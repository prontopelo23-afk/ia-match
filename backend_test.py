"""Backend smoke tests for IA Match.

Tests three critical endpoints:
1) GET /api/resources -> 16 French resources (with YouTube, Blog, Podcast, Newsletter)
2) GET /api/tools -> 48 tools, claude has correct domain + image
3) POST /api/builder/run -> non-empty French output
"""
import os
import sys
import json
import re
from pathlib import Path

import requests

# Read backend URL from frontend .env (EXPO_PUBLIC_BACKEND_URL)
FRONTEND_ENV = Path("/app/frontend/.env")
BACKEND_URL = None
for line in FRONTEND_ENV.read_text().splitlines():
    if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
        BACKEND_URL = line.split("=", 1)[1].strip().strip('"').strip("'")
        break

assert BACKEND_URL, "EXPO_PUBLIC_BACKEND_URL not found"
API = f"{BACKEND_URL}/api"
print(f"[INFO] Using API base: {API}")

results = {"passed": [], "failed": []}


def record(name, ok, detail=""):
    if ok:
        results["passed"].append(name)
        print(f"[PASS] {name} {detail}")
    else:
        results["failed"].append((name, detail))
        print(f"[FAIL] {name} -> {detail}")


# ---------------------------------------------------------------------------
# 1) GET /api/resources
# ---------------------------------------------------------------------------
try:
    r = requests.get(f"{API}/resources", timeout=30)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
    data = r.json()
    assert isinstance(data, list), "Resources response is not a list"
    record(
        "GET /api/resources status 200 + list",
        True,
        f"({len(data)} items)",
    )

    # Count check
    if len(data) == 16:
        record("Resources count == 16", True)
    else:
        record("Resources count == 16", False, f"got {len(data)}")

    # Required fields
    required_fields = {"id", "category", "title", "author", "summary", "url"}
    missing_field_items = []
    for idx, item in enumerate(data):
        miss = required_fields - set(item.keys())
        if miss:
            missing_field_items.append((idx, miss))
    if not missing_field_items:
        record("Resources fields (id, category, title, author, summary, url)", True)
    else:
        record(
            "Resources fields (id, category, title, author, summary, url)",
            False,
            f"missing fields: {missing_field_items[:3]}",
        )

    # Category presence
    cats_lower = [str(it.get("category", "")).lower() for it in data]
    titles_authors = " | ".join(
        [
            f"{it.get('title','')} - {it.get('author','')}"
            for it in data
        ]
    ).lower()

    has_youtube = any("youtube" in c for c in cats_lower)
    has_blog = any("blog" in c for c in cats_lower)
    has_podcast = any("podcast" in c for c in cats_lower)
    has_newsletter = any("newsletter" in c for c in cats_lower)

    record("Resources contain YouTube category", has_youtube)
    record("Resources contain Blog category", has_blog)
    record("Resources contain Podcast category", has_podcast)
    record("Resources contain Newsletter category", has_newsletter)

    # Specific authors
    has_underscore = "underscore" in titles_authors
    has_korben = "korben" in titles_authors
    record("Resources contain Underscore_", has_underscore)
    record("Resources contain Korben", has_korben)

    # French content (look for accented chars or French words in summaries)
    summary_blob = " ".join([str(it.get("summary", "")) for it in data]).lower()
    fr_indicators = ["é", "è", "à", "ç", " le ", " la ", " des ", " et ", "ia"]
    fr_hits = sum(1 for ind in fr_indicators if ind in summary_blob)
    record(
        "Resources summaries appear to be in French",
        fr_hits >= 3,
        f"french-indicator hits={fr_hits}",
    )
except Exception as e:
    record("GET /api/resources", False, str(e))


# ---------------------------------------------------------------------------
# 2) GET /api/tools
# ---------------------------------------------------------------------------
try:
    r = requests.get(f"{API}/tools", timeout=30)
    assert r.status_code == 200, f"status={r.status_code} body={r.text[:200]}"
    tools = r.json()
    assert isinstance(tools, list), "Tools response is not a list"
    record("GET /api/tools status 200 + list", True, f"({len(tools)} items)")

    if len(tools) == 48:
        record("Tools count == 48", True)
    else:
        record("Tools count == 48", False, f"got {len(tools)}")

    claude = next((t for t in tools if t.get("slug") == "claude"), None)
    if not claude:
        record("Tool slug 'claude' present", False)
    else:
        record("Tool slug 'claude' present", True)
        if claude.get("domain") == "claude.ai":
            record("claude.domain == 'claude.ai'", True)
        else:
            record("claude.domain == 'claude.ai'", False, f"got {claude.get('domain')!r}")
        expected_img = "https://logo.clearbit.com/claude.ai"
        if claude.get("image") == expected_img:
            record(f"claude.image == '{expected_img}'", True)
        else:
            record(
                f"claude.image == '{expected_img}'",
                False,
                f"got {claude.get('image')!r}",
            )
except Exception as e:
    record("GET /api/tools", False, str(e))


# ---------------------------------------------------------------------------
# 3) POST /api/builder/run
# ---------------------------------------------------------------------------
try:
    payload = {"prompt": "Résume en 2 lignes ce qu'est IA Match."}
    r = requests.post(f"{API}/builder/run", json=payload, timeout=120)
    if r.status_code != 200:
        record(
            "POST /api/builder/run status 200",
            False,
            f"status={r.status_code} body={r.text[:300]}",
        )
    else:
        record("POST /api/builder/run status 200", True)
        body = r.json()
        output = body.get("output", "")
        if isinstance(output, str) and output.strip():
            record(
                "Builder output non-empty string",
                True,
                f"(len={len(output)}, preview={output[:120]!r})",
            )
        else:
            record(
                "Builder output non-empty string",
                False,
                f"output={output!r}",
            )

        # French check (very lenient): contains accented char OR a common FR word
        text_lower = output.lower() if isinstance(output, str) else ""
        fr_words = [" le ", " la ", " les ", " des ", " et ", " est ", " une ", " un ", " pour ", "ia"]
        has_accent = bool(re.search(r"[éèàùçâêîôûëïü]", text_lower))
        has_fr_word = any(w in f" {text_lower} " for w in fr_words)
        record(
            "Builder output appears to be in French",
            has_accent or has_fr_word,
            f"(accent={has_accent}, fr_word={has_fr_word})",
        )
except Exception as e:
    record("POST /api/builder/run", False, str(e))


# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
print("\n========== SUMMARY ==========")
print(f"PASSED: {len(results['passed'])}")
for n in results["passed"]:
    print(f"  ✅ {n}")
print(f"FAILED: {len(results['failed'])}")
for n, d in results["failed"]:
    print(f"  ❌ {n} -> {d}")

sys.exit(0 if not results["failed"] else 1)
