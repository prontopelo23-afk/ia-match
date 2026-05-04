"""Smoke-tests locaux fiables pour l'API IA Match courante."""
from fastapi.testclient import TestClient
import server


client = TestClient(server.app)


def test_health_and_core_endpoints():
    checks = [
        ("/api/", dict),
        ("/api/tools", list),
        ("/api/categories", list),
        ("/api/lessons", list),
        ("/api/academy/paths", list),
        ("/api/models/rankings", dict),
        ("/api/builder/config", dict),
    ]
    for path, expected_type in checks:
        response = client.get(path)
        assert response.status_code == 200, f"{path}: {response.status_code} {response.text[:200]}"
        assert isinstance(response.json(), expected_type)


def test_current_data_packs_are_loaded():
    tools = client.get("/api/tools").json()
    lessons = client.get("/api/lessons").json()
    paths = client.get("/api/academy/paths").json()
    builder_config = client.get("/api/builder/config").json()
    rankings = client.get("/api/models/rankings").json()

    assert len(tools) >= 48
    assert len(lessons) >= 80
    assert len(paths) >= 10
    assert len(builder_config.get("quality_rules", [])) >= 5
    assert len(rankings.get("import_ready_records", [])) >= 90


def test_match_returns_actionable_result():
    response = client.post("/api/match", json={
        "need": "Je veux écrire un email clair pour un client débutant",
        "priority": "balanced",
        "free_only": False,
        "language": "fr",
    })
    assert response.status_code == 200
    results = response.json()
    assert results
    first = results[0]
    assert first["tool"]["name"]
    assert first["matchScore"] > 0
    assert first.get("reasons")
    assert first.get("readyPrompt")


def test_match_recommendations_do_not_repeat_public_products():
    response = client.post("/api/match", json={
        "need": "Je veux comparer des modèles IA pour mon entreprise",
        "priority": "balanced",
        "free_only": False,
        "language": "fr",
    })
    assert response.status_code == 200
    names = [item["tool"]["name"].lower() for item in response.json()[:10]]
    assert len(names) == len(set(names))


def test_match_image_recommendations_group_model_variants():
    response = client.post("/api/match", json={
        "need": "Je veux créer une image pour une publicité Instagram",
        "priority": "price",
        "free_only": True,
        "language": "fr",
    })
    assert response.status_code == 200
    names = [item["tool"]["name"].lower() for item in response.json()[:8]]
    assert sum("flux" in name for name in names) <= 1
    assert sum("stable diffusion" in name for name in names) <= 1
    assert sum("nano banana" in name for name in names) <= 1
    assert sum("gpt image" in name or "chatgpt image" in name for name in names) <= 1
