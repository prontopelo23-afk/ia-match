#!/usr/bin/env python3
"""Generate frontend/src/fallbackData.ts from the local FastAPI app.

This keeps the Vercel/static build from losing rich IA Match data when no public
backend URL is configured.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
FRONTEND_OUT = ROOT / "frontend" / "src" / "fallbackData.ts"

sys.path.insert(0, str(BACKEND))
from fastapi.testclient import TestClient  # noqa: E402
import server  # noqa: E402

client = TestClient(server.app)

ENDPOINTS = {
    "TOOLS": "/api/tools",
    "CATEGORIES": "/api/categories",
    "NEWS": "/api/news",
    "EDITORIAL_FEED": "/api/editorial/feed",
    "EDITORIAL_CATEGORIES": "/api/editorial/categories",
    "EDITORIAL_SOURCES": "/api/editorial/sources",
    "EDITORIAL_HIGHLIGHTS": "/api/editorial/highlights",
    "LESSONS": "/api/lessons",
    "TEMPLATES": "/api/templates",
    "RESOURCES": "/api/resources",
    "ACADEMY_PATHS": "/api/academy/paths",
    "ACADEMY_BADGES": "/api/academy/badges",
    "ACADEMY_QUIZZES": "/api/academy/quizzes",
    "ACADEMY_EXERCISES": "/api/academy/exercises",
    "ACADEMY_BAD_TO_GOOD": "/api/academy/bad-to-good",
    "BEGINNER_TERMS": "/api/academy/beginner-terms",
    "BUILDER_PRESETS": "/api/builder/presets",
    "BUILDER_CONFIG": "/api/builder/config",
    "MODEL_RANKINGS": "/api/models/rankings",
    "KNOWLEDGE_INTELLIGENCE": "/api/knowledge/intelligence",
    "GLOSSARY": "/api/glossary",
    "FAQ": "/api/faq",
    "USE_CASES": "/api/use-cases",
    "PERSONAS": "/api/personas",
    # /api/quiz currently exposes a coroutine in local TestClient; keep the existing static quiz pack if needed.
}


def get_json(path: str):
    response = client.get(path)
    if response.status_code != 200:
        raise RuntimeError(f"{path} -> {response.status_code}: {response.text[:300]}")
    return response.json()


def main() -> None:
    data = {key: get_json(path) for key, path in ENDPOINTS.items()}
    counts = []
    for key, value in data.items():
        if isinstance(value, list):
            counts.append(f"// - {key}: {len(value)} items")
        elif isinstance(value, dict):
            counts.append(f"// - {key}: {len(value)} keys")
        else:
            counts.append(f"// - {key}: {type(value).__name__}")

    json_text = json.dumps(data, ensure_ascii=False, indent=2)
    content = "\n".join([
        "// Données de secours embarquées pour que IA Match ne soit jamais vide si l’API locale est indisponible.",
        "// Généré par scripts/generate_static_fallback_data.py depuis backend/server.py.",
        *counts,
        f"export const FALLBACK_DATA = {json_text} as const;",
        "",
    ])
    FRONTEND_OUT.write_text(content, encoding="utf-8")
    print(f"Wrote {FRONTEND_OUT}")
    print("\n".join(counts))


if __name__ == "__main__":
    main()
