"""Configuration pytest locale IA Match.

Les anciens fichiers test_ia_match*.py sont des tests HTTP d'intégration qui ciblent
une URL Emergent/Expo historique et des compteurs de données v1/v2/v3 devenus obsolètes.
En local, on exécute plutôt des smoke-tests FastAPI TestClient fiables.
Pour relancer explicitement ces tests legacy contre une URL déployée :
IA_MATCH_RUN_LEGACY_HTTP_TESTS=1 EXPO_BACKEND_URL=https://... pytest tests
"""
import os
from pathlib import Path


def pytest_ignore_collect(collection_path: Path, config):
    name = collection_path.name
    if name.startswith("test_ia_match") and os.environ.get("IA_MATCH_RUN_LEGACY_HTTP_TESTS") != "1":
        return True
    return False
