from typing import Dict, Any, List
import json
from pathlib import Path

# Central cache for static IA Match data loaded at backend boot.
_cached_data: Dict[str, Any] = {}


def _read_json(path: Path) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _logo(domain: str) -> str:
    return f"https://logo.clearbit.com/{domain}"


def _hash_int(s: str, mod: int) -> int:
    h = 0
    for ch in s:
        h = (h * 131 + ord(ch)) & 0xFFFFFFFF
    return h % mod


def _compute_category_scores(tool: dict) -> dict:
    """Return editorial category-fit indices, not fake benchmark measurements.

    These values are deliberately derived from the curated global score,
    accuracy, and declared specialty order. There is no slug hashing or
    pseudo-random variation: if a category has no verified override in the
    imported model pack, IA Match exposes it only as an editorial fit index.
    """
    cats = tool.get("categorySlugs", []) or []
    base = int(tool.get("score", 70))
    acc = int(tool.get("accuracyPct", 75))
    editorial_base = int(base * 0.6 + acc * 0.4)
    out: dict = {}
    for i, c in enumerate(cats):
        # Primary specialty stays close to the curated score; secondary
        # categories are intentionally discounted so they cannot masquerade as
        # equally strong measured benchmarks.
        penalty = 0 if i == 0 else 7 if i == 1 else 13 + (i - 2) * 4
        out[c] = max(40, min(99, editorial_base - penalty))
    return out


IMAGE_RANKING_OVERRIDES = {
    # IA Match treats this as the current OpenAI/ChatGPT image product.
    # It should be the default pro recommendation for broad image generation.
    "dalle": {
        "name": "ChatGPT Image 2.0",
        "tagline": "Le meilleur choix polyvalent pour créer des images pro dans ChatGPT",
        "description": "Génération et édition d’images OpenAI intégrées à ChatGPT : très bon suivi de consigne, texte lisible, retouche conversationnelle et usage marketing/pro.",
        "accuracyPct": 97,
        "score": 97,
        "categoryScores": {"image": 99},
        "features": ["Intégré ChatGPT", "Génération image", "Édition conversationnelle", "Texte lisible", "Usage marketing"],
        "useCases": ["Visuel marketing pro", "Image de marque", "Illustration premium", "Retouche par prompt"],
        "keywords": ["image", "chatgpt", "openai", "gpt image", "dall-e", "dalle", "illustration", "dessin", "visuel", "concept", "professionnel", "professionnelle", "pro", "premium", "marketing", "campagne", "marque", "brand", "texte", "typographie", "retouche"],
    },
    "midjourney": {"categoryScores": {"image": 96}},
    "nano-banana": {"score": 93, "accuracyPct": 94, "categoryScores": {"image": 94}},
    "nano-banana-2": {"score": 95, "accuracyPct": 95, "categoryScores": {"image": 95}},
    "nano-banana-pro": {"score": 94, "accuracyPct": 94, "categoryScores": {"image": 94}},
    "gpt-image-2-high": {"score": 96, "accuracyPct": 96, "categoryScores": {"image": 96}},
    "gpt-image-2": {"score": 95, "accuracyPct": 95, "categoryScores": {"image": 95}},
    "gpt-image-15": {"score": 88, "accuracyPct": 88, "categoryScores": {"image": 88}},
    "gpt-image-1-5-high": {"score": 87, "accuracyPct": 87, "categoryScores": {"image": 87}},
    "imagen": {"score": 90, "accuracyPct": 90, "categoryScores": {"image": 90}},
    "flux": {"categoryScores": {"image": 92}},
    "topaz": {"categoryScores": {"image": 78}},
    "photoroom": {"categoryScores": {"image": 82}},
    "magnific": {"categoryScores": {"image": 84}},
}


def _apply_calibration_overrides(tool: dict) -> dict:
    out = dict(tool)
    override = IMAGE_RANKING_OVERRIDES.get(out.get("slug"))
    if override:
        for key, value in override.items():
            if key == "keywords":
                merged = list(dict.fromkeys([*out.get("keywords", []), *value]))
                out[key] = merged
            elif key == "features":
                out[key] = list(dict.fromkeys([*out.get("features", []), *value]))
            elif key == "useCases":
                out[key] = list(dict.fromkeys([*value, *out.get("useCases", [])]))
            elif key == "categoryScores":
                scores = dict(out.get("categoryScores", {}))
                scores.update(value)
                out[key] = scores
            else:
                out[key] = value
    return out


def _decorate_tool_extras(t: dict) -> dict:
    out = _apply_calibration_overrides(t)
    priv = (_cached_data.get("privacy_overrides") or {}).get(out["slug"]) or (_cached_data.get("privacy_overrides") or {}).get("_default", {})
    out["privacy"] = priv
    examples = _cached_data.get("examples") or {}
    if out["slug"] in examples:
        out["example"] = examples[out["slug"]]
    return out


def _course_to_lesson(course: dict, idx: int) -> dict:
    chapters = course.get("chapters") or []
    body_parts = []
    steps = []
    for ch in chapters:
        title = ch.get("title") or f"Étape {ch.get('order', len(steps) + 1)}"
        lesson = ch.get("simple_lesson") or ch.get("content") or ""
        action = ch.get("action_to_try")
        body_parts.append(f"## {title}\n{lesson}" + (f"\n\nÀ essayer : {action}" if action else ""))
        steps.append(action or lesson or title)
    objectives = course.get("learning_objectives") or course.get("learning_goals") or []
    level = str(course.get("level") or "BEGINNER").upper()
    if level == "DEBUTANT":
        level = "BEGINNER"
    elif level in {"INTERMEDIAIRE", "INTERMÉDIAIRE"}:
        level = "INTERMEDIATE"
    elif level == "AVANCE":
        level = "ADVANCED"
    return {
        "id": course.get("id") or f"lesson_{idx + 1}",
        "order": idx + 1,
        "level": level,
        "minutes": int(course.get("estimated_duration_minutes") or course.get("duration_minutes") or 10),
        "title": course.get("title") or "Leçon IA Match",
        "intro": course.get("plain_language_summary") or "Une leçon IA Match pratique et directement actionnable.",
        "body": "\n\n".join(body_parts) or course.get("summary") or "",
        "framework": " · ".join(objectives[:3]) if objectives else "Objectif · Contexte · Contraintes · Format",
        "steps": [s for s in steps[:5] if s] or objectives[:5] or ["Définir l’objectif", "Ajouter le contexte", "Demander un format clair"],
        "before": (course.get("common_mistakes") or [{}])[0].get("simple_explanation", "Fais-moi un truc avec l’IA."),
        "after": (course.get("learning_objectives") or course.get("learning_goals") or ["Donne une réponse structurée avec contexte, contraintes et format."])[0],
        "access": course.get("access") or ("premium" if course.get("premium") else "free"),
        "path_id": course.get("path_id"),
        "recommended_template_ids": course.get("recommended_template_ids", []),
    }


def _template_to_public(template: dict, idx: int) -> dict:
    return {
        "id": template.get("id") or f"tpl_{idx + 1}",
        "level": str(template.get("level") or "BEGINNER").upper(),
        "title": template.get("title") or "Template IA Match",
        "body": template.get("template") or template.get("body") or "",
        "variables": template.get("variables") or [],
        "category": template.get("category"),
        "premium": bool(template.get("premium", False)),
        "quality_checks": template.get("quality_checks") or [],
    }


def _load_ia_match_v4_files(base_path: Path) -> None:
    data_dir = base_path / "data"
    public_path = data_dir / "ia_match_public_v4.json"
    models_path = data_dir / "ia_match_models_full_v1.json"
    academy_path = data_dir / "ia_match_academy_premium_v1.json"

    if public_path.exists():
        public = _read_json(public_path)
        _cached_data["ia_match_public_v4"] = public
        core = public.get("core", {})
        content = public.get("content", {})
        _cached_data["verified_entities"] = core.get("entities", [])
        _cached_data["verified_rankings"] = core.get("rankings", [])
        _cached_data["verified_benchmarks"] = core.get("benchmarks", [])
        _cached_data["verified_sources"] = core.get("sources", [])
        _cached_data["verified_comparisons"] = core.get("comparisons", [])
        _cached_data["production_categories"] = core.get("categories", [])
        _cached_data["prompt_builder_presets"] = content.get("prompt_builder_presets", [])
        _cached_data["prompt_quality_rules"] = [
            "La demande précise le rôle de l’IA et le résultat attendu.",
            "Le contexte utile est donné avant les contraintes.",
            "Le format de sortie est explicite et facile à vérifier.",
            "Le prompt évite le jargon inutile et demande une réponse en français clair.",
            "La réussite est décrite avec un critère concret et actionnable.",
        ]
        _cached_data["intent_router"] = [
            {"intent": "écrire", "recommended_model": "ChatGPT", "reason": "réponses structurées, rapides et faciles à retravailler"},
            {"intent": "analyser", "recommended_model": "Claude", "reason": "bon pour le contexte long, les documents et la nuance"},
            {"intent": "chercher", "recommended_model": "Perplexity", "reason": "utile quand il faut des sources et vérifier l’actualité"},
            {"intent": "coder", "recommended_model": "Claude ou Cursor", "reason": "adapté aux étapes techniques et au debug"},
            {"intent": "créer une image", "recommended_model": "ChatGPT Image ou Midjourney", "reason": "meilleur quand le brief visuel est détaillé"},
        ]
        _cached_data["prompt_builder_config"] = {
            "version": "ia_match_builder_v1",
            "score_max": 100,
            "beginner_formula": "rôle + objectif + contexte + contraintes + format + critère de réussite",
            "copywriting_rule": "Écrire pour des gens qui connaissent leur tâche, pas les noms des modèles.",
        }
        _cached_data["prompt_categories"] = sorted({t.get("category") for t in content.get("prompt_templates", []) if t.get("category")})
        _cached_data["templates"] = [_template_to_public(t, i) for i, t in enumerate(content.get("prompt_templates", []))] or _cached_data.get("templates", [])
        _cached_data["resources"] = content.get("resources", []) or _cached_data.get("resources", [])
        if content.get("academy_courses"):
            _cached_data["lessons"] = [_course_to_lesson(c, i) for i, c in enumerate(content.get("academy_courses", []))]
        if content.get("glossary"):
            _cached_data["glossary"] = content.get("glossary")
        if content.get("faq"):
            _cached_data["faq"] = content.get("faq")

    if models_path.exists():
        models = _read_json(models_path)
        _cached_data["model_rankings"] = models
        _cached_data["model_import_records"] = models.get("import_ready_records", [])
        _cached_data["knowledge_intelligence"] = {
            "methodology": models.get("methodology", {}),
            "sources": models.get("sources", []),
            "recommendations": models.get("recommendations", {}),
        }

    if academy_path.exists():
        academy = _read_json(academy_path)
        _cached_data["academy_premium_v1"] = academy
        _cached_data["academy_paths"] = academy.get("learning_paths", [])
        _cached_data["academy_badges"] = academy.get("academy_badges", [])
        _cached_data["academy_quizzes_premium"] = academy.get("academy_quizzes", [])
        _cached_data["academy_exercises"] = academy.get("academy_exercises", [])
        _cached_data["academy_bad_to_good_examples"] = academy.get("bad_to_good_examples", [])
        premium_courses = academy.get("academy_courses", [])
        if premium_courses:
            _cached_data["lessons"] = [_course_to_lesson(c, i) for i, c in enumerate(premium_courses)]


def load_static_data(base_path: Path):
    """Load built-in seed data, then enrich it with verified JSON packs when present."""
    global _cached_data
    _cached_data = {}

    tools_path = base_path / "data" / "tools.json"
    if tools_path.exists():
        _cached_data["tools"] = _read_json(tools_path)
        _cached_data["categories"] = []
        _cached_data["privacy_overrides"] = {"_default": {}}
        _cached_data["examples"] = {}
    else:
        from seed_data import TOOLS, CATEGORIES
        from seed_data_extra import EXTRA_TOOLS
        from editorial_data import NEWS, LESSONS, TEMPLATES, RESOURCES
        from learn_data import GLOSSARY, FAQ, USE_CASES, PERSONAS, PRIVACY_OVERRIDES, EXAMPLES, QUIZ, quiz_level

        existing_slugs = {t["slug"] for t in TOOLS}
        for extra_tool in EXTRA_TOOLS:
            if extra_tool["slug"] in existing_slugs:
                continue
            extra_tool["image"] = extra_tool.get("image") or _logo(extra_tool["domain"])
            TOOLS.append(extra_tool)
            existing_slugs.add(extra_tool["slug"])

        for tool in TOOLS:
            tool["categoryScores"] = _compute_category_scores(tool)

        _cached_data["tools"] = TOOLS
        _cached_data["categories"] = CATEGORIES
        _cached_data["glossary"] = GLOSSARY
        _cached_data["faq"] = FAQ
        _cached_data["use_cases"] = USE_CASES
        _cached_data["personas"] = PERSONAS
        _cached_data["privacy_overrides"] = PRIVACY_OVERRIDES
        _cached_data["examples"] = EXAMPLES
        _cached_data["quiz"] = QUIZ
        _cached_data["quiz_level"] = quiz_level
        _cached_data["news"] = NEWS
        _cached_data["lessons"] = LESSONS
        _cached_data["templates"] = TEMPLATES
        _cached_data["resources"] = RESOURCES

    # 1) Load the canonical public/rich packs copied into backend/data.
    _load_ia_match_v4_files(base_path)

    # 2) Merge the full uploaded/imported packs. This is intentionally after
    # the built-in seed data and top-level canonical packs so the premium prompt
    # builder, knowledge-intelligence, verified-core and model JSONs are not just
    # present on disk: they actively enrich the cache served by the API.
    try:
        from imported_data import augment_cached_data

        _cached_data = augment_cached_data(_cached_data, base_path)
    except Exception as exc:
        # Keep the app bootable if an optional imported pack is malformed, but
        # make the problem visible in backend logs during validation.
        print(f"IA Match imported data enrichment skipped: {exc}")

    # 3) Apply the May 2026 source-backed static data refresh after every import
    # so seed tools and rich-pack tools share the same official-link/pricing/source
    # schema before decoration/fallback export.
    try:
        from static_data_updates import apply_static_data_updates

        _cached_data["tools"] = apply_static_data_updates(_cached_data.get("tools", []))
    except Exception as exc:
        print(f"IA Match May 2026 static data refresh skipped: {exc}")

    # 4) Decorate after every import/enrichment step. Previously this happened
    # before the rich JSON merge, so newly imported tools could stay invisible.
    _cached_data["decorated_tools"] = [_decorate_tool_extras(t) for t in _cached_data.get("tools", [])]


def get_cached_data(key: str) -> Any:
    return _cached_data.get(key)


def set_cached_data(key: str, value: Any):
    _cached_data[key] = value


def get_tools() -> List[Dict]:
    return get_cached_data("decorated_tools") or []


def get_categories() -> List[Dict]:
    return get_cached_data("categories") or []


def get_glossary() -> List[Dict]:
    return get_cached_data("glossary") or []


def get_faq() -> List[Dict]:
    return get_cached_data("faq") or []


def get_use_cases() -> List[Dict]:
    return get_cached_data("use_cases") or []


def get_personas() -> List[Dict]:
    return get_cached_data("personas") or []


def get_quiz() -> List[Dict]:
    return get_cached_data("quiz") or []


def get_news() -> List[Dict]:
    return get_cached_data("news") or []


def get_lessons() -> List[Dict]:
    return get_cached_data("lessons") or []


def get_templates() -> List[Dict]:
    return get_cached_data("templates") or []


def get_resources() -> List[Dict]:
    return get_cached_data("resources") or []


def get_quiz_level(score: int) -> Dict:
    fn = get_cached_data("quiz_level")
    return fn(score) if callable(fn) else {}
