"""Backend test for IA Match - Iteration 3 endpoints.

Tests the 5 endpoints listed in test_plan:
1. GET /api/tools (>=100 tools, critical slugs)
2. GET /api/resources (18 resources, r17/r18)
3. POST /api/auth/register (success + 4 error cases)
4. POST /api/auth/login (success + 2 error cases)
5. GET /api/auth/whoami (success + 2 error cases)
"""
import random
import string
import sys
from pathlib import Path

import requests

# Read EXPO_PUBLIC_BACKEND_URL from /app/frontend/.env
FRONTEND_ENV = Path("/app/frontend/.env")
BASE_URL = None
for line in FRONTEND_ENV.read_text().splitlines():
    if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
        BASE_URL = line.split("=", 1)[1].strip().strip('"')
        break
assert BASE_URL, "EXPO_PUBLIC_BACKEND_URL not found in /app/frontend/.env"
API = f"{BASE_URL}/api"
print(f"[INFO] Using API base: {API}\n")

results = []


def record(name, ok, detail=""):
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {name} :: {detail}")
    results.append((name, ok, detail))


def rand_email():
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=10))
    return f"new_user_{suffix}@iamatch.fr"


# ---------- 1. GET /api/tools ----------
print("=" * 70)
print("1. GET /api/tools")
print("=" * 70)
try:
    r = requests.get(f"{API}/tools", timeout=30)
    record("GET /api/tools status 200", r.status_code == 200, f"got {r.status_code}")
    tools = r.json() if r.status_code == 200 else []
    record(
        "GET /api/tools returns >= 100 tools",
        len(tools) >= 100,
        f"count={len(tools)}",
    )
    slugs = {t["slug"] for t in tools}
    expected_slugs = [
        "claude-opus", "gpt5", "o3", "gemini-25", "deepseek-r1",
        "qwen", "kimi", "llama", "mixtral", "nano-banana",
        "veo", "command-r", "hailuo", "imagen",
    ]
    for s in expected_slugs:
        record(
            f"slug present: {s}",
            s in slugs,
            "" if s in slugs else f"missing in {len(slugs)} slugs",
        )
except Exception as e:
    record("GET /api/tools", False, f"exception: {e}")


# ---------- 2. GET /api/resources ----------
print("\n" + "=" * 70)
print("2. GET /api/resources")
print("=" * 70)
try:
    r = requests.get(f"{API}/resources", timeout=15)
    record("GET /api/resources status 200", r.status_code == 200, f"got {r.status_code}")
    resources = r.json() if r.status_code == 200 else []
    record(
        "GET /api/resources returns exactly 18 items",
        len(resources) == 18,
        f"count={len(resources)}",
    )
    by_id = {res.get("id"): res for res in resources}
    r17 = by_id.get("r17")
    r18 = by_id.get("r18")
    if r17:
        ok_title = r17.get("title") == "Shubham Sharma"
        ok_cat = (r17.get("category") or "").upper() == "YOUTUBE"
        ok_url = "Shubham_Sharma" in (r17.get("url") or "")
        record("r17 title=Shubham Sharma", ok_title, f"got title={r17.get('title')!r}")
        record("r17 category=YOUTUBE", ok_cat, f"got category={r17.get('category')!r}")
        record("r17 url contains 'Shubham_Sharma'", ok_url, f"got url={r17.get('url')!r}")
    else:
        record("r17 exists", False, "id=r17 not found")
    if r18:
        ok_title = r18.get("title") == "Renaud Dekode"
        ok_cat = (r18.get("category") or "").upper() == "YOUTUBE"
        ok_url = "RenaudDekode" in (r18.get("url") or "")
        record("r18 title=Renaud Dekode", ok_title, f"got title={r18.get('title')!r}")
        record("r18 category=YOUTUBE", ok_cat, f"got category={r18.get('category')!r}")
        record("r18 url contains 'RenaudDekode'", ok_url, f"got url={r18.get('url')!r}")
    else:
        record("r18 exists", False, "id=r18 not found")
except Exception as e:
    record("GET /api/resources", False, f"exception: {e}")


# ---------- 3. POST /api/auth/register ----------
print("\n" + "=" * 70)
print("3. POST /api/auth/register")
print("=" * 70)
test_email = rand_email()
test_password = "abcdef12345"
test_name = "Test"
saved_token = None

try:
    body = {"email": test_email, "password": test_password, "name": test_name, "accept_terms": True}
    r = requests.post(f"{API}/auth/register", json=body, timeout=15)
    record("register valid -> 200", r.status_code == 200, f"got {r.status_code} body={r.text[:200]}")
    if r.status_code == 200:
        data = r.json()
        token = data.get("token")
        user = data.get("user") or {}
        record("register response has non-empty token", bool(token), f"token len={len(token) if token else 0}")
        record("user.id present", bool(user.get("id")), f"user={user}")
        record("user.email matches", user.get("email") == test_email, f"got {user.get('email')}")
        record("user.name present", bool(user.get("name")), f"got {user.get('name')!r}")
        record("user.is_premium == False", user.get("is_premium") is False, f"got {user.get('is_premium')!r}")
        saved_token = token
except Exception as e:
    record("register valid", False, f"exception: {e}")

try:
    body = {"email": rand_email(), "password": "abcdef12345", "name": "T", "accept_terms": False}
    r = requests.post(f"{API}/auth/register", json=body, timeout=15)
    record("register without accept_terms -> 400", r.status_code == 400, f"got {r.status_code}")
except Exception as e:
    record("register without accept_terms", False, f"exception: {e}")

try:
    body = {"email": rand_email(), "password": "abc", "name": "T", "accept_terms": True}
    r = requests.post(f"{API}/auth/register", json=body, timeout=15)
    record("register short password -> 400", r.status_code == 400, f"got {r.status_code}")
except Exception as e:
    record("register short password", False, f"exception: {e}")

try:
    body = {"email": "not-an-email", "password": "abcdef12345", "name": "T", "accept_terms": True}
    r = requests.post(f"{API}/auth/register", json=body, timeout=15)
    record("register invalid email -> 400", r.status_code == 400, f"got {r.status_code}")
except Exception as e:
    record("register invalid email", False, f"exception: {e}")

try:
    body = {"email": test_email, "password": test_password, "name": test_name, "accept_terms": True}
    r = requests.post(f"{API}/auth/register", json=body, timeout=15)
    record("register duplicate email -> 409", r.status_code == 409, f"got {r.status_code}")
except Exception as e:
    record("register duplicate email", False, f"exception: {e}")


# ---------- 4. POST /api/auth/login ----------
print("\n" + "=" * 70)
print("4. POST /api/auth/login")
print("=" * 70)
login_token = None
try:
    body = {"email": test_email, "password": test_password}
    r = requests.post(f"{API}/auth/login", json=body, timeout=15)
    record("login valid -> 200", r.status_code == 200, f"got {r.status_code} body={r.text[:200]}")
    if r.status_code == 200:
        data = r.json()
        login_token = data.get("token")
        record("login response has token", bool(login_token), f"token len={len(login_token) if login_token else 0}")
        record("login response has user.id", bool((data.get("user") or {}).get("id")), f"user={data.get('user')}")
except Exception as e:
    record("login valid", False, f"exception: {e}")

try:
    body = {"email": test_email, "password": "wrong-password-xyz"}
    r = requests.post(f"{API}/auth/login", json=body, timeout=15)
    record("login wrong password -> 401", r.status_code == 401, f"got {r.status_code}")
except Exception as e:
    record("login wrong password", False, f"exception: {e}")

try:
    body = {"email": rand_email(), "password": "abcdef12345"}
    r = requests.post(f"{API}/auth/login", json=body, timeout=15)
    record("login unknown email -> 401", r.status_code == 401, f"got {r.status_code}")
except Exception as e:
    record("login unknown email", False, f"exception: {e}")


# ---------- 5. GET /api/auth/whoami ----------
print("\n" + "=" * 70)
print("5. GET /api/auth/whoami")
print("=" * 70)
try:
    r = requests.get(f"{API}/auth/whoami", timeout=15)
    record("whoami no header -> 401", r.status_code == 401, f"got {r.status_code}")
except Exception as e:
    record("whoami no header", False, f"exception: {e}")

try:
    headers = {"X-Auth-Token": login_token or saved_token or ""}
    r = requests.get(f"{API}/auth/whoami", headers=headers, timeout=15)
    record("whoami valid token -> 200", r.status_code == 200, f"got {r.status_code} body={r.text[:200]}")
    if r.status_code == 200:
        data = r.json()
        record("whoami response has id", bool(data.get("id")), str(data))
        record("whoami response email matches", data.get("email") == test_email, f"got {data.get('email')}")
        record("whoami response has name", "name" in data, str(data))
        record("whoami response has is_premium", "is_premium" in data, str(data))
except Exception as e:
    record("whoami valid token", False, f"exception: {e}")

try:
    headers = {"X-Auth-Token": "foo.bar.baz"}
    r = requests.get(f"{API}/auth/whoami", headers=headers, timeout=15)
    record("whoami invalid token -> 401", r.status_code == 401, f"got {r.status_code}")
except Exception as e:
    record("whoami invalid token", False, f"exception: {e}")


# ---------- Summary ----------
print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
passed = sum(1 for _, ok, _ in results if ok)
failed = sum(1 for _, ok, _ in results if not ok)
print(f"PASSED: {passed}")
print(f"FAILED: {failed}")
if failed:
    print("\nFailing assertions:")
    for name, ok, detail in results:
        if not ok:
            print(f"  - {name} :: {detail}")
sys.exit(0 if failed == 0 else 1)
