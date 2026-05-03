#!/usr/bin/env python3
"""
Script pour récupérer les benchmarks publics et mettre à jour scoreDetails.
Sources : Artificial Analysis, LMSYS Arena, SWE-bench, OpenRouter.
"""
import httpx, json, os, sys
from pathlib import Path

BASE = Path(__file__).parent.parent
DATA_FILE = BASE / "backend" / "data" / "benchmarks_cache.json"

# Sources publiques (exemples réels)
SOURCES = {
    "artificial_analysis": "https://artificialanalysis.ai/api/v1/rankings",
    "arena_lmsys": "https://huggingface.co/api/spaces/lmsys/chatbot-arena-leaderboard",
    "swe_bench": "https://raw.githubusercontent.com/swe-bench/experiments/main/results.json",
}

def fetch_all():
    results = {}
    client = httpx.Client(timeout=30.0)
    
    # 1. Artificial Analysis rankings
    try:
        r = client.get(SOURCES["artificial_analysis"])
        data = r.json()
        results["artificial_analysis"] = {item["model"]: item for item in data.get("rankings", [])}
    except Exception as e:
        print(f"Artificial Analysis error: {e}")
        results["artificial_analysis"] = {}
    
    # 2. LMSYS Arena
    try:
        r = client.get(SOURCES["arena_lmsys"])
        data = r.json()
        results["arena_lmsys"] = {item["model"]: item for item in data.get("data", [])}
    except Exception as e:
        print(f"LMSYS Arena error: {e}")
        results["arena_lmsys"] = {}
    
    # 3. SWE-bench (code tasks)
    try:
        r = client.get(SOURCES["swe_bench"])
        data = r.json()
        results["swe_bench"] = {item["model"]: item for item in data.get("results", [])}
    except Exception as e:
        print(f"SWE-bench error: {e}")
        results["swe_bench"] = {}
    
    # Sauvegarde cache
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Cache sauvegardé: {DATA_FILE}")
    return results

def update_tool_scores(results, db_path="backend/database.json"):
    """Met à jour les scores dans la base de données."""
    db = json.loads(Path(BASE / db_path).read_text()) if Path(BASE / db_path).exists() else {}
    
    for tool in db.get("tools", []):
        slug = tool.get("slug", "")
        tool["scoreDetails"] = {
            "Artificial Analysis": results.get("artificial_analysis", {}).get(slug, {}).get("score", None),
            "Arena/LMSYS": results.get("arena_lmsys", {}).get(slug, {}).get("score", None),
            "SWE-bench": results.get("swe_bench", {}).get(slug, {}).get("pass_rate", None),
            "Sources": ["Artificial Analysis", "Arena/LMSYS", "SWE-bench"]
        }
    
    with open(BASE / db_path, "w") as f:
        json.dump(db, f, indent=2)
    print("Scores mis à jour dans database.json")

if __name__ == "__main__":
    print("Récupération des benchmarks...")
    cache = fetch_all()
    update_tool_scores(cache)