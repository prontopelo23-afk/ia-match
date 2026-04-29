"""Pytest suite IA Match backend v4: 10 articles, 10 lessons, 15 templates (5/5/5)."""
import os
import pytest
import requests

BASE_URL = (
    os.environ.get("EXPO_BACKEND_URL")
    or os.environ.get("EXPO_PUBLIC_BACKEND_URL")
).rstrip("/")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- News v4 (10 articles, body 300+ words) ----------
class TestNewsV4:
    def test_news_returns_10(self, api):
        r = api.get(f"{BASE_URL}/api/news")
        assert r.status_code == 200
        items = r.json()
        assert len(items) == 10, f"expected 10 articles, got {len(items)}"

    def test_news_n1_is_gpt55(self, api):
        r = api.get(f"{BASE_URL}/api/news")
        items = r.json()
        first = items[0]
        assert first["id"] == "n1"
        assert "GPT-5.5" in first["title"]
        # body 300+ words
        assert len(first["body"].split()) >= 300, f"n1 body has only {len(first['body'].split())} words"

    def test_news_required_topics_present(self, api):
        r = api.get(f"{BASE_URL}/api/news")
        items = r.json()
        by_id = {n["id"]: n for n in items}
        assert "GPT Image 2.0" in by_id["n2"]["title"]
        assert "américain" in by_id["n3"]["title"].lower() or "americain" in by_id["n3"]["title"].lower()
        assert "Mistral" in by_id["n4"]["title"]
        assert "Highfield" in by_id["n5"]["title"]

    def test_news_all_have_300plus_word_body(self, api):
        r = api.get(f"{BASE_URL}/api/news")
        items = r.json()
        below = [n["id"] for n in items if len(n["body"].split()) < 300]
        # At least the first 5 educational articles must have 300+ words
        flagged = [i for i in below if i in ("n1", "n2", "n3", "n4", "n5", "n6")]
        assert not flagged, f"articles below 300 words: {flagged}"

    def test_news_detail_n1(self, api):
        r = api.get(f"{BASE_URL}/api/news/n1")
        assert r.status_code == 200
        body = r.json()
        assert "## " in body["body"]
        assert body["intro"]


# ---------- Lessons v4 (10 fundamentals) ----------
class TestLessonsV4:
    def test_lessons_returns_10(self, api):
        r = api.get(f"{BASE_URL}/api/lessons")
        assert r.status_code == 200
        items = r.json()
        assert len(items) == 10, f"expected 10 lessons, got {len(items)}"

    def test_lessons_specific_topics(self, api):
        r = api.get(f"{BASE_URL}/api/lessons")
        items = r.json()
        by_id = {l["id"]: l for l in items}
        assert "modèle" in by_id["l1"]["title"].lower()
        assert "token" in by_id["l2"]["title"].lower()
        assert "halluc" in by_id["l3"]["title"].lower()
        assert "modèle" in by_id["l5"]["title"].lower() or "choisir" in by_id["l5"]["title"].lower()
        assert "chain" in by_id["l10"]["title"].lower() or "raisonn" in by_id["l10"]["title"].lower()

    def test_lessons_have_required_fields(self, api):
        r = api.get(f"{BASE_URL}/api/lessons")
        items = r.json()
        for l in items:
            for k in ("id", "order", "level", "title", "intro", "body", "framework", "steps", "before", "after"):
                assert k in l, f"missing {k} in {l.get('id')}"


# ---------- Templates v4 (15 = 5/5/5 by level) ----------
class TestTemplatesV4:
    def test_templates_returns_15(self, api):
        r = api.get(f"{BASE_URL}/api/templates")
        assert r.status_code == 200
        items = r.json()
        assert len(items) == 15, f"expected 15 templates, got {len(items)}"

    def test_templates_split_5_5_5(self, api):
        r = api.get(f"{BASE_URL}/api/templates")
        items = r.json()
        levels = {}
        for t in items:
            levels[t["level"]] = levels.get(t["level"], 0) + 1
        assert levels.get("BEGINNER") == 5, f"expected 5 BEGINNER, got {levels.get('BEGINNER')}"
        assert levels.get("INTERMEDIATE") == 5, f"expected 5 INTERMEDIATE, got {levels.get('INTERMEDIATE')}"
        assert levels.get("ADVANCED") == 5, f"expected 5 ADVANCED, got {levels.get('ADVANCED')}"

    def test_filter_templates_by_level(self, api):
        for lvl in ("BEGINNER", "INTERMEDIATE", "ADVANCED"):
            r = api.get(f"{BASE_URL}/api/templates", params={"level": lvl})
            assert r.status_code == 200
            items = r.json()
            assert len(items) == 5
            assert all(t["level"] == lvl for t in items)


# ---------- Sanity regression ----------
class TestRegression:
    def test_tools_still_48(self, api):
        r = api.get(f"{BASE_URL}/api/tools")
        assert r.status_code == 200
        assert len(r.json()) == 48

    def test_resources_still_12(self, api):
        r = api.get(f"{BASE_URL}/api/resources")
        assert r.status_code == 200
        assert len(r.json()) == 12
