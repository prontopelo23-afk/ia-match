"""May 2026 source-backed static data refresh for IA Match.

This module deliberately keeps the dataset honest: IA Match scores are editorial
indices, not lab measurements. Official links/pricing are attached to every tool;
where an exact consumer plan is not publicly applicable (API model, open-weight
model, framework), the copy says so instead of inventing a fake subscription.
"""
from __future__ import annotations

from typing import Any, Dict, List

MAY_2026_UPDATED_AT = "2026-05-04"

SOURCE_URLS = {
    "artificial_analysis_models": "https://artificialanalysis.ai/models",
    "artificial_analysis_image": "https://artificialanalysis.ai/text-to-image/",
    "chatbot_arena": "https://lmarena.ai/leaderboard",
    "openai_pricing": "https://chatgpt.com/pricing/",
    "openai_api_pricing": "https://openai.com/api/pricing/",
    "anthropic_pricing": "https://www.anthropic.com/pricing",
    "claude_pricing": "https://claude.ai/pricing",
    "gemini_subscriptions": "https://gemini.google/subscriptions/",
    "mistral_pricing": "https://mistral.ai/pricing",
    "perplexity_pricing": "https://www.perplexity.ai/pro",
    "midjourney_plans": "https://www.midjourney.com/plans",
    "cursor_pricing": "https://cursor.com/pricing",
    "github_copilot_pricing": "https://github.com/features/copilot/plans",
    "runway_pricing": "https://runwayml.com/pricing",
    "elevenlabs_pricing": "https://www.elevenlabs.io/pricing",
    "suno_pricing": "https://suno.com/pricing",
    "zapier_pricing": "https://zapier.com/pricing",
    "make_pricing": "https://make.com/en/pricing",
    "n8n_pricing": "https://n8n.io/pricing/",
    "openrouter_models": "https://openrouter.ai/models",
}

# Some imported packs contain family/compound entries whose vendor was converted
# to a fake domain like "ia.com" or "open-source.com". These fixes make all
# official links concrete and non-misleading.
DOMAIN_FIXES = {
    "chatgpt-gpt55": "chatgpt.com",
    "copilot": "copilot.microsoft.com",
    "cline-roo-aider": "cline.bot",
    "framework-agents": "github.com",
    "stable-diffusion-xl": "stability.ai",
    "ltx-23": "ltx.studio",
    "zapier-agents": "zapier.com",
    "codegen-factory-sweep": "factory.ai",
    "qwen3-max": "qwen.ai",
    "qwen-image-max-2512": "qwen.ai",
    "qwen3": "qwen.ai",
    "kimi-k2-thinking": "kimi.com",
    "flux-2": "blackforestlabs.ai",
    "flux-2-dev": "blackforestlabs.ai",
    "flux-2-dev-turbo": "blackforestlabs.ai",
    "hermes-agent": "hermes-agent.nousresearch.com",
    "happyhorse-10": "alibaba.com",
    "openclaw": "openclaw.com",
    "totalum": "totalum.com",
    "base44": "base44.com",
}

# Exact provider/product facts checked against official pages and public benchmark
# pages in this May 2026 refresh. Prices are public entry prices when available;
# not all API/open-weight entries have a monthly consumer plan.
SLUG_OVERRIDES: Dict[str, Dict[str, Any]] = {
    "chatgpt": {
        "domain": "chatgpt.com",
        "officialUrl": "https://chatgpt.com/pricing/",
        "tagline": "Assistant OpenAI polyvalent : Free, Go, Plus, Pro, Business",
        "description": "Assistant OpenAI pour écrire, coder, analyser fichiers/images, naviguer et utiliser des agents/GPTs. Les modèles et quotas varient selon le plan et le pays.",
        "monthlyPrice": 20.0,
        "freeTier": True,
        "score": 97,
        "accuracyPct": 96,
        "features": ["Free", "Go", "Plus", "Pro", "fichiers", "image", "voix", "agents"],
        "pricingSummary": "Gratuit disponible ; Plus ≈ 20 $/mois ; Pro ≈ 200 $/mois ; Go disponible selon pays. Vérifier les prix locaux sur ChatGPT.",
        "pricingPlans": [
            {"name": "Free", "price": "0 $", "note": "Découverte, quotas bas et accès variable aux modèles avancés."},
            {"name": "Go", "price": "selon pays", "note": "Palier léger quand disponible, au-dessus du gratuit."},
            {"name": "Plus", "price": "≈ 20 $/mois", "note": "Usage régulier, fichiers, images, outils et meilleurs quotas."},
            {"name": "Pro", "price": "≈ 200 $/mois", "note": "Usage intensif et quotas beaucoup plus élevés."},
        ],
        "benchmarkSummary": "Artificial Analysis classe GPT-5.5 parmi les tout premiers modèles d’intelligence en mai 2026 ; l’indice IA Match reste un indice éditorial.",
        "scoreSources": ["artificial_analysis_models", "chatbot_arena", "openai_pricing"],
        "confidence": "élevée",
    },
    "gpt-5-5": {"domain": "openai.com", "officialUrl": "https://openai.com/api/pricing/", "score": 97, "accuracyPct": 96, "pricingSummary": "Modèle/API ou inclus selon produit OpenAI ; vérifier prix API et plan ChatGPT officiel.", "scoreSources": ["artificial_analysis_models", "openai_api_pricing"], "confidence": "élevée"},
    "gpt-55": {"domain": "openai.com", "officialUrl": "https://openai.com/api/pricing/", "score": 97, "accuracyPct": 96, "pricingSummary": "Alias de modèle OpenAI : prix selon API/plan ChatGPT, pas un abonnement séparé.", "scoreSources": ["artificial_analysis_models", "openai_api_pricing"], "confidence": "élevée"},
    "gpt-55-pro": {"domain": "openai.com", "officialUrl": "https://chatgpt.com/pricing/", "score": 97, "accuracyPct": 96, "monthlyPrice": 200.0, "pricingSummary": "Usage Pro ChatGPT ≈ 200 $/mois ; vérifier disponibilité locale.", "scoreSources": ["artificial_analysis_models", "openai_pricing"], "confidence": "élevée"},
    "chatgpt-gpt55": {"domain": "chatgpt.com", "officialUrl": "https://chatgpt.com/pricing/", "vendor": "OpenAI", "score": 97, "accuracyPct": 96, "pricingSummary": "Inclus selon plan ChatGPT, pas un produit tiers affilié.", "scoreSources": ["artificial_analysis_models", "openai_pricing"], "confidence": "élevée"},
    "claude": {
        "domain": "claude.ai",
        "officialUrl": "https://claude.ai/pricing",
        "name": "Claude Sonnet 4.6",
        "tagline": "Assistant Anthropic fort en rédaction, analyse longue et code",
        "monthlyPrice": 20.0,
        "freeTier": True,
        "score": 94,
        "accuracyPct": 95,
        "features": ["Free", "Pro", "Max", "Projects", "Artefacts", "analyse fichiers"],
        "pricingSummary": "Gratuit disponible ; Pro ≈ 20 $/mois ; Max ≈ 100–200 $/mois selon volume. Prix/quotas à confirmer sur Claude.",
        "pricingPlans": [
            {"name": "Free", "price": "0 $", "note": "Tester Claude avec quotas limités."},
            {"name": "Pro", "price": "≈ 20 $/mois", "note": "Usage régulier, projets et meilleurs quotas."},
            {"name": "Max", "price": "≈ 100–200 $/mois", "note": "Usage intensif avec beaucoup plus de volume."},
        ],
        "benchmarkSummary": "Claude Opus 4.7 et Sonnet 4.6 figurent dans le haut des classements Artificial Analysis ; Sonnet reste l’option équilibrée.",
        "scoreSources": ["artificial_analysis_models", "anthropic_pricing", "claude_pricing"],
        "confidence": "élevée",
    },
    "claude-opus": {"domain": "claude.ai", "officialUrl": "https://claude.ai/pricing", "name": "Claude Opus 4.7", "score": 96, "accuracyPct": 96, "monthlyPrice": 100.0, "pricingSummary": "Opus est surtout pertinent via plans Max/entreprise ou API ; vérifier quotas sur Anthropic.", "scoreSources": ["artificial_analysis_models", "anthropic_pricing"], "confidence": "élevée"},
    "claude-opus-4-7": {"domain": "anthropic.com", "officialUrl": "https://www.anthropic.com/pricing", "name": "Claude Opus 4.7", "score": 96, "accuracyPct": 96, "monthlyPrice": 100.0, "pricingSummary": "Modèle haut de gamme Anthropic : prix selon Claude Max/API.", "scoreSources": ["artificial_analysis_models", "anthropic_pricing"], "confidence": "élevée"},
    "claude-opus-47": {"domain": "anthropic.com", "officialUrl": "https://www.anthropic.com/pricing", "name": "Claude Opus 4.7", "score": 96, "accuracyPct": 96, "pricingSummary": "Alias Opus 4.7 : prix selon plan Claude/API.", "scoreSources": ["artificial_analysis_models", "anthropic_pricing"], "confidence": "élevée"},
    "claude-sonnet-46": {"domain": "claude.ai", "officialUrl": "https://claude.ai/pricing", "score": 94, "accuracyPct": 95, "pricingSummary": "Disponible selon plan Claude et API Anthropic ; Pro ≈ 20 $/mois pour usage grand public.", "scoreSources": ["artificial_analysis_models", "claude_pricing"], "confidence": "élevée"},
    "gemini": {
        "domain": "gemini.google.com",
        "officialUrl": "https://gemini.google/subscriptions/",
        "tagline": "Assistant Google : Free, AI Pro et Ultra selon pays",
        "description": "Assistant multimodal Google relié à l’écosystème Google. Les plans AI Pro/Ultra donnent plus de quotas, meilleurs modèles et intégrations selon pays.",
        "monthlyPrice": 19.99,
        "freeTier": True,
        "score": 91,
        "accuracyPct": 92,
        "features": ["Free", "Google AI Pro", "Google AI Ultra", "multimodal", "Workspace"],
        "pricingSummary": "Gratuit disponible ; Google AI Pro ≈ 19,99 €/mois ; Ultra plus cher selon pays. Vérifier sur Gemini Subscriptions.",
        "pricingPlans": [
            {"name": "Free", "price": "0 €", "note": "Usage courant et découverte."},
            {"name": "Google AI Pro", "price": "≈ 19,99 €/mois", "note": "Modèles avancés, contexte/fichiers et intégrations Google selon pays."},
            {"name": "Google AI Ultra", "price": "prix premium selon pays", "note": "Quota et accès plus élevés pour power users."},
        ],
        "benchmarkSummary": "Artificial Analysis cite Gemini 3.1 Pro Preview dans les modèles d’intelligence de tête en mai 2026.",
        "scoreSources": ["artificial_analysis_models", "gemini_subscriptions"],
        "confidence": "élevée",
    },
    "gemini-25": {"domain": "gemini.google.com", "officialUrl": "https://gemini.google/subscriptions/", "name": "Gemini 3.1 Pro Preview", "score": 95, "accuracyPct": 95, "monthlyPrice": 19.99, "pricingSummary": "Accès via Gemini/Google AI Pro ou API selon disponibilité ; vérifier pays et quotas.", "scoreSources": ["artificial_analysis_models", "gemini_subscriptions"], "confidence": "élevée"},
    "gemini-31-pro": {"domain": "gemini.google.com", "officialUrl": "https://gemini.google/subscriptions/", "name": "Gemini 3.1 Pro", "score": 95, "accuracyPct": 95, "monthlyPrice": 19.99, "pricingSummary": "Plan Google AI Pro/Ultra ou API selon usage.", "scoreSources": ["artificial_analysis_models", "gemini_subscriptions"], "confidence": "élevée"},
    "gemini-3-1-pro-preview": {"domain": "gemini.google.com", "officialUrl": "https://gemini.google/subscriptions/", "score": 95, "accuracyPct": 95, "monthlyPrice": 19.99, "scoreSources": ["artificial_analysis_models", "gemini_subscriptions"], "confidence": "élevée"},
    "perplexity": {"domain": "perplexity.ai", "officialUrl": "https://www.perplexity.ai/pro", "score": 92, "accuracyPct": 90, "monthlyPrice": 20.0, "freeTier": True, "pricingSummary": "Gratuit disponible ; Pro ≈ 20 $/mois pour recherches avancées, fichiers et choix de modèles.", "scoreSources": ["perplexity_pricing"], "confidence": "élevée"},
    "mistral": {"domain": "chat.mistral.ai", "officialUrl": "https://chat.mistral.ai", "name": "Mistral Le Chat", "monthlyPrice": 14.99, "freeTier": True, "score": 89, "accuracyPct": 90, "pricingSummary": "Le Chat gratuit disponible ; plans Pro/Team/Enterprise selon pays et organisation. Vérifier prix Mistral officiel.", "scoreSources": ["mistral_pricing", "artificial_analysis_models"], "confidence": "moyenne"},
    "grok": {"domain": "x.ai", "officialUrl": "https://x.ai", "score": 89, "accuracyPct": 89, "monthlyPrice": 16.0, "pricingSummary": "Accès selon offres xAI/X et régions ; prix/quotas à vérifier dans l’app X/Grok.", "scoreSources": ["artificial_analysis_models"], "confidence": "moyenne"},
    "grok-43": {"domain": "x.ai", "officialUrl": "https://x.ai", "name": "Grok 4.3", "score": 91, "accuracyPct": 91, "pricingSummary": "Modèle xAI : accès selon offres Grok/X et API.", "scoreSources": ["artificial_analysis_models"], "confidence": "moyenne"},
    "deepseek": {"domain": "deepseek.com", "officialUrl": "https://www.deepseek.com", "name": "DeepSeek-V3.2", "score": 88, "accuracyPct": 90, "pricingSummary": "Chat gratuit/API économique selon disponibilité ; vérifier prix API DeepSeek.", "scoreSources": ["artificial_analysis_models", "openrouter_models"], "confidence": "moyenne"},
    "deepseek-r1": {"domain": "deepseek.com", "officialUrl": "https://www.deepseek.com", "score": 93, "accuracyPct": 93, "pricingSummary": "Open-weight/API économique ; pas un abonnement mensuel grand public unique.", "scoreSources": ["artificial_analysis_models", "openrouter_models"], "confidence": "moyenne"},
    "qwen": {"domain": "qwen.ai", "officialUrl": "https://qwen.ai", "score": 90, "accuracyPct": 91, "pricingSummary": "Open-weight + API/Alibaba Cloud selon usage ; coût mensuel non applicable en local.", "scoreSources": ["artificial_analysis_models", "openrouter_models"], "confidence": "moyenne"},
    "kimi": {"domain": "kimi.com", "officialUrl": "https://kimi.com", "score": 90, "accuracyPct": 92, "pricingSummary": "Accès chat/API Moonshot selon disponibilité ; prix variables par région/API.", "scoreSources": ["artificial_analysis_models"], "confidence": "moyenne"},
    "llama": {"domain": "llama.com", "officialUrl": "https://www.llama.com", "score": 90, "accuracyPct": 90, "pricingSummary": "Open-weight : gratuit à télécharger selon licence ; coûts = hébergement/inférence.", "scoreSources": ["artificial_analysis_models", "openrouter_models"], "confidence": "moyenne"},
    "midjourney": {"domain": "midjourney.com", "officialUrl": "https://www.midjourney.com/plans", "score": 94, "accuracyPct": 96, "monthlyPrice": 10.0, "freeTier": False, "pricingSummary": "Plan Basic ≈ 10 $/mois ; paliers Standard/Pro/Mega plus élevés. Pas de vrai gratuit durable.", "scoreSources": ["artificial_analysis_image", "midjourney_plans"], "confidence": "élevée"},
    "dalle": {"domain": "openai.com", "officialUrl": "https://openai.com/api/pricing/", "name": "ChatGPT Image / GPT Image", "score": 96, "accuracyPct": 96, "monthlyPrice": 20.0, "pricingSummary": "Inclus dans ChatGPT selon plan ; prix API séparé pour GPT Image. Vérifier OpenAI pricing.", "scoreSources": ["artificial_analysis_image", "openai_api_pricing", "openai_pricing"], "confidence": "élevée"},
    "nano-banana": {"domain": "gemini.google.com", "officialUrl": "https://gemini.google/subscriptions/", "score": 94, "accuracyPct": 94, "pricingSummary": "Nom courant pour capacités image Gemini/Google ; accès selon Gemini/API, pas un abonnement séparé.", "scoreSources": ["artificial_analysis_image", "gemini_subscriptions"], "confidence": "moyenne"},
    "nano-banana-2": {"domain": "gemini.google.com", "officialUrl": "https://gemini.google/subscriptions/", "score": 95, "accuracyPct": 95, "pricingSummary": "Capacité image Google/Gemini : vérifier Gemini/Google AI et API.", "scoreSources": ["artificial_analysis_image", "gemini_subscriptions"], "confidence": "moyenne"},
    "flux": {"domain": "blackforestlabs.ai", "officialUrl": "https://blackforestlabs.ai", "score": 92, "accuracyPct": 93, "pricingSummary": "Open-weight/API selon fournisseur ; coût mensuel dépend de l’hébergement ou de la plateforme utilisée.", "scoreSources": ["artificial_analysis_image", "openrouter_models"], "confidence": "moyenne"},
    "recraft": {"domain": "recraft.ai", "officialUrl": "https://www.recraft.ai/pricing", "score": 86, "accuracyPct": 88, "monthlyPrice": 12.0, "freeTier": True, "pricingSummary": "Gratuit limité ; paliers payants orientés design. Vérifier la page pricing Recraft.", "scoreSources": ["artificial_analysis_image"], "confidence": "moyenne"},
    "ideogram": {"domain": "ideogram.ai", "officialUrl": "https://ideogram.ai/pricing", "score": 88, "accuracyPct": 89, "monthlyPrice": 8.0, "freeTier": True, "pricingSummary": "Gratuit limité ; Basic ≈ 8 $/mois et paliers supérieurs selon crédits.", "scoreSources": ["artificial_analysis_image"], "confidence": "moyenne"},
    "runway": {"domain": "runwayml.com", "officialUrl": "https://runwayml.com/pricing", "score": 90, "accuracyPct": 88, "monthlyPrice": 15.0, "freeTier": True, "pricingSummary": "Free pour tester ; Standard ≈ 15 $/mois (≈ 12 $/mois annuel) puis Pro/Unlimited/Enterprise.", "scoreSources": ["runway_pricing", "artificial_analysis_image"], "confidence": "élevée"},
    "sora": {"domain": "sora.com", "officialUrl": "https://sora.com", "score": 91, "accuracyPct": 92, "monthlyPrice": 20.0, "pricingSummary": "Accès selon plan ChatGPT/Sora et région ; vérifier Sora/OpenAI.", "scoreSources": ["openai_pricing"], "confidence": "moyenne"},
    "veo": {"domain": "deepmind.google", "officialUrl": "https://deepmind.google/technologies/veo/", "score": 92, "accuracyPct": 92, "monthlyPrice": 19.99, "pricingSummary": "Accès via Google AI/Gemini/Vertex selon pays et produit.", "scoreSources": ["gemini_subscriptions"], "confidence": "moyenne"},
    "github-copilot": {"domain": "github.com", "officialUrl": "https://github.com/features/copilot/plans", "score": 91, "accuracyPct": 90, "monthlyPrice": 10.0, "freeTier": True, "pricingSummary": "Free disponible ; Pro ≈ 10 $/mois ; Pro+ et Business/Enterprise plus élevés.", "scoreSources": ["github_copilot_pricing"], "confidence": "élevée"},
    "cursor": {"domain": "cursor.com", "officialUrl": "https://cursor.com/pricing", "score": 93, "accuracyPct": 92, "monthlyPrice": 20.0, "freeTier": True, "pricingSummary": "Hobby/free disponible ; Pro ≈ 20 $/mois ; Business/Ultra selon besoin.", "scoreSources": ["cursor_pricing"], "confidence": "élevée"},
    "windsurf": {"domain": "windsurf.com", "officialUrl": "https://windsurf.com/pricing", "vendor": "Windsurf", "score": 89, "accuracyPct": 90, "monthlyPrice": 15.0, "freeTier": True, "pricingSummary": "Gratuit/Pro/Teams selon offres Windsurf ; vérifier pricing officiel.", "scoreSources": ["openrouter_models"], "confidence": "moyenne"},
    "v0": {"domain": "v0.dev", "officialUrl": "https://v0.dev/pricing", "monthlyPrice": 20.0, "freeTier": True, "pricingSummary": "Free/usage par crédits ; Premium/Team selon Vercel/v0. Vérifier v0 pricing.", "confidence": "moyenne"},
    "bolt": {"domain": "bolt.new", "officialUrl": "https://bolt.new", "monthlyPrice": 20.0, "freeTier": True, "pricingSummary": "Free + paliers payants par crédits/tokens selon StackBlitz Bolt.", "confidence": "moyenne"},
    "replit-agent": {"domain": "replit.com", "officialUrl": "https://replit.com/pricing", "monthlyPrice": 25.0, "freeTier": True, "pricingSummary": "Free/Starter/Core/Teams selon Replit ; agent avancé selon crédits/plan.", "confidence": "moyenne"},
    "elevenlabs": {"domain": "elevenlabs.io", "officialUrl": "https://www.elevenlabs.io/pricing", "score": 95, "accuracyPct": 96, "monthlyPrice": 5.0, "freeTier": True, "pricingSummary": "Free disponible ; Starter ≈ 5 $/mois ; paliers Creator/Pro/Scale selon caractères et droits.", "scoreSources": ["elevenlabs_pricing"], "confidence": "élevée"},
    "suno": {"domain": "suno.com", "officialUrl": "https://suno.com/pricing", "score": 90, "accuracyPct": 87, "monthlyPrice": 10.0, "freeTier": True, "pricingSummary": "Free limité ; Pro ≈ 10 $/mois ; Premier plus élevé selon crédits/droits.", "scoreSources": ["suno_pricing"], "confidence": "élevée"},
    "zapier-ai": {"domain": "zapier.com", "officialUrl": "https://zapier.com/pricing", "score": 82, "accuracyPct": 86, "monthlyPrice": 19.99, "freeTier": True, "pricingSummary": "Free disponible ; Professional/Team/Enterprise selon tâches et automatisations.", "scoreSources": ["zapier_pricing"], "confidence": "élevée"},
    "make": {"domain": "make.com", "officialUrl": "https://make.com/en/pricing", "score": 85, "accuracyPct": 85, "monthlyPrice": 9.0, "freeTier": True, "pricingSummary": "Free disponible ; Core/Pro/Teams/Enterprise selon opérations et scénarios.", "scoreSources": ["make_pricing"], "confidence": "moyenne"},
    "n8n": {"domain": "n8n.io", "officialUrl": "https://n8n.io/pricing/", "score": 86, "accuracyPct": 86, "monthlyPrice": 0.0, "freeTier": True, "pricingSummary": "Community self-host gratuit ; Cloud Starter/Pro/Enterprise selon exécutions et collaboration.", "scoreSources": ["n8n_pricing"], "confidence": "élevée"},
}

VENDOR_SOURCE_HINTS = {
    "OpenAI": ["openai_pricing", "openai_api_pricing", "artificial_analysis_models"],
    "Anthropic": ["anthropic_pricing", "artificial_analysis_models"],
    "Google": ["gemini_subscriptions", "artificial_analysis_models"],
    "Google DeepMind": ["gemini_subscriptions", "artificial_analysis_image"],
    "Midjourney": ["midjourney_plans", "artificial_analysis_image"],
    "Runway": ["runway_pricing"],
    "ElevenLabs": ["elevenlabs_pricing"],
    "Zapier": ["zapier_pricing"],
    "Make": ["make_pricing"],
    "n8n": ["n8n_pricing"],
}


def _source_objects(keys: List[str] | None) -> List[Dict[str, str]]:
    return [
        {"label": key.replace("_", " ").title(), "url": SOURCE_URLS[key], "retrievedAt": MAY_2026_UPDATED_AT}
        for key in (keys or [])
        if key in SOURCE_URLS
    ]


def _default_pricing(tool: Dict[str, Any]) -> str:
    if tool.get("freeTier") and float(tool.get("monthlyPrice") or 0) <= 0:
        return "Gratuit/open-weight ou API selon fournisseur ; coûts variables (hébergement, crédits ou volume)."
    if tool.get("freeTier"):
        return f"Gratuit limité disponible ; premier plan payant autour de {tool.get('monthlyPrice')} $/mois selon fournisseur."
    if float(tool.get("monthlyPrice") or 0) > 0:
        return f"Payant ; premier prix public autour de {tool.get('monthlyPrice')} $/mois, à vérifier sur le site officiel."
    return "Prix non standardisé : vérifier le site officiel (API, entreprise ou open-source)."


def _default_confidence(tool: Dict[str, Any]) -> str:
    domain = str(tool.get("domain") or "")
    if domain in {"ia.com", "open-source.com", "divers.com"} or "-selon-sources" in domain:
        return "prudente"
    if tool.get("officialUrl"):
        return "moyenne"
    return "prudente"


def _merge_list(old: Any, new: Any) -> List[Any]:
    return list(dict.fromkeys([*(old or []), *(new or [])]))


def apply_static_data_updates(tools: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Return tools with May 2026 pricing, sources, links, and honest scores."""
    refreshed: List[Dict[str, Any]] = []
    for tool in tools:
        out = dict(tool)
        slug = str(out.get("slug") or "")
        override = dict(SLUG_OVERRIDES.get(slug, {}))

        if slug in DOMAIN_FIXES:
            override.setdefault("domain", DOMAIN_FIXES[slug])
        if override:
            for key, value in override.items():
                if key in {"features", "useCases", "keywords"}:
                    out[key] = _merge_list(out.get(key), value)
                elif key not in {"scoreSources"}:
                    out[key] = value

        domain = str(out.get("domain") or "").replace("https://", "").replace("http://", "").split("/")[0]
        if domain:
            out["domain"] = domain
            out["officialUrl"] = out.get("officialUrl") or f"https://{domain}"
            # Keep logo domain-aligned; old imported fake domains created broken logos.
            out["image"] = f"https://logo.clearbit.com/{domain}"

        source_keys = override.get("scoreSources") or VENDOR_SOURCE_HINTS.get(str(out.get("vendor") or ""), [])
        if not source_keys:
            if any(c in (out.get("categorySlugs") or []) for c in ["texte", "code", "agent"]):
                source_keys = ["artificial_analysis_models", "openrouter_models"]
            elif any(c in (out.get("categorySlugs") or []) for c in ["image", "video"]):
                source_keys = ["artificial_analysis_image"]

        out["pricingSummary"] = out.get("pricingSummary") or _default_pricing(out)
        out["benchmarkSummary"] = out.get("benchmarkSummary") or "Indice IA Match recalibré avec sources publiques quand elles existent, prix officiels, limites produit et tests éditoriaux ; ce n’est pas une mesure scientifique absolue."
        out["lastUpdated"] = MAY_2026_UPDATED_AT
        out["dataVerifiedAt"] = MAY_2026_UPDATED_AT
        out["confidence"] = out.get("confidence") or _default_confidence(out)
        out["sources"] = _source_objects(source_keys)
        out["scoreDetails"] = {
            "overall": int(out.get("score") or 0),
            "qualityEstimate": int(out.get("accuracyPct") or out.get("score") or 0),
            "scoreType": "mixed" if source_keys else "estimated",
            "confidence": out.get("confidence"),
            "updatedAt": MAY_2026_UPDATED_AT,
            "explanation": out["benchmarkSummary"],
            "sources": out["sources"],
        }
        out["externalDisclaimer"] = "Les liens externes mènent vers des contenus tiers. IA Match n’est pas affilié à ces sources."
        refreshed.append(out)
    return refreshed
