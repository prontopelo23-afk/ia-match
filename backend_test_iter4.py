"""Backend test for IA Match - Iteration 4: per-category specialty scores.

Tests:
1. GET /api/tools/cursor : categoryScores present, dict, contains "code", values 45-99
2. GET /api/tools/gpt5 : categoryScores has "texte" >= general score - 5
3. GET /api/tools?category=code : sorted by categoryScores.code desc, Cursor in top 3,
   GPT-5.5 ranked below Cursor
4. GET /api/tools?category=image : top 5 contains >=3 of {Midjourney, Nano Banana 2,
   Flux, Imagen 3, Magnific}
5. GET /api/tools (no filter) : sorted by general score desc, first >= 95
6. 5 random tools : categoryScores non-empty AND contains every entry of categorySlugs
"""
import random
import sys
from pathlib import Path

import requests

FRONTEND_ENV = Path("/app/frontend/.env")
BASE_URL = None
for line in FRONTEND_ENV.read_text().splitlines():
    if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
        BASE_URL = line.split("=", 1)[1].strip().strip('"')
        break
assert BASE_URL, "EXPO_PUBLIC_BACKEND_URL not found"
API = f"{BASE_URL}/api"
print(f"[INFO] API base: {API}\n")

results = []


def check(name: str, cond: bool, detail: str = ""):
    status = "PASS" if cond else "FAIL"
    results.append((status, name, detail))
    print(f"[{status}] {name}{(' :: ' + detail) if detail else ''}")


# -------- 1. /api/tools/cursor --------
print("=" * 60)
print("1. GET /api/tools/cursor")
print("=" * 60)
r = requests.get(f"{API}/tools/cursor", timeout=30)
check("cursor: HTTP 200", r.status_code == 200, f"status={r.status_code}")
if r.status_code == 200:
    cursor = r.json()
    cs = cursor.get("categoryScores")
    check("cursor: categoryScores is present", cs is not None)
    check("cursor: categoryScores is dict", isinstance(cs, dict),
          f"type={type(cs).__name__}")
    check("cursor: categoryScores not empty", isinstance(cs, dict) and len(cs) > 0,
          f"len={len(cs) if isinstance(cs, dict) else 'NA'}")
    check("cursor: contains 'code'", isinstance(cs, dict) and "code" in cs,
          f"keys={list(cs.keys()) if isinstance(cs, dict) else 'NA'}")
    if isinstance(cs, dict):
        all_int_in_range = all(isinstance(v, int) and 45 <= v <= 99 for v in cs.values())
        check("cursor: all values int in [45,99]", all_int_in_range,
              f"values={cs}")
        cat_slugs = cursor.get("categorySlugs", [])
        check("cursor: categorySlugs subset of categoryScores keys",
              all(c in cs for c in cat_slugs),
              f"categorySlugs={cat_slugs}, scores keys={list(cs.keys())}")
        print(f"  cursor general score={cursor.get('score')}, categoryScores={cs}")


# -------- 2. /api/tools/gpt5 --------
print("\n" + "=" * 60)
print("2. GET /api/tools/gpt5")
print("=" * 60)
r = requests.get(f"{API}/tools/gpt5", timeout=30)
check("gpt5: HTTP 200", r.status_code == 200, f"status={r.status_code}")
if r.status_code == 200:
    gpt5 = r.json()
    cs = gpt5.get("categoryScores", {})
    general = gpt5.get("score", 0)
    check("gpt5: categoryScores has 'texte'", "texte" in cs,
          f"keys={list(cs.keys())}")
    if "texte" in cs:
        diff = cs["texte"] - (general - 5)
        check("gpt5: categoryScores['texte'] >= general - 5",
              cs["texte"] >= general - 5,
              f"texte={cs['texte']}, general={general}, diff={diff}")
    print(f"  gpt5 general={general}, categoryScores={cs}")


# -------- 3. /api/tools?category=code --------
print("\n" + "=" * 60)
print("3. GET /api/tools?category=code")
print("=" * 60)
r = requests.get(f"{API}/tools", params={"category": "code"}, timeout=30)
check("tools?category=code: HTTP 200", r.status_code == 200,
      f"status={r.status_code}")
if r.status_code == 200:
    code_tools = r.json()
    check("tools?category=code: non-empty list", len(code_tools) > 0,
          f"count={len(code_tools)}")
    # Check sort order: descending by categoryScores.code
    code_scores = [t.get("categoryScores", {}).get("code", t.get("score", 0))
                   for t in code_tools]
    is_sorted = all(code_scores[i] >= code_scores[i + 1] for i in range(len(code_scores) - 1))
    check("tools?category=code: sorted desc by code score", is_sorted,
          f"first 8 scores={code_scores[:8]}")
    # Cursor in top 3
    top3_slugs = [t["slug"] for t in code_tools[:3]]
    check("tools?category=code: Cursor in top 3", "cursor" in top3_slugs,
          f"top3 slugs={top3_slugs}")
    # GPT-5.5 ranked below Cursor (find both indices, support gpt55 / gpt-5.5 etc.)
    cursor_idx = next((i for i, t in enumerate(code_tools) if t["slug"] == "cursor"), -1)
    gpt55_candidates = [t for t in code_tools
                        if t["slug"] in ("gpt55", "gpt-55", "gpt5.5", "gpt-5-5")
                        or t.get("name", "").lower().replace(" ", "") in ("gpt-5.5", "gpt5.5")]
    if not gpt55_candidates:
        # try by name
        gpt55_candidates = [t for t in code_tools if "5.5" in t.get("name", "")]
    if gpt55_candidates:
        gpt55 = gpt55_candidates[0]
        gpt55_idx = next((i for i, t in enumerate(code_tools) if t["slug"] == gpt55["slug"]), -1)
        check("tools?category=code: GPT-5.5 ranked below Cursor",
              cursor_idx != -1 and gpt55_idx != -1 and cursor_idx < gpt55_idx,
              f"cursor_idx={cursor_idx}, gpt55_idx={gpt55_idx}, gpt55_slug={gpt55['slug']}, gpt55_general={gpt55.get('score')}, gpt55_code={gpt55.get('categoryScores',{}).get('code')}, cursor_code={code_tools[cursor_idx].get('categoryScores',{}).get('code') if cursor_idx>=0 else 'NA'}")
    else:
        check("tools?category=code: GPT-5.5 found in code list", False,
              "no candidate matched (slugs sample: " +
              ", ".join(t["slug"] for t in code_tools[:10]) + ")")
    print(f"  top 5 code: {[(t['slug'], t.get('categoryScores',{}).get('code'), t.get('score')) for t in code_tools[:5]]}")


# -------- 4. /api/tools?category=image --------
print("\n" + "=" * 60)
print("4. GET /api/tools?category=image")
print("=" * 60)
r = requests.get(f"{API}/tools", params={"category": "image"}, timeout=30)
check("tools?category=image: HTTP 200", r.status_code == 200,
      f"status={r.status_code}")
if r.status_code == 200:
    img_tools = r.json()
    top5 = img_tools[:5]
    top5_names = [t.get("name", "") for t in top5]
    top5_slugs = [t.get("slug", "") for t in top5]
    expected_specialists = {"Midjourney", "Nano Banana 2", "Flux", "Imagen 3", "Magnific"}
    matches = [n for n in top5_names if any(spec in n or n in spec for spec in expected_specialists)]
    # Also check by slugs
    expected_slug_hints = {"midjourney", "nano-banana", "flux", "imagen", "magnific"}
    slug_matches = [s for s in top5_slugs if any(h in s for h in expected_slug_hints)]
    found = max(len(matches), len(slug_matches))
    check("tools?category=image: top 5 contains >= 3 specialists", found >= 3,
          f"top5_names={top5_names}, top5_slugs={top5_slugs}, matches_by_name={matches}, matches_by_slug={slug_matches}")
    print(f"  top 5 image: {[(t['slug'], t.get('name'), t.get('categoryScores',{}).get('image'), t.get('score')) for t in top5]}")


# -------- 5. /api/tools no filter --------
print("\n" + "=" * 60)
print("5. GET /api/tools (no filter)")
print("=" * 60)
r = requests.get(f"{API}/tools", timeout=30)
check("tools: HTTP 200", r.status_code == 200, f"status={r.status_code}")
if r.status_code == 200:
    all_tools = r.json()
    scores = [t.get("score", 0) for t in all_tools]
    is_sorted = all(scores[i] >= scores[i + 1] for i in range(len(scores) - 1))
    check("tools: sorted desc by general score", is_sorted,
          f"first 10 scores={scores[:10]}")
    check("tools: first tool score >= 95",
          len(all_tools) > 0 and all_tools[0].get("score", 0) >= 95,
          f"first score={all_tools[0].get('score') if all_tools else 'NA'}, name={all_tools[0].get('name') if all_tools else 'NA'}")
    print(f"  total tools: {len(all_tools)}")
    print(f"  top 3 (general): {[(t['slug'], t.get('score')) for t in all_tools[:3]]}")


# -------- 6. 5 random tools : categoryScores covers categorySlugs --------
print("\n" + "=" * 60)
print("6. 5 random tools : categoryScores covers categorySlugs")
print("=" * 60)
if r.status_code == 200 and len(all_tools) >= 5:
    random.seed(42)
    sample = random.sample(all_tools, 5)
    for t in sample:
        slug = t["slug"]
        cs = t.get("categoryScores", {})
        cat_slugs = t.get("categorySlugs", [])
        non_empty = isinstance(cs, dict) and len(cs) > 0
        covers_all = all(c in cs for c in cat_slugs)
        check(f"tool '{slug}': categoryScores non-empty", non_empty,
              f"categoryScores={cs}")
        check(f"tool '{slug}': categoryScores covers all categorySlugs ({cat_slugs})",
              covers_all,
              f"categoryScores keys={list(cs.keys()) if isinstance(cs,dict) else 'NA'}")


# -------- Summary --------
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
passed = sum(1 for s, _, _ in results if s == "PASS")
failed = sum(1 for s, _, _ in results if s == "FAIL")
print(f"PASS: {passed} / FAIL: {failed} / TOTAL: {len(results)}")
if failed:
    print("\nFailures:")
    for status, name, detail in results:
        if status == "FAIL":
            print(f"  - {name} :: {detail}")
    sys.exit(1)
print("\nAll tests passed.")
sys.exit(0)
