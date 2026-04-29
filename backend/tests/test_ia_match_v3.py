"""Pytest suite for IA Match backend - iteration 3 (v3).
Covers: new news fields (intro/body/author), tool.domain, /api/resources, /api/builder/run with Claude Haiku.
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


# ---------- News v3 (intro / body / author + 7 articles) ----------
class TestNewsV3:
    def test_news_returns_7_with_new_fields(self, api):
        r = api.get(f"{BASE_URL}/api/news")
        assert r.status_code == 200
        items = r.json()
        assert len(items) == 7
        for n in items:
            for k in ("id", "category", "title", "summary", "publishedAt", "intro", "body", "author"):
                assert k in n, f"missing field {k} in {n.get('id')}"
            assert isinstance(n["intro"], str) and len(n["intro"]) > 20
            assert isinstance(n["body"], str) and len(n["body"]) > 200

    def test_news_n1_full_article(self, api):
        r = api.get(f"{BASE_URL}/api/news/n1")
        assert r.status_code == 200
        body = r.json()
        assert body["id"] == "n1"
        assert "## " in body["body"], "body should contain markdown h2 headers"
        assert body["author"]
        assert body["intro"]


# ---------- Tools v3 (domain field) ----------
class TestToolsV3:
    def test_tools_have_domain(self, api):
        r = api.get(f"{BASE_URL}/api/tools")
        assert r.status_code == 200
        tools = r.json()
        assert len(tools) == 48
        with_domain = [t for t in tools if t.get("domain")]
        assert len(with_domain) == len(tools), f"only {len(with_domain)}/{len(tools)} have domain"
        # cross-check: image == clearbit logo of domain
        for t in tools[:5]:
            assert t["domain"] in t["image"]

    def test_tool_chatgpt_domain(self, api):
        r = api.get(f"{BASE_URL}/api/tools/chatgpt")
        assert r.status_code == 200
        body = r.json()
        assert body["domain"] == "openai.com"


# ---------- Resources (new endpoint) ----------
class TestResources:
    def test_list_resources(self, api):
        r = api.get(f"{BASE_URL}/api/resources")
        assert r.status_code == 200
        items = r.json()
        assert len(items) == 12
        # all categories represented
        cats = {i["category"] for i in items}
        assert {"YOUTUBE", "BLOG", "PODCAST", "NEWSLETTER", "OUTIL"}.issubset(cats)
        for r_ in items:
            for k in ("id", "category", "title", "author", "summary", "url"):
                assert k in r_
            assert r_["url"].startswith("http")

    def test_filter_resources_by_category(self, api):
        r = api.get(f"{BASE_URL}/api/resources", params={"category": "YOUTUBE"})
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 1
        assert all(i["category"] == "YOUTUBE" for i in items)


# ---------- Builder (LLM via Claude Haiku 4.5) ----------
class TestBuilderRun:
    def test_builder_run_simple(self, api):
        r = api.post(f"{BASE_URL}/api/builder/run", json={"prompt": "Dis bonjour"}, timeout=60)
        assert r.status_code == 200, f"got {r.status_code}: {r.text[:300]}"
        body = r.json()
        assert "output" in body
        assert isinstance(body["output"], str)
        assert len(body["output"]) > 0

    def test_builder_run_empty_prompt(self, api):
        r = api.post(f"{BASE_URL}/api/builder/run", json={"prompt": "   "})
        assert r.status_code == 400
