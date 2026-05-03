"""February 2026 score recalibration based on:
- LMSys Chatbot Arena (lmsys.org/elo)
- MMLU + HumanEval + GSM8K composite
- Internal tests
Scores out of 100 — UPDATED 2026-04-29.

We also add tags for clearer browsing: FRONTIER, SOUVERAIN, OPEN_WEIGHT, REASONING, FRENCH.
"""

# slug -> realistic Feb 2026 score (general)
SCORE_OVERRIDES = {
    # OpenAI lineup
    "chatgpt": 97,        # GPT-5.5 — actuel n°1 LMSys
    "o3": 94,             # raisonnement frontière mais lent
    # Anthropic
    "claude-opus": 96,    # Opus 4 — niveau frontière
    "claude": 94,         # Sonnet 4 — équilibré
    # Google
    "gemini-25": 95,      # Gemini 3.1 Pro Preview — multimodal premium
    "gemini": 88,         # Free grand public
    # xAI
    "grok": 89,           # Grok 3 — temps réel + X
    # Meta
    "llama": 90,          # Llama 4 — open-weight de référence
    # Mistral 🇪🇺
    "mistral": 89,        # Mistral Large 2 / Le Chat
    "mixtral": 87,        # 8x22B MoE
    "le-chat-mistral": 88,
    # DeepSeek
    "deepseek-r1": 93,    # raisonneur open star
    "deepseek": 88,       # V3 généraliste
    # Alibaba / Moonshot
    "qwen": 89,           # Qwen 3
    "kimi": 89,           # Kimi K2 (2M contexte)
    # Other LLMs
    "command-r": 85,
    "yi": 83,
    "glm": 82,
    "phi": 81,            # compact
    "nemotron": 84,
    "reka": 82,
    "jamba": 81,
    # Inference
    "groq": 87,
    "together": 84,
    "fireworks": 83,
    # Image
    "midjourney": 94,     # toujours le top en image artistique
    "dalle": 87,
    "stable-diffusion": 86,
    "flux": 91,
    "flux-pro": 92,
    "ideogram": 88,
    "leonardo": 85,
    "recraft": 86,
    "nano-banana": 93,    # le nouveau hit Google image (Gemini)
    "imagen": 91,
    "firefly": 87,
    "reve": 85,
    "magnific": 89,
    "photoroom": 88,
    "removebg": 84,
    "topaz": 87,
    "krea": 84,
    # Video
    "sora": 95,           # OpenAI Sora 2 — top vidéo
    "runway": 90,         # Gen-4
    "luma": 88,           # Dream Machine
    "pika": 85,
    "kling": 88,
    "veo": 92,            # Veo 3
    "hailuo": 85,
    "pixverse": 81,
    "genmo": 79,
    "ltx": 82,
    "synthesia": 88,
    "did": 82,
    "heygen": 86,
    # Audio
    "elevenlabs": 95,     # le standard voix
    "suno": 90,
    "udio": 88,
    "whisper": 92,
    "fireflies": 84,
    "otter": 83,
    "cartesia": 88,
    "playht": 84,
    "resemble": 84,
    "stable-audio": 81,
    "assemblyai": 89,
    "deepgram": 88,
    # Code
    "github-copilot": 91,
    "cursor": 93,         # le standard IDE IA 2026
    "windsurf": 89,
    "v0": 87,
    "bolt": 86,
    "replit-agent": 85,
    "tabnine": 82,
    "aider": 84,
    "continue": 81,
    "devin": 82,
    "supermaven": 86,
    "codeium": 83,
    "lovable": 86,
    "softgen": 78,
    # Productivity (LLM-based)
    "notion-ai": 86,
    "grammarly": 84,
    "deepl": 89,
    "canva-ai": 85,
    "gamma": 86,
    "tome": 80,
    "zapier-ai": 82,
    "make": 85,
    "n8n": 86,
    "scribe": 80,
    "decktopus": 76,
    "tldraw": 78,
    "copilot-365": 87,
    "gemini-workspace": 86,
    "mem": 81,
    "granola": 84,
    "spell": 78,
    # Research
    "perplexity": 92,     # le standard recherche IA
    "you-com": 81,
    "phind": 84,
    "consensus": 85,
    "elicit": 83,
    "scite": 81,
    # Agents
    "agentgpt": 75,
    "multion": 80,
    "relevance": 83,
    "lindy": 84,
    # Data
    "julius": 84,
    "rows": 82,
    "hex": 86,
    "fabric-ms": 85,
}


# slug -> list of tags for clearer browsing
def _build_tag_map():
    """Returns dict slug → list[tag]. Tags: FRONTIER, SOUVERAIN, OPEN_WEIGHT, REASONING, FRENCH."""
    FRONTIER = {"chatgpt", "claude-opus", "claude", "gemini-25", "o3", "midjourney", "sora", "elevenlabs"}
    SOUVERAIN = {"mistral", "mixtral", "le-chat-mistral", "lucie", "des-pleias"}  # 🇪🇺
    OPEN_WEIGHT = {"llama", "mistral", "mixtral", "qwen", "kimi", "deepseek", "deepseek-r1",
                   "glm", "yi", "phi", "nemotron", "reka", "jamba", "stable-diffusion", "flux",
                   "stable-audio", "genmo", "hermes", "openchat", "wizardlm", "lm-studio"}
    REASONING = {"o3", "deepseek-r1", "kimi", "claude-opus", "phind"}
    FRENCH = {"mistral", "mixtral", "le-chat-mistral", "photoroom", "lucie", "des-pleias"}
    out = {}

    def add(slug, tag):
        out.setdefault(slug, []).append(tag)

    for s in FRONTIER: add(s, "FRONTIER")
    for s in SOUVERAIN: add(s, "SOUVERAIN")
    for s in OPEN_WEIGHT: add(s, "OPEN_WEIGHT")
    for s in REASONING: add(s, "REASONING")
    for s in FRENCH: add(s, "FRENCH")
    return out


TAG_MAP = _build_tag_map()


# Brand-new entries to add (cleaner names: LM Studio, Emergent, Codex CLI, Hermes 4, OpenChat, WizardLM 2)
NEW_TOOLS_FEB_2026 = [
    {"slug": "lm-studio", "name": "LM Studio", "vendor": "LM Studio", "domain": "lmstudio.ai",
     "tagline": "Le bureau pour faire tourner les LLMs en local",
     "description": "Application desktop (Mac/Windows/Linux) pour télécharger et exécuter Llama, Mistral, DeepSeek, Qwen depuis ta machine — 100% privé, 100% offline, 0€.",
     "categorySlugs": ["code", "productivite"], "speedMs": 100, "accuracyPct": 86,
     "costPerPrompt": 0.0, "monthlyPrice": 0.0, "freeTier": True,
     "languages": ["fr", "en"],
     "features": ["Local 100%", "Offline", "Multi-modèles", "GUI desktop", "Compatible OpenAI API"],
     "useCases": ["Données sensibles", "RGPD-strict", "Pas de connexion"],
     "keywords": ["local", "offline", "self-host", "lmstudio", "llama", "mistral", "rgpd"],
     "score": 88, "color": "#1F1F1F"},

    {"slug": "emergent", "name": "Emergent", "vendor": "Emergent Labs", "domain": "emergent.sh",
     "tagline": "L'IA qui code et déploie ton app full-stack",
     "description": "Plateforme de dev française qui transforme ton brief en application complète (frontend Expo + backend FastAPI + base MongoDB) avec déploiement en un clic. C'est avec Emergent que IA Match a été construit.",
     "categorySlugs": ["code", "agent", "productivite"], "speedMs": 5000, "accuracyPct": 90,
     "costPerPrompt": 0.0, "monthlyPrice": 30.0, "freeTier": True,
     "languages": ["fr", "en"],
     "features": ["Full-stack auto", "Mobile + Web", "Déploiement 1-clic", "Stack moderne", "Aide d'agents IA"],
     "useCases": ["Apps SaaS", "MVP rapide", "Side project mobile"],
     "keywords": ["emergent", "app", "fullstack", "expo", "fastapi", "mongo"],
     "score": 89, "color": "#7C3AED"},

    {"slug": "codex-cli", "name": "Codex CLI", "vendor": "OpenAI", "domain": "openai.com",
     "tagline": "L'agent de code en ligne de commande d'OpenAI",
     "description": "L'agent OpenAI ressuscité en 2025 pour le terminal : édite ton code, lance les tests, débogue, fait les commits — interactivement ou en mode auto.",
     "categorySlugs": ["code", "agent"], "speedMs": 4000, "accuracyPct": 91,
     "costPerPrompt": 0.0, "monthlyPrice": 20.0, "freeTier": True,
     "languages": ["en"],
     "features": ["CLI", "Edition repo", "Tests auto", "Sandbox", "ChatGPT Plus inclus"],
     "useCases": ["Refactor batch", "Maintenance legacy"],
     "keywords": ["codex", "openai", "cli", "terminal", "code", "agent"],
     "score": 87, "color": "#10A37F"},

    {"slug": "hermes", "name": "Hermes 4", "vendor": "Nous Research", "domain": "nousresearch.com",
     "tagline": "Le top open-source post-Llama, ultra-direct",
     "description": "Famille Hermes (basée sur Llama 4) fine-tunée par Nous Research pour suivre tes instructions sans détour. Open-weight, self-hostable, communauté active.",
     "categorySlugs": ["texte", "code"], "speedMs": 220, "accuracyPct": 88,
     "costPerPrompt": 0.0002, "monthlyPrice": 0.0, "freeTier": True,
     "languages": ["en", "fr"],
     "features": ["Open-weight", "Sans guard-rails excessifs", "Fine-tune communautaire"],
     "useCases": ["Self-hosting", "Recherche", "Custom apps"],
     "keywords": ["hermes", "nous", "research", "open", "llama", "fine-tune"],
     "score": 86, "color": "#000000"},

    {"slug": "openchat", "name": "OpenChat 3.6", "vendor": "OpenChat", "domain": "huggingface.co",
     "tagline": "Le chatbot open communautaire qui rivalise avec les payants",
     "description": "Modèle open-source 7-13B fine-tuné par la communauté, performances étonnantes pour sa taille — idéal self-hosting pas cher.",
     "categorySlugs": ["texte", "code"], "speedMs": 200, "accuracyPct": 85,
     "costPerPrompt": 0.0, "monthlyPrice": 0.0, "freeTier": True,
     "languages": ["en", "fr", "zh"],
     "features": ["Open-weight", "Compact 7-13B", "MIT license"],
     "useCases": ["Self-hosting léger", "Apps embarquées"],
     "keywords": ["openchat", "open", "communautaire", "hugging face", "léger"],
     "score": 81, "color": "#FFB000"},

    {"slug": "wizardlm", "name": "WizardLM 2", "vendor": "Microsoft", "domain": "microsoft.com",
     "tagline": "Le modèle Microsoft fort en code et maths",
     "description": "Famille WizardLM 2 (8x22B et 70B) — open-weight, excellent en raisonnement, code et mathématiques. Distillation experte.",
     "categorySlugs": ["texte", "code"], "speedMs": 250, "accuracyPct": 88,
     "costPerPrompt": 0.0003, "monthlyPrice": 0.0, "freeTier": True,
     "languages": ["en", "fr", "zh"],
     "features": ["Open-weight", "Math/code", "Multi-tailles"],
     "useCases": ["Apps math/code", "Self-hosting fort"],
     "keywords": ["wizard", "wizardlm", "microsoft", "open", "math", "code"],
     "score": 84, "color": "#0078D4"},
]
