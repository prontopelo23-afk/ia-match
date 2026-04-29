"""Iteration 6 — pedagogical endpoints + privacy/example for tools."""
import os
import sys
import requests
from pathlib import Path

# Read EXPO_PUBLIC_BACKEND_URL from /app/frontend/.env
FRONTEND_ENV = Path("/app/frontend/.env")
BASE = None
for line in FRONTEND_ENV.read_text().splitlines():
    if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
        BASE = line.split("=", 1)[1].strip().strip('"').strip("'")
        break
assert BASE, "EXPO_PUBLIC_BACKEND_URL not found"
API = BASE.rstrip("/") + "/api"
print(f"Using API base: {API}")

PASS = 0
FAIL = 0
FAILS: list = []


def check(label: str, cond: bool, detail: str = ""):
    global PASS, FAIL
    if cond:
        PASS += 1
        print(f"  ✅ {label}")
    else:
        FAIL += 1
        FAILS.append(f"{label} — {detail}")
        print(f"  ❌ {label}  {detail}")


def section(title: str):
    print(f"\n=== {title} ===")


# 1. /api/glossary
section("1. GET /api/glossary")
r = requests.get(f"{API}/glossary", timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
data = r.json() if r.status_code == 200 else []
check("≥ 30 entries", isinstance(data, list) and len(data) >= 30, f"got {len(data) if isinstance(data, list) else 'not list'}")
required = {"term", "emoji", "short", "long", "example"}
missing_fields = [i for i, e in enumerate(data) if not required.issubset(set(e.keys()))]
check("each entry has term/emoji/short/long/example", len(missing_fields) == 0,
      f"{len(missing_fields)} entries missing fields, sample idx={missing_fields[:3]}")
terms_lower = {(e.get("term") or "").lower() for e in data}
expected_terms_any = ["prompt", "token", "hallucination", "rgpd", "souveraineté ia"]
present = [t for t in expected_terms_any if any(t in tl for tl in terms_lower)]
check("contains Prompt/Token/Hallucination/RGPD/Souveraineté IA",
      len(present) >= 1, f"present={present}")
# Check explicitly for "Prompt", "Token", "Hallucination"
check("'Prompt' present", any("prompt" == (e.get("term") or "").lower() for e in data))
check("'Token' present", any("token" == (e.get("term") or "").lower() for e in data))
check("'Hallucination' present", any("hallucination" in (e.get("term") or "").lower() for e in data))
check("'RGPD' or 'Souveraineté IA' present",
      any("rgpd" in (e.get("term") or "").lower() or "souveraineté" in (e.get("term") or "").lower() for e in data))


# 2. /api/faq
section("2. GET /api/faq")
r = requests.get(f"{API}/faq", timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
faq = r.json() if r.status_code == 200 else []
check("≥ 15 entries", isinstance(faq, list) and len(faq) >= 15, f"got {len(faq) if isinstance(faq, list) else 'not list'}")
check("each entry has q and a", all(isinstance(e.get("q"), str) and isinstance(e.get("a"), str) for e in faq))
check("at least one question contains 'données'",
      any("données" in (e.get("q") or "").lower() for e in faq))
check("at least one question contains 'coût' or 'gratuit'",
      any("coût" in (e.get("q") or "").lower() or "gratuit" in (e.get("q") or "").lower() for e in faq))


# 3. /api/use-cases
section("3. GET /api/use-cases")
r = requests.get(f"{API}/use-cases", timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
ucs = r.json() if r.status_code == 200 else []
check("≥ 10 entries", isinstance(ucs, list) and len(ucs) >= 10, f"got {len(ucs) if isinstance(ucs, list) else 'not list'}")
required_uc = {"id", "icon", "title", "summary", "tools", "tools_resolved", "tip"}
miss_uc = [u.get("id") for u in ucs if not required_uc.issubset(set(u.keys()))]
check("each has id/icon/title/summary/tools/tools_resolved/tip", len(miss_uc) == 0, f"missing: {miss_uc[:3]}")
# tools is list of slugs (strings)
all_tools_strings = all(isinstance(t, str) for u in ucs for t in u.get("tools", []))
check("tools is list of slug strings", all_tools_strings)
# tools_resolved is list of dicts with name+vendor+image+slug
tr_ok = True
for u in ucs:
    for tr in u.get("tools_resolved", []):
        if not isinstance(tr, dict) or not {"name", "vendor", "image", "slug"}.issubset(tr.keys()):
            tr_ok = False
            break
check("tools_resolved entries have name+vendor+image+slug", tr_ok)
ids_uc = {u.get("id") for u in ucs}
check("uc-cv present", "uc-cv" in ids_uc, f"ids sample: {list(ids_uc)[:5]}")
check("uc-pdf present", "uc-pdf" in ids_uc)
check("uc-logo present", "uc-logo" in ids_uc)


# 4. /api/personas
section("4. GET /api/personas")
r = requests.get(f"{API}/personas", timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
personas = r.json() if r.status_code == 200 else []
check("≥ 5 entries", isinstance(personas, list) and len(personas) >= 5, f"got {len(personas) if isinstance(personas, list) else 'not list'}")
required_p = {"id", "label", "emoji", "summary", "tools", "tools_resolved", "tips"}
miss_p = [p.get("id") for p in personas if not required_p.issubset(set(p.keys()))]
check("each has id/label/emoji/summary/tools/tools_resolved/tips", len(miss_p) == 0, f"missing: {miss_p[:3]}")
ids_p = {p.get("id") for p in personas}
check("etudiant present", "etudiant" in ids_p, f"ids: {ids_p}")
check("freelance present", "freelance" in ids_p)
check("senior present", "senior" in ids_p)


# 5. /api/quiz
section("5. GET /api/quiz")
r = requests.get(f"{API}/quiz", timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
quiz = r.json() if r.status_code == 200 else []
check("exactly 8 questions", isinstance(quiz, list) and len(quiz) == 8, f"got {len(quiz) if isinstance(quiz, list) else 'not list'}")
q_ok = True
detail = ""
for q in quiz:
    if not {"id", "question", "options"}.issubset(q.keys()):
        q_ok = False
        detail = f"missing fields in {q.get('id')}"
        break
    opts = q.get("options", [])
    if len(opts) != 4:
        q_ok = False
        detail = f"{q.get('id')} has {len(opts)} options"
        break
    for o in opts:
        if "label" not in o or "score" not in o:
            q_ok = False
            detail = f"{q.get('id')} option missing label/score"
            break
        s = o.get("score")
        if not isinstance(s, int) or s < 0 or s > 3:
            q_ok = False
            detail = f"{q.get('id')} option score={s} invalid"
            break
    if not q_ok:
        break
check("each question has id/question/options (4 with label+score 0-3)", q_ok, detail)


# 6. /api/quiz/score with all 0
section("6. POST /api/quiz/score [0]*8")
r = requests.post(f"{API}/quiz/score", json={"answers": [0] * 8}, timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
res = r.json() if r.status_code == 200 else {}
check("level == Débutant", res.get("level") == "Débutant", f"got {res.get('level')}")
check("total == 0", res.get("total") == 0, f"got {res.get('total')}")
check("max == 24", res.get("max") == 24, f"got {res.get('max')}")
check("description present", isinstance(res.get("description"), str) and len(res.get("description", "")) > 0)
check("next_steps is list", isinstance(res.get("next_steps"), list))
check("lessons is list", isinstance(res.get("lessons"), list))


# 7. /api/quiz/score with all 3
section("7. POST /api/quiz/score [3]*8")
r = requests.post(f"{API}/quiz/score", json={"answers": [3] * 8}, timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
res2 = r.json() if r.status_code == 200 else {}
check("level == Avancé", res2.get("level") == "Avancé", f"got {res2.get('level')}")
check("total == 24", res2.get("total") == 24, f"got {res2.get('total')}")


# 8. /api/tools/claude
section("8. GET /api/tools/claude")
r = requests.get(f"{API}/tools/claude", timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
claude = r.json() if r.status_code == 200 else {}
priv = claude.get("privacy")
check("privacy present", isinstance(priv, dict), f"privacy={priv}")
if isinstance(priv, dict):
    for k in ["privacy_score", "eu_hosted", "trains_on_data", "rgpd", "note"]:
        check(f"privacy.{k} present", k in priv, f"keys={list(priv.keys())}")
ex = claude.get("example")
check("example present", isinstance(ex, dict), f"example={ex}")
if isinstance(ex, dict):
    check("example.prompt present", "prompt" in ex)
    check("example.output present", "output" in ex)


# 9. /api/tools/mistral
section("9. GET /api/tools/mistral")
r = requests.get(f"{API}/tools/mistral", timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
mistral = r.json() if r.status_code == 200 else {}
priv = mistral.get("privacy") or {}
check("mistral.privacy.eu_hosted == true", priv.get("eu_hosted") is True, f"got {priv.get('eu_hosted')}")
ps = priv.get("privacy_score")
check("mistral.privacy.privacy_score >= 90", isinstance(ps, (int, float)) and ps >= 90, f"got {ps}")


# 10. /api/tools/deepseek
section("10. GET /api/tools/deepseek")
r = requests.get(f"{API}/tools/deepseek", timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
ds = r.json() if r.status_code == 200 else {}
priv = ds.get("privacy") or {}
check("deepseek.privacy.eu_hosted == false", priv.get("eu_hosted") is False, f"got {priv.get('eu_hosted')}")
ps = priv.get("privacy_score")
check("deepseek.privacy.privacy_score < 60", isinstance(ps, (int, float)) and ps < 60, f"got {ps}")


# 11. gpt5 must not exist
section("11. GET /api/tools/gpt5 should be 404")
r = requests.get(f"{API}/tools/gpt5", timeout=15)
check("status 404", r.status_code == 404, f"got {r.status_code}")


# 12. /api/tools/chatgpt tagline GPT-5.5, score >= 95
section("12. GET /api/tools/chatgpt")
r = requests.get(f"{API}/tools/chatgpt", timeout=15)
check("status 200", r.status_code == 200, f"got {r.status_code}")
ch = r.json() if r.status_code == 200 else {}
tagline = ch.get("tagline", "")
check("tagline contains 'GPT-5.5'", "GPT-5.5" in tagline, f"tagline={tagline!r}")
sc = ch.get("score")
check("score >= 95", isinstance(sc, (int, float)) and sc >= 95, f"score={sc}")


# Summary
print("\n=========== SUMMARY ===========")
print(f"PASS: {PASS}")
print(f"FAIL: {FAIL}")
if FAILS:
    print("\nFailures:")
    for f in FAILS:
        print(f"  - {f}")
sys.exit(0 if FAIL == 0 else 1)
