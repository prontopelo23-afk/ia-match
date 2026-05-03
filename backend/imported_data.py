"""Adapters for IA Match premium JSON packs.

The files in backend/data/imported come from IA Match data-room / academy / prompt-builder
exports. This module converts them to the simple shapes already consumed by the app.
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path
from typing import Any, Dict, Iterable, List

COLOR_BY_PROVIDER = {
    "OpenAI": "#10A37F",
    "Anthropic": "#CC785C",
    "Google": "#4285F4",
    "Mistral AI": "#FA520F",
    "Mistral": "#FA520F",
    "Meta": "#0866FF",
    "Perplexity": "#1FB8CD",
    "xAI": "#111111",
    "DeepSeek": "#2563EB",
    "Alibaba": "#FF6A00",
    "Microsoft": "#7FBA00",
    "Runway": "#111827",
    "Midjourney": "#111827",
}

DOMAIN_BY_PROVIDER = {
    "OpenAI": "openai.com",
    "Anthropic": "anthropic.com",
    "Google": "google.com",
    "Mistral AI": "mistral.ai",
    "Mistral": "mistral.ai",
    "Meta": "meta.com",
    "Perplexity": "perplexity.ai",
    "xAI": "x.ai",
    "DeepSeek": "deepseek.com",
    "Alibaba": "alibaba.com",
    "Microsoft": "microsoft.com",
    "Runway": "runwayml.com",
    "Midjourney": "midjourney.com",
}

CATEGORY_MAP = {
    "conversation": "texte",
    "writing": "texte",
    "text": "texte",
    "general_models": "texte",
    "conversation_assistant": "texte",
    "image": "image",
    "image_generation": "image",
    "design": "image",
    "video": "video",
    "video_generation": "video",
    "audio": "audio",
    "audio_voice": "audio",
    "voice": "audio",
    "music": "audio",
    "coding": "code",
    "coding_dev": "code",
    "code": "code",
    "developer": "code",
    "research": "recherche",
    "research_search": "recherche",
    "search": "recherche",
    "documents": "productivite",
    "documents_pdf_office": "productivite",
    "productivity": "productivite",
    "business": "productivite",
    "agents": "agent",
    "agent": "agent",
    "app_builders": "agent",
    "data": "data",
}


def _load(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _slugify(text: str) -> str:
    text = unicodedata.normalize("NFD", text or "")
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text.lower()).strip("-")
    return text or "item"


def _logo(domain: str) -> str:
    return f"https://logo.clearbit.com/{domain}" if domain else "https://logo.clearbit.com/openai.com"


def _normalise_categories(raw: Iterable[str]) -> List[str]:
    cats: List[str] = []
    for c in raw or []:
        key = str(c).strip().lower()
        mapped = CATEGORY_MAP.get(key)
        if mapped and mapped not in cats:
            cats.append(mapped)
    return cats or ["texte"]


def _entity_to_tool(entity: Dict[str, Any]) -> Dict[str, Any]:
    provider = entity.get("provider") or "IA"
    domain = entity.get("official_url", "")
    if domain.startswith("http"):
        domain = re.sub(r"^https?://(www\.)?", "", domain).split("/")[0]
    else:
        domain = DOMAIN_BY_PROVIDER.get(provider, f"{_slugify(provider)}.com")
    score = int(entity.get("ia_match_score") or entity.get("ia_match_score_seed") or 80)
    cats = _normalise_categories(entity.get("categories") or [entity.get("category", "texte")])
    best_for = entity.get("best_for") or entity.get("use_cases") or []
    pros = entity.get("pros") or entity.get("strengths") or []
    cons = entity.get("cons") or entity.get("weaknesses") or []
    modalities = entity.get("modalities") or []
    name = entity.get("name") or entity.get("id") or "IA"
    slug = _slugify(entity.get("id") or name)
    category_scores = {cat: max(50, min(99, score - i * 6)) for i, cat in enumerate(cats)}
    return {
        "slug": slug,
        "name": name,
        "vendor": provider,
        "domain": domain,
        "tagline": entity.get("tagline") or (best_for[0] if best_for else f"{name} dans IA Match"),
        "description": entity.get("description") or "; ".join(best_for + pros) or f"Fiche IA Match pour {name}.",
        "categorySlugs": cats,
        "speedMs": max(90, 480 - score * 3),
        "accuracyPct": max(55, min(99, score)),
        "costPerPrompt": 0.002,
        "monthlyPrice": 20.0 if score >= 88 else 0.0,
        "freeTier": True,
        "languages": entity.get("languages") or ["fr", "en"],
        "features": (entity.get("features") or modalities or pros or best_for)[:8],
        "useCases": best_for[:8] or pros[:4] or ["Choisir une IA adaptée"],
        "keywords": [*map(str, entity.get("keywords") or []), name, provider, *cats, *map(str, best_for[:5])],
        "score": score,
        "categoryScores": category_scores,
        "color": COLOR_BY_PROVIDER.get(provider, "#FA520F"),
        "image": _logo(domain),
        "lastUpdated": entity.get("last_verified_at") or entity.get("generated_at"),
        "sourceIds": entity.get("source_ids", []),
        "confidence": entity.get("confidence"),
        "limitations": cons,
    }


def _academy_course_to_lesson(course: Dict[str, Any], order: int) -> Dict[str, Any]:
    chapters = course.get("chapters") or []
    steps: List[str] = []
    body_parts: List[str] = []
    for ch in chapters:
        title = ch.get("title") or f"Étape {ch.get('order', len(steps) + 1)}"
        lesson = ch.get("simple_lesson") or ch.get("content") or ""
        action = ch.get("action_to_try")
        if lesson:
            body_parts.append(f"{title} — {lesson}")
        if action:
            steps.append(action)
        elif title:
            steps.append(title)
    objectives = course.get("learning_objectives") or course.get("learning_goals") or []
    if not steps:
        steps = objectives[:5] or ["Lire la leçon", "Tester dans le Prompt Builder", "Vérifier le résultat"]
    mistakes = course.get("common_mistakes") or []
    before = mistakes[0].get("simple_explanation") if mistakes else "Demande vague, peu de contexte, résultat difficile à utiliser."
    after = (course.get("plain_language_summary") or (objectives[0] if objectives else course.get("title", "")))
    return {
        "id": course.get("id") or f"premium_course_{order}",
        "order": order,
        "level": str(course.get("level") or "DÉBUTANT").upper().replace("DEBUTANT", "DÉBUTANT"),
        "minutes": int(course.get("estimated_duration_minutes") or course.get("duration_minutes") or 10),
        "title": course.get("title") or f"Cours {order}",
        "intro": course.get("plain_language_summary") or (objectives[0] if objectives else "Cours IA Match Academy."),
        "body": "\n\n".join(body_parts) or course.get("plain_language_summary") or "Leçon pratique IA Match.",
        "framework": "OBJECTIF · CONTEXTE · CONTRAINTES · FORMAT · VÉRIFICATION",
        "steps": steps[:6],
        "before": before,
        "after": after,
        "premium": course.get("access") == "premium" or course.get("premium", False),
        "pathId": course.get("path_id"),
        "recommendedTemplateIds": course.get("recommended_template_ids", []),
    }


def _template_to_app_template(tpl: Dict[str, Any]) -> Dict[str, Any]:
    variables = tpl.get("variables") or []
    if variables and isinstance(variables[0], dict):
        variables = [str(v.get("key") or v.get("label") or "variable") for v in variables]
    return {
        "id": tpl.get("id") or _slugify(tpl.get("title", "template")),
        "level": str(tpl.get("level") or tpl.get("premium_level") or "BEGINNER").upper().replace("DEBUTANT", "DÉBUTANT"),
        "title": tpl.get("title") or "Template IA Match",
        "body": tpl.get("template") or tpl.get("prompt") or "",
        "variables": variables,
        "category": tpl.get("category") or tpl.get("category_id"),
        "targetModel": tpl.get("target_model") or tpl.get("target_model_id"),
        "premium": tpl.get("premium") or tpl.get("premium_level") == "premium",
        "qualityChecks": tpl.get("quality_checks", []),
    }


def _dedupe_by_id(items: Iterable[Dict[str, Any]], key: str) -> List[Dict[str, Any]]:
    seen = set()
    out: List[Dict[str, Any]] = []
    for item in items:
        ident = item.get(key)
        if not ident or ident in seen:
            continue
        seen.add(ident)
        out.append(item)
    return out


def augment_cached_data(cache: Dict[str, Any], base_path: Path) -> Dict[str, Any]:
    """Merge premium JSON packs into the existing in-memory cache."""
    imported = base_path / "data" / "imported"
    verified = _load(imported / "ia_match_verified_core.json")
    academy = _load(imported / "ia_match_academy_premium.json")
    prompt_pack = _load(imported / "ia_match_prompt_builder_premium.json")
    knowledge = _load(imported / "ia_match_knowledge_intelligence.json")
    models = _load(imported / "ia_match_ai_models_full.json")

    core = verified.get("core") or {}
    content = verified.get("content") or {}

    # Tools / models: keep hand-curated existing tools first, then add verified/model-pack entities.
    existing_slugs = {t.get("slug") for t in cache.get("tools", [])}
    extra_tools: List[Dict[str, Any]] = []
    entities: List[Dict[str, Any]] = []
    entities.extend(core.get("entities") or [])
    entities.extend(models.get("import_ready_records") or [])
    for entity in entities:
        tool = _entity_to_tool(entity)
        if tool["slug"] not in existing_slugs:
            extra_tools.append(tool)
            existing_slugs.add(tool["slug"])
    cache["tools"] = list(cache.get("tools", [])) + extra_tools

    # Academy: premium 80-course pack first, then verified 40-course pack, then old editorial lessons.
    premium_courses = [_academy_course_to_lesson(c, i + 1) for i, c in enumerate(academy.get("academy_courses") or [])]
    verified_courses = [_academy_course_to_lesson(c, len(premium_courses) + i + 1) for i, c in enumerate(content.get("academy_courses") or [])]
    cache["lessons"] = _dedupe_by_id(premium_courses + verified_courses + list(cache.get("lessons", [])), "id")

    # Templates: prompt-builder premium pack + verified content + legacy templates.
    templates = [_template_to_app_template(t) for t in (prompt_pack.get("prompt_templates") or [])]
    templates += [_template_to_app_template(t) for t in (content.get("prompt_templates") or [])]
    templates += list(cache.get("templates", []))
    cache["templates"] = _dedupe_by_id(templates, "id")

    # Resources from verified pack are already in the app shape.
    resources = list(content.get("resources") or []) + list(cache.get("resources", []))
    cache["resources"] = _dedupe_by_id(resources, "id")

    # Simple knowledge/config collections for API use.
    cache["academy_paths"] = academy.get("learning_paths", [])
    cache["academy_badges"] = academy.get("academy_badges", [])
    cache["academy_quizzes_premium"] = academy.get("academy_quizzes", [])
    cache["academy_exercises"] = academy.get("academy_exercises", [])
    cache["academy_bad_to_good_examples"] = academy.get("bad_to_good_examples", [])
    cache["beginner_friendly_terms"] = academy.get("beginner_friendly_terms", [])
    cache["prompt_categories"] = prompt_pack.get("prompt_categories", [])
    cache["prompt_builder_presets"] = (prompt_pack.get("prompt_builder_presets") or []) + (content.get("prompt_builder_presets") or [])
    cache["prompt_quality_rules"] = prompt_pack.get("prompt_quality_rules", [])
    cache["prompt_builder_config"] = prompt_pack.get("prompt_builder_config", {})
    cache["intent_router"] = prompt_pack.get("intent_router", [])
    cache["model_prompt_guides"] = prompt_pack.get("model_prompt_guides", [])
    cache["prompt_bad_to_good_examples"] = prompt_pack.get("bad_to_good_examples", [])
    cache["prompt_safety_usage_notes"] = prompt_pack.get("safety_usage_notes", [])
    cache["knowledge_intelligence"] = knowledge
    cache["model_rankings"] = {
        **models,
        "rankings": core.get("rankings", []),
        "benchmarks": core.get("benchmarks", []),
        "pricing": core.get("pricing", []),
        "comparisons": core.get("comparisons", []),
        "sources": core.get("sources", []) + (models.get("sources") or []),
        "models_general": models.get("models_general", []),
        "specialization_rankings": models.get("specialization_rankings", {}),
        "agents_general": models.get("agents_general", []),
        "agents_coding": models.get("agents_coding", []),
        "app_builders": models.get("app_builders", []),
        "recommendations": models.get("recommendations", {}),
        "import_ready_records": models.get("import_ready_records", []),
    }
    return cache
