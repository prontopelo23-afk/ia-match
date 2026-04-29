"""Backend tests for IA Match API."""
import os
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://ai-match-13.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ---------- tools ----------
def test_list_tools_returns_20(s):
    r = s.get(f"{API}/tools", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 20
    t = data[0]
    for key in ["slug", "name", "vendor", "tagline", "description", "categorySlugs", "speedMs", "accuracyPct", "monthlyPrice", "freeTier", "languages", "score"]:
        assert key in t


def test_get_single_tool_chatgpt(s):
    r = s.get(f"{API}/tools/chatgpt", timeout=15)
    assert r.status_code == 200
    assert r.json()["slug"] == "chatgpt"


def test_get_unknown_tool_404(s):
    r = s.get(f"{API}/tools/does-not-exist", timeout=15)
    assert r.status_code == 404


# ---------- categories ----------
def test_categories_returns_7(s):
    r = s.get(f"{API}/categories", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 7
    slugs = [c["slug"] for c in data]
    assert "texte" in slugs and "image" in slugs and "code" in slugs


# ---------- benchmarks ----------
@pytest.mark.parametrize("sort_key,field,reverse", [
    ("speed", "speedMs", False),
    ("accuracy", "accuracyPct", True),
    ("score", "score", True),
])
def test_benchmarks_sorting(s, sort_key, field, reverse):
    r = s.get(f"{API}/benchmarks", params={"sort": sort_key}, timeout=15)
    assert r.status_code == 200
    rows = r.json()["rows"]
    assert len(rows) == 20
    vals = [row[field] for row in rows]
    assert vals == sorted(vals, reverse=reverse)


def test_benchmarks_price_free_first(s):
    r = s.get(f"{API}/benchmarks", params={"sort": "price"}, timeout=15)
    assert r.status_code == 200
    rows = r.json()["rows"]
    # Free tier rows should come first
    free_seen_done = False
    for row in rows:
        if not row["freeTier"]:
            free_seen_done = True
        elif free_seen_done:
            pytest.fail("Free tier appeared after paid in price sort")


# ---------- match ----------
def test_match_cv_returns_chatgpt_top(s):
    r = s.post(f"{API}/match", json={"need": "faire un cv", "priority": "balanced"}, timeout=20)
    assert r.status_code == 200
    results = r.json()
    assert len(results) > 0 and len(results) <= 8
    top_slugs = [x["tool"]["slug"] for x in results[:3]]
    assert "chatgpt" in top_slugs
    assert "matchScore" in results[0] and "reasons" in results[0]


def test_match_priority_speed_orders_fast(s):
    r = s.post(f"{API}/match", json={"need": "réponse rapide", "priority": "speed"}, timeout=20)
    assert r.status_code == 200
    results = r.json()
    # First tool should be reasonably fast
    assert results[0]["tool"]["speedMs"] <= 500


def test_match_free_only_filters(s):
    r = s.post(f"{API}/match", json={"need": "écrire un texte", "priority": "balanced", "free_only": True}, timeout=20)
    assert r.status_code == 200
    for item in r.json():
        assert item["tool"]["freeTier"] is True


def test_match_empty_need_400(s):
    r = s.post(f"{API}/match", json={"need": "  ", "priority": "balanced"}, timeout=15)
    assert r.status_code == 400


# ---------- ratings ----------
def test_ratings_create_and_aggregate(s):
    payload = {"tool_slug": "chatgpt", "score": 85, "note": "TEST_rating"}
    r = s.post(f"{API}/ratings", json=payload, timeout=15)
    assert r.status_code == 200
    body = r.json()
    assert body["tool_slug"] == "chatgpt" and body["score"] == 85
    # aggregate
    g = s.get(f"{API}/ratings/chatgpt", timeout=15)
    assert g.status_code == 200
    summary = g.json()
    assert summary["count"] >= 1
    assert 0 <= summary["average"] <= 100


def test_ratings_score_too_high_400(s):
    r = s.post(f"{API}/ratings", json={"tool_slug": "chatgpt", "score": 150}, timeout=15)
    assert r.status_code == 400


def test_ratings_score_negative_400(s):
    r = s.post(f"{API}/ratings", json={"tool_slug": "chatgpt", "score": -5}, timeout=15)
    assert r.status_code == 400


def test_ratings_unknown_tool_404(s):
    r = s.post(f"{API}/ratings", json={"tool_slug": "nope-xyz", "score": 50}, timeout=15)
    assert r.status_code == 404
