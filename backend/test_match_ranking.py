from fastapi.testclient import TestClient

import server


def _match(need: str, priority: str = "accuracy"):
    client = TestClient(server.app)
    response = client.post(
        "/api/match",
        json={"need": need, "priority": priority, "free_only": False, "language": "fr"},
    )
    assert response.status_code == 200
    return response.json()


def _names(items):
    return [item["tool"]["name"] for item in items]


def test_image_professional_match_prefers_chatgpt_image_before_topaz_or_nano_banana():
    items = _match(
        "Je veux créer une image professionnelle premium pour une campagne marketing, niveau pro, meilleur outil possible même payant"
    )
    names = _names(items)
    assert names[0] == "ChatGPT Image 2.0", names
    for competitor in ["Nano Banana", "Topaz"]:
        competitor_ranks = [i for i, name in enumerate(names) if competitor in name]
        if competitor_ranks:
            assert competitor_ranks[0] > 2, names


def test_image_generation_match_does_not_rank_photo_enhancers_before_generators():
    names = _names(_match("créer une image de marque professionnelle avec du texte lisible et un rendu premium"))
    assert "Topaz Photo AI" not in names[:3], names
    assert "Photoroom" not in names[:3], names


def test_tools_image_category_ranks_chatgpt_image_first_for_score_sort():
    client = TestClient(server.app)
    response = client.get("/api/tools", params={"category": "image", "sort": "score"})
    assert response.status_code == 200
    names = _names([{"tool": t} for t in response.json()])
    assert names[0] == "ChatGPT Image 2.0", names[:8]
