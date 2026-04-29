"""Pytest suite for IA Match backend - iteration 2.
Covers new endpoints (news, lessons, templates), expanded catalog (48 tools), and regression on existing flows.
"""
import os
import pytest
import requests

BASE_URL = (
    os.environ.get("EXPO_BACKEND_URL")
    or os.environ.get("EXPO_PUBLIC_BACKEND_URL")
    or "https://ai-match-13.preview.emergentagent.com"
).rstrip("/")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        body = r.json()
        assert body.get("message") == "IA Match API"


# ---------- Catalog (expanded to 48) ----------
class TestCatalog:
    def test_categories(self, api):
        r = api.get(f"{BASE_URL}/api/categories")
        assert r.status_code == 200
        cats = r.json()
        assert len(cats) >= 7
        slugs = {c["slug"] for c in cats}
        assert {"texte", "image", "code", "video", "audio", "productivite", "recherche"}.issubset(slugs)

    def test_tools_count_48(self, api):
        r = api.get(f"{BASE_URL}/api/tools")
        assert r.status_code == 200
        tools = r.json()
        assert len(tools) == 48, f"Expected 48 tools, got {len(tools)}"

    def test_tools_have_clearbit_logos(self, api):
        r = api.get(f"{BASE_URL}/api/tools")
        tools = r.json()
        clearbit = [t for t in tools if t.get("image", "").startswith("https://logo.clearbit.com/")]
        assert len(clearbit) == len(tools), f"Only {len(clearbit)}/{len(tools)} tools use Clearbit logos"

    def test_tools_filter_image_category(self, api):
        r = api.get(f"{BASE_URL}/api/tools", params={"category": "image"})
        assert r.status_code == 200
        items = r.json()
        assert len(items) > 0
        for t in items:
            assert "image" in t["categorySlugs"]

    def test_tools_search_chatgpt(self, api):
        r = api.get(f"{BASE_URL}/api/tools", params={"search": "chatgpt"})
        assert r.status_code == 200
        items = r.json()
        assert any(t["slug"] == "chatgpt" for t in items)

    def test_tools_free_only(self, api):
        r = api.get(f"{BASE_URL}/api/tools", params={"free_only": True})
        assert r.status_code == 200
        for t in r.json():
            assert t["freeTier"] is True

    def test_tools_sort_speed(self, api):
        r = api.get(f"{BASE_URL}/api/tools", params={"sort": "speed"})
        items = r.json()
        speeds = [t["speedMs"] for t in items]
        assert speeds == sorted(speeds)

    def test_tool_detail_chatgpt(self, api):
        r = api.get(f"{BASE_URL}/api/tools/chatgpt")
        assert r.status_code == 200
        body = r.json()
        assert body["slug"] == "chatgpt"
        assert body["image"].startswith("https://logo.clearbit.com/")

    def test_tool_detail_404(self, api):
        r = api.get(f"{BASE_URL}/api/tools/does-not-exist")
        assert r.status_code == 404


# ---------- Match wizard regression ----------
class TestMatch:
    def test_match_cv(self, api):
        r = api.post(f"{BASE_URL}/api/match", json={"need": "faire un cv", "priority": "balanced"})
        assert r.status_code == 200
        results = r.json()
        assert 1 <= len(results) <= 8
        assert results[0]["matchScore"] >= results[-1]["matchScore"]

    def test_match_empty_need(self, api):
        r = api.post(f"{BASE_URL}/api/match", json={"need": "  "})
        assert r.status_code == 400


# ---------- Benchmarks ----------
class TestBenchmarks:
    def test_benchmarks_returns_48_rows(self, api):
        r = api.get(f"{BASE_URL}/api/benchmarks")
        assert r.status_code == 200
        rows = r.json()["rows"]
        assert len(rows) == 48

    def test_benchmarks_sort_accuracy(self, api):
        r = api.get(f"{BASE_URL}/api/benchmarks", params={"sort": "accuracy"})
        rows = r.json()["rows"]
        accs = [row["accuracyPct"] for row in rows]
        assert accs == sorted(accs, reverse=True)


# ---------- Ratings ----------
class TestRatings:
    def test_create_and_get_rating(self, api):
        payload = {"tool_slug": "chatgpt", "score": 88, "note": "TEST_pytest"}
        r = api.post(f"{BASE_URL}/api/ratings", json=payload)
        assert r.status_code == 200
        body = r.json()
        assert body["tool_slug"] == "chatgpt"
        assert body["score"] == 88
        # Verify aggregation
        r2 = api.get(f"{BASE_URL}/api/ratings/chatgpt")
        assert r2.status_code == 200
        agg = r2.json()
        assert agg["count"] >= 1

    def test_rating_invalid_score(self, api):
        r = api.post(f"{BASE_URL}/api/ratings", json={"tool_slug": "chatgpt", "score": 200})
        assert r.status_code == 400

    def test_rating_unknown_tool(self, api):
        r = api.post(f"{BASE_URL}/api/ratings", json={"tool_slug": "ghost", "score": 50})
        assert r.status_code == 404


# ---------- News (Actue) ----------
class TestNews:
    def test_list_news(self, api):
        r = api.get(f"{BASE_URL}/api/news")
        assert r.status_code == 200
        items = r.json()
        assert len(items) == 7, f"Expected 7 articles, got {len(items)}"
        first = items[0]
        for k in ("id", "category", "title", "summary", "publishedAt"):
            assert k in first

    def test_get_featured_article(self, api):
        r = api.get(f"{BASE_URL}/api/news/n1")
        assert r.status_code == 200
        body = r.json()
        assert body["title"] == "GPT-5.2 simplifie le prompt stack"
        assert body["highlight"] == "5.2"

    def test_news_404(self, api):
        r = api.get(f"{BASE_URL}/api/news/nope")
        assert r.status_code == 404


# ---------- Lessons (Academy) ----------
class TestLessons:
    def test_list_lessons_sorted(self, api):
        r = api.get(f"{BASE_URL}/api/lessons")
        assert r.status_code == 200
        items = r.json()
        assert len(items) == 5
        orders = [le["order"] for le in items]
        assert orders == sorted(orders)

    def test_lesson_detail(self, api):
        r = api.get(f"{BASE_URL}/api/lessons/l1")
        assert r.status_code == 200
        body = r.json()
        for k in ("framework", "before", "after", "steps"):
            assert k in body
        assert isinstance(body["steps"], list) and len(body["steps"]) > 0


# ---------- Templates (Academy) ----------
class TestTemplates:
    def test_list_templates(self, api):
        r = api.get(f"{BASE_URL}/api/templates")
        assert r.status_code == 200
        items = r.json()
        assert len(items) == 8

    def test_template_detail(self, api):
        r = api.get(f"{BASE_URL}/api/templates/t1")
        assert r.status_code == 200
        body = r.json()
        assert "body" in body and "variables" in body
        assert isinstance(body["variables"], list)

    def test_templates_filter_by_level(self, api):
        r = api.get(f"{BASE_URL}/api/templates", params={"level": "BEGINNER"})
        assert r.status_code == 200
        items = r.json()
        assert all(t["level"].upper() == "BEGINNER" for t in items)
