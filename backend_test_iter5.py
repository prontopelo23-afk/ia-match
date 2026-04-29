"""Backend tests for IA Match - Itération 5 (security hardening + new auth endpoints + cleanup)."""
import os
import sys
import time
import uuid
import requests

BASE = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://ai-match-preview-2.preview.emergentagent.com").rstrip("/") + "/api"
print(f"BASE = {BASE}")

results = []  # list of (name, ok, details)


def check(name, cond, details=""):
    results.append((name, bool(cond), details))
    flag = "PASS" if cond else "FAIL"
    print(f"[{flag}] {name} -- {details}")


def rand_email(prefix="u"):
    return f"{prefix}_{uuid.uuid4().hex[:8]}@iamatch.fr"


# =============================================================================
# 1) Password validation
# =============================================================================
print("\n=== 1) Password validation ===")
e1 = rand_email("u1")
r = requests.post(f"{BASE}/auth/register", json={"email": e1, "password": "weak", "accept_terms": True}, timeout=15)
body = r.text
check("register weak<10 chars -> 400", r.status_code == 400, f"status={r.status_code} body={body[:200]}")
check("error mentions length (10 ou caractères)", ("10" in body or "caract" in body.lower()), f"body={body[:200]}")

e2 = rand_email("u2")
r = requests.post(f"{BASE}/auth/register", json={"email": e2, "password": "abcdefghij", "accept_terms": True}, timeout=15)
body = r.text
check("register no-digit -> 400", r.status_code == 400, f"status={r.status_code} body={body[:200]}")
check("error mentions chiffre", "chiffre" in body.lower(), f"body={body[:200]}")

e3 = rand_email("u3")
r = requests.post(f"{BASE}/auth/register", json={"email": e3, "password": "abc1234567", "accept_terms": True}, timeout=15)
check("register valid (10 chars + digit) -> 200", r.status_code == 200, f"status={r.status_code} body={r.text[:200]}")
if r.status_code == 200:
    j = r.json()
    check("register response has token", bool(j.get("token")), f"token len={len(j.get('token',''))}")
    check("register response has user.id", bool(j.get("user", {}).get("id")), f"user={j.get('user')}")

# =============================================================================
# 2) Rate limiting register: 6 register per minute -> 6th = 429
# =============================================================================
print("\n=== 2) Rate limiting register (6/min) ===")
codes = []
for i in range(6):
    em = rand_email(f"rl{i}")
    rr = requests.post(f"{BASE}/auth/register", json={"email": em, "password": "abc1234567", "accept_terms": True}, timeout=15)
    codes.append(rr.status_code)
    print(f"  register #{i+1}: {rr.status_code}")
check("6th register call returns 429 (rate limit)", codes[-1] == 429, f"codes={codes}")

# =============================================================================
# 3) Account lockout login
# =============================================================================
print("\n=== 3) Account lockout login ===")
# Wait so we don't get rate-limited by login limit (5/min). Use a fresh email.
# Create the account with NEW IP path: actually rate limit is per IP. Let's just register a new account,
# pause briefly, then attempt 5 bad logins.
lock_email = rand_email("lock")
# We may already be rate-limited on /register. Wait long enough.
print("Waiting 65s to clear register/login rate limits...")
time.sleep(65)

rr = requests.post(f"{BASE}/auth/register", json={"email": lock_email, "password": "abc1234567", "accept_terms": True}, timeout=15)
check("lockout: registered fresh account", rr.status_code == 200, f"status={rr.status_code} body={rr.text[:200]}")

login_codes = []
for i in range(5):
    rr = requests.post(f"{BASE}/auth/login", json={"email": lock_email, "password": "wrong-pass"}, timeout=15)
    login_codes.append(rr.status_code)
    print(f"  bad login #{i+1}: {rr.status_code} body={rr.text[:120]}")
print(f"login_codes={login_codes}")
# After 5 fails -> account locked. Login attempt with correct password -> 429 still.
# Wait ~70s to make sure login rate-limit (5/min IP) is reset, but lockout (15min) still active.
print("Waiting 70s for IP-based login rate limit to clear (account lock should still apply)...")
time.sleep(70)
rr = requests.post(f"{BASE}/auth/login", json={"email": lock_email, "password": "abc1234567"}, timeout=15)
print(f"  login with CORRECT pwd after lockout: {rr.status_code} body={rr.text[:200]}")
check("login with correct pwd is still locked -> 429", rr.status_code == 429, f"status={rr.status_code} body={rr.text[:200]}")
check("lock message mentions verrouillé", "verrouill" in rr.text.lower(), f"body={rr.text[:200]}")

# =============================================================================
# 4) Security headers
# =============================================================================
print("\n=== 4) Security headers ===")
r = requests.get(f"{BASE}/tools", timeout=15)
print(f"  GET /api/tools status={r.status_code}")
hdrs = {k.lower(): v for k, v in r.headers.items()}
check("X-Content-Type-Options=nosniff", hdrs.get("x-content-type-options", "").lower() == "nosniff", f"value={hdrs.get('x-content-type-options')}")
check("X-Frame-Options=DENY", hdrs.get("x-frame-options", "").upper() == "DENY", f"value={hdrs.get('x-frame-options')}")
check("Strict-Transport-Security max-age", "max-age" in hdrs.get("strict-transport-security", ""), f"value={hdrs.get('strict-transport-security')}")
check("Permissions-Policy present", bool(hdrs.get("permissions-policy")), f"value={hdrs.get('permissions-policy')}")
check("Referrer-Policy present", bool(hdrs.get("referrer-policy")), f"value={hdrs.get('referrer-policy')}")

# =============================================================================
# 5) New auth endpoints (PATCH /me, change pwd, reset pwd, delete account)
# =============================================================================
print("\n=== 5) New auth endpoints ===")
print("Waiting 65s to clear any rate limits before fresh auth tests...")
time.sleep(65)

email5 = rand_email("auth5")
pwd5 = "abc1234567"
r = requests.post(f"{BASE}/auth/register", json={"email": email5, "password": pwd5, "accept_terms": True}, timeout=15)
check("fresh test account registered", r.status_code == 200, f"status={r.status_code} body={r.text[:200]}")
token5 = None
if r.status_code == 200:
    token5 = r.json()["token"]

# PATCH /api/auth/me
if token5:
    r = requests.patch(f"{BASE}/auth/me", json={"name": "Modifié"}, headers={"X-Auth-Token": token5}, timeout=15)
    check("PATCH /auth/me with valid token -> 200", r.status_code == 200, f"status={r.status_code} body={r.text[:200]}")
    if r.status_code == 200:
        check("PATCH /auth/me name updated to 'Modifié'", r.json().get("name") == "Modifié", f"user={r.json()}")

# POST /api/auth/password/change with bad current
if token5:
    r = requests.post(f"{BASE}/auth/password/change",
                      json={"current_password": "WRONG_pwd99", "new_password": "newpass1234"},
                      headers={"X-Auth-Token": token5}, timeout=15)
    check("password/change bad current -> 401", r.status_code == 401, f"status={r.status_code} body={r.text[:200]}")

# POST /api/auth/password/change with correct current
if token5:
    r = requests.post(f"{BASE}/auth/password/change",
                      json={"current_password": pwd5, "new_password": "newpass1234"},
                      headers={"X-Auth-Token": token5}, timeout=15)
    check("password/change correct -> 200", r.status_code == 200, f"status={r.status_code} body={r.text[:200]}")

# Reset password (existing email) - Note: limit 3/min so be careful
r = requests.post(f"{BASE}/auth/password/reset", json={"email": email5}, timeout=15)
check("password/reset existing email -> 200", r.status_code == 200, f"status={r.status_code} body={r.text[:200]}")
if r.status_code == 200:
    check("password/reset returns reset_link", "reset_link" in r.json(), f"json={r.json()}")

# Reset password (ghost email)
r = requests.post(f"{BASE}/auth/password/reset", json={"email": "ghost@nope.fr"}, timeout=15)
check("password/reset ghost email -> 200 (no leak)", r.status_code == 200, f"status={r.status_code} body={r.text[:200]}")

# DELETE /api/auth/account (use a separate fresh account to avoid test ordering issues)
print("Waiting 65s before DELETE account flow (avoid register rate-limit)...")
time.sleep(65)
email_del = rand_email("del")
r = requests.post(f"{BASE}/auth/register", json={"email": email_del, "password": "abc1234567", "accept_terms": True}, timeout=15)
check("delete-account: fresh register", r.status_code == 200, f"status={r.status_code} body={r.text[:200]}")
token_del = r.json()["token"] if r.status_code == 200 else None

if token_del:
    r = requests.delete(f"{BASE}/auth/account", headers={"X-Auth-Token": token_del}, timeout=15)
    check("DELETE /auth/account -> 200", r.status_code == 200, f"status={r.status_code} body={r.text[:200]}")
    # whoami with deleted user's token
    r = requests.get(f"{BASE}/auth/whoami", headers={"X-Auth-Token": token_del}, timeout=15)
    check("whoami after deletion -> 401 or 404", r.status_code in (401, 404), f"status={r.status_code} body={r.text[:200]}")

# =============================================================================
# 6) Cleanup tools
# =============================================================================
print("\n=== 6) Cleanup tools ===")
r = requests.get(f"{BASE}/tools/chatgpt", timeout=15)
check("/tools/chatgpt -> 200", r.status_code == 200, f"status={r.status_code}")
if r.status_code == 200:
    j = r.json()
    check("chatgpt tagline contains 'GPT-5.5'", "GPT-5.5" in j.get("tagline", ""), f"tagline={j.get('tagline')}")
    check("chatgpt score == 96", j.get("score") == 96, f"score={j.get('score')}")

r = requests.get(f"{BASE}/tools/gpt5", timeout=15)
check("/tools/gpt5 -> 404 (removed)", r.status_code == 404, f"status={r.status_code} body={r.text[:200]}")

r = requests.get(f"{BASE}/tools/cursor", timeout=15)
check("/tools/cursor -> 200", r.status_code == 200, f"status={r.status_code}")
if r.status_code == 200:
    j = r.json()
    lu = j.get("lastUpdated")
    check("cursor lastUpdated present and non-empty string", isinstance(lu, str) and len(lu) > 0, f"lastUpdated={lu}")

# =============================================================================
# 7) Admin endpoint guard
# =============================================================================
print("\n=== 7) Admin endpoint guard ===")
r = requests.post(f"{BASE}/admin/news/refresh", timeout=15)
check("/admin/news/refresh without token -> 401", r.status_code == 401, f"status={r.status_code} body={r.text[:200]}")

# =============================================================================
# 8) News rotation
# =============================================================================
print("\n=== 8) News rotation ===")
r = requests.get(f"{BASE}/news", timeout=15)
check("/news -> 200", r.status_code == 200, f"status={r.status_code}")
if r.status_code == 200:
    items = r.json()
    check("/news returns >=8 items", isinstance(items, list) and len(items) >= 8, f"len={len(items) if isinstance(items, list) else 'n/a'}")
    if isinstance(items, list) and items:
        has_ts = any(("created_at" in it) or ("publishedAt" in it) for it in items)
        check("at least one news has created_at or publishedAt", has_ts, f"sample keys={list(items[0].keys())[:10]}")

# =============================================================================
# Summary
# =============================================================================
print("\n========== SUMMARY ==========")
passed = sum(1 for _, ok, _ in results if ok)
failed = sum(1 for _, ok, _ in results if not ok)
print(f"PASS: {passed} / {len(results)}")
print(f"FAIL: {failed}")
print()
print("Failures:")
for name, ok, details in results:
    if not ok:
        print(f"  [FAIL] {name} -- {details}")
print()
print("All:")
for name, ok, details in results:
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}")

sys.exit(0 if failed == 0 else 1)
