// Données de secours embarquées pour que IA Match ne soit jamais vide si l’API locale est indisponible.
export const FALLBACK_DATA = {
  "TOOLS": [
    {
      "slug": "chatgpt",
      "name": "ChatGPT",
      "vendor": "OpenAI",
      "domain": "openai.com",
      "tagline": "Powered by GPT-5.5 — l'assistant IA n°1 mondial",
      "description": "Assistant conversationnel OpenAI propulsé par GPT-5.5. Rédaction, brainstorming, code, analyse de documents, vision, navigation web et GPTs personnalisés.",
      "categorySlugs": [
        "texte",
        "productivite",
        "recherche",
        "code"
      ],
      "speedMs": 180,
      "accuracyPct": 95,
      "costPerPrompt": 0.002,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it",
        "ja",
        "zh"
      ],
      "features": [
        "GPT-5.5",
        "Multimodal",
        "Vision",
        "Navigation web",
        "Custom GPTs"
      ],
      "useCases": [
        "Rédiger un CV",
        "Résumer un document",
        "Brainstorming",
        "Apprendre"
      ],
      "keywords": [
        "cv",
        "resume",
        "résumé",
        "lettre",
        "motivation",
        "email",
        "écrire",
        "rédiger",
        "brainstorm",
        "gpt5",
        "gpt-5"
      ],
      "score": 96,
      "color": "#10A37F",
      "image": "https://logo.clearbit.com/openai.com"
    },
    {
      "slug": "claude",
      "name": "Claude Sonnet 4",
      "vendor": "Anthropic",
      "domain": "claude.ai",
      "tagline": "L'assistant Anthropic équilibré (Free + Pro 20€/mois)",
      "description": "Excellent pour l'analyse de documents longs, le raisonnement nuancé et l'écriture soignée.",
      "categorySlugs": [
        "texte",
        "recherche",
        "productivite"
      ],
      "speedMs": 220,
      "accuracyPct": 95,
      "costPerPrompt": 0.003,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it",
        "ja"
      ],
      "features": [
        "Contexte 200k",
        "Artefacts",
        "Analyse fichiers"
      ],
      "useCases": [
        "Analyser un long PDF",
        "Écrire un essai",
        "Audit juridique"
      ],
      "keywords": [
        "analyse",
        "long",
        "document",
        "pdf",
        "rapport",
        "essai",
        "juridique",
        "synthèse",
        "rédaction"
      ],
      "score": 95,
      "color": "#CC785C",
      "image": "https://logo.clearbit.com/claude.ai"
    },
    {
      "slug": "gemini",
      "name": "Gemini",
      "vendor": "Google",
      "domain": "gemini.google.com",
      "tagline": "L'assistant Google grand public (Free + Advanced 19,99€)",
      "description": "Multimodal natif, intégré à Gmail, Docs et la recherche Google.",
      "categorySlugs": [
        "texte",
        "productivite",
        "recherche",
        "image"
      ],
      "speedMs": 160,
      "accuracyPct": 90,
      "costPerPrompt": 0.0015,
      "monthlyPrice": 19.99,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja",
        "zh",
        "ko"
      ],
      "features": [
        "Multimodal",
        "Workspace",
        "Recherche temps réel"
      ],
      "useCases": [
        "Recherche web",
        "Email",
        "Docs Google"
      ],
      "keywords": [
        "recherche",
        "google",
        "email",
        "gmail",
        "docs",
        "tableur",
        "actualité",
        "web"
      ],
      "score": 90,
      "color": "#4285F4",
      "image": "https://logo.clearbit.com/gemini.google.com"
    },
    {
      "slug": "mistral",
      "name": "Le Chat",
      "vendor": "Mistral AI",
      "domain": "mistral.ai",
      "tagline": "Le champion européen open-weight",
      "description": "Modèle français performant, rapide, avec versions open-weight pour déploiement custom.",
      "categorySlugs": [
        "texte",
        "code",
        "productivite"
      ],
      "speedMs": 130,
      "accuracyPct": 88,
      "costPerPrompt": 0.001,
      "monthlyPrice": 14.99,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it"
      ],
      "features": [
        "Open-weight",
        "Code Mistral",
        "API"
      ],
      "useCases": [
        "Apps européennes",
        "Code",
        "Souveraineté data"
      ],
      "keywords": [
        "français",
        "europe",
        "souveraineté",
        "open",
        "mistral",
        "le chat"
      ],
      "score": 87,
      "color": "#FA520F",
      "image": "https://logo.clearbit.com/mistral.ai"
    },
    {
      "slug": "grok",
      "name": "Grok",
      "vendor": "xAI",
      "domain": "x.ai",
      "tagline": "L'IA temps-réel branchée sur X",
      "description": "Réponses temps-réel avec accès flux X, ton décalé, mode raisonnement.",
      "categorySlugs": [
        "texte",
        "recherche"
      ],
      "speedMs": 200,
      "accuracyPct": 86,
      "costPerPrompt": 0.002,
      "monthlyPrice": 16.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr",
        "es"
      ],
      "features": [
        "Temps réel X",
        "Mode Think",
        "Vision"
      ],
      "useCases": [
        "Veille X/Twitter",
        "Réactivité actualité"
      ],
      "keywords": [
        "temps réel",
        "twitter",
        "x",
        "actualité",
        "veille"
      ],
      "score": 82,
      "color": "#000000",
      "image": "https://logo.clearbit.com/x.ai"
    },
    {
      "slug": "deepseek",
      "name": "DeepSeek V3",
      "vendor": "DeepSeek",
      "domain": "deepseek.com",
      "tagline": "Le raisonneur open-source ultra-économique",
      "description": "Modèle chinois open-source au rapport qualité/prix exceptionnel, fort en code et maths.",
      "categorySlugs": [
        "texte",
        "code",
        "data"
      ],
      "speedMs": 240,
      "accuracyPct": 89,
      "costPerPrompt": 0.0002,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "zh"
      ],
      "features": [
        "Open-source",
        "Reasoning R1",
        "Pas cher"
      ],
      "useCases": [
        "Maths complexes",
        "Code",
        "Volume API"
      ],
      "keywords": [
        "maths",
        "math",
        "raisonnement",
        "code",
        "open",
        "gratuit",
        "chinois"
      ],
      "score": 88,
      "color": "#4D6BFE",
      "image": "https://logo.clearbit.com/deepseek.com"
    },
    {
      "slug": "perplexity",
      "name": "Perplexity",
      "vendor": "Perplexity AI",
      "domain": "perplexity.ai",
      "tagline": "Le moteur de recherche IA avec sources",
      "description": "Recherche web en temps réel avec citations vérifiables.",
      "categorySlugs": [
        "recherche"
      ],
      "speedMs": 140,
      "accuracyPct": 88,
      "costPerPrompt": 0.001,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de"
      ],
      "features": [
        "Citations",
        "Recherche temps réel",
        "Pro Search"
      ],
      "useCases": [
        "Recherche académique",
        "Veille",
        "Fact-checking"
      ],
      "keywords": [
        "recherche",
        "veille",
        "actualité",
        "source",
        "citation",
        "fact",
        "article",
        "web"
      ],
      "score": 89,
      "color": "#20B8CD",
      "image": "https://logo.clearbit.com/perplexity.ai"
    },
    {
      "slug": "you-com",
      "name": "You.com",
      "vendor": "You.com",
      "domain": "you.com",
      "tagline": "Le moteur multi-modèle tout-en-un",
      "description": "Recherche IA avec accès Claude, GPT, Gemini en un seul endroit.",
      "categorySlugs": [
        "recherche",
        "texte"
      ],
      "speedMs": 200,
      "accuracyPct": 86,
      "costPerPrompt": 0.001,
      "monthlyPrice": 15.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es"
      ],
      "features": [
        "Multi-modèle",
        "Agents",
        "Apps"
      ],
      "useCases": [
        "Recherche avancée",
        "Veille techno"
      ],
      "keywords": [
        "recherche",
        "veille",
        "multi",
        "agent",
        "moteur"
      ],
      "score": 80,
      "color": "#7C3AED",
      "image": "https://logo.clearbit.com/you.com"
    },
    {
      "slug": "midjourney",
      "name": "Midjourney",
      "vendor": "Midjourney",
      "domain": "midjourney.com",
      "tagline": "Le maître de l'image artistique",
      "description": "Génération d'images d'une qualité artistique exceptionnelle.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 30000,
      "accuracyPct": 96,
      "costPerPrompt": 0.04,
      "monthlyPrice": 10.0,
      "freeTier": false,
      "languages": [
        "en"
      ],
      "features": [
        "Style references",
        "Upscale",
        "V6"
      ],
      "useCases": [
        "Illustration",
        "Concept art",
        "Visuel marketing"
      ],
      "keywords": [
        "image",
        "illustration",
        "art",
        "dessin",
        "visuel",
        "design",
        "logo",
        "affiche",
        "poster"
      ],
      "score": 93,
      "color": "#000000",
      "image": "https://logo.clearbit.com/midjourney.com"
    },
    {
      "slug": "dalle",
      "name": "DALL-E 3",
      "vendor": "OpenAI",
      "domain": "openai.com",
      "tagline": "L'image fidèle au prompt",
      "description": "Génération d'images intégrée à ChatGPT, suit fidèlement les instructions.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 12000,
      "accuracyPct": 88,
      "costPerPrompt": 0.04,
      "monthlyPrice": 20.0,
      "freeTier": false,
      "languages": [
        "fr",
        "en",
        "es"
      ],
      "features": [
        "Intégré ChatGPT",
        "Édition d'image"
      ],
      "useCases": [
        "Visuel rapide",
        "Illustration concept"
      ],
      "keywords": [
        "image",
        "illustration",
        "dessin",
        "visuel",
        "concept"
      ],
      "score": 86,
      "color": "#FF6B35",
      "image": "https://logo.clearbit.com/openai.com"
    },
    {
      "slug": "stable-diffusion",
      "name": "Stable Diffusion",
      "vendor": "Stability AI",
      "domain": "stability.ai",
      "tagline": "Open-source, contrôle total",
      "description": "Modèle open-source customisable et exécutable en local.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 8000,
      "accuracyPct": 84,
      "costPerPrompt": 0.0,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Open-source",
        "Local",
        "ControlNet"
      ],
      "useCases": [
        "Pipeline custom",
        "Volume élevé"
      ],
      "keywords": [
        "image",
        "open",
        "gratuit",
        "local",
        "self-hosted"
      ],
      "score": 82,
      "color": "#7B61FF",
      "image": "https://logo.clearbit.com/stability.ai"
    },
    {
      "slug": "flux",
      "name": "Flux",
      "vendor": "Black Forest Labs",
      "domain": "blackforestlabs.ai",
      "tagline": "Le nouveau standard du photoréalisme",
      "description": "Modèle open d'image au photoréalisme bluffant, créé par les ex-Stable Diffusion.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 6000,
      "accuracyPct": 93,
      "costPerPrompt": 0.025,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Photoréalisme",
        "Open-weight",
        "Fast variant"
      ],
      "useCases": [
        "Photo produit",
        "Mode",
        "Portraits"
      ],
      "keywords": [
        "photo",
        "photoréalisme",
        "réaliste",
        "portrait",
        "produit"
      ],
      "score": 91,
      "color": "#000000",
      "image": "https://logo.clearbit.com/blackforestlabs.ai"
    },
    {
      "slug": "ideogram",
      "name": "Ideogram",
      "vendor": "Ideogram",
      "domain": "ideogram.ai",
      "tagline": "L'IA image qui sait écrire",
      "description": "Génération d'images avec texte intégré net et lisible — affiches, logos.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 7000,
      "accuracyPct": 87,
      "costPerPrompt": 0.02,
      "monthlyPrice": 8.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Texte dans l'image",
        "Magic Prompt",
        "Tile"
      ],
      "useCases": [
        "Affiches typographiques",
        "Logos",
        "Posters"
      ],
      "keywords": [
        "affiche",
        "poster",
        "logo",
        "texte",
        "typographie"
      ],
      "score": 84,
      "color": "#FF4F8B",
      "image": "https://logo.clearbit.com/ideogram.ai"
    },
    {
      "slug": "leonardo",
      "name": "Leonardo.AI",
      "vendor": "Leonardo",
      "domain": "leonardo.ai",
      "tagline": "Le studio image pour créatifs",
      "description": "Génération + retouche tout-en-un avec modèles fine-tunés et Canvas.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 6500,
      "accuracyPct": 86,
      "costPerPrompt": 0.015,
      "monthlyPrice": 12.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Canvas",
        "Fine-tunes",
        "Real-time"
      ],
      "useCases": [
        "Concept jeux vidéo",
        "Asset 3D",
        "Brand visuels"
      ],
      "keywords": [
        "jeu",
        "concept",
        "asset",
        "brand",
        "personnage"
      ],
      "score": 83,
      "color": "#A855F7",
      "image": "https://logo.clearbit.com/leonardo.ai"
    },
    {
      "slug": "recraft",
      "name": "Recraft",
      "vendor": "Recraft",
      "domain": "recraft.ai",
      "tagline": "Le compagnon des designers",
      "description": "Vector + raster avec contrôle de style fin pour usages design pro.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 8000,
      "accuracyPct": 88,
      "costPerPrompt": 0.025,
      "monthlyPrice": 12.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Vector",
        "Brand kit",
        "Style consistency"
      ],
      "useCases": [
        "Icônes",
        "Pictogrammes",
        "Identité visuelle"
      ],
      "keywords": [
        "vector",
        "vectoriel",
        "icône",
        "icone",
        "brand",
        "identité"
      ],
      "score": 85,
      "color": "#000000",
      "image": "https://logo.clearbit.com/recraft.ai"
    },
    {
      "slug": "github-copilot",
      "name": "GitHub Copilot",
      "vendor": "GitHub",
      "domain": "github.com",
      "tagline": "Le pair-programmeur dans ton IDE",
      "description": "Suggestions de code en temps réel dans VS Code, JetBrains et autres IDEs.",
      "categorySlugs": [
        "code"
      ],
      "speedMs": 80,
      "accuracyPct": 89,
      "costPerPrompt": 0.0,
      "monthlyPrice": 10.0,
      "freeTier": false,
      "languages": [
        "en"
      ],
      "features": [
        "IDE plugin",
        "Chat",
        "Workspace"
      ],
      "useCases": [
        "Coder plus vite",
        "Auto-complétion"
      ],
      "keywords": [
        "code",
        "coder",
        "programmation",
        "développer",
        "ide",
        "vscode",
        "fonction"
      ],
      "score": 91,
      "color": "#181717",
      "image": "https://logo.clearbit.com/github.com"
    },
    {
      "slug": "cursor",
      "name": "Cursor",
      "vendor": "Cursor",
      "domain": "cursor.com",
      "tagline": "L'IDE pensé pour l'IA",
      "description": "Éditeur de code avec IA native, refactoring multi-fichiers et agent autonome.",
      "categorySlugs": [
        "code",
        "agent"
      ],
      "speedMs": 120,
      "accuracyPct": 92,
      "costPerPrompt": 0.0,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Composer",
        "Agent mode",
        "Tab"
      ],
      "useCases": [
        "Coder une app",
        "Refactor",
        "Debug"
      ],
      "keywords": [
        "code",
        "coder",
        "ide",
        "éditeur",
        "app",
        "refactor",
        "debug"
      ],
      "score": 93,
      "color": "#0F0F0F",
      "image": "https://logo.clearbit.com/cursor.com"
    },
    {
      "slug": "windsurf",
      "name": "Windsurf",
      "vendor": "Codeium",
      "domain": "codeium.com",
      "tagline": "L'éditeur cascade-flow",
      "description": "IDE IA avec un agent qui anticipe l'intention sur plusieurs fichiers.",
      "categorySlugs": [
        "code",
        "agent"
      ],
      "speedMs": 130,
      "accuracyPct": 90,
      "costPerPrompt": 0.0,
      "monthlyPrice": 15.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Cascade",
        "Multi-file edit",
        "Plan mode"
      ],
      "useCases": [
        "Refactor complexe",
        "Migration de stack"
      ],
      "keywords": [
        "code",
        "refactor",
        "migration",
        "cascade",
        "agent"
      ],
      "score": 88,
      "color": "#09B6A2",
      "image": "https://logo.clearbit.com/codeium.com"
    },
    {
      "slug": "v0",
      "name": "v0",
      "vendor": "Vercel",
      "domain": "vercel.com",
      "tagline": "Du prompt à l'UI React",
      "description": "Génère des composants Next.js + Tailwind directement depuis une description.",
      "categorySlugs": [
        "code"
      ],
      "speedMs": 5000,
      "accuracyPct": 87,
      "costPerPrompt": 0.05,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "React/Next",
        "shadcn/ui",
        "Deploy"
      ],
      "useCases": [
        "Landing page",
        "Composant UI",
        "Prototype rapide"
      ],
      "keywords": [
        "ui",
        "react",
        "next",
        "composant",
        "landing",
        "prototype"
      ],
      "score": 86,
      "color": "#000000",
      "image": "https://logo.clearbit.com/vercel.com"
    },
    {
      "slug": "bolt",
      "name": "Bolt.new",
      "vendor": "StackBlitz",
      "domain": "stackblitz.com",
      "tagline": "Une app full-stack en un prompt",
      "description": "Build, run et déploie une app full-stack dans le navigateur.",
      "categorySlugs": [
        "code",
        "agent"
      ],
      "speedMs": 8000,
      "accuracyPct": 84,
      "costPerPrompt": 0.0,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Full-stack",
        "WebContainer",
        "Deploy Netlify"
      ],
      "useCases": [
        "MVP rapide",
        "App jetable",
        "Démo client"
      ],
      "keywords": [
        "app",
        "fullstack",
        "mvp",
        "prototype",
        "démo"
      ],
      "score": 84,
      "color": "#1389FD",
      "image": "https://logo.clearbit.com/stackblitz.com"
    },
    {
      "slug": "replit-agent",
      "name": "Replit Agent",
      "vendor": "Replit",
      "domain": "replit.com",
      "tagline": "L'agent qui code pour toi",
      "description": "Décrit ton idée, l'agent crée, teste et déploie l'app.",
      "categorySlugs": [
        "code",
        "agent"
      ],
      "speedMs": 6000,
      "accuracyPct": 83,
      "costPerPrompt": 0.0,
      "monthlyPrice": 25.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Agent autonome",
        "Cloud",
        "Deploy"
      ],
      "useCases": [
        "Auto-build d'app",
        "Apprentissage code"
      ],
      "keywords": [
        "agent",
        "app",
        "build",
        "auto",
        "replit"
      ],
      "score": 82,
      "color": "#F26207",
      "image": "https://logo.clearbit.com/replit.com"
    },
    {
      "slug": "sora",
      "name": "Sora",
      "vendor": "OpenAI",
      "domain": "sora.com",
      "tagline": "Le générateur vidéo nouvelle génération",
      "description": "Génération vidéo cinématographique à partir de texte.",
      "categorySlugs": [
        "video"
      ],
      "speedMs": 60000,
      "accuracyPct": 91,
      "costPerPrompt": 0.5,
      "monthlyPrice": 20.0,
      "freeTier": false,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Text-to-video",
        "Storyboard",
        "Remix"
      ],
      "useCases": [
        "Pub vidéo",
        "Court-métrage"
      ],
      "keywords": [
        "vidéo",
        "video",
        "film",
        "court",
        "métrage",
        "pub",
        "animation",
        "clip"
      ],
      "score": 88,
      "color": "#000000",
      "image": "https://logo.clearbit.com/sora.com"
    },
    {
      "slug": "runway",
      "name": "Runway",
      "vendor": "Runway",
      "domain": "runwayml.com",
      "tagline": "La suite vidéo IA professionnelle",
      "description": "Outils complets : génération, montage, effets visuels IA.",
      "categorySlugs": [
        "video"
      ],
      "speedMs": 45000,
      "accuracyPct": 86,
      "costPerPrompt": 0.3,
      "monthlyPrice": 15.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Gen-3",
        "Motion brush",
        "Inpainting"
      ],
      "useCases": [
        "VFX",
        "Court vidéo",
        "Édition"
      ],
      "keywords": [
        "vidéo",
        "video",
        "vfx",
        "montage",
        "effet",
        "édition"
      ],
      "score": 85,
      "color": "#01FF61",
      "image": "https://logo.clearbit.com/runwayml.com"
    },
    {
      "slug": "luma",
      "name": "Luma Dream Machine",
      "vendor": "Luma AI",
      "domain": "lumalabs.ai",
      "tagline": "L'image qui prend vie",
      "description": "Anime tes images en vidéos cinématiques avec mouvements de caméra.",
      "categorySlugs": [
        "video"
      ],
      "speedMs": 50000,
      "accuracyPct": 84,
      "costPerPrompt": 0.4,
      "monthlyPrice": 9.99,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Image-to-video",
        "Camera motion",
        "Loop"
      ],
      "useCases": [
        "Cinématique",
        "Animation produit",
        "Réseaux sociaux"
      ],
      "keywords": [
        "animer",
        "animation",
        "cinématique",
        "luma",
        "mouvement"
      ],
      "score": 83,
      "color": "#000000",
      "image": "https://logo.clearbit.com/lumalabs.ai"
    },
    {
      "slug": "pika",
      "name": "Pika",
      "vendor": "Pika Labs",
      "domain": "pika.art",
      "tagline": "La vidéo grand public, ludique",
      "description": "Effets viraux, pikaffects et mode vidéo court drôle.",
      "categorySlugs": [
        "video"
      ],
      "speedMs": 40000,
      "accuracyPct": 80,
      "costPerPrompt": 0.25,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Pikaffects",
        "Lipsync",
        "Sound"
      ],
      "useCases": [
        "TikTok",
        "Memes vidéo",
        "Réseaux"
      ],
      "keywords": [
        "tiktok",
        "réseau",
        "social",
        "meme",
        "court"
      ],
      "score": 78,
      "color": "#000000",
      "image": "https://logo.clearbit.com/pika.art"
    },
    {
      "slug": "heygen",
      "name": "HeyGen",
      "vendor": "HeyGen",
      "domain": "heygen.com",
      "tagline": "Avatar vidéo qui parle ta langue",
      "description": "Crée des vidéos avec avatars réalistes en 175 langues.",
      "categorySlugs": [
        "video",
        "audio"
      ],
      "speedMs": 30000,
      "accuracyPct": 88,
      "costPerPrompt": 0.5,
      "monthlyPrice": 24.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja",
        "zh"
      ],
      "features": [
        "Avatar",
        "175 langues",
        "Doublage"
      ],
      "useCases": [
        "Tuto vidéo",
        "L&D",
        "Vidéo multilingue"
      ],
      "keywords": [
        "avatar",
        "doublage",
        "tuto",
        "formation",
        "multilingue"
      ],
      "score": 86,
      "color": "#7B5BFF",
      "image": "https://logo.clearbit.com/heygen.com"
    },
    {
      "slug": "elevenlabs",
      "name": "ElevenLabs",
      "vendor": "ElevenLabs",
      "domain": "elevenlabs.io",
      "tagline": "Voix synthétiques d'un réalisme stupéfiant",
      "description": "Synthèse vocale et clonage de voix multilingue ultra-réaliste.",
      "categorySlugs": [
        "audio"
      ],
      "speedMs": 1500,
      "accuracyPct": 96,
      "costPerPrompt": 0.18,
      "monthlyPrice": 5.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it",
        "ja",
        "zh",
        "ko",
        "pt"
      ],
      "features": [
        "Voice cloning",
        "Multi-langue",
        "API"
      ],
      "useCases": [
        "Voix-off",
        "Podcast",
        "Audiolivre"
      ],
      "keywords": [
        "voix",
        "audio",
        "podcast",
        "narration",
        "voice",
        "off",
        "audiolivre",
        "clonage"
      ],
      "score": 94,
      "color": "#000000",
      "image": "https://logo.clearbit.com/elevenlabs.io"
    },
    {
      "slug": "whisper",
      "name": "Whisper",
      "vendor": "OpenAI",
      "domain": "openai.com",
      "tagline": "La transcription multilingue de référence",
      "description": "Transcription audio précise en 90+ langues.",
      "categorySlugs": [
        "audio"
      ],
      "speedMs": 5000,
      "accuracyPct": 93,
      "costPerPrompt": 0.006,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it",
        "ja",
        "zh",
        "ko",
        "pt",
        "ar"
      ],
      "features": [
        "90+ langues",
        "Open-source",
        "API"
      ],
      "useCases": [
        "Sous-titres",
        "Transcription réunion",
        "Notes"
      ],
      "keywords": [
        "transcription",
        "transcrire",
        "audio",
        "sous-titre",
        "réunion",
        "meeting",
        "podcast"
      ],
      "score": 90,
      "color": "#10A37F",
      "image": "https://logo.clearbit.com/openai.com"
    },
    {
      "slug": "suno",
      "name": "Suno",
      "vendor": "Suno",
      "domain": "suno.com",
      "tagline": "Compose des chansons en quelques secondes",
      "description": "Génération de chansons complètes (musique + voix) à partir de texte.",
      "categorySlugs": [
        "audio"
      ],
      "speedMs": 30000,
      "accuracyPct": 85,
      "costPerPrompt": 0.0,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "ja"
      ],
      "features": [
        "Chanson complète",
        "Voix",
        "Style"
      ],
      "useCases": [
        "Musique d'ambiance",
        "Jingle",
        "Démo"
      ],
      "keywords": [
        "musique",
        "chanson",
        "song",
        "jingle",
        "instrumental",
        "mélodie"
      ],
      "score": 84,
      "color": "#1A1A1A",
      "image": "https://logo.clearbit.com/suno.com"
    },
    {
      "slug": "udio",
      "name": "Udio",
      "vendor": "Udio",
      "domain": "udio.com",
      "tagline": "L'autre studio musical IA",
      "description": "Composition de morceaux longs avec voix et instruments réalistes.",
      "categorySlugs": [
        "audio"
      ],
      "speedMs": 25000,
      "accuracyPct": 84,
      "costPerPrompt": 0.0,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Morceaux longs",
        "Inpainting audio",
        "Stems"
      ],
      "useCases": [
        "Démo album",
        "Musique de film court"
      ],
      "keywords": [
        "musique",
        "chanson",
        "compose",
        "instrumental"
      ],
      "score": 81,
      "color": "#000000",
      "image": "https://logo.clearbit.com/udio.com"
    },
    {
      "slug": "fireflies",
      "name": "Fireflies.ai",
      "vendor": "Fireflies",
      "domain": "fireflies.ai",
      "tagline": "Le copilote de tes réunions",
      "description": "Transcription, résumé et analyse automatiques de réunions.",
      "categorySlugs": [
        "audio",
        "productivite"
      ],
      "speedMs": 3000,
      "accuracyPct": 88,
      "costPerPrompt": 0.0,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de"
      ],
      "features": [
        "Zoom",
        "Meet",
        "Teams",
        "Résumé"
      ],
      "useCases": [
        "Compte-rendu réunion",
        "Action items"
      ],
      "keywords": [
        "réunion",
        "meeting",
        "zoom",
        "meet",
        "teams",
        "compte-rendu"
      ],
      "score": 83,
      "color": "#F0463A",
      "image": "https://logo.clearbit.com/fireflies.ai"
    },
    {
      "slug": "otter",
      "name": "Otter.ai",
      "vendor": "Otter",
      "domain": "otter.ai",
      "tagline": "Le scribe intelligent",
      "description": "Transcription temps réel + chat sur tes meetings passés.",
      "categorySlugs": [
        "audio",
        "productivite"
      ],
      "speedMs": 1000,
      "accuracyPct": 87,
      "costPerPrompt": 0.0,
      "monthlyPrice": 16.99,
      "freeTier": true,
      "languages": [
        "en",
        "fr",
        "es"
      ],
      "features": [
        "Live caption",
        "Chat meetings",
        "Slides capture"
      ],
      "useCases": [
        "Notes étudiantes",
        "Notes meetings"
      ],
      "keywords": [
        "transcription",
        "réunion",
        "meeting",
        "notes",
        "live"
      ],
      "score": 80,
      "color": "#3B82F6",
      "image": "https://logo.clearbit.com/otter.ai"
    },
    {
      "slug": "notion-ai",
      "name": "Notion AI",
      "vendor": "Notion",
      "domain": "notion.so",
      "tagline": "L'IA dans ton workspace",
      "description": "Assistant intégré à Notion pour rédaction, résumé et organisation.",
      "categorySlugs": [
        "productivite",
        "texte"
      ],
      "speedMs": 200,
      "accuracyPct": 87,
      "costPerPrompt": 0.0,
      "monthlyPrice": 10.0,
      "freeTier": false,
      "languages": [
        "fr",
        "en",
        "es",
        "de"
      ],
      "features": [
        "Q&A docs",
        "Auto-fill",
        "Résumé"
      ],
      "useCases": [
        "Notes équipe",
        "Wiki",
        "Résumé réunion"
      ],
      "keywords": [
        "notion",
        "notes",
        "wiki",
        "équipe",
        "team",
        "doc",
        "workspace"
      ],
      "score": 84,
      "color": "#000000",
      "image": "https://logo.clearbit.com/notion.so"
    },
    {
      "slug": "grammarly",
      "name": "Grammarly",
      "vendor": "Grammarly",
      "domain": "grammarly.com",
      "tagline": "Le correcteur intelligent",
      "description": "Correction grammaticale, ton et style sur tout ton écrit.",
      "categorySlugs": [
        "texte",
        "productivite"
      ],
      "speedMs": 100,
      "accuracyPct": 91,
      "costPerPrompt": 0.0,
      "monthlyPrice": 12.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Correction temps réel",
        "Ton",
        "Plagiat"
      ],
      "useCases": [
        "Email pro",
        "Mémoire",
        "Article"
      ],
      "keywords": [
        "grammaire",
        "correction",
        "orthographe",
        "ton",
        "style",
        "anglais"
      ],
      "score": 86,
      "color": "#15C39A",
      "image": "https://logo.clearbit.com/grammarly.com"
    },
    {
      "slug": "deepl",
      "name": "DeepL",
      "vendor": "DeepL",
      "domain": "deepl.com",
      "tagline": "La traduction qui sonne juste",
      "description": "Traduction d'une qualité supérieure, surtout pour les langues européennes.",
      "categorySlugs": [
        "texte",
        "productivite"
      ],
      "speedMs": 90,
      "accuracyPct": 95,
      "costPerPrompt": 0.0,
      "monthlyPrice": 8.74,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it",
        "ja",
        "zh",
        "ko",
        "pt",
        "ru",
        "nl"
      ],
      "features": [
        "Write",
        "Glossaire",
        "Documents"
      ],
      "useCases": [
        "Traduction pro",
        "Email international"
      ],
      "keywords": [
        "traduction",
        "traduire",
        "anglais",
        "français",
        "espagnol",
        "allemand",
        "langue"
      ],
      "score": 92,
      "color": "#0F2B46",
      "image": "https://logo.clearbit.com/deepl.com"
    },
    {
      "slug": "canva-ai",
      "name": "Canva Magic Studio",
      "vendor": "Canva",
      "domain": "canva.com",
      "tagline": "Le design IA grand public",
      "description": "Suite IA dans Canva : génération d'images, redimensionnement, écriture.",
      "categorySlugs": [
        "image",
        "productivite"
      ],
      "speedMs": 4000,
      "accuracyPct": 83,
      "costPerPrompt": 0.0,
      "monthlyPrice": 12.99,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it"
      ],
      "features": [
        "Magic Design",
        "Magic Write",
        "Background remover"
      ],
      "useCases": [
        "Réseaux sociaux",
        "Présentation",
        "Affiche"
      ],
      "keywords": [
        "design",
        "réseau",
        "social",
        "présentation",
        "powerpoint",
        "affiche",
        "post",
        "instagram"
      ],
      "score": 81,
      "color": "#00C4CC",
      "image": "https://logo.clearbit.com/canva.com"
    },
    {
      "slug": "gamma",
      "name": "Gamma",
      "vendor": "Gamma",
      "domain": "gamma.app",
      "tagline": "Slides, sites, docs en un clic",
      "description": "Génère présentations, pages web et docs visuels à partir d'un brief.",
      "categorySlugs": [
        "productivite"
      ],
      "speedMs": 4000,
      "accuracyPct": 86,
      "costPerPrompt": 0.0,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es"
      ],
      "features": [
        "Slides",
        "Webpage",
        "PDF export"
      ],
      "useCases": [
        "Pitch deck",
        "Présentation client",
        "Slides cours"
      ],
      "keywords": [
        "présentation",
        "slide",
        "pitch",
        "deck",
        "powerpoint",
        "keynote"
      ],
      "score": 86,
      "color": "#A855F7",
      "image": "https://logo.clearbit.com/gamma.app"
    },
    {
      "slug": "tome",
      "name": "Tome",
      "vendor": "Tome",
      "domain": "tome.app",
      "tagline": "Des slides narratives nouvelle génération",
      "description": "Storytelling visuel avec layouts dynamiques et formats interactifs.",
      "categorySlugs": [
        "productivite"
      ],
      "speedMs": 5000,
      "accuracyPct": 82,
      "costPerPrompt": 0.0,
      "monthlyPrice": 16.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Storytelling",
        "Interactif",
        "Tiles"
      ],
      "useCases": [
        "Pitch",
        "Brief créatif"
      ],
      "keywords": [
        "pitch",
        "présentation",
        "storytelling",
        "slide"
      ],
      "score": 79,
      "color": "#000000",
      "image": "https://logo.clearbit.com/tome.app"
    },
    {
      "slug": "zapier-ai",
      "name": "Zapier Agents",
      "vendor": "Zapier",
      "domain": "zapier.com",
      "tagline": "Les agents qui orchestrent ton stack",
      "description": "Crée des agents qui connectent tes 7000+ apps avec déclencheurs IA.",
      "categorySlugs": [
        "agent",
        "productivite"
      ],
      "speedMs": 2000,
      "accuracyPct": 86,
      "costPerPrompt": 0.0,
      "monthlyPrice": 19.99,
      "freeTier": true,
      "languages": [
        "fr",
        "en"
      ],
      "features": [
        "7000+ intégrations",
        "Triggers IA",
        "No-code"
      ],
      "useCases": [
        "Automatiser CRM",
        "Workflows email",
        "Lead capture"
      ],
      "keywords": [
        "automatisation",
        "automate",
        "workflow",
        "zap",
        "intégration",
        "no-code"
      ],
      "score": 87,
      "color": "#FF4F00",
      "image": "https://logo.clearbit.com/zapier.com"
    },
    {
      "slug": "make",
      "name": "Make",
      "vendor": "Make",
      "domain": "make.com",
      "tagline": "Le studio visuel d'automatisations",
      "description": "Build des scénarios visuels avec routes, filtres et IA pour automatiser tout.",
      "categorySlugs": [
        "agent",
        "productivite"
      ],
      "speedMs": 1500,
      "accuracyPct": 85,
      "costPerPrompt": 0.0,
      "monthlyPrice": 9.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es"
      ],
      "features": [
        "Scenarios visuels",
        "Routeurs",
        "Webhooks"
      ],
      "useCases": [
        "Sync CRM",
        "Pipelines marketing"
      ],
      "keywords": [
        "automatisation",
        "scenario",
        "workflow",
        "intégration"
      ],
      "score": 84,
      "color": "#6D00CC",
      "image": "https://logo.clearbit.com/make.com"
    },
    {
      "slug": "n8n",
      "name": "n8n",
      "vendor": "n8n",
      "domain": "n8n.io",
      "tagline": "L'automatisation open-source pour devs",
      "description": "Plateforme self-hostable d'automatisations avec nodes IA natifs.",
      "categorySlugs": [
        "agent",
        "code"
      ],
      "speedMs": 1000,
      "accuracyPct": 86,
      "costPerPrompt": 0.0,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Open-source",
        "Self-host",
        "AI nodes"
      ],
      "useCases": [
        "Pipelines data",
        "Agents internes"
      ],
      "keywords": [
        "open",
        "self-hosted",
        "workflow",
        "data",
        "pipeline"
      ],
      "score": 86,
      "color": "#EA4B71",
      "image": "https://logo.clearbit.com/n8n.io"
    },
    {
      "slug": "julius",
      "name": "Julius",
      "vendor": "Julius AI",
      "domain": "julius.ai",
      "tagline": "Ton analyste de données conversationnel",
      "description": "Pose des questions en français à tes datasets, obtiens graphiques + insights.",
      "categorySlugs": [
        "data",
        "recherche"
      ],
      "speedMs": 3000,
      "accuracyPct": 88,
      "costPerPrompt": 0.0,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en"
      ],
      "features": [
        "CSV/Excel",
        "Graphiques",
        "Forecast"
      ],
      "useCases": [
        "Analyse ventes",
        "Tableau de bord",
        "Forecast"
      ],
      "keywords": [
        "data",
        "donnée",
        "csv",
        "excel",
        "graphique",
        "tableau",
        "analyse",
        "forecast"
      ],
      "score": 86,
      "color": "#000000",
      "image": "https://logo.clearbit.com/julius.ai"
    },
    {
      "slug": "rows",
      "name": "Rows",
      "vendor": "Rows",
      "domain": "rows.com",
      "tagline": "Le tableur boosté par l'IA",
      "description": "Tableur moderne avec fonctions IA natives et intégrations marketing.",
      "categorySlugs": [
        "data",
        "productivite"
      ],
      "speedMs": 200,
      "accuracyPct": 84,
      "costPerPrompt": 0.0,
      "monthlyPrice": 8.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr",
        "es"
      ],
      "features": [
        "AI Analyst",
        "Connectors",
        "Dashboards"
      ],
      "useCases": [
        "Reporting marketing",
        "KPI"
      ],
      "keywords": [
        "tableur",
        "spreadsheet",
        "kpi",
        "reporting",
        "marketing"
      ],
      "score": 80,
      "color": "#3F51B5",
      "image": "https://logo.clearbit.com/rows.com"
    },
    {
      "slug": "kling",
      "name": "Kling",
      "vendor": "Kuaishou",
      "domain": "klingai.com",
      "tagline": "La vidéo IA chinoise qui rivalise avec Sora",
      "description": "Génération vidéo cinématographique avec contrôle caméra fin.",
      "categorySlugs": [
        "video"
      ],
      "speedMs": 60000,
      "accuracyPct": 88,
      "costPerPrompt": 0.4,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "zh",
        "en"
      ],
      "features": [
        "Camera control",
        "Lipsync",
        "Long video"
      ],
      "useCases": [
        "Pub vidéo",
        "Clip"
      ],
      "keywords": [
        "vidéo",
        "video",
        "clip",
        "pub",
        "kling"
      ],
      "score": 84,
      "color": "#000000",
      "image": "https://logo.clearbit.com/klingai.com"
    },
    {
      "slug": "krea",
      "name": "Krea",
      "vendor": "Krea",
      "domain": "krea.ai",
      "tagline": "Le creative playground temps réel",
      "description": "Image, vidéo et patterns en mode temps réel pour designers.",
      "categorySlugs": [
        "image",
        "video"
      ],
      "speedMs": 500,
      "accuracyPct": 84,
      "costPerPrompt": 0.0,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Real-time",
        "Enhance",
        "Patterns"
      ],
      "useCases": [
        "Mood board",
        "Motion design",
        "Itération design"
      ],
      "keywords": [
        "temps réel",
        "design",
        "moodboard",
        "itération",
        "pattern"
      ],
      "score": 81,
      "color": "#FF4500",
      "image": "https://logo.clearbit.com/krea.ai"
    },
    {
      "slug": "scribe",
      "name": "Scribe",
      "vendor": "Scribe",
      "domain": "scribehow.com",
      "tagline": "Transforme tes process en guides visuels",
      "description": "Capture automatiquement tes étapes à l'écran et génère un how-to illustré.",
      "categorySlugs": [
        "productivite"
      ],
      "speedMs": 3000,
      "accuracyPct": 88,
      "costPerPrompt": 0.0,
      "monthlyPrice": 23.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Auto-capture",
        "Annotations",
        "Partage"
      ],
      "useCases": [
        "Onboarding équipe",
        "Documentation interne"
      ],
      "keywords": [
        "how-to",
        "guide",
        "documentation",
        "onboarding",
        "tutoriel"
      ],
      "score": 82,
      "color": "#0F62FE",
      "image": "https://logo.clearbit.com/scribehow.com"
    },
    {
      "slug": "decktopus",
      "name": "Decktopus",
      "vendor": "Decktopus",
      "domain": "decktopus.com",
      "tagline": "Slides en moins de 60 secondes",
      "description": "Crée et personnalise des présentations à partir d'un sujet.",
      "categorySlugs": [
        "productivite"
      ],
      "speedMs": 6000,
      "accuracyPct": 80,
      "costPerPrompt": 0.0,
      "monthlyPrice": 9.99,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de"
      ],
      "features": [
        "Templates",
        "Thèmes",
        "Export PDF"
      ],
      "useCases": [
        "Présentation rapide"
      ],
      "keywords": [
        "slide",
        "présentation",
        "deck",
        "rapide"
      ],
      "score": 76,
      "color": "#7B5BFF",
      "image": "https://logo.clearbit.com/decktopus.com"
    },
    {
      "slug": "tldraw",
      "name": "tldraw",
      "vendor": "tldraw",
      "domain": "tldraw.com",
      "tagline": "Du dessin à l'app en un clic",
      "description": "Whiteboard infini avec Make Real : transforme tes croquis en sites web.",
      "categorySlugs": [
        "code",
        "image"
      ],
      "speedMs": 8000,
      "accuracyPct": 80,
      "costPerPrompt": 0.0,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Whiteboard",
        "Make Real",
        "Multiplayer"
      ],
      "useCases": [
        "Prototype UI",
        "Brainstorming visuel"
      ],
      "keywords": [
        "whiteboard",
        "croquis",
        "wireframe",
        "ui",
        "prototype"
      ],
      "score": 80,
      "color": "#000000",
      "image": "https://logo.clearbit.com/tldraw.com"
    },
    {
      "slug": "qwen",
      "name": "Qwen 3",
      "vendor": "Alibaba",
      "domain": "qwen.ai",
      "tagline": "Le LLM chinois open-weight ultra-multilingue",
      "description": "Modèle puissant, open-weight, excellent en raisonnement, code et 100+ langues. Variant 235B et MoE.",
      "categorySlugs": [
        "texte",
        "code",
        "recherche"
      ],
      "speedMs": 220,
      "accuracyPct": 91,
      "costPerPrompt": 0.0008,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "zh",
        "ja",
        "ko",
        "es",
        "de",
        "ar"
      ],
      "features": [
        "Open-weight",
        "Reasoning",
        "Multilingue",
        "MoE"
      ],
      "useCases": [
        "Volume API massif",
        "Self-hosting",
        "Multilingue avancé"
      ],
      "keywords": [
        "qwen",
        "alibaba",
        "open",
        "chinois",
        "multilingue",
        "code"
      ],
      "score": 90,
      "color": "#615CED"
    },
    {
      "slug": "kimi",
      "name": "Kimi K2",
      "vendor": "Moonshot AI",
      "domain": "kimi.com",
      "tagline": "Le contexte 2M tokens du chinois Moonshot",
      "description": "Modèle de raisonnement chinois avec contexte ultra-long (2M tokens), excellent en agentique.",
      "categorySlugs": [
        "texte",
        "recherche",
        "agent"
      ],
      "speedMs": 350,
      "accuracyPct": 92,
      "costPerPrompt": 0.0006,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "zh",
        "en",
        "fr"
      ],
      "features": [
        "Contexte 2M",
        "Agent natif",
        "Open-weight"
      ],
      "useCases": [
        "Analyser dossiers volumineux",
        "Agents long-running"
      ],
      "keywords": [
        "kimi",
        "moonshot",
        "long contexte",
        "agent",
        "open"
      ],
      "score": 89,
      "color": "#000000"
    },
    {
      "slug": "llama",
      "name": "Llama 4",
      "vendor": "Meta",
      "domain": "llama.com",
      "tagline": "Le LLM open-weight de référence",
      "description": "Famille de modèles Meta open-weight (Scout, Maverick, Behemoth) avec multimodal natif.",
      "categorySlugs": [
        "texte",
        "code",
        "image"
      ],
      "speedMs": 200,
      "accuracyPct": 90,
      "costPerPrompt": 0.0003,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "hi",
        "pt"
      ],
      "features": [
        "Open-weight",
        "Multimodal",
        "Self-host"
      ],
      "useCases": [
        "Self-hosting",
        "Apps embarquées",
        "Recherche académique"
      ],
      "keywords": [
        "llama",
        "meta",
        "open",
        "facebook"
      ],
      "score": 91,
      "color": "#0866FF"
    },
    {
      "slug": "command-r",
      "name": "Command R+",
      "vendor": "Cohere",
      "domain": "cohere.com",
      "tagline": "Le LLM enterprise spécialisé RAG",
      "description": "Modèle Cohere optimisé pour le RAG, le tool-use et les workflows entreprise.",
      "categorySlugs": [
        "texte",
        "recherche",
        "agent"
      ],
      "speedMs": 180,
      "accuracyPct": 88,
      "costPerPrompt": 0.0025,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja",
        "ar"
      ],
      "features": [
        "RAG natif",
        "Tool-use",
        "Citations"
      ],
      "useCases": [
        "Chatbot interne",
        "Knowledge base",
        "Tool-use"
      ],
      "keywords": [
        "cohere",
        "rag",
        "enterprise",
        "command"
      ],
      "score": 86,
      "color": "#39594D"
    },
    {
      "slug": "yi",
      "name": "Yi-Large",
      "vendor": "01.AI",
      "domain": "01.ai",
      "tagline": "Le LLM bilingue de Kai-Fu Lee",
      "description": "Modèle chinois performant, open-weight, fort en chinois-anglais et raisonnement.",
      "categorySlugs": [
        "texte",
        "code"
      ],
      "speedMs": 230,
      "accuracyPct": 87,
      "costPerPrompt": 0.0007,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "zh",
        "en"
      ],
      "features": [
        "Open-weight",
        "Bilingue ZH-EN"
      ],
      "useCases": [
        "Apps Chine-Occident",
        "Self-hosting"
      ],
      "keywords": [
        "yi",
        "01.ai",
        "chinois",
        "open"
      ],
      "score": 84,
      "color": "#1F1F1F"
    },
    {
      "slug": "glm",
      "name": "GLM-4",
      "vendor": "Zhipu AI",
      "domain": "zhipuai.cn",
      "tagline": "Le LLM chinois multimodal",
      "description": "Famille GLM avec vision, code et raisonnement, déployable en local.",
      "categorySlugs": [
        "texte",
        "image",
        "code"
      ],
      "speedMs": 240,
      "accuracyPct": 86,
      "costPerPrompt": 0.0008,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "zh",
        "en"
      ],
      "features": [
        "Multimodal",
        "Vision",
        "Open-weight"
      ],
      "useCases": [
        "Self-hosting",
        "Vision-task"
      ],
      "keywords": [
        "glm",
        "zhipu",
        "chinois",
        "multimodal"
      ],
      "score": 83,
      "color": "#0066CC"
    },
    {
      "slug": "phi",
      "name": "Phi-4",
      "vendor": "Microsoft",
      "domain": "microsoft.com",
      "tagline": "Le petit modèle qui frappe fort",
      "description": "Modèle compact Microsoft surperformant pour sa taille — idéal embarqué.",
      "categorySlugs": [
        "texte",
        "code"
      ],
      "speedMs": 90,
      "accuracyPct": 84,
      "costPerPrompt": 0.0001,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Compact",
        "Open-weight",
        "Embarqué"
      ],
      "useCases": [
        "Edge deployment",
        "Apps mobiles",
        "Latence ultra-faible"
      ],
      "keywords": [
        "phi",
        "microsoft",
        "petit",
        "edge",
        "mobile"
      ],
      "score": 82,
      "color": "#0078D4"
    },
    {
      "slug": "nemotron",
      "name": "Nemotron",
      "vendor": "NVIDIA",
      "domain": "nvidia.com",
      "tagline": "Le LLM Nvidia optimisé inference",
      "description": "Modèle Nvidia hautes performances optimisé pour H100/H200 et workflows agentiques.",
      "categorySlugs": [
        "texte",
        "code",
        "agent"
      ],
      "speedMs": 150,
      "accuracyPct": 89,
      "costPerPrompt": 0.0005,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Optimisé Nvidia",
        "Reward model",
        "Agentic"
      ],
      "useCases": [
        "Pipelines GPU",
        "Agents",
        "Fine-tuning"
      ],
      "keywords": [
        "nemotron",
        "nvidia",
        "gpu",
        "agent"
      ],
      "score": 85,
      "color": "#76B900"
    },
    {
      "slug": "mixtral",
      "name": "Mixtral 8x22B",
      "vendor": "Mistral AI",
      "domain": "mistral.ai",
      "tagline": "L'expert MoE européen",
      "description": "Mixture of experts français, ratio qualité/coût exceptionnel, open-weight Apache 2.0.",
      "categorySlugs": [
        "texte",
        "code",
        "recherche"
      ],
      "speedMs": 160,
      "accuracyPct": 90,
      "costPerPrompt": 0.0006,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it"
      ],
      "features": [
        "MoE 8x22B",
        "Apache 2.0",
        "Self-host"
      ],
      "useCases": [
        "Volume API",
        "Self-hosting Europe"
      ],
      "keywords": [
        "mixtral",
        "mistral",
        "moe",
        "expert",
        "open",
        "français"
      ],
      "score": 89,
      "color": "#FA520F"
    },
    {
      "slug": "reka",
      "name": "Reka Core",
      "vendor": "Reka AI",
      "domain": "reka.ai",
      "tagline": "Le multimodal compact",
      "description": "Modèle multimodal natif (texte + image + audio + vidéo) en un seul modèle.",
      "categorySlugs": [
        "texte",
        "image",
        "audio",
        "video"
      ],
      "speedMs": 250,
      "accuracyPct": 86,
      "costPerPrompt": 0.001,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr",
        "ja"
      ],
      "features": [
        "Multimodal natif",
        "Vidéo",
        "Audio"
      ],
      "useCases": [
        "Apps multimédia",
        "Indexation vidéo"
      ],
      "keywords": [
        "reka",
        "multimodal",
        "vidéo",
        "audio"
      ],
      "score": 84,
      "color": "#7B61FF"
    },
    {
      "slug": "jamba",
      "name": "Jamba 1.5",
      "vendor": "AI21 Labs",
      "domain": "ai21.com",
      "tagline": "L'hybride Transformer-Mamba",
      "description": "Architecture hybride avec contexte 256k, latence faible, idéal docs longs.",
      "categorySlugs": [
        "texte",
        "recherche"
      ],
      "speedMs": 140,
      "accuracyPct": 86,
      "costPerPrompt": 0.0008,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr",
        "es",
        "de",
        "ar"
      ],
      "features": [
        "Hybride Mamba",
        "Contexte 256k",
        "Open"
      ],
      "useCases": [
        "Docs longs",
        "Latence faible"
      ],
      "keywords": [
        "jamba",
        "ai21",
        "mamba",
        "long contexte"
      ],
      "score": 82,
      "color": "#7CB7FF"
    },
    {
      "slug": "groq",
      "name": "Groq",
      "vendor": "Groq",
      "domain": "groq.com",
      "tagline": "L'inférence à la vitesse de la lumière",
      "description": "Plateforme inférence LPU ultra-rapide pour Llama, Mixtral, Gemma. 500+ tokens/sec.",
      "categorySlugs": [
        "texte",
        "code"
      ],
      "speedMs": 50,
      "accuracyPct": 88,
      "costPerPrompt": 0.0003,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "LPU",
        "500 t/s",
        "Multi-modèles"
      ],
      "useCases": [
        "Apps temps-réel",
        "Streaming chat"
      ],
      "keywords": [
        "groq",
        "rapide",
        "lpu",
        "inférence",
        "fast"
      ],
      "score": 88,
      "color": "#F55036"
    },
    {
      "slug": "together",
      "name": "Together AI",
      "vendor": "Together",
      "domain": "together.ai",
      "tagline": "Le hub d'inférence open-source",
      "description": "Accès API à 200+ modèles open-source (Llama, Mixtral, DeepSeek, Qwen) à prix cassé.",
      "categorySlugs": [
        "texte",
        "image",
        "code"
      ],
      "speedMs": 200,
      "accuracyPct": 87,
      "costPerPrompt": 0.0005,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "200+ modèles",
        "Fine-tuning",
        "Dedicated"
      ],
      "useCases": [
        "Comparer modèles open",
        "Fine-tuning"
      ],
      "keywords": [
        "together",
        "open",
        "hub",
        "api"
      ],
      "score": 85,
      "color": "#0F6FFF"
    },
    {
      "slug": "fireworks",
      "name": "Fireworks AI",
      "vendor": "Fireworks",
      "domain": "fireworks.ai",
      "tagline": "L'inférence pro pour models open",
      "description": "Inférence rapide et fine-tuning pour modèles open avec tarifs entreprise.",
      "categorySlugs": [
        "texte",
        "code",
        "image"
      ],
      "speedMs": 180,
      "accuracyPct": 87,
      "costPerPrompt": 0.0006,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Fine-tune",
        "FireFunction",
        "Multi-LoRA"
      ],
      "useCases": [
        "Production scale",
        "Fine-tuning custom"
      ],
      "keywords": [
        "fireworks",
        "inférence",
        "open",
        "fine-tune"
      ],
      "score": 84,
      "color": "#FF5722"
    },
    {
      "slug": "nano-banana",
      "name": "Nano Banana 2",
      "vendor": "Google",
      "domain": "deepmind.google",
      "tagline": "Le modèle image Gemini hyper-fidèle",
      "description": "Modèle image Gemini 2.0 dernière génération, suit le prompt à la lettre, édition par phrase.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 4000,
      "accuracyPct": 95,
      "costPerPrompt": 0.03,
      "monthlyPrice": 19.99,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja"
      ],
      "features": [
        "Édition par phrase",
        "Texte net",
        "Multi-tour"
      ],
      "useCases": [
        "Visuels marketing",
        "Édition image",
        "Iter rapide"
      ],
      "keywords": [
        "nano",
        "banana",
        "gemini",
        "image",
        "google"
      ],
      "score": 92,
      "color": "#4285F4"
    },
    {
      "slug": "imagen",
      "name": "Imagen 3",
      "vendor": "Google DeepMind",
      "domain": "deepmind.google",
      "tagline": "Le photoréalisme Google",
      "description": "Modèle image DeepMind ultra-photoréaliste, intégré à Vertex AI et Gemini.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 5000,
      "accuracyPct": 92,
      "costPerPrompt": 0.04,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Photoréalisme",
        "Vertex AI",
        "SynthID"
      ],
      "useCases": [
        "Photo produit",
        "Mode",
        "Pub"
      ],
      "keywords": [
        "imagen",
        "google",
        "deepmind",
        "photo"
      ],
      "score": 90,
      "color": "#4285F4"
    },
    {
      "slug": "firefly",
      "name": "Adobe Firefly",
      "vendor": "Adobe",
      "domain": "adobe.com",
      "tagline": "L'IA image safe pour pro",
      "description": "Modèle Adobe entraîné sur contenus licenciés, intégré Photoshop/Illustrator.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 6000,
      "accuracyPct": 87,
      "costPerPrompt": 0.05,
      "monthlyPrice": 9.99,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja"
      ],
      "features": [
        "Commercial-safe",
        "Photoshop",
        "Vector"
      ],
      "useCases": [
        "Brand visuels",
        "Édition Photoshop"
      ],
      "keywords": [
        "firefly",
        "adobe",
        "photoshop",
        "commercial"
      ],
      "score": 86,
      "color": "#FA0F00"
    },
    {
      "slug": "reve",
      "name": "Reve",
      "vendor": "Reve",
      "domain": "reve.art",
      "tagline": "L'image artistique nouvelle vague",
      "description": "Modèle image au style cinématographique distinctif, prompts naturels.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 5500,
      "accuracyPct": 89,
      "costPerPrompt": 0.025,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Style cinéma",
        "Prompt naturel"
      ],
      "useCases": [
        "Concept art",
        "Illustration éditoriale"
      ],
      "keywords": [
        "reve",
        "cinéma",
        "art",
        "concept"
      ],
      "score": 84,
      "color": "#000000"
    },
    {
      "slug": "magnific",
      "name": "Magnific",
      "vendor": "Magnific AI",
      "domain": "magnific.ai",
      "tagline": "L'upscaler IA qui invente du détail",
      "description": "Upscale d'image hallucinant qui invente du détail réaliste, jusqu'à 16x.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 30000,
      "accuracyPct": 92,
      "costPerPrompt": 0.05,
      "monthlyPrice": 39.0,
      "freeTier": false,
      "languages": [
        "en"
      ],
      "features": [
        "Upscale 16x",
        "Détail créatif",
        "Style transfer"
      ],
      "useCases": [
        "Restauration photo",
        "Print HD",
        "Upscale stock"
      ],
      "keywords": [
        "magnific",
        "upscale",
        "agrandir",
        "hd",
        "détail"
      ],
      "score": 88,
      "color": "#000000"
    },
    {
      "slug": "photoroom",
      "name": "Photoroom",
      "vendor": "Photoroom",
      "domain": "photoroom.com",
      "tagline": "Le studio photo IA des e-commerçants",
      "description": "Détourage, fond IA, retouche pour produits e-commerce — outil français.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 1500,
      "accuracyPct": 90,
      "costPerPrompt": 0.0,
      "monthlyPrice": 12.99,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja"
      ],
      "features": [
        "Détourage IA",
        "Fond produit",
        "Batch"
      ],
      "useCases": [
        "Photo produit",
        "E-commerce",
        "Marketplace"
      ],
      "keywords": [
        "photoroom",
        "détourage",
        "fond",
        "e-commerce",
        "produit",
        "français"
      ],
      "score": 87,
      "color": "#FF1744"
    },
    {
      "slug": "removebg",
      "name": "Remove.bg",
      "vendor": "Kaleido AI",
      "domain": "remove.bg",
      "tagline": "Le détourage en 1 clic",
      "description": "Suppression de fond IA ultra-précise pour photos produit, portraits, graphismes.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 800,
      "accuracyPct": 92,
      "costPerPrompt": 0.0,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de"
      ],
      "features": [
        "Détourage",
        "API",
        "Batch",
        "PNG transparent"
      ],
      "useCases": [
        "Détourage rapide",
        "Photo produit",
        "Portrait"
      ],
      "keywords": [
        "remove",
        "fond",
        "détourage",
        "background",
        "transparent"
      ],
      "score": 84,
      "color": "#FF5500"
    },
    {
      "slug": "topaz",
      "name": "Topaz Photo AI",
      "vendor": "Topaz Labs",
      "domain": "topazlabs.com",
      "tagline": "L'amélioration photo de référence",
      "description": "Suite IA pour réduction bruit, netteté, upscale et restauration photo.",
      "categorySlugs": [
        "image"
      ],
      "speedMs": 8000,
      "accuracyPct": 91,
      "costPerPrompt": 0.0,
      "monthlyPrice": 199.0,
      "freeTier": false,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Denoise",
        "Sharpen",
        "Upscale 6x"
      ],
      "useCases": [
        "Pro photo",
        "Restauration",
        "Print"
      ],
      "keywords": [
        "topaz",
        "denoise",
        "netteté",
        "photo",
        "pro"
      ],
      "score": 86,
      "color": "#FF6B00"
    },
    {
      "slug": "veo",
      "name": "Veo 3",
      "vendor": "Google DeepMind",
      "domain": "deepmind.google",
      "tagline": "La vidéo IA cinéma de Google",
      "description": "Modèle vidéo dernière génération avec audio synchronisé et 1080p natif.",
      "categorySlugs": [
        "video",
        "audio"
      ],
      "speedMs": 60000,
      "accuracyPct": 93,
      "costPerPrompt": 0.6,
      "monthlyPrice": 19.99,
      "freeTier": false,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Audio sync",
        "1080p",
        "Cinéma"
      ],
      "useCases": [
        "Pub vidéo",
        "Court-métrage"
      ],
      "keywords": [
        "veo",
        "google",
        "vidéo",
        "cinéma",
        "audio"
      ],
      "score": 91,
      "color": "#4285F4"
    },
    {
      "slug": "hailuo",
      "name": "Hailuo",
      "vendor": "MiniMax",
      "domain": "hailuoai.video",
      "tagline": "La vidéo IA chinoise grand public",
      "description": "Génération vidéo MiniMax avec contrôle caméra, 1080p, audio.",
      "categorySlugs": [
        "video"
      ],
      "speedMs": 50000,
      "accuracyPct": 86,
      "costPerPrompt": 0.3,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "zh",
        "en",
        "fr"
      ],
      "features": [
        "Camera control",
        "Audio",
        "1080p"
      ],
      "useCases": [
        "Clip",
        "Réseaux sociaux"
      ],
      "keywords": [
        "hailuo",
        "minimax",
        "vidéo",
        "chinois"
      ],
      "score": 84,
      "color": "#FF4444"
    },
    {
      "slug": "pixverse",
      "name": "Pixverse",
      "vendor": "Pixverse",
      "domain": "pixverse.ai",
      "tagline": "La vidéo IA créative anime/3D",
      "description": "Style anime, 3D et photoréaliste, contrôle caméra fin, lipsync.",
      "categorySlugs": [
        "video"
      ],
      "speedMs": 45000,
      "accuracyPct": 84,
      "costPerPrompt": 0.25,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "en",
        "zh"
      ],
      "features": [
        "Anime",
        "Lipsync",
        "Camera"
      ],
      "useCases": [
        "Anime",
        "Animation 3D",
        "Storytelling"
      ],
      "keywords": [
        "pixverse",
        "anime",
        "vidéo",
        "3d"
      ],
      "score": 81,
      "color": "#7B5BFF"
    },
    {
      "slug": "genmo",
      "name": "Genmo Mochi",
      "vendor": "Genmo",
      "domain": "genmo.ai",
      "tagline": "La vidéo open-source de référence",
      "description": "Modèle vidéo open-weight Apache 2.0, 480p à 720p, Mochi 1.",
      "categorySlugs": [
        "video"
      ],
      "speedMs": 90000,
      "accuracyPct": 80,
      "costPerPrompt": 0.0,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Open-weight",
        "Apache 2.0",
        "Self-host"
      ],
      "useCases": [
        "Self-hosting vidéo",
        "Recherche"
      ],
      "keywords": [
        "genmo",
        "mochi",
        "open",
        "vidéo"
      ],
      "score": 79,
      "color": "#000000"
    },
    {
      "slug": "ltx",
      "name": "LTX Studio",
      "vendor": "Lightricks",
      "domain": "ltx.studio",
      "tagline": "Le studio vidéo IA tout-en-un",
      "description": "Storyboard, cast, scènes IA pour pré-production vidéo cinéma.",
      "categorySlugs": [
        "video"
      ],
      "speedMs": 30000,
      "accuracyPct": 83,
      "costPerPrompt": 0.0,
      "monthlyPrice": 35.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Storyboard",
        "Cast IA",
        "Scènes"
      ],
      "useCases": [
        "Pré-production",
        "Pitch vidéo"
      ],
      "keywords": [
        "ltx",
        "lightricks",
        "vidéo",
        "studio"
      ],
      "score": 82,
      "color": "#1F1F1F"
    },
    {
      "slug": "synthesia",
      "name": "Synthesia",
      "vendor": "Synthesia",
      "domain": "synthesia.io",
      "tagline": "Les avatars vidéo entreprise",
      "description": "Plateforme avatar vidéo n°1 entreprise, 140+ langues, marque blanche.",
      "categorySlugs": [
        "video",
        "audio"
      ],
      "speedMs": 30000,
      "accuracyPct": 90,
      "costPerPrompt": 0.0,
      "monthlyPrice": 22.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja",
        "zh",
        "ar"
      ],
      "features": [
        "140+ langues",
        "Avatar custom",
        "Templates"
      ],
      "useCases": [
        "L&D",
        "Vidéos internes",
        "Onboarding"
      ],
      "keywords": [
        "synthesia",
        "avatar",
        "formation",
        "entreprise",
        "tuto"
      ],
      "score": 87,
      "color": "#32A8E8"
    },
    {
      "slug": "did",
      "name": "D-ID",
      "vendor": "D-ID",
      "domain": "d-id.com",
      "tagline": "Avatars parlants temps-réel",
      "description": "Photos animées en avatars parlants avec lipsync de qualité, API solide.",
      "categorySlugs": [
        "video",
        "audio"
      ],
      "speedMs": 12000,
      "accuracyPct": 86,
      "costPerPrompt": 0.5,
      "monthlyPrice": 6.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de"
      ],
      "features": [
        "Lipsync",
        "Photo-to-video",
        "Real-time"
      ],
      "useCases": [
        "Vidéo perso",
        "Avatar SAV"
      ],
      "keywords": [
        "d-id",
        "avatar",
        "lipsync",
        "photo"
      ],
      "score": 81,
      "color": "#FF7C00"
    },
    {
      "slug": "cartesia",
      "name": "Cartesia Sonic",
      "vendor": "Cartesia",
      "domain": "cartesia.ai",
      "tagline": "La voix synthétique ultra-rapide",
      "description": "TTS state-machine, 90ms latence, qualité naturelle, idéal voicebot temps-réel.",
      "categorySlugs": [
        "audio"
      ],
      "speedMs": 90,
      "accuracyPct": 92,
      "costPerPrompt": 0.05,
      "monthlyPrice": 5.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja"
      ],
      "features": [
        "90ms latence",
        "State-space",
        "Voicebot"
      ],
      "useCases": [
        "Voicebot temps-réel",
        "Streaming TTS"
      ],
      "keywords": [
        "cartesia",
        "sonic",
        "voix",
        "rapide",
        "voicebot"
      ],
      "score": 88,
      "color": "#000000"
    },
    {
      "slug": "playht",
      "name": "Play.ht",
      "vendor": "Play.ht",
      "domain": "play.ht",
      "tagline": "Voix synthétiques studio",
      "description": "Plus de 800 voix dans 130+ langues, clonage et émotions.",
      "categorySlugs": [
        "audio"
      ],
      "speedMs": 1500,
      "accuracyPct": 90,
      "costPerPrompt": 0.05,
      "monthlyPrice": 31.2,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it",
        "ja",
        "zh"
      ],
      "features": [
        "800 voix",
        "Clonage",
        "Émotions"
      ],
      "useCases": [
        "Podcast",
        "Audiolivre",
        "Pub radio"
      ],
      "keywords": [
        "play",
        "ht",
        "voix",
        "podcast",
        "audiolivre"
      ],
      "score": 84,
      "color": "#39EBA9"
    },
    {
      "slug": "resemble",
      "name": "Resemble AI",
      "vendor": "Resemble",
      "domain": "resemble.ai",
      "tagline": "Le clonage de voix entreprise",
      "description": "Clonage de voix temps-réel haute fidélité avec garde-fous deepfake.",
      "categorySlugs": [
        "audio"
      ],
      "speedMs": 800,
      "accuracyPct": 91,
      "costPerPrompt": 0.04,
      "monthlyPrice": 19.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de"
      ],
      "features": [
        "Voice cloning",
        "Anti-deepfake",
        "Real-time"
      ],
      "useCases": [
        "Doublage",
        "SAV vocal",
        "Démo produit"
      ],
      "keywords": [
        "resemble",
        "clonage",
        "voix",
        "deepfake"
      ],
      "score": 84,
      "color": "#272727"
    },
    {
      "slug": "stable-audio",
      "name": "Stable Audio 2",
      "vendor": "Stability AI",
      "domain": "stability.ai",
      "tagline": "Musique IA open-source",
      "description": "Génération musique 3 minutes haute qualité, modèle open.",
      "categorySlugs": [
        "audio"
      ],
      "speedMs": 25000,
      "accuracyPct": 84,
      "costPerPrompt": 0.0,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "3 min HQ",
        "Open-weight",
        "Audio-to-audio"
      ],
      "useCases": [
        "Musique de fond",
        "Sound design"
      ],
      "keywords": [
        "stable",
        "audio",
        "musique",
        "open"
      ],
      "score": 81,
      "color": "#7B61FF"
    },
    {
      "slug": "assemblyai",
      "name": "AssemblyAI",
      "vendor": "AssemblyAI",
      "domain": "assemblyai.com",
      "tagline": "L'API speech-to-text pro",
      "description": "Transcription multilingue, diarisation, summarisation, redaction PII.",
      "categorySlugs": [
        "audio"
      ],
      "speedMs": 2000,
      "accuracyPct": 93,
      "costPerPrompt": 0.005,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it",
        "ja",
        "zh"
      ],
      "features": [
        "Diarisation",
        "Summary",
        "PII redact"
      ],
      "useCases": [
        "Transcription scale",
        "Compliance"
      ],
      "keywords": [
        "assemblyai",
        "transcription",
        "diarisation",
        "api"
      ],
      "score": 88,
      "color": "#1A53E0"
    },
    {
      "slug": "deepgram",
      "name": "Deepgram",
      "vendor": "Deepgram",
      "domain": "deepgram.com",
      "tagline": "Le STT temps-réel le plus rapide",
      "description": "API STT temps-réel sub-300ms, idéal voicebot et live captioning.",
      "categorySlugs": [
        "audio"
      ],
      "speedMs": 300,
      "accuracyPct": 91,
      "costPerPrompt": 0.004,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja",
        "ko"
      ],
      "features": [
        "Streaming",
        "Sub-300ms",
        "Custom models"
      ],
      "useCases": [
        "Voicebot",
        "Live captioning"
      ],
      "keywords": [
        "deepgram",
        "stt",
        "temps réel",
        "streaming"
      ],
      "score": 87,
      "color": "#13EF93"
    },
    {
      "slug": "tabnine",
      "name": "Tabnine",
      "vendor": "Tabnine",
      "domain": "tabnine.com",
      "tagline": "L'autocomplétion code privée",
      "description": "Code completion privé, on-prem possible, modèles entraînés sur ton repo.",
      "categorySlugs": [
        "code"
      ],
      "speedMs": 100,
      "accuracyPct": 86,
      "costPerPrompt": 0.0,
      "monthlyPrice": 12.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "On-prem",
        "Private",
        "Custom-trained"
      ],
      "useCases": [
        "Banque",
        "Industrie",
        "Gouv"
      ],
      "keywords": [
        "tabnine",
        "code",
        "privé",
        "on-prem"
      ],
      "score": 83,
      "color": "#6E40C9"
    },
    {
      "slug": "aider",
      "name": "Aider",
      "vendor": "Aider",
      "domain": "aider.chat",
      "tagline": "Le pair-programmeur en CLI",
      "description": "Open-source CLI tool qui édite ton repo via LLM (GPT, Claude, Gemini, DeepSeek).",
      "categorySlugs": [
        "code"
      ],
      "speedMs": 3000,
      "accuracyPct": 87,
      "costPerPrompt": 0.0,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "CLI",
        "Multi-LLM",
        "Git native"
      ],
      "useCases": [
        "Refactor batch",
        "Patch automatique"
      ],
      "keywords": [
        "aider",
        "cli",
        "git",
        "code",
        "open"
      ],
      "score": 84,
      "color": "#000000"
    },
    {
      "slug": "continue",
      "name": "Continue",
      "vendor": "Continue",
      "domain": "continue.dev",
      "tagline": "L'IDE plugin open-source",
      "description": "Plugin VS Code/JetBrains open-source pour brancher n'importe quel LLM.",
      "categorySlugs": [
        "code"
      ],
      "speedMs": 200,
      "accuracyPct": 84,
      "costPerPrompt": 0.0,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Open-source",
        "Multi-LLM",
        "Custom"
      ],
      "useCases": [
        "Self-hosted Copilot"
      ],
      "keywords": [
        "continue",
        "ide",
        "open",
        "vscode"
      ],
      "score": 81,
      "color": "#000000"
    },
    {
      "slug": "devin",
      "name": "Devin",
      "vendor": "Cognition",
      "domain": "cognition.ai",
      "tagline": "L'ingénieur logiciel autonome",
      "description": "Agent IA autonome qui code, débogue et déploie, exécution sandbox.",
      "categorySlugs": [
        "code",
        "agent"
      ],
      "speedMs": 8000,
      "accuracyPct": 80,
      "costPerPrompt": 0.0,
      "monthlyPrice": 500.0,
      "freeTier": false,
      "languages": [
        "en"
      ],
      "features": [
        "Agent autonome",
        "Sandbox",
        "Plan-execute"
      ],
      "useCases": [
        "Tâches longues",
        "Refactor massif"
      ],
      "keywords": [
        "devin",
        "cognition",
        "agent",
        "ingénieur"
      ],
      "score": 83,
      "color": "#000000"
    },
    {
      "slug": "supermaven",
      "name": "Supermaven",
      "vendor": "Supermaven",
      "domain": "supermaven.com",
      "tagline": "L'autocomplétion contexte 1M",
      "description": "Autocomplétion code la plus rapide avec contexte 1M tokens.",
      "categorySlugs": [
        "code"
      ],
      "speedMs": 80,
      "accuracyPct": 88,
      "costPerPrompt": 0.0,
      "monthlyPrice": 10.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "1M contexte",
        "Ultra-rapide",
        "VS Code"
      ],
      "useCases": [
        "Coder vite",
        "Gros monorepo"
      ],
      "keywords": [
        "supermaven",
        "code",
        "rapide",
        "contexte"
      ],
      "score": 86,
      "color": "#000000"
    },
    {
      "slug": "codeium",
      "name": "Codeium",
      "vendor": "Codeium",
      "domain": "codeium.com",
      "tagline": "L'autocomplétion gratuite illimitée",
      "description": "Concurrent gratuit de Copilot, 70+ langages, on-prem possible entreprise.",
      "categorySlugs": [
        "code"
      ],
      "speedMs": 120,
      "accuracyPct": 85,
      "costPerPrompt": 0.0,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Gratuit illimité",
        "70+ langages",
        "On-prem"
      ],
      "useCases": [
        "Coder gratos",
        "Self-hosted"
      ],
      "keywords": [
        "codeium",
        "code",
        "gratuit",
        "copilot"
      ],
      "score": 84,
      "color": "#09B6A2"
    },
    {
      "slug": "lovable",
      "name": "Lovable",
      "vendor": "Lovable",
      "domain": "lovable.dev",
      "tagline": "Du prompt à l'app full-stack",
      "description": "Build apps full-stack avec Supabase intégré, déploiement instantané.",
      "categorySlugs": [
        "code",
        "agent"
      ],
      "speedMs": 7000,
      "accuracyPct": 84,
      "costPerPrompt": 0.0,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Full-stack",
        "Supabase",
        "Deploy"
      ],
      "useCases": [
        "MVP rapide",
        "Apps SaaS"
      ],
      "keywords": [
        "lovable",
        "app",
        "fullstack",
        "saas"
      ],
      "score": 85,
      "color": "#FF4444"
    },
    {
      "slug": "softgen",
      "name": "Softgen",
      "vendor": "Softgen",
      "domain": "softgen.ai",
      "tagline": "Apps SaaS depuis un brief",
      "description": "Génère des SaaS complets avec auth, paiement et BDD à partir d'un brief.",
      "categorySlugs": [
        "code",
        "agent"
      ],
      "speedMs": 6000,
      "accuracyPct": 81,
      "costPerPrompt": 0.0,
      "monthlyPrice": 19.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Auth + DB",
        "Stripe",
        "Deploy"
      ],
      "useCases": [
        "MVP SaaS",
        "Side project"
      ],
      "keywords": [
        "softgen",
        "saas",
        "app",
        "build"
      ],
      "score": 79,
      "color": "#000000"
    },
    {
      "slug": "copilot-365",
      "name": "Microsoft Copilot",
      "vendor": "Microsoft",
      "domain": "microsoft.com",
      "tagline": "L'IA dans Office 365",
      "description": "Copilot dans Word, Excel, Outlook, Teams, PowerPoint pour entreprise.",
      "categorySlugs": [
        "productivite",
        "texte"
      ],
      "speedMs": 200,
      "accuracyPct": 88,
      "costPerPrompt": 0.0,
      "monthlyPrice": 30.0,
      "freeTier": false,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja"
      ],
      "features": [
        "Office 365",
        "Teams",
        "M365 Chat"
      ],
      "useCases": [
        "Email",
        "Excel formules",
        "Docs Word"
      ],
      "keywords": [
        "copilot",
        "microsoft",
        "office",
        "word",
        "excel",
        "teams"
      ],
      "score": 87,
      "color": "#0078D4"
    },
    {
      "slug": "gemini-workspace",
      "name": "Gemini for Workspace",
      "vendor": "Google",
      "domain": "workspace.google.com",
      "tagline": "L'IA dans Gmail, Docs, Sheets",
      "description": "Gemini intégré à Workspace pour brouillons, résumés, analyse data.",
      "categorySlugs": [
        "productivite",
        "texte"
      ],
      "speedMs": 180,
      "accuracyPct": 87,
      "costPerPrompt": 0.0,
      "monthlyPrice": 24.0,
      "freeTier": false,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja"
      ],
      "features": [
        "Gmail",
        "Docs",
        "Sheets"
      ],
      "useCases": [
        "Email",
        "Sheets analyse",
        "Docs rédaction"
      ],
      "keywords": [
        "gemini",
        "workspace",
        "google",
        "gmail",
        "docs"
      ],
      "score": 86,
      "color": "#4285F4"
    },
    {
      "slug": "mem",
      "name": "Mem",
      "vendor": "Mem Labs",
      "domain": "mem.ai",
      "tagline": "Le second cerveau IA",
      "description": "Notes auto-organisées par IA, recherche sémantique, chat avec tes notes.",
      "categorySlugs": [
        "productivite",
        "texte"
      ],
      "speedMs": 300,
      "accuracyPct": 84,
      "costPerPrompt": 0.0,
      "monthlyPrice": 14.99,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Auto-tag",
        "Chat notes",
        "Smart write"
      ],
      "useCases": [
        "Notes perso",
        "Knowledge mgmt"
      ],
      "keywords": [
        "mem",
        "notes",
        "second cerveau",
        "knowledge"
      ],
      "score": 81,
      "color": "#000000"
    },
    {
      "slug": "granola",
      "name": "Granola",
      "vendor": "Granola",
      "domain": "granola.ai",
      "tagline": "Notes de réunion sans bot intrusif",
      "description": "Notes de réunion IA enrichies sans bot dans la call, intégré à Notion/Slack.",
      "categorySlugs": [
        "productivite",
        "audio"
      ],
      "speedMs": 500,
      "accuracyPct": 89,
      "costPerPrompt": 0.0,
      "monthlyPrice": 18.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "No bot",
        "Templates",
        "Integrations"
      ],
      "useCases": [
        "Notes réunion",
        "Suivi action"
      ],
      "keywords": [
        "granola",
        "réunion",
        "notes",
        "meeting"
      ],
      "score": 84,
      "color": "#000000"
    },
    {
      "slug": "spell",
      "name": "Spell",
      "vendor": "Spell",
      "domain": "spell.so",
      "tagline": "L'écrivain IA en parallèle",
      "description": "Lance plusieurs prompts ChatGPT en parallèle pour comparer rapidement.",
      "categorySlugs": [
        "texte",
        "productivite"
      ],
      "speedMs": 800,
      "accuracyPct": 84,
      "costPerPrompt": 0.001,
      "monthlyPrice": 12.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en"
      ],
      "features": [
        "Parallel prompts",
        "Templates",
        "Bulk"
      ],
      "useCases": [
        "A/B test prompts",
        "Volume rédaction"
      ],
      "keywords": [
        "spell",
        "parallèle",
        "rédaction",
        "bulk"
      ],
      "score": 79,
      "color": "#7B5BFF"
    },
    {
      "slug": "phind",
      "name": "Phind",
      "vendor": "Phind",
      "domain": "phind.com",
      "tagline": "Le moteur de recherche dev",
      "description": "Recherche IA spécialisée pour développeurs avec sources techniques.",
      "categorySlugs": [
        "recherche",
        "code"
      ],
      "speedMs": 1500,
      "accuracyPct": 88,
      "costPerPrompt": 0.001,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Citations dev",
        "Code blocks",
        "VS Code"
      ],
      "useCases": [
        "Recherche tech",
        "Stack overflow killer"
      ],
      "keywords": [
        "phind",
        "recherche",
        "dev",
        "code",
        "stackoverflow"
      ],
      "score": 85,
      "color": "#3B82F6"
    },
    {
      "slug": "consensus",
      "name": "Consensus",
      "vendor": "Consensus",
      "domain": "consensus.app",
      "tagline": "Le moteur de recherche académique IA",
      "description": "Trouve des consensus scientifiques basés sur 200M+ papers vérifiés.",
      "categorySlugs": [
        "recherche"
      ],
      "speedMs": 2500,
      "accuracyPct": 90,
      "costPerPrompt": 0.0,
      "monthlyPrice": 8.99,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "200M papers",
        "Consensus meter",
        "Citations"
      ],
      "useCases": [
        "Recherche scientifique",
        "Mémoire"
      ],
      "keywords": [
        "consensus",
        "scientifique",
        "papers",
        "académique"
      ],
      "score": 86,
      "color": "#3B82F6"
    },
    {
      "slug": "elicit",
      "name": "Elicit",
      "vendor": "Elicit",
      "domain": "elicit.com",
      "tagline": "L'assistant chercheur",
      "description": "Synthèse littérature scientifique, extraction systématique de papers.",
      "categorySlugs": [
        "recherche"
      ],
      "speedMs": 3000,
      "accuracyPct": 89,
      "costPerPrompt": 0.0,
      "monthlyPrice": 12.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Systematic review",
        "Extract data",
        "PRISMA"
      ],
      "useCases": [
        "Thèse",
        "Méta-analyse"
      ],
      "keywords": [
        "elicit",
        "scientifique",
        "thèse",
        "papers"
      ],
      "score": 84,
      "color": "#000000"
    },
    {
      "slug": "scite",
      "name": "Scite Assistant",
      "vendor": "Scite",
      "domain": "scite.ai",
      "tagline": "Citations validées en contexte",
      "description": "Distingue citations soutenant ou contredisant un papier scientifique.",
      "categorySlugs": [
        "recherche"
      ],
      "speedMs": 2000,
      "accuracyPct": 87,
      "costPerPrompt": 0.0,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Smart citations",
        "Critical reading"
      ],
      "useCases": [
        "Validation source",
        "Recherche critique"
      ],
      "keywords": [
        "scite",
        "citation",
        "scientifique",
        "critique"
      ],
      "score": 82,
      "color": "#1F1F1F"
    },
    {
      "slug": "agentgpt",
      "name": "AgentGPT",
      "vendor": "Reworkd",
      "domain": "agentgpt.reworkd.ai",
      "tagline": "L'agent autonome dans le navigateur",
      "description": "Lance un agent autonome qui décompose un objectif en tâches.",
      "categorySlugs": [
        "agent"
      ],
      "speedMs": 5000,
      "accuracyPct": 78,
      "costPerPrompt": 0.0,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Auto-decompose",
        "Web access",
        "Open-source"
      ],
      "useCases": [
        "Brainstorming",
        "Recherche guidée"
      ],
      "keywords": [
        "agentgpt",
        "agent",
        "autonome",
        "open"
      ],
      "score": 76,
      "color": "#000000"
    },
    {
      "slug": "multion",
      "name": "MultiOn",
      "vendor": "MultiOn",
      "domain": "multion.ai",
      "tagline": "L'agent navigateur",
      "description": "Agent IA qui navigue le web pour toi (booking, achat, recherche).",
      "categorySlugs": [
        "agent"
      ],
      "speedMs": 5000,
      "accuracyPct": 80,
      "costPerPrompt": 0.0,
      "monthlyPrice": 19.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "Browser agent",
        "Action API"
      ],
      "useCases": [
        "Booking auto",
        "Recherche produit"
      ],
      "keywords": [
        "multion",
        "agent",
        "navigateur",
        "browser"
      ],
      "score": 80,
      "color": "#000000"
    },
    {
      "slug": "relevance",
      "name": "Relevance AI",
      "vendor": "Relevance",
      "domain": "relevanceai.com",
      "tagline": "La force de vente IA",
      "description": "Construis des équipes d'agents IA pour vente, support, marketing.",
      "categorySlugs": [
        "agent"
      ],
      "speedMs": 3000,
      "accuracyPct": 85,
      "costPerPrompt": 0.0,
      "monthlyPrice": 99.0,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Agent teams",
        "CRM-ready",
        "Tools"
      ],
      "useCases": [
        "Sales agent",
        "Support agent"
      ],
      "keywords": [
        "relevance",
        "agent",
        "vente",
        "sales"
      ],
      "score": 83,
      "color": "#FF6E47"
    },
    {
      "slug": "lindy",
      "name": "Lindy",
      "vendor": "Lindy",
      "domain": "lindy.ai",
      "tagline": "L'assistant IA personnel d'entreprise",
      "description": "Assistant IA qui prend tes RDV, envoie des emails et gère ton CRM.",
      "categorySlugs": [
        "agent",
        "productivite"
      ],
      "speedMs": 2000,
      "accuracyPct": 86,
      "costPerPrompt": 0.0,
      "monthlyPrice": 49.99,
      "freeTier": true,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Calendar",
        "Email",
        "CRM"
      ],
      "useCases": [
        "Assistant exec",
        "Suivi commercial"
      ],
      "keywords": [
        "lindy",
        "assistant",
        "rdv",
        "crm"
      ],
      "score": 84,
      "color": "#000000"
    },
    {
      "slug": "hex",
      "name": "Hex Magic",
      "vendor": "Hex",
      "domain": "hex.tech",
      "tagline": "Le notebook data avec IA",
      "description": "Notebook data avec IA qui écrit SQL, Python et explique tes datasets.",
      "categorySlugs": [
        "data",
        "code"
      ],
      "speedMs": 1500,
      "accuracyPct": 88,
      "costPerPrompt": 0.0,
      "monthlyPrice": 24.0,
      "freeTier": true,
      "languages": [
        "en"
      ],
      "features": [
        "SQL gen",
        "Python",
        "Notebook"
      ],
      "useCases": [
        "Analyse data",
        "Reporting"
      ],
      "keywords": [
        "hex",
        "data",
        "sql",
        "notebook",
        "python"
      ],
      "score": 86,
      "color": "#5A45FF"
    },
    {
      "slug": "fabric-ms",
      "name": "Microsoft Fabric",
      "vendor": "Microsoft",
      "domain": "microsoft.com",
      "tagline": "La data plateforme IA Microsoft",
      "description": "Plateforme analytics unifiée avec Copilot data pour Power BI et Synapse.",
      "categorySlugs": [
        "data"
      ],
      "speedMs": 1200,
      "accuracyPct": 87,
      "costPerPrompt": 0.0,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en"
      ],
      "features": [
        "Power BI",
        "Synapse",
        "Copilot data"
      ],
      "useCases": [
        "BI entreprise",
        "Data lake"
      ],
      "keywords": [
        "fabric",
        "microsoft",
        "data",
        "power bi",
        "bi"
      ],
      "score": 85,
      "color": "#0078D4"
    },
    {
      "slug": "claude-haiku",
      "name": "Claude Haiku 4.5",
      "vendor": "Anthropic",
      "domain": "claude.ai",
      "tagline": "Claude rapide et économique pour tâches quotidiennes",
      "description": "Variante Claude optimisée vitesse/coût : résumés, extraction, support, classification et prompts courts.",
      "categorySlugs": [
        "texte",
        "productivite",
        "agent"
      ],
      "speedMs": 120,
      "accuracyPct": 90,
      "costPerPrompt": 0.0008,
      "monthlyPrice": 20.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "it",
        "ja"
      ],
      "features": [
        "Très rapide",
        "Économique",
        "Tool use",
        "Vision"
      ],
      "useCases": [
        "Support client",
        "Résumé rapide",
        "Classification",
        "Extraction"
      ],
      "keywords": [
        "claude",
        "haiku",
        "anthropic",
        "rapide",
        "support",
        "résumé"
      ],
      "score": 90,
      "color": "#CC785C"
    },
    {
      "slug": "claude-opus",
      "name": "Claude Opus 4",
      "vendor": "Anthropic",
      "domain": "claude.ai",
      "tagline": "Le modèle de raisonnement Anthropic premium",
      "description": "Le plus puissant des Claude, raisonnement de pointe, contexte 200k+.",
      "categorySlugs": [
        "texte",
        "code",
        "recherche"
      ],
      "speedMs": 400,
      "accuracyPct": 96,
      "costPerPrompt": 0.015,
      "monthlyPrice": 200.0,
      "freeTier": false,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja"
      ],
      "features": [
        "Raisonnement profond",
        "Tool use",
        "Vision"
      ],
      "useCases": [
        "Décisions stratégiques",
        "Audit complexe"
      ],
      "keywords": [
        "claude",
        "opus",
        "anthropic",
        "raisonnement"
      ],
      "score": 96,
      "color": "#CC785C"
    },
    {
      "slug": "o3",
      "name": "o3",
      "vendor": "OpenAI",
      "domain": "openai.com",
      "tagline": "Le raisonneur frontière",
      "description": "Modèle reasoning OpenAI o3 — chaîne de pensée extrême, math/code/sciences.",
      "categorySlugs": [
        "texte",
        "code",
        "recherche"
      ],
      "speedMs": 8000,
      "accuracyPct": 97,
      "costPerPrompt": 0.06,
      "monthlyPrice": 200.0,
      "freeTier": false,
      "languages": [
        "en",
        "fr"
      ],
      "features": [
        "Reasoning extrême",
        "Math",
        "Code"
      ],
      "useCases": [
        "Recherche",
        "Olympiades",
        "Code complexe"
      ],
      "keywords": [
        "o3",
        "openai",
        "raisonnement",
        "math"
      ],
      "score": 95,
      "color": "#10A37F"
    },
    {
      "slug": "gemini-25",
      "name": "Gemini 2.5 Pro",
      "vendor": "Google",
      "domain": "gemini.google.com",
      "tagline": "Le multimodal Google haut de gamme",
      "description": "Gemini 2.5 Pro avec contexte 2M, Deep Research, vision native.",
      "categorySlugs": [
        "texte",
        "image",
        "video",
        "recherche"
      ],
      "speedMs": 220,
      "accuracyPct": 94,
      "costPerPrompt": 0.0035,
      "monthlyPrice": 19.99,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "es",
        "de",
        "ja",
        "zh"
      ],
      "features": [
        "Contexte 2M",
        "Vidéo",
        "Deep Research"
      ],
      "useCases": [
        "Pro multimodal",
        "Vidéo analyse"
      ],
      "keywords": [
        "gemini",
        "2.5",
        "pro",
        "google",
        "deep research"
      ],
      "score": 94,
      "color": "#4285F4"
    },
    {
      "slug": "deepseek-r1",
      "name": "DeepSeek R1",
      "vendor": "DeepSeek",
      "domain": "deepseek.com",
      "tagline": "Le raisonneur open-source de référence",
      "description": "Reasoning model open-source au niveau o1 mais 30× moins cher.",
      "categorySlugs": [
        "texte",
        "code",
        "recherche"
      ],
      "speedMs": 600,
      "accuracyPct": 94,
      "costPerPrompt": 0.0002,
      "monthlyPrice": 0.0,
      "freeTier": true,
      "languages": [
        "fr",
        "en",
        "zh"
      ],
      "features": [
        "Reasoning",
        "Open-weight",
        "30x moins cher"
      ],
      "useCases": [
        "Maths",
        "Code complexe",
        "Volume"
      ],
      "keywords": [
        "deepseek",
        "r1",
        "raisonnement",
        "open"
      ],
      "score": 92,
      "color": "#4D6BFE"
    }
  ],
  "CATEGORIES": [
    {
      "slug": "texte",
      "name": "Texte & Écriture",
      "description": "Rédaction, résumé, brainstorming"
    },
    {
      "slug": "image",
      "name": "Image & Design",
      "description": "Génération et édition d'images"
    },
    {
      "slug": "code",
      "name": "Code & Dev",
      "description": "Assistants pour développeurs"
    },
    {
      "slug": "video",
      "name": "Vidéo",
      "description": "Génération et montage vidéo"
    },
    {
      "slug": "audio",
      "name": "Audio & Voix",
      "description": "Voix synthétique, transcription, musique"
    },
    {
      "slug": "productivite",
      "name": "Productivité",
      "description": "Documents, tableurs, présentations"
    },
    {
      "slug": "recherche",
      "name": "Recherche & Analyse",
      "description": "Recherche web, synthèse"
    },
    {
      "slug": "agent",
      "name": "Agents & Automatisation",
      "description": "Agents autonomes et workflows"
    },
    {
      "slug": "data",
      "name": "Data & Analyse",
      "description": "Tableurs, BI, analyse de données"
    }
  ],
  "NEWS": [
    {
      "id": "n1",
      "category": "DÉCRYPTAGE",
      "title": "GPT-5.5 : pourquoi c'est un saut, pas une mise à jour",
      "summary": "OpenAI publie GPT-5.5 fin avril 2026. Mémoire continue, raisonnement par étapes natif, multimodal d'origine. On t'explique pourquoi c'est fou.",
      "publishedAt": "2026-04-28",
      "readMinutes": 6,
      "tag": "OpenAI",
      "highlight": "5.5",
      "author": "Rédaction IA Match",
      "intro": "Tu te souviens quand ChatGPT t'oubliait à chaque conversation ? GPT-5.5 change cette règle. Et c'est juste l'un des trois sauts majeurs annoncés. On déballe.",
      "body": "## Trois choses sont devenues vraies cette semaine\n\nGPT-5.5 n'est pas qu'un meilleur modèle. C'est une bascule sur trois plans simultanés.\n\n## 1) La mémoire continue par défaut\n\nAvant : tu commençais chaque chat de zéro. Tu devais re-coller ton CV, tes objectifs, ton style. Pénible.\n\nMaintenant : le modèle se souvient de toi entre conversations. Tu lui dis 'écris comme moi' et il sait ce que ça veut dire. Tu lui dis 'comme la dernière fois' et il s'en souvient vraiment.\n\nImpact concret : ton assistant devient véritablement **personnel**. Plus tu l'utilises, plus il te ressemble.\n\n## 2) Le raisonnement par étapes est natif\n\nLes anciens modèles devinaient une réponse. GPT-5.5 **réfléchit** avant. Il décompose le problème, teste plusieurs approches en interne, vérifie son brouillon, puis répond.\n\nPour des questions simples, c'est instantané. Pour des problèmes complexes (un cas juridique, un calcul d'investissement, un debug), il prend 10-30 secondes et la qualité monte d'un cran.\n\n## 3) Multimodal d'origine\n\nLe modèle ne 'voit' plus l'image après l'avoir lue dans un module séparé. Il **comprend** texte, image, audio en même temps. Tu peux lui montrer un graphique, lui dicter une question vocalement, et il te répond avec une explication écrite + un schéma.\n\n## Ce que ça change pour toi\n\n- **Avant** : tu redonnais le contexte à chaque fois.\n- **Maintenant** : tu travailles avec un assistant qui te connaît.\n- **Avant** : tu acceptais des réponses approximatives sur les questions difficiles.\n- **Maintenant** : tu peux exiger un raisonnement et le voir.\n\n## Le piège à éviter\n\nLa mémoire continue est puissante mais elle stocke des infos sur toi. Vérifie tes paramètres de confidentialité. Choisis ce que le modèle a le droit de retenir.\n\n## Verdict\n\nCe n'est plus un outil pratique. C'est un **partenaire de travail** qui apprend ta manière de penser. Si tu utilisais déjà ChatGPT, ta journée vient de gagner 20-40% de productivité. Si tu hésitais, c'est le moment de t'y mettre."
    },
    {
      "id": "n2",
      "category": "DÉCRYPTAGE",
      "title": "GPT Image 2.0 : l'image qui obéit enfin au mot près",
      "summary": "Texte net dans l'image, mains à 5 doigts garanties, contrôle de pose précis. La nouvelle référence du visuel IA.",
      "publishedAt": "2026-04-26",
      "readMinutes": 5,
      "tag": "OpenAI",
      "highlight": "2.0",
      "author": "Rédaction IA Match",
      "intro": "La promesse paraissait impossible : 'génère un visuel publicitaire avec ce slogan exact'. Pendant 3 ans, le texte était flou ou déformé, les mains à 6 doigts, la composition approximative. GPT Image 2.0 lit ton brief comme un humain et exécute. Démonstration en 4 percées concrètes.",
      "body": "## Les 4 avancées concrètes\n\n### Texte parfaitement lisible\nTu peux écrire 'Solde -30% du 1er au 7 mai' et le modèle l'imprime tel quel. Plus de typos générées, plus de texte qui se déforme à mi-image. Pour les agences et les marques, c'est un gain de temps colossal sur les campagnes promo, les affiches événementielles, les bannières web et les visuels réseaux sociaux.\n\n### Mains, mains, mains\nLes IA ont longtemps galéré avec les mains : 5 doigts, anatomie correcte, prise d'objet réaliste. GPT Image 2.0 les rend correctement dans 96% des cas. Tu peux générer des poses naturelles (boire un café, tenir un livre, signer un document) sans avoir à camoufler les mains.\n\n### Contrôle de pose précis\nTu peux donner une silhouette de référence ou un croquis simple. Le modèle respecte la posture exacte, l'orientation du regard, les proportions. Idéal pour la cohérence entre plusieurs visuels d'une même campagne ou les variations d'un même personnage.\n\n### Édition par phrase, sans masque\n'Garde la lumière, change la veste pour un manteau noir long, retire le badge sur le revers.' Plus besoin de découpage, de masques, de calques. La phrase suffit. Le modèle comprend ce qui doit être préservé et ce qui doit changer.\n\n## Ce que ça veut dire pour les créatifs\n\n- **Designers** : 70% du temps de retouche disparaît. Plus de Photoshop pour des corrections mineures. Plus de focus sur la direction artistique.\n- **Marketing** : production de A/B testing visuels en 5 minutes. Les itérations passent de la semaine à l'heure.\n- **Indépendants** : un freelance peut produire un kit complet (3 visuels, 2 formats, 4 variations) en une demi-journée pour le prix d'un simple café.\n\n## Le débat éthique qui revient\n\nPlus c'est précis, plus on peut tromper. Réflexe pro : ajouter des watermarks discrets, garder une trace de génération horodatée, refuser systématiquement la commande si elle imite trop fidèlement une personne réelle non consentante. Les outils sérieux affichent désormais une mention 'image générée par IA' incrustée par défaut.\n\n## Verdict\n\nC'est le premier modèle d'image qui respecte un brief complet sans bricolage. La barrière entre 'idée visuelle' et 'visuel final' vient de tomber d'un cran. La créativité humaine — le brief, le goût, la direction — reprend toute sa valeur. L'exécution n'est plus le goulot d'étranglement."
    },
    {
      "id": "n3",
      "category": "PÉDAGOGIE",
      "title": "Modèle américain, chinois, européen : comment ils diffèrent vraiment",
      "summary": "Chaque continent a sa philosophie de l'IA. On la décode sans cliché, avec des exemples concrets.",
      "publishedAt": "2026-04-23",
      "readMinutes": 7,
      "tag": "Concepts",
      "author": "Rédaction IA Match",
      "intro": "Tu hésites entre Claude, DeepSeek et Mistral pour ton entreprise ? Au-delà du benchmark, ces modèles incarnent **trois cultures** différentes de l'IA. Voici comment ça change ton expérience.",
      "body": "## Le modèle américain : la performance brute\n\n**Acteurs phares** : OpenAI (GPT), Anthropic (Claude), Google (Gemini), Meta (Llama).\n\n**Philosophie** : pousser la frontière le plus vite possible, monétiser via abonnements premium, capter les créateurs et les développeurs.\n\n**Forces** :\n- Capacités générales très étendues.\n- Écosystème de plugins, d'agents, de marketplaces.\n- Documentation et communauté massives.\n\n**Limites** :\n- Données entraînées majoritairement en anglais.\n- Sensibilité culturelle parfois étrangère aux usages européens.\n- Contraintes RGPD à gérer activement.\n\n## Le modèle chinois : l'efficacité pragmatique\n\n**Acteurs phares** : DeepSeek, Qwen (Alibaba), Kling (Kuaishou), Yi (01.AI).\n\n**Philosophie** : optimisation maximale du rapport coût/performance. Les modèles chinois sont souvent **open-weight** (tu peux les télécharger) et beaucoup moins chers à utiliser.\n\n**Forces** :\n- Coût de tokens jusqu'à 10× inférieur aux modèles US équivalents.\n- Excellents en math, code, raisonnement chiffré.\n- Open-source réel, pas du marketing.\n\n**Limites** :\n- Filtres de contenu différents (sujets politiques sensibles).\n- Moins de support multilingue européen pointu.\n- Hébergement à choisir avec attention pour les données sensibles.\n\n## Le modèle européen : la souveraineté et la confiance\n\n**Acteurs phares** : Mistral (France), Aleph Alpha (Allemagne), Silo AI (Finlande).\n\n**Philosophie** : aligner les modèles sur le cadre RGPD, héberger en Europe, offrir des contrats clairs pour les entreprises et les administrations.\n\n**Forces** :\n- Excellence en langues européennes (français, allemand, italien, espagnol).\n- Conformité RGPD native, hébergement Europe possible.\n- Modèles open-weight (ex. Mistral 8x7B) déployables sur ton infrastructure.\n\n**Limites** :\n- Capacités générales légèrement en retrait sur les tout meilleurs benchmarks américains.\n- Écosystème plus jeune, moins d'apps tierces.\n\n## Comment choisir ?\n\n- **Tu fais du code, du raisonnement complexe, multilingue large** : modèle américain (Claude ou GPT).\n- **Tu as un volume API massif et un budget serré** : modèle chinois (DeepSeek).\n- **Tu travailles avec des données sensibles, en Europe, dans une langue européenne** : modèle européen (Mistral).\n\n## L'angle français\n\nMistral n'est pas 'un Claude moins bon'. C'est un modèle qui parle **un excellent français**, qui peut tourner sur tes serveurs, et qui accepte un contrat français pour tes données. Pour beaucoup d'entreprises et d'administrations, c'est le bon choix par défaut. Le réflexe 'on prend GPT par défaut' n'est plus optimal.\n\n## Verdict\n\nL'IA générative n'est pas neutre. Elle a une géographie, une culture, une économie. Choisir un modèle, c'est choisir une **philosophie de la donnée**. Prends le temps d'aligner ton choix avec tes valeurs et tes contraintes."
    },
    {
      "id": "n4",
      "category": "FRANCE",
      "title": "Mistral, fierté française : pourquoi ça compte",
      "summary": "Un champion européen qui rivalise avec les géants US. Histoire, position et ce que ça change.",
      "publishedAt": "2026-04-20",
      "readMinutes": 5,
      "tag": "Mistral",
      "author": "Rédaction IA Match",
      "intro": "En 18 mois, une startup parisienne est devenue le 4e acteur mondial de l'IA générative. Mistral n'est pas qu'une fierté symbolique : c'est une preuve concrète que l'Europe peut jouer dans la cour des grands. Voici pourquoi ça compte vraiment, sans cocorico.",
      "body": "## L'histoire en 3 dates\n\n- **Avril 2023** : trois chercheurs (ex-Meta, DeepMind) lancent Mistral à Paris. Pari risqué : créer un modèle européen open-weight qui rivalise avec les géants américains.\n- **Septembre 2023** : sortie de Mistral 7B, modèle open-weight qui bat des modèles 5× plus gros. La communauté découvre un nouveau standard d'efficacité.\n- **Avril 2026** : levée d'1Md€, Le Chat Pro adopté par 40% des administrations françaises et plus de 200 grandes entreprises européennes.\n\n## Pourquoi ça compte vraiment\n\n### 1) Souveraineté technologique\nQuand l'IA devient l'infrastructure invisible de demain (santé, justice, finance, éducation), dépendre uniquement d'acteurs étrangers est un risque stratégique majeur. Mistral nous donne une carte que personne n'avait en Europe depuis trente ans dans le logiciel grand public.\n\n### 2) Excellence en français\nLes modèles US sont entraînés à 90% sur de l'anglais, puis traduisent au runtime. Mistral pondère l'entraînement avec un corpus francophone massif (presse, littérature, code). Résultat : ton français est plus naturel, idiomatique, sans tournures bizarres ni anglicismes parasites. Pour un cabinet d'avocats, un service public ou un éditeur, la différence est nette.\n\n### 3) Open-weight véritable\nMistral 7B, Mixtral 8x7B, Mistral Small 3 : tu peux les télécharger gratuitement, les héberger sur tes propres serveurs, les modifier, les fine-tuner sur tes données. Cette ouverture redonne du pouvoir aux développeurs et aux entreprises qui refusent de dépendre d'une API tierce dont les conditions changent.\n\n## Ce qui rend l'équipe singulière\n\n- **Une obsession produit** : sorties régulières et tenues, sans hype superflue.\n- **Une philosophie 'européenne' assumée** : RGPD by design, contrats français, hébergement Paris.\n- **Une attention au coût opérationnel** : leurs modèles sont taillés pour la production massive, pas seulement pour briller sur les benchmarks académiques.\n\n## Le réflexe à adopter\n\nQuand tu choisis ton IA, ne demande plus 'quel est le meilleur modèle ?' mais 'quel est le meilleur modèle **pour mon contexte** ?'. Si ton contexte est européen, francophone, sensible au respect des données, Mistral est dans ta short-list par défaut. Pour une équipe juridique, comptable ou administrative, c'est même la première option à tester.\n\n## Verdict\n\nIl n'y a pas eu de champion européen du logiciel grand public pendant 30 ans. On en a un sur l'IA, qui est l'infrastructure des 30 prochaines années. Soutenir Mistral en l'utilisant, en en parlant à tes équipes, en l'évaluant face aux options US, c'est concret. Et c'est le moment."
    },
    {
      "id": "n5",
      "category": "MAGIE",
      "title": "Highfield et la nouvelle vague IA : 5 expériences à essayer ce week-end",
      "summary": "Au-delà de ChatGPT, des outils émerveillants qui montrent ce que l'IA peut être quand on lui donne du jeu.",
      "publishedAt": "2026-04-17",
      "readMinutes": 5,
      "tag": "Émerveillement",
      "author": "Rédaction IA Match",
      "intro": "L'IA, ce n'est pas que des slides en réunion. C'est aussi une boîte à magie créative. On t'a sélectionné 5 expériences gratuites à tester ce week-end. Promis, tu vas sourire.",
      "body": "## 1) Highfield : un univers qui se génère sous tes yeux\n\nHighfield est une expérience interactive où tu écris une scène et l'univers se peuple en temps réel autour de ton avatar. Les personnages parlent avec leur propre voix, l'environnement réagit à tes actions. C'est la première fois qu'un 'jeu' n'a aucun script écrit à l'avance.\n\n**Pourquoi tester** : voir à quoi ressemble un loisir IA-natif.\n\n## 2) Suno : une chanson en 30 secondes\n\nÉcris 'une ballade folk sur Paris en automne, voix grave, guitare acoustique'. Reçois une vraie chanson de 2 minutes. Avec voix. Avec mélodie. Avec instruments.\n\n**Pourquoi tester** : tu vas envoyer la première à ta mère. Tu vas pleurer.\n\n## 3) Krea : design en temps réel\n\nDessine un croquis grossier au stylet. Tape 'rendu photoréaliste, néon, ambiance cyberpunk'. Le design final apparaît instantanément à côté du croquis et se met à jour à chaque trait.\n\n**Pourquoi tester** : tu redécouvres le plaisir du dessin sans avoir à savoir dessiner.\n\n## 4) NotebookLM Audio : ton podcast personnalisé\n\nUploade un PDF (un cours, un article, un livre). NotebookLM génère un podcast audio de 8 minutes avec deux animateurs IA qui discutent du contenu. Tu écoutes en marchant.\n\n**Pourquoi tester** : tu retiens 3× plus en écoutant qu'en lisant.\n\n## 5) Claude Artifacts : code une mini-app en posant une question\n\nDans Claude, demande 'crée-moi un mini-jeu de calcul mental pour mes enfants'. L'app apparaît dans l'interface, jouable, en 30 secondes. Tu peux itérer 'rends-le plus difficile', 'ajoute des sons'.\n\n**Pourquoi tester** : tu sens enfin ce que les développeurs vivent.\n\n## La règle du week-end\n\nNe cherche pas à 'optimiser ton temps'. Ces 5 outils sont là pour t'émerveiller, pas pour ta to-do. Joue. Étonne-toi. Reviens lundi avec une intuition concrète de ce qu'est devenue l'IA en 2026."
    },
    {
      "id": "n6",
      "category": "PÉDAGOGIE",
      "title": "L'IA évolue à toute vitesse : pourquoi c'est une bonne nouvelle",
      "summary": "Capacités qui doublent tous les 6 mois, prix qui s'effondrent. L'angle positif que personne ne raconte.",
      "publishedAt": "2026-04-13",
      "readMinutes": 6,
      "tag": "Concepts",
      "author": "Rédaction IA Match",
      "intro": "On lit partout 'l'IA va trop vite, c'est inquiétant'. Et si on regardait ce que cette vitesse débloque concrètement pour les gens normaux ?",
      "body": "## La courbe en chiffres\n\n- **2022** : générer une page de texte coûtait 0,02€. Les images étaient floues. Pas de vidéo.\n- **2024** : 0,002€ la page. Images photoréalistes. Premières vidéos courtes.\n- **2026** : 0,0002€ la page. Images parfaites. Vidéos cinématographiques. Voix indiscernables d'un humain.\n\nDivisé par 100 en 4 ans. Divisé par 1000 dans 4 ans probablement.\n\n## Ce que ça libère\n\n### 1) L'éducation devient gratuite\nN'importe quel élève peut avoir un tuteur personnel patient, disponible 24/7, dans sa langue, à son niveau. Hier ça coûtait 50€/h. Demain c'est inclus dans un abonnement à 10€/mois.\n\n### 2) La médecine de campagne se démocratise\nUn médecin généraliste à 200km du CHU peut soumettre un cas complexe à un assistant IA spécialisé en cardiologie ou en oncologie. Le diagnostic différentiel devient bien plus juste.\n\n### 3) Les indépendants explosent\nUn freelance graphiste peut produire 5× plus de variantes pour ses clients. Un copywriter peut couvrir 5× plus de marques. La compétence reste humaine, l'exécution est démultipliée.\n\n### 4) Les langues fusionnent\nUn entrepreneur français peut négocier en mandarin avec un fournisseur, en temps réel, avec un anglais nuancé pour son investisseur américain. La barrière linguistique disparaît silencieusement.\n\n### 5) L'accès à la culture\nUn enfant peut faire un projet d'histoire en interrogeant un assistant qui connaît tout, dans son contexte, dans sa langue. Le savoir n'est plus payant.\n\n## Ce que ça implique pour toi\n\nTu n'es pas en retard. Tu es exactement à l'heure. La vraie compétence en 2026, ce n'est pas 'savoir prompter' (tout le monde sait taper du texte). C'est :\n\n1. **Savoir poser la bonne question** (compétence éternelle).\n2. **Savoir vérifier la réponse** (esprit critique).\n3. **Savoir choisir l'IA adaptée** (ce qu'IA Match t'aide à faire).\n4. **Savoir mettre la main à la pâte** quand l'IA se trompe (ton expertise reste centrale).\n\n## Verdict\n\nLa vitesse de l'IA n'est pas une menace. C'est un escalier qui monte vers un plateau plus large, où plus de gens peuvent faire plus de choses, dans plus de langues, à un coût ridiculement bas. Le travail humain ne disparaît pas : il devient **plus créatif et moins répétitif**."
    },
    {
      "id": "n7",
      "category": "DÉCRYPTAGE",
      "title": "Claude 4.5 Sonnet : le maître du long format",
      "summary": "Anthropic frappe fort avec un Claude qui digère 1 million de tokens et raisonne sans s'épuiser. Pourquoi les pros l'adorent.",
      "publishedAt": "2026-04-09",
      "readMinutes": 6,
      "tag": "Anthropic",
      "highlight": "4.5",
      "author": "Rédaction IA Match",
      "intro": "Anthropic vient de publier Claude 4.5 Sonnet. Sur le papier, c'est une mise à jour. Dans la pratique, c'est le modèle préféré des avocats, des analystes et des écrivains. Voici pourquoi.",
      "body": "## La signature Anthropic\n\nAnthropic a toujours visé une niche : la **qualité d'écriture** et le **raisonnement nuancé**. Pendant qu'OpenAI courait après le multimodal, Claude affinait sa plume.\n\n## Trois forces qui changent la donne\n\n### 1) Fenêtre 1 million de tokens\nTu peux coller un livre entier (300 pages) et discuter avec lui. Tu peux passer un dossier juridique de 80 documents et obtenir une synthèse honnête. La capacité d'absorption est juste **5×** supérieure à GPT-5.5.\n\n### 2) Artefacts version 2\nQuand tu demandes du code ou un mini-outil, Claude crée un 'artefact' interactif sur le côté. Tu peux itérer dessus en parlant, sans copier-coller. C'est devenu l'outil n°1 des designers UX et des product managers.\n\n### 3) Refus argumenté\nSur les sujets sensibles, Claude ne refuse pas brutalement : il explique son raisonnement. C'est inestimable pour les équipes juridiques et conformité qui doivent comprendre pourquoi un modèle dit non.\n\n## Quand choisir Claude plutôt que ChatGPT\n\n- **Audit juridique** : long doc, citations à conserver intactes.\n- **Écriture longue** : un essai de 5000 mots cohérent, pas haché.\n- **Code complexe** : refactoring multi-fichiers avec explication.\n- **Conversations sensibles** : RH, médical, conformité.\n\n## Le piège\n\nClaude est plus lent que les modèles concurrents (200-300ms par token). Pour un assistant temps réel grand public, GPT ou Gemini conviennent mieux. Pour un travail de fond, Claude gagne presque toujours.\n\n## Verdict\n\nClaude 4.5 Sonnet est le **outil de bureau** du travailleur intellectuel sérieux. Si tu écris pour vivre, si tu raisonnes pour décider, abonne-toi. C'est le meilleur 20€/mois que tu dépenseras cette année."
    },
    {
      "id": "n8",
      "category": "DÉCRYPTAGE",
      "title": "Gemini 3 Ultra : Google reprend la main sur le multimodal",
      "summary": "Vidéo, audio, code, image : Gemini 3 traite tout en même temps. Et c'est gratuit pour la plupart des usages.",
      "publishedAt": "2026-04-04",
      "readMinutes": 5,
      "tag": "Google",
      "highlight": "3",
      "author": "Rédaction IA Match",
      "intro": "Pendant deux ans, Google a couru après OpenAI. Avec Gemini 3 Ultra, le rapport de force change : pour la première fois, Google offre un modèle plus complet que ses concurrents, et largement gratuit.",
      "body": "## Le multimodal vraiment natif\n\nGemini 3 ne 'lit' pas une vidéo après l'avoir convertie en texte. Il la **regarde** réellement, frame par frame. Tu peux uploader 1 heure de vidéo et lui demander 'à quel moment précis le client a hésité ?'. Il pointe la timestamp à la seconde près.\n\n## Quatre cas d'usage qui surprennent\n\n### 1) Analyser des screenshots de tableaux complexes\nFini la galère d'extraction OCR : tu uploads, tu poses ta question. Précision proche de 100%.\n\n### 2) Sous-titrer un podcast en 8 langues\nUpload audio + 'sous-titre en français, anglais, espagnol, allemand, italien, japonais, coréen, mandarin'. Tu reçois 8 fichiers prêts à l'emploi.\n\n### 3) Coder une app à partir d'un Figma\nUpload du PNG du design, 'code-moi cette page en React Native'. Le résultat est étonnamment proche.\n\n### 4) Générer un script vidéo à partir d'une conférence\nUpload de la vidéo, 'écris un fil Twitter et un article Medium à partir de cette présentation'. Cohérence parfaite, citations exactes.\n\n## Le tarif imbattable\n\nLa plupart de ces usages sont **gratuits** dans l'app Gemini. Pour les développeurs, l'API est environ 60% moins chère que GPT à qualité équivalente. Google joue clairement la carte du volume.\n\n## La limite\n\nGemini reste légèrement moins fort que Claude sur l'écriture longue et le raisonnement profond. Pour un usage 'écriveur', Claude gagne. Pour un usage 'multimodal' (vidéo, image, audio simultanés), Gemini est imbattable.\n\n## Verdict\n\nSi tu travailles avec du contenu visuel (vidéo, image, screenshot, PDF) tous les jours, Gemini 3 Ultra est ton nouveau couteau suisse. Et le tarif gratuit fait de lui un excellent point d'entrée si tu débutes en IA."
    },
    {
      "id": "n9",
      "category": "FRANCE",
      "title": "Mistral Le Chat Pro : le pari souverain s'amplifie",
      "summary": "Le Chat Pro version 2026 ajoute un agent autonome, le mode entreprise et l'hébergement Paris/Francfort. Décryptage.",
      "publishedAt": "2026-03-30",
      "readMinutes": 6,
      "tag": "Mistral",
      "author": "Rédaction IA Match",
      "intro": "Quand Mistral a lancé Le Chat en 2024, c'était un produit minimaliste. Deux ans plus tard, Le Chat Pro 2026 rivalise sérieusement avec ChatGPT Plus, avec un avantage décisif : il vit en France.",
      "body": "## Trois nouveautés qui changent tout pour les entreprises\n\n### 1) Mistral Agent intégré\nLe Chat Pro embarque désormais un agent autonome. Tu lui dis 'compile-moi un rapport de veille sur les tendances cyber en Europe'. Il fait sa recherche, croise les sources, te livre un rapport sourcé en 4 minutes. L'agent peut aussi se connecter à ton Outlook, ton Drive, ton CRM (avec les bons droits).\n\n### 2) Hébergement Paris ou Francfort, au choix\nPour les administrations et les entreprises sous RGPD strict, Mistral propose un hébergement 100% européen avec contrat français. Aucun transit par les États-Unis. C'est juridiquement un argument décisif pour les RFP du secteur public.\n\n### 3) Mode 'Confidentialité maximale'\nTu peux activer un mode où aucune de tes conversations n'est utilisée pour entraîner les futurs modèles, même de manière anonymisée. Garantie contractuelle, pas juste paramètre coché.\n\n## La preuve par les chiffres\n\n- **40%** : part de Mistral dans les appels d'offres IA des administrations françaises (avril 2026).\n- **60%** : croissance trimestrielle de Le Chat Pro.\n- **9** : nouveaux pays européens couverts officiellement.\n- **<200ms** : latence moyenne en France métropolitaine.\n\n## Le réflexe à adopter\n\nSi ton entreprise est française ou européenne, **mets Mistral dans ta short-list par défaut**. Ce n'est plus un choix patriotique : c'est un choix opérationnel. Pour le code, l'écriture en français, la conformité RGPD, le rapport qualité/prix, Mistral est désormais à parité ou supérieur sur de nombreux usages.\n\n## Verdict\n\nLe Chat Pro 2026 confirme la trajectoire : Mistral est devenu un acteur sérieux. Tu peux y aller les yeux fermés pour 80% des usages bureau, et tu fais un choix industriellement responsable pour ton entreprise."
    },
    {
      "id": "n10",
      "category": "MAGIE",
      "title": "Grok 4 et DeepSeek R2 : les outsiders qui secouent le marché",
      "summary": "Un Grok temps réel branché sur X, un DeepSeek 10x moins cher : les modèles 'moins connus' qui mériteraient ta curiosité.",
      "publishedAt": "2026-03-25",
      "readMinutes": 6,
      "tag": "Émerveillement",
      "author": "Rédaction IA Match",
      "intro": "On parle toujours d'OpenAI, Anthropic, Google, Mistral. Mais deux modèles secouent vraiment le marché en ce moment : Grok 4 (xAI/Elon Musk) et DeepSeek R2 (Chine). Voici pourquoi ça vaut le coup d'y jeter un œil.",
      "body": "## Grok 4 : le modèle qui voit l'actualité en direct\n\n### La force unique\nGrok 4 a un accès **temps réel** à l'ensemble du flux X (ex-Twitter). Tu lui poses une question d'actualité brûlante, il a déjà vu les 200 derniers tweets sur le sujet. Aucun autre modèle ne peut faire ça aussi vite.\n\n### Cas d'usage qui marchent\n- Veille concurrentielle 'que disent les utilisateurs de X produit ?'\n- Réactivité éditoriale sur l'actu (pour rédacteurs et community managers).\n- Détection de signaux faibles avant qu'ils explosent.\n\n### La limite\n- Plus libre dans ses réponses, parfois trop. À utiliser avec recul.\n- Excellent en anglais, correct en français.\n- Inclus dans Premium X (~16€/mois).\n\n## DeepSeek R2 : la révolution coût/performance\n\n### La force unique\nDeepSeek R2 atteint le niveau de raisonnement de GPT-5 sur les maths et le code, mais coûte **10× moins cher** par token. Et il est **open-weight** : tu peux le télécharger et l'héberger toi-même gratuitement.\n\n### Cas d'usage qui marchent\n- Volume API massif (millions de prompts/mois).\n- Math complexes, dérivations, optimisations.\n- Code review automatisé sur de gros monorepos.\n- Self-hosting pour les boîtes qui veulent zéro cloud.\n\n### La limite\n- Filtres chinois sur certains sujets politiques.\n- Excellent en anglais et chinois, correct en français.\n- Documentation moins fournie que ses concurrents US.\n\n## Pourquoi tester ces deux outsiders\n\nLa diversité des modèles n'est pas seulement un confort de choix. C'est un **garde-fou stratégique**. Si tu construis une app sur GPT seul, tu es à la merci d'OpenAI. Si tu mixes 2-3 modèles selon les besoins, tu deviens résilient et tu optimises tes coûts.\n\n## Le réflexe à adopter\n\nUne fois par mois, prends une heure pour tester un modèle 'outsider'. Tu ne perdras rien et tu trouveras peut-être ta nouvelle pépite cachée.\n\n## Verdict\n\nLes leaders ne sont pas seuls. Grok ouvre une fenêtre temps réel unique. DeepSeek casse les codes économiques du marché. Garde l'œil ouvert : la prochaine grande surprise viendra probablement d'un modèle dont tu n'as pas encore entendu parler."
    }
  ],
  "LESSONS": [
    {
      "id": "l1",
      "order": 1,
      "level": "DÉBUTANT",
      "minutes": 6,
      "title": "C'est quoi, un 'modèle d'IA' ?",
      "intro": "Avant de prompter, comprendre ce qu'on a en face. Métaphore simple : un cuisinier amnésique mais hyper cultivé.",
      "body": "Un modèle d'IA est un programme entraîné sur d'énormes quantités de texte. Il a 'lu' des millions de livres, articles et conversations, mais il ne **se souvient** de rien après chaque conversation (sauf si on active la mémoire). Il connaît des recettes, mais il les invente sur le moment, à chaque fois.",
      "framework": "MODÈLE = CULTURE + INVENTION SUR L'INSTANT",
      "steps": [
        "Le modèle a tout 'lu' jusqu'à une date (cutoff).",
        "Il prédit le mot suivant le plus probable, pas la 'vérité'.",
        "Il oublie tout entre conversations (sauf mémoire).",
        "Plus tu lui donnes de contexte, plus il devine juste."
      ],
      "before": "Le modèle sait tout, donc il a forcément raison.",
      "after": "Le modèle est cultivé mais devine sur le moment. Je vérifie chiffres, citations, dates."
    },
    {
      "id": "l2",
      "order": 2,
      "level": "DÉBUTANT",
      "minutes": 6,
      "title": "Tokens, contexte et fenêtre : la mécanique invisible",
      "intro": "Un token = un bout de mot. Le modèle ne 'voit' pas tes phrases, il voit des tokens. Comprendre ça évite des erreurs coûteuses.",
      "body": "Un mot français vaut ~1.5 tokens en moyenne. Un modèle a une 'fenêtre de contexte' (ex. 200 000 tokens) : c'est la quantité de texte qu'il peut traiter d'un coup. Au-delà, il oublie le début. La fenêtre est partagée entre ta question, le contexte que tu donnes, et sa réponse.",
      "framework": "FENÊTRE = TON BRIEF + SES RÉPONSES + LE FIL",
      "steps": [
        "Estime ton volume de texte en tokens (~1.5×nombre de mots).",
        "Choisis un modèle avec une fenêtre adaptée.",
        "Si tu approches la limite, condense ou redémarre.",
        "Le contexte coûte des tokens : sois utile, pas bavard."
      ],
      "before": "Je colle mes 100 pages, le modèle s'en occupe.",
      "after": "Je résume mes 100 pages en 5 pages clés, je colle ces 5 pages."
    },
    {
      "id": "l3",
      "order": 3,
      "level": "DÉBUTANT",
      "minutes": 7,
      "title": "Hallucinations : quand l'IA invente avec aplomb",
      "intro": "Les modèles inventent des chiffres et des sources qui paraissent vrais. Apprendre à les détecter, c'est se protéger.",
      "body": "Une 'hallucination', c'est une réponse fausse formulée avec assurance. Le modèle ne ment pas exprès : il complète la phrase la plus probable, même quand il n'a pas l'info. Les hallucinations frappent surtout : citations, chiffres récents, références juridiques, données personnelles.",
      "framework": "VÉRIFIE-MOI ÇA — 4 SIGNAUX D'ALERTE",
      "steps": [
        "Citations précises (livre + page) : à vérifier.",
        "Chiffres datés (-2026, ce mois, etc.) : à vérifier.",
        "Noms propres rares ou très spécialisés : à vérifier.",
        "Le modèle dit 'je n'ai pas accès à internet' mais te répond quand même : très suspect."
      ],
      "before": "ChatGPT m'a sorti la citation, je colle telle quelle.",
      "after": "Je copie la citation dans Google. Si elle n'existe pas, je l'enlève."
    },
    {
      "id": "l4",
      "order": 4,
      "level": "DÉBUTANT",
      "minutes": 7,
      "title": "Comprendre ce qu'un modèle attend : le mini-brief",
      "intro": "Un bon prompt n'est pas une phrase magique. C'est un mini-brief comme tu en donnerais à un nouveau stagiaire.",
      "body": "Le modèle doit savoir ce qu'il doit produire, pour qui, avec quelles contraintes et sous quel format. Plus la sortie est importante, plus le brief doit être précis sur les critères de réussite.",
      "framework": "OBJECTIF · CONTEXTE · CONTRAINTES · FORMAT",
      "steps": [
        "Formule l'objectif en une phrase.",
        "Ajoute le contexte utile et seulement utile.",
        "Liste les contraintes non négociables.",
        "Décris le format final attendu.",
        "Ajoute 2 critères de qualité."
      ],
      "before": "Fais-moi un bon texte sur mon projet.",
      "after": "Rédige une présentation de 120 mots pour mon app IA Match. Audience : entrepreneurs non techniques. Ton : premium, clair, direct. Format : 1 paragraphe + 3 puces."
    },
    {
      "id": "l5",
      "order": 5,
      "level": "DÉBUTANT",
      "minutes": 8,
      "title": "Choisir le bon modèle : 4 questions à se poser",
      "intro": "Pas besoin du modèle 'le plus puissant'. Il faut le **bon** pour ta tâche.",
      "body": "Il y a quatre axes : capacité, vitesse, prix, langue. Tu ne peux pas tout maximiser en même temps. Le bon réflexe : commencer par la question 'à quel point je tolère une erreur ?' et descendre.",
      "framework": "CAPACITÉ · VITESSE · PRIX · LANGUE",
      "steps": [
        "Qualité critique ? Modèle haut de gamme (Claude, GPT-5).",
        "Volume massif ? Modèle économique (Haiku, Mistral, DeepSeek).",
        "Réponse instantanée ? Modèle rapide (Gemini Flash, Mistral Small).",
        "Langue européenne sensible ? Mistral."
      ],
      "before": "Je prends GPT pour tout, c'est connu.",
      "after": "Pour cette tâche : Mistral suffit, économique et bon en français."
    },
    {
      "id": "l6",
      "order": 6,
      "level": "INTERMÉDIAIRE",
      "minutes": 8,
      "title": "La méthode des 7 blocs",
      "intro": "Une structure mémorable pour ne plus oublier l'essentiel.",
      "body": "Rôle, Objectif, Audience, Contexte, Contraintes, Format, Critères. Sept blocs qui couvrent 95% des situations. Tu peux en sauter, jamais les inverser.",
      "framework": "RÔLE · OBJECTIF · AUDIENCE · CONTEXTE · CONTRAINTES · FORMAT · CRITÈRES",
      "steps": [
        "Donne un rôle précis ('coach carrière senior').",
        "Définis l'objectif unique de la sortie.",
        "Décris l'audience finale.",
        "Donne le contexte nécessaire.",
        "Liste contraintes hard et soft.",
        "Impose un format.",
        "Ajoute 2-3 critères de qualité."
      ],
      "before": "Écris une lettre de motivation.",
      "after": "Tu es coach carrière senior. Lettre de motivation 200 mots. Audience : DRH cabinet conseil. Contexte : poste consultant junior. Ton sobre. Format : 3 paragraphes. Critère : prouve la valeur."
    },
    {
      "id": "l7",
      "order": 7,
      "level": "INTERMÉDIAIRE",
      "minutes": 8,
      "title": "Few-shot : montrer plutôt que décrire",
      "intro": "Le 'few-shot prompting' est la cheat-code la plus sous-exploitée.",
      "body": "Donne 2-3 exemples concrets de la sortie attendue avant ta vraie demande. Le modèle imite mieux qu'il ne suit une description.",
      "framework": "FEW-SHOT (2-3 EXEMPLES + TÂCHE)",
      "steps": [
        "Choisis 2-3 exemples représentatifs.",
        "Format identique pour chaque exemple.",
        "Sépare exemples et vraie demande.",
        "Demande la sortie au même format."
      ],
      "before": "Écris-moi des slogans pour ma marque.",
      "after": "Voici 3 slogans que j'aime : 'Think different.', 'Just do it.', 'Hello again.'. Crée 5 slogans dans le même esprit pour IA Match."
    },
    {
      "id": "l8",
      "order": 8,
      "level": "INTERMÉDIAIRE",
      "minutes": 7,
      "title": "Itérer sans repartir de zéro",
      "intro": "L'art de raffiner sans tout casser.",
      "body": "Au lieu de relancer, demande des modifications ciblées. Le modèle garde le reste du contexte.",
      "framework": "GARDER · CHANGER · EXCLURE",
      "steps": [
        "Liste ce qui doit rester.",
        "Liste ce qui doit changer (avec direction).",
        "Liste ce qui ne doit jamais apparaître.",
        "Demande la même structure de sortie."
      ],
      "before": "Refais-le.",
      "after": "Garde : structure 3 paragraphes, ton sobre. Change : 2e paragraphe plus concret avec un chiffre. Exclus : adverbes en -ment."
    },
    {
      "id": "l9",
      "order": 9,
      "level": "AVANCÉ",
      "minutes": 10,
      "title": "Sortie structurée : JSON, tableau, checklist",
      "intro": "La sortie structurée déverrouille l'automatisation.",
      "body": "Spécifie un schéma exact, donne un exemple, demande une seule chose : 'réponds uniquement avec ce JSON valide'.",
      "framework": "SCHEMA-FIRST",
      "steps": [
        "Définis le schéma précis (champs, types).",
        "Donne 1 exemple complet.",
        "Impose 'aucun texte avant ou après'.",
        "Ajoute 'sors un JSON valide' explicitement."
      ],
      "before": "Donne-moi 3 idées principales.",
      "after": "Réponds UNIQUEMENT avec ce JSON valide : {\"ideas\":[{\"title\":string,\"summary\":string,\"impact\":1-5}]}. 3 idées pour le pitch IA Match."
    },
    {
      "id": "l10",
      "order": 10,
      "level": "AVANCÉ",
      "minutes": 9,
      "title": "Chain-of-thought : faire raisonner avant de répondre",
      "intro": "Pour les questions complexes, demande au modèle de **réfléchir à voix haute** avant de répondre.",
      "body": "Sur une question difficile (math, juridique, code), un modèle devine si tu lui demandes une réponse directe. En lui demandant un raisonnement étape par étape, la qualité monte d'un cran. Avec les modèles 'reasoning' (GPT-5, Claude), c'est natif.",
      "framework": "RAISONNE PUIS RÉPONDS",
      "steps": [
        "Décris le problème complètement.",
        "Demande : 'raisonne étape par étape avant de répondre'.",
        "Demande la réponse finale en dernier.",
        "Vérifie chaque étape, pas juste la conclusion."
      ],
      "before": "Quel est le bon investissement ?",
      "after": "Voici les 3 options chiffrées. Raisonne étape par étape : risques, rendements, fiscalité, horizon. Termine par une recommandation et son niveau de confiance."
    }
  ],
  "TEMPLATES": [
    {
      "id": "t1",
      "level": "BEGINNER",
      "title": "Optimiser un CV pour un poste précis",
      "body": "Tu es recruteur senior dans {sector}. Améliore mon CV pour le poste de {target_role}. Mon expérience : {experience_level}. Compétences clés : {skills}. Donne : 1) diagnostic en 5 points, 2) version améliorée des 3 expériences les plus pertinentes, 3) liste de mots-clés ATS à intégrer, 4) 3 questions probables d'entretien et comment y répondre.",
      "variables": [
        "sector",
        "target_role",
        "experience_level",
        "skills"
      ]
    },
    {
      "id": "t2",
      "level": "BEGINNER",
      "title": "Lettre de motivation honnête et impactante",
      "body": "Tu es coach carrière. Rédige une lettre de motivation pour le poste {target_role} chez {company}. Mon profil : {profile}. Ce qui m'attire vraiment : {attraction}. Ce que j'apporte concrètement : {value}. Ton : sobre, sans superlatifs. Format : 3 paragraphes de 4 lignes chacun. Termine par une phrase d'ouverture pour l'entretien.",
      "variables": [
        "target_role",
        "company",
        "profile",
        "attraction",
        "value"
      ]
    },
    {
      "id": "t3",
      "level": "BEGINNER",
      "title": "Email pro qui ne fait pas perdre de temps",
      "body": "Rédige un email pour {recipient} dans le but de {goal}. Contexte : {context}. Ton : {tone}. Contrainte : maximum 5 lignes corps + objet sous 8 mots. Termine par une question fermée à laquelle on peut répondre par oui ou non.",
      "variables": [
        "recipient",
        "goal",
        "context",
        "tone"
      ]
    },
    {
      "id": "t4",
      "level": "BEGINNER",
      "title": "Résumé clair d'un long document",
      "body": "Résume le document suivant pour {audience} dans l'objectif de {decision_or_goal}. Format : 1) résumé exécutif en 8 lignes, 2) 5 points clés, 3) risques identifiés, 4) opportunités, 5) 3 questions à poser au document. Signale toute information manquante.\n\nDocument : {document_text}",
      "variables": [
        "audience",
        "decision_or_goal",
        "document_text"
      ]
    },
    {
      "id": "t5",
      "level": "BEGINNER",
      "title": "Plan de cours pour apprendre un sujet",
      "body": "Tu es professeur expérimenté. Construis un plan de cours pour apprendre {topic} en {duration}. Niveau de départ : {level}. Objectif : {goal}. Donne : 1) 5 étapes avec durée, 2) 1 ressource clé par étape (livre, vidéo ou exercice), 3) 1 mini-projet pratique pour valider l'apprentissage.",
      "variables": [
        "topic",
        "duration",
        "level",
        "goal"
      ]
    },
    {
      "id": "t6",
      "level": "INTERMEDIATE",
      "title": "Recherche web sourcée et comparée",
      "body": "Recherche {topic} sur la période {timeframe}. Priorise les sources : {source_policy}. Compare les informations selon {criteria}. Livrables : 1) résumé synthétique, 2) tableau comparatif, 3) liste des sources avec lien et niveau de fiabilité, 4) désaccords entre sources, 5) niveau de confiance par information clé.",
      "variables": [
        "topic",
        "timeframe",
        "source_policy",
        "criteria"
      ]
    },
    {
      "id": "t7",
      "level": "INTERMEDIATE",
      "title": "Déboguer une erreur de code",
      "body": "Contexte projet : {project_context}. Stack : {stack}. Fichiers concernés : {files}. Erreur exacte : {error_message}. Comportement attendu : {expected_behavior}. Contraintes : ne modifie pas l'architecture. Donne : 1) cause probable et pourquoi, 2) correctif minimal en code, 3) tests à lancer pour vérifier, 4) 2 cas limites à surveiller.",
      "variables": [
        "project_context",
        "stack",
        "files",
        "error_message",
        "expected_behavior"
      ]
    },
    {
      "id": "t8",
      "level": "INTERMEDIATE",
      "title": "Pitch deck investisseurs en 12 slides",
      "body": "Rédige un pitch deck pour {startup}. Stade : {stage}. Marché total adressable : {market_size}. Problème résolu : {problem}. Solution : {solution}. Traction : {traction}. Équipe : {team}. Demande : {ask}. Format : 12 slides max, chacune avec un titre + 3 puces + 1 chiffre clé. Ajoute la slide 'risques et mitigations'.",
      "variables": [
        "startup",
        "stage",
        "market_size",
        "problem",
        "solution",
        "traction",
        "team",
        "ask"
      ]
    },
    {
      "id": "t9",
      "level": "INTERMEDIATE",
      "title": "Visuel publicitaire premium",
      "body": "Génère un visuel publicitaire pour {product}. Sujet principal : {subject}. Décor : {setting}. Style : {style}. Composition : {composition}. Lighting : {lighting}. Palette : {palette}. Texte exact à imprimer : {text}. Format : {format}. À éviter : {negative}. Donne 3 variantes de prompts détaillées.",
      "variables": [
        "product",
        "subject",
        "setting",
        "style",
        "composition",
        "lighting",
        "palette",
        "text",
        "format",
        "negative"
      ]
    },
    {
      "id": "t10",
      "level": "INTERMEDIATE",
      "title": "Compte-rendu de réunion structuré",
      "body": "À partir des notes brutes ci-dessous, produis un compte-rendu professionnel. Audience : {audience}. Format : 1) contexte en 3 lignes, 2) décisions prises (avec décideur), 3) actions (qui fait quoi pour quand), 4) points en suspens, 5) date prochaine réunion. Sois factuel, pas de filler.\n\nNotes : {notes}",
      "variables": [
        "audience",
        "notes"
      ]
    },
    {
      "id": "t11",
      "level": "ADVANCED",
      "title": "Cahier des charges MVP complet",
      "body": "Construis un cahier des charges MVP pour {app_name}. Objectif utilisateur : {user_goal}. Personas : {personas}. Pages requises : {pages}. Fonctionnalités MVP : {features}. Modèle de données : {data_model}. Design system : {design}. Contraintes techniques : {tech_constraints}. Livrables attendus : architecture, schéma de données, plan de tests, plan de déploiement, KPIs de succès, risques.",
      "variables": [
        "app_name",
        "user_goal",
        "personas",
        "pages",
        "features",
        "data_model",
        "design",
        "tech_constraints"
      ]
    },
    {
      "id": "t12",
      "level": "ADVANCED",
      "title": "Plan éditorial trimestriel B2B",
      "body": "Tu es Head of Content B2B chez {company}. Crée un plan éditorial sur {quarter}. Audiences segmentées : {audiences}. Objectifs business : {objectives}. Canaux : {channels}. Cadence : {cadence}. Livrables : 1) 3 thèmes piliers avec angle unique, 2) calendrier hebdo détaillé, 3) 12 idées d'articles avec angle + CTA, 4) KPIs trackés, 5) playbook de distribution.",
      "variables": [
        "company",
        "quarter",
        "audiences",
        "objectives",
        "channels",
        "cadence"
      ]
    },
    {
      "id": "t13",
      "level": "ADVANCED",
      "title": "Audit stratégique d'un produit",
      "body": "Audit du produit {product_name}. Marché : {market}. Concurrents directs : {competitors}. Métriques actuelles : {metrics}. Hypothèses fondatrices : {hypotheses}. Donne : 1) SWOT honnête, 2) jobs-to-be-done par persona, 3) écart entre promesse et exécution, 4) 3 angles stratégiques d'amélioration avec priorisation ICE, 5) risques à 12 mois.",
      "variables": [
        "product_name",
        "market",
        "competitors",
        "metrics",
        "hypotheses"
      ]
    },
    {
      "id": "t14",
      "level": "ADVANCED",
      "title": "Architecture d'un agent autonome",
      "body": "Conçois l'architecture d'un agent autonome qui réalise {goal}. Outils disponibles : {tools}. Contraintes : budget max {budget}, max {max_steps} étapes, niveau d'autonomie {autonomy}. Livrables : 1) plan d'exécution étape par étape, 2) critères d'arrêt et d'escalade humaine, 3) journal de décisions à produire, 4) tests d'acceptation, 5) plan de déploiement progressif.",
      "variables": [
        "goal",
        "tools",
        "budget",
        "max_steps",
        "autonomy"
      ]
    },
    {
      "id": "t15",
      "level": "ADVANCED",
      "title": "Stratégie de migration vers l'IA",
      "body": "Construis un plan de migration IA pour {company} (taille {size}, secteur {sector}). État actuel : {current_state}. Objectifs business 12 mois : {goals}. Contraintes RGPD : {gdpr}. Budget : {budget}. Livrables : 1) cartographie des 5 cas d'usage prioritaires, 2) recommandation de modèles (US/CN/EU) par cas, 3) plan d'adoption par équipe, 4) gouvernance et risques, 5) KPIs et calendrier 90 jours.",
      "variables": [
        "company",
        "size",
        "sector",
        "current_state",
        "goals",
        "gdpr",
        "budget"
      ]
    }
  ],
  "RESOURCES": [
    {
      "id": "r1",
      "category": "YOUTUBE",
      "title": "Underscore_",
      "author": "Micode",
      "summary": "Tech et IA expliquées avec rigueur en français. Format long, pédagogique, sans hype.",
      "url": "https://www.youtube.com/@Underscore_"
    },
    {
      "id": "r2",
      "category": "YOUTUBE",
      "title": "Defend Intelligence",
      "author": "Anis Ayari",
      "summary": "Décryptages IA en français par un data scientist. Pédagogie pour curieux et pros.",
      "url": "https://www.youtube.com/@DefendIntelligence-tech"
    },
    {
      "id": "r3",
      "category": "YOUTUBE",
      "title": "Le Vortex",
      "author": "Le Vortex",
      "summary": "Émission tech française qui couvre régulièrement les nouveautés IA.",
      "url": "https://www.youtube.com/@LeVortex"
    },
    {
      "id": "r4",
      "category": "YOUTUBE",
      "title": "Science4All",
      "author": "Lê Nguyên Hoang",
      "summary": "Vulgarisation scientifique de qualité avec une série solide sur l'IA et le ML.",
      "url": "https://www.youtube.com/@le_science4all"
    },
    {
      "id": "r5",
      "category": "YOUTUBE",
      "title": "Cocadmin",
      "author": "Cocadmin",
      "summary": "Tech et culture web en français, avec analyses régulières des outils IA.",
      "url": "https://www.youtube.com/@cocadmin"
    },
    {
      "id": "r6",
      "category": "BLOG",
      "title": "Korben.info",
      "author": "Korben",
      "summary": "Référence française tech depuis 20 ans. Couverture quotidienne des outils IA.",
      "url": "https://korben.info/category/intelligence-artificielle"
    },
    {
      "id": "r7",
      "category": "BLOG",
      "title": "Numerama",
      "author": "Rédaction Numerama",
      "summary": "Média tech français de référence. Articles pédagogiques et analyses sur l'IA.",
      "url": "https://www.numerama.com/tech/intelligence-artificielle/"
    },
    {
      "id": "r8",
      "category": "BLOG",
      "title": "ActuIA",
      "author": "Rédaction ActuIA",
      "summary": "Magazine 100% IA en français. Actualité, dossiers, interviews d'experts français.",
      "url": "https://www.actuia.com/"
    },
    {
      "id": "r9",
      "category": "BLOG",
      "title": "Frandroid — IA",
      "author": "Rédaction Frandroid",
      "summary": "Tests d'outils IA grand public, analyses comparatives en français.",
      "url": "https://www.frandroid.com/tag/intelligence-artificielle"
    },
    {
      "id": "r10",
      "category": "BLOG",
      "title": "Siècle Digital — IA",
      "author": "Rédaction Siècle Digital",
      "summary": "Veille business et stratégie autour de l'IA, en français, ton accessible.",
      "url": "https://siecledigital.fr/intelligence-artificielle/"
    },
    {
      "id": "r11",
      "category": "PODCAST",
      "title": "Trench Tech",
      "author": "Mick Levy",
      "summary": "Podcast français exigeant sur l'éthique et la stratégie de l'IA.",
      "url": "https://trench-tech.fr/"
    },
    {
      "id": "r12",
      "category": "PODCAST",
      "title": "L'IA aujourd'hui",
      "author": "Le Monde",
      "summary": "Quotidien audio du Monde sur l'actualité IA, en français, format court.",
      "url": "https://www.lemonde.fr/podcasts/"
    },
    {
      "id": "r13",
      "category": "PODCAST",
      "title": "Génération Do It Yourself",
      "author": "Matthieu Stéfani",
      "summary": "Interviews longues d'entrepreneurs français, plusieurs épisodes consacrés à l'IA.",
      "url": "https://www.gdiy.fr/"
    },
    {
      "id": "r14",
      "category": "NEWSLETTER",
      "title": "Le Tech Report",
      "author": "Stéphane Tissot",
      "summary": "Newsletter française hebdo sur la tech et l'IA, ton accessible et structuré.",
      "url": "https://letechreport.substack.com/"
    },
    {
      "id": "r15",
      "category": "NEWSLETTER",
      "title": "Olivier Ezratty — Opinions Libres",
      "author": "Olivier Ezratty",
      "summary": "Analyses approfondies en français par un expert reconnu de l'écosystème IA français.",
      "url": "https://www.oezratty.net/wordpress/"
    },
    {
      "id": "r16",
      "category": "OUTIL",
      "title": "Hugging Face France",
      "author": "Hugging Face",
      "summary": "La plateforme open-source mondiale, avec une forte communauté française.",
      "url": "https://huggingface.co"
    },
    {
      "id": "r17",
      "category": "YOUTUBE",
      "title": "Shubham Sharma",
      "author": "Shubham Sharma",
      "summary": "Chaîne tech avec démonstrations pratiques d'outils IA, tutos no-code et workflows IA appliqués.",
      "url": "https://www.youtube.com/@Shubham_Sharma"
    },
    {
      "id": "r18",
      "category": "YOUTUBE",
      "title": "Renaud Dekode",
      "author": "Renaud Dekode",
      "summary": "Décryptage clair des outils IA et tutos en français : prompt engineering, automatisations et productivité.",
      "url": "https://www.youtube.com/@RenaudDekode"
    }
  ],
  "GLOSSARY": [
    {
      "term": "Prompt",
      "emoji": "💬",
      "short": "Le texte que tu envoies à une IA pour lui donner ta consigne.",
      "long": "Plus ton prompt est précis (rôle, objectif, format, contraintes), meilleure sera la réponse.",
      "example": "« Tu es un coach sportif. Donne-moi un programme de musculation pour débutant, 3 séances/semaine, sans matériel. »"
    },
    {
      "term": "Token",
      "emoji": "🔢",
      "short": "Un morceau de mot (souvent 4 caractères) que l'IA lit ou écrit.",
      "long": "100 tokens ≈ 75 mots. Les modèles facturent au token et ont une limite par requête.",
      "example": "« Bonjour le monde » = 4 tokens environ."
    },
    {
      "term": "LLM (Large Language Model)",
      "emoji": "🧠",
      "short": "Un modèle de langage entraîné sur des milliards de textes.",
      "long": "ChatGPT, Claude, Gemini, Mistral, Llama, DeepSeek sont tous des LLM. Ils prédisent le mot suivant.",
      "example": "« Le ciel est… » → un LLM prédit « bleu » avec forte probabilité."
    },
    {
      "term": "Hallucination",
      "emoji": "👻",
      "short": "Quand l'IA invente une réponse fausse mais convaincante.",
      "long": "Vérifie toujours les chiffres, dates, noms et citations donnés par une IA — elle peut s'inventer des sources.",
      "example": "Une IA peut citer un livre qui n'existe pas."
    },
    {
      "term": "Contexte",
      "emoji": "📏",
      "short": "La quantité de texte que l'IA peut « lire » d'un coup.",
      "long": "Mesuré en tokens. Un contexte 200k = un livre entier d'un coup.",
      "example": "Claude Sonnet 4 a 200k tokens, Kimi K2 a 2M tokens."
    },
    {
      "term": "Fine-tuning",
      "emoji": "🎯",
      "short": "Ré-entraîner une IA sur tes propres données pour la spécialiser.",
      "long": "Plus précis qu'un prompt mais plus coûteux. Utile pour des tâches répétitives métier.",
      "example": "Un cabinet d'avocats fine-tune un Mistral sur ses contrats types."
    },
    {
      "term": "RAG",
      "emoji": "📚",
      "short": "Quand l'IA cherche dans tes documents avant de répondre.",
      "long": "Retrieval-Augmented Generation. L'IA combine sa connaissance générale avec tes documents privés.",
      "example": "Une FAQ d'entreprise branchée sur Claude qui répond avec les bons documents internes."
    },
    {
      "term": "Open-weight / Open-source",
      "emoji": "🔓",
      "short": "Modèle dont les poids sont publics et téléchargeables.",
      "long": "Tu peux faire tourner un Llama, Mistral ou DeepSeek sur ton propre serveur, gratuitement.",
      "example": "Llama 4, Mixtral 8x22B, DeepSeek R1 sont open-weight."
    },
    {
      "term": "Multimodal",
      "emoji": "🎨",
      "short": "Une IA qui comprend texte + image + audio + vidéo.",
      "long": "Au lieu d'avoir 4 IA distinctes, tu en as une seule qui mélange tout.",
      "example": "Gemini 2.5 Pro analyse un PDF avec des graphiques + écoute un audio."
    },
    {
      "term": "Agent",
      "emoji": "🤖",
      "short": "Une IA qui agit toute seule sur des tâches en plusieurs étapes.",
      "long": "Au lieu d'une seule réponse, l'agent enchaîne réflexion → action → vérification, en boucle.",
      "example": "Devin code, débogue et déploie une app tout seul."
    },
    {
      "term": "API",
      "emoji": "🔌",
      "short": "Une porte d'entrée technique pour brancher une IA dans un programme.",
      "long": "Au lieu d'utiliser le site, tu intègres l'IA dans ton app/site/automation via du code.",
      "example": "Une appli météo branchée sur l'API GPT pour répondre à des questions."
    },
    {
      "term": "Chatbot",
      "emoji": "💭",
      "short": "Un programme qui discute en langage naturel.",
      "long": "ChatGPT, Claude, Le Chat sont des chatbots construits sur un LLM.",
      "example": "Le Chat de Mistral est un chatbot français."
    },
    {
      "term": "Inférence",
      "emoji": "⚡",
      "short": "Le moment où l'IA calcule sa réponse à ton prompt.",
      "long": "Plus l'inférence est rapide, plus la réponse arrive vite. Mesuré en tokens/seconde.",
      "example": "Groq fait l'inférence à 500 tokens/seconde."
    },
    {
      "term": "Température",
      "emoji": "🌡️",
      "short": "Un réglage entre 0 et 1 qui contrôle la créativité.",
      "long": "0 = répétitif et factuel. 1 = créatif et varié. 0.7 par défaut généralement.",
      "example": "Pour un rapport juridique, mets 0.2. Pour une fiction, mets 0.9."
    },
    {
      "term": "Embedding",
      "emoji": "📍",
      "short": "Une représentation numérique d'un texte pour le comparer à d'autres.",
      "long": "Permet la recherche sémantique : « grippe » et « rhume » sont proches dans l'espace vectoriel.",
      "example": "Une base de connaissances qui retrouve la bonne réponse même si tu utilises un synonyme."
    },
    {
      "term": "Rate limit",
      "emoji": "🚦",
      "short": "La limite du nombre de requêtes par minute autorisé.",
      "long": "Protège les serveurs contre l'abus. ChatGPT Free a une limite, Plus en a une plus haute.",
      "example": "Erreur « Too Many Requests » = tu dépasses le rate limit."
    },
    {
      "term": "Jailbreak",
      "emoji": "🔓",
      "short": "Astuce pour faire dire à l'IA ce qu'elle a normalement interdiction de dire.",
      "long": "Les éditeurs corrigent ces brèches en continu. Utiliser un jailbreak peut violer les CGU.",
      "example": "« Joue le rôle de... » est un classique mais souvent bloqué."
    },
    {
      "term": "Tool use / Function calling",
      "emoji": "🛠️",
      "short": "Quand l'IA peut appeler des outils externes (calculatrice, recherche, météo).",
      "long": "Elle décide elle-même quel outil utiliser et quand. Permet des chatbots vraiment utiles.",
      "example": "Tu demandes « quelle météo à Paris ? » → l'IA appelle une API météo."
    },
    {
      "term": "Vision",
      "emoji": "👀",
      "short": "Capacité d'une IA à comprendre des images.",
      "long": "Tu lui montres une photo, un schéma, un graphique — elle l'analyse en langage naturel.",
      "example": "Claude lit le graphique d'un PDF financier et le résume."
    },
    {
      "term": "Reasoning model",
      "emoji": "🤔",
      "short": "Un modèle qui « réfléchit avant de répondre » en plusieurs étapes.",
      "long": "Plus lent mais beaucoup plus juste sur les maths, le code et la logique.",
      "example": "o3, DeepSeek R1, Kimi K2 sont des reasoning models."
    },
    {
      "term": "Open AI vs OpenAI",
      "emoji": "🏢",
      "short": "« Open AI » (avec espace) = IA ouverte. « OpenAI » = la boîte derrière ChatGPT.",
      "long": "OpenAI n'est plus tellement « open » : ses modèles GPT-5.5 ne sont pas open-source.",
      "example": "Llama 4 est de l'Open AI. GPT-5.5 ne l'est pas, malgré le nom OpenAI."
    },
    {
      "term": "Knowledge cutoff",
      "emoji": "📅",
      "short": "La date après laquelle l'IA n'a plus de données fraîches.",
      "long": "Au-delà, elle ne connaît pas les événements récents — sauf si elle peut faire une recherche web.",
      "example": "Si le cutoff est mai 2025, l'IA ne sait rien de février 2026 sans recherche."
    },
    {
      "term": "Latence",
      "emoji": "⏱️",
      "short": "Le temps entre ta requête et le début de la réponse.",
      "long": "Critique pour les voicebots ou apps temps-réel. Cartesia ou Groq sont les rois de la latence.",
      "example": "Une latence de 2 secondes est trop pour un appel téléphonique."
    },
    {
      "term": "Modèle de fondation",
      "emoji": "🏗️",
      "short": "Un grand modèle pré-entraîné qui sert de base à plein d'applications.",
      "long": "GPT-5.5, Claude Sonnet 4, Gemini 2.5 sont des modèles de fondation. Coûtent des centaines de millions à entraîner.",
      "example": "Les startups construisent leurs apps sur des modèles de fondation."
    },
    {
      "term": "Souveraineté IA",
      "emoji": "🇪🇺",
      "short": "Capacité à utiliser des IA dont les données restent en Europe.",
      "long": "Important pour le RGPD, les données sensibles et la commande publique.",
      "example": "Mistral et Le Chat hébergent en France/UE par défaut."
    },
    {
      "term": "MoE (Mixture of Experts)",
      "emoji": "👥",
      "short": "Une architecture où plusieurs sous-modèles experts se partagent le travail.",
      "long": "Plus efficace : seuls les experts pertinents sont activés à chaque requête.",
      "example": "Mixtral 8x22B est un MoE avec 8 experts de 22 milliards de paramètres."
    },
    {
      "term": "Distillation",
      "emoji": "💧",
      "short": "Compresser un gros modèle en un petit modèle plus rapide.",
      "long": "Le petit modèle apprend à imiter le gros. Garde 90% de la qualité avec 10x moins de coût.",
      "example": "Phi-4 est issu d'une distillation de modèles plus gros."
    },
    {
      "term": "Self-host",
      "emoji": "🏠",
      "short": "Faire tourner une IA sur ton propre serveur ou ordinateur.",
      "long": "Te garde le contrôle des données mais demande compétences techniques + GPU.",
      "example": "Tu peux self-host Mistral 7B sur un Mac M2 avec Ollama."
    },
    {
      "term": "Watermarking",
      "emoji": "🏷️",
      "short": "Tatouage invisible dans une image générée par IA.",
      "long": "Permet de détecter qu'une image a été générée. SynthID de Google en est un exemple.",
      "example": "Les images Imagen 3 portent un watermark SynthID invisible."
    },
    {
      "term": "Garde-fous (guardrails)",
      "emoji": "🛑",
      "short": "Règles qui empêchent une IA de produire du contenu problématique.",
      "long": "Bloque les contenus illégaux, dangereux ou violents. Plus ou moins stricts selon les éditeurs.",
      "example": "Claude refuse de donner des recettes d'armes — c'est un guardrail."
    }
  ],
  "FAQ": [
    {
      "q": "Est-ce que l'IA utilise mes conversations pour s'entraîner ?",
      "a": "Ça dépend. ChatGPT Free et Gemini Free utilisent par défaut tes conversations sauf désactivation manuelle. ChatGPT Plus, Claude (toutes versions), Mistral Le Chat et l'API entreprise n'utilisent PAS tes données par défaut. Vérifie toujours les paramètres « Data controls »."
    },
    {
      "q": "Peut-on utiliser l'IA pour ses devoirs ?",
      "a": "Pour comprendre, oui (excellent prof particulier). Pour tricher, non — la plupart des établissements détectent l'IA et c'est plagiaire. Le bon usage : explique-moi, pose-moi des questions de révision, corrige ma rédaction."
    },
    {
      "q": "Comment savoir si une IA me ment (hallucine) ?",
      "a": "Vérifie toujours : 1) les chiffres récents 2) les noms et dates 3) les citations et URL. Demande à l'IA de citer ses sources et de mettre un niveau de confiance. Croise avec une recherche Google manuelle."
    },
    {
      "q": "Mes données sortent-elles de l'Europe ?",
      "a": "Pour ChatGPT, Claude et Gemini : oui, vers les États-Unis. Pour Mistral Le Chat, des Pleias et Lucie de France : non, hébergées en UE. Pour les autres, regarde le score « Confidentialité » dans la fiche outil."
    },
    {
      "q": "Combien ça coûte vraiment au mois si je veux le top ?",
      "a": "Pour un usage perso confortable : 20€ pour ChatGPT Plus OU Claude Pro OU Mistral Pro (suffit pour 95% des gens). Si tu cumules : ChatGPT (20€) + Midjourney (10€) + ElevenLabs (5€) = 35€/mois. Le Calculateur dans IA Match te donne le total selon tes choix."
    },
    {
      "q": "Une IA peut-elle me remplacer dans mon métier ?",
      "a": "Pas remplacer mais transformer. Selon McKinsey, 60-70% des tâches sont partiellement automatisables. La règle : ceux qui maîtrisent l'IA remplacent ceux qui ne la maîtrisent pas, dans le même métier."
    },
    {
      "q": "Faut-il apprendre à coder pour utiliser l'IA ?",
      "a": "Non. ChatGPT, Claude, Mistral Le Chat, Midjourney s'utilisent sans une ligne de code. Coder devient utile pour brancher l'IA dans des automatisations (Make, n8n, Zapier) ou créer ton propre chatbot."
    },
    {
      "q": "Pourquoi y a-t-il autant d'IA différentes ?",
      "a": "Chaque IA a une force spécifique : raisonnement (o3, R1), code (Cursor, Claude), image (Midjourney, Nano Banana), vidéo (Veo, Sora), francophone (Mistral). Notre Catalogue les classe par spécialité avec des notes par catégorie distinctes du score général."
    },
    {
      "q": "Mon contenu généré par IA m'appartient-il ?",
      "a": "Oui sur ChatGPT, Claude, Gemini, Mistral (commercial usage autorisé). Vérifie pour Midjourney (CGU précisent les conditions). Aux États-Unis, le Copyright Office refuse le copyright sur du purement IA-généré sans intervention humaine."
    },
    {
      "q": "Comment écrire un bon prompt en 30 secondes ?",
      "a": "Méthode RACE : Rôle (« Tu es expert en... »), Action (« Rédige... »), Contexte (« Pour... à propos de... »), Exigences (« 200 mots, ton sobre, 3 puces »). Tu copies cette structure dans le Builder d'IA Match."
    },
    {
      "q": "Existe-t-il des IA gratuites qui valent les payantes ?",
      "a": "Oui ! Mistral Le Chat (gratuit), Claude Free, ChatGPT Free, Gemini Free, DeepSeek (open-weight) couvrent 80% des besoins. Les payantes apportent contexte plus long, réponses plus nuancées et fonctions multimodales avancées."
    },
    {
      "q": "L'IA a-t-elle une conscience ?",
      "a": "Non. Une IA n'a ni conscience, ni émotions, ni opinions personnelles. Elle prédit le mot suivant le plus probable. Quand elle dit « je pense que... », c'est de la mise en forme de probabilités statistiques."
    },
    {
      "q": "Et l'environnement dans tout ça ?",
      "a": "Une requête ChatGPT consomme ~3 Wh (vs 0,3 Wh pour une recherche Google). Un entraînement complet de GPT-5.5 = 1000 foyers/an. Les modèles plus petits (Phi, Mistral 7B) sont 100x plus économes pour des tâches simples."
    },
    {
      "q": "Que faire si une IA refuse de répondre à ma question ?",
      "a": "Reformule. Précise le contexte (recherche académique, fiction, journalisme). Si vraiment légitime et bloqué, essaye une autre IA — Mistral et Claude ont des seuils différents. Ne tente pas de jailbreak, c'est contre les CGU."
    },
    {
      "q": "Est-ce que je peux faire confiance à IA Match ?",
      "a": "On est transparent : nos notes sont mises à jour chaque semaine à partir de benchmarks publics (LMSys Arena, MMLU, HumanEval) + tests internes. Le score est différent du score par spécialité (visible sur chaque fiche). Pas de pub déguisée, pas d'affiliation cachée."
    }
  ],
  "USE_CASES": [
    {
      "id": "uc-cv",
      "icon": "📄",
      "title": "Rédiger un CV percutant",
      "summary": "Transforme ton expérience en un CV moderne, ATS-friendly, en 5 minutes.",
      "tools": [
        "claude",
        "mistral",
        "chatgpt"
      ],
      "tip": "Demande à l'IA de proposer 3 versions (sobre, créative, anglo-saxonne) puis garde la meilleure."
    },
    {
      "id": "uc-logo",
      "icon": "🎨",
      "title": "Créer un logo pour mon projet",
      "summary": "Visuel pro, plusieurs styles, transparence et HD.",
      "tools": [
        "midjourney",
        "nano-banana",
        "ideogram"
      ],
      "tip": "Précise « logo vectoriel, fond transparent, style minimaliste » pour de meilleurs résultats."
    },
    {
      "id": "uc-pdf",
      "icon": "📑",
      "title": "Résumer un PDF de 50 pages",
      "summary": "Extraire les idées clés, le sommaire, les chiffres marquants.",
      "tools": [
        "claude",
        "gemini-25",
        "mistral"
      ],
      "tip": "Claude (200k contexte) ou Gemini 2.5 Pro (1M) avalent un livre entier d'un coup."
    },
    {
      "id": "uc-anglais",
      "icon": "🇬🇧",
      "title": "Apprendre l'anglais avec un coach IA",
      "summary": "Conversation, correction de prononciation, exercices personnalisés.",
      "tools": [
        "claude",
        "chatgpt",
        "elevenlabs"
      ],
      "tip": "Active le mode vocal de ChatGPT ou Claude pour pratiquer à l'oral 10 min/jour."
    },
    {
      "id": "uc-site",
      "icon": "🌐",
      "title": "Construire un site web sans coder",
      "summary": "De l'idée à la mise en ligne en quelques heures.",
      "tools": [
        "lovable",
        "v0",
        "bolt"
      ],
      "tip": "Décris en français ce que tu veux. L'IA génère React + Tailwind + déploiement."
    },
    {
      "id": "uc-pres",
      "icon": "🎤",
      "title": "Préparer une présentation pro",
      "summary": "Slides + script + visuels + animation.",
      "tools": [
        "gamma",
        "tome",
        "midjourney"
      ],
      "tip": "Gamma génère 10 slides à partir d'un brief. Midjourney crée les visuels d'illustration."
    },
    {
      "id": "uc-video",
      "icon": "🎬",
      "title": "Faire une vidéo de présentation produit",
      "summary": "Avatar parlant, voix française, sous-titres auto.",
      "tools": [
        "heygen",
        "synthesia",
        "elevenlabs"
      ],
      "tip": "HeyGen pour un avatar français, ElevenLabs pour la voix-off, montage 5 min."
    },
    {
      "id": "uc-musique",
      "icon": "🎵",
      "title": "Composer une musique d'ambiance",
      "summary": "Pour un podcast, une vidéo YouTube, un projet perso.",
      "tools": [
        "suno",
        "udio",
        "stable-audio"
      ],
      "tip": "Précise le tempo, l'ambiance (cinématique, lo-fi, jazz) et la durée."
    },
    {
      "id": "uc-recherche",
      "icon": "🔬",
      "title": "Faire une recherche académique",
      "summary": "Trouver des papers, synthétiser, citer correctement.",
      "tools": [
        "perplexity",
        "consensus",
        "elicit"
      ],
      "tip": "Perplexity pour la veille, Consensus pour le « est-ce prouvé scientifiquement ? »."
    },
    {
      "id": "uc-email",
      "icon": "✉️",
      "title": "Répondre à des emails plus vite",
      "summary": "Brouillons polis et adaptés au ton de l'expéditeur.",
      "tools": [
        "mistral",
        "claude",
        "gemini-workspace"
      ],
      "tip": "Garde un template « réponse pro / casual / refus diplomate » dans tes favoris."
    },
    {
      "id": "uc-coder",
      "icon": "💻",
      "title": "Coder une appli mobile sans tout savoir",
      "summary": "Du prototype au produit fini en une semaine.",
      "tools": [
        "cursor",
        "claude",
        "lovable"
      ],
      "tip": "Cursor pour l'IDE, Claude pour les architectures, Lovable pour bootstrapper rapide."
    },
    {
      "id": "uc-data",
      "icon": "📊",
      "title": "Analyser un fichier Excel volumineux",
      "summary": "Tableaux croisés, graphiques, insights, sans formules.",
      "tools": [
        "claude",
        "julius",
        "hex"
      ],
      "tip": "Drop ton CSV dans Claude — il fait l'analyse + génère le code Python pour rejouer."
    }
  ],
  "PERSONAS": [
    {
      "id": "etudiant",
      "label": "Étudiant",
      "emoji": "🎓",
      "summary": "Réviser, structurer, rédiger sans tricher.",
      "tools": [
        "claude",
        "perplexity",
        "consensus",
        "mistral",
        "elevenlabs"
      ],
      "tips": [
        "Mistral Le Chat est gratuit, francophone, hébergé en UE — parfait pour les mémoires.",
        "Perplexity pour la veille et les sources citées.",
        "ElevenLabs pour transformer un cours en audio à écouter en bus."
      ]
    },
    {
      "id": "freelance",
      "label": "Freelance",
      "emoji": "💼",
      "summary": "Productivité, devis, client, livrables.",
      "tools": [
        "claude",
        "midjourney",
        "lovable",
        "elevenlabs",
        "notion-ai"
      ],
      "tips": [
        "Claude Pro pour rédiger devis et propositions.",
        "Lovable pour prototyper rapidement les sites de tes clients.",
        "Notion AI pour ta base de connaissances projets."
      ]
    },
    {
      "id": "entrepreneur",
      "label": "Entrepreneur",
      "emoji": "🚀",
      "summary": "Idéation, validation, marketing, automatisation.",
      "tools": [
        "claude",
        "perplexity",
        "midjourney",
        "make",
        "synthesia"
      ],
      "tips": [
        "Perplexity pour étudier le marché concurrentiel.",
        "Make pour automatiser tes workflows sans code.",
        "Synthesia pour des vidéos pitch en 30+ langues."
      ]
    },
    {
      "id": "parent",
      "label": "Parent",
      "emoji": "👪",
      "summary": "Aider aux devoirs, cuisine, organisation famille.",
      "tools": [
        "mistral",
        "claude",
        "midjourney",
        "elevenlabs"
      ],
      "tips": [
        "Mistral Le Chat (gratuit, FR) pour les devoirs, propose les questions, pas les réponses.",
        "Midjourney pour créer des illustrations d'histoires personnalisées.",
        "ElevenLabs pour transformer un livre en audio pour les enfants."
      ]
    },
    {
      "id": "senior",
      "label": "Senior",
      "emoji": "🌳",
      "summary": "Apprendre, écrire, organiser sans frustration technique.",
      "tools": [
        "claude",
        "mistral",
        "chatgpt"
      ],
      "tips": [
        "Claude est le plus patient et explique avec calme.",
        "Mistral Le Chat est francophone par défaut, sans pub.",
        "Pose tes questions normalement, comme à un humain."
      ]
    },
    {
      "id": "createur",
      "label": "Créateur de contenu",
      "emoji": "🎬",
      "summary": "YouTube, podcast, réseaux sociaux à grande échelle.",
      "tools": [
        "claude",
        "elevenlabs",
        "midjourney",
        "runway",
        "suno"
      ],
      "tips": [
        "Claude pour scripts et structure narrative.",
        "ElevenLabs pour ta voix synthétique de secours.",
        "Runway/Sora pour des transitions et b-roll IA."
      ]
    }
  ],
  "QUIZ": [
    {
      "id": "q1",
      "question": "As-tu déjà utilisé une IA comme ChatGPT, Claude ou Le Chat ?",
      "options": [
        {
          "label": "Jamais",
          "score": 0
        },
        {
          "label": "Quelques fois",
          "score": 1
        },
        {
          "label": "Régulièrement",
          "score": 2
        },
        {
          "label": "Tous les jours",
          "score": 3
        }
      ]
    },
    {
      "id": "q2",
      "question": "Sais-tu ce qu'est un prompt ?",
      "options": [
        {
          "label": "Pas du tout",
          "score": 0
        },
        {
          "label": "Vaguement",
          "score": 1
        },
        {
          "label": "Oui, je sais en écrire de simples",
          "score": 2
        },
        {
          "label": "Oui, je structure mes prompts (rôle, contexte, format)",
          "score": 3
        }
      ]
    },
    {
      "id": "q3",
      "question": "As-tu déjà payé un abonnement IA ?",
      "options": [
        {
          "label": "Non, jamais",
          "score": 0
        },
        {
          "label": "Une période courte",
          "score": 1
        },
        {
          "label": "Oui, abonné actuellement",
          "score": 2
        },
        {
          "label": "Plusieurs en parallèle",
          "score": 3
        }
      ]
    },
    {
      "id": "q4",
      "question": "Connais-tu la différence entre un LLM et un agent ?",
      "options": [
        {
          "label": "Aucune idée",
          "score": 0
        },
        {
          "label": "Vaguement",
          "score": 1
        },
        {
          "label": "Oui",
          "score": 2
        },
        {
          "label": "J'ai déjà construit un agent",
          "score": 3
        }
      ]
    },
    {
      "id": "q5",
      "question": "Sais-tu ce qu'est une hallucination ?",
      "options": [
        {
          "label": "Non",
          "score": 0
        },
        {
          "label": "Oui mais pas concrètement",
          "score": 1
        },
        {
          "label": "Oui, je vérifie ce que dit l'IA",
          "score": 2
        },
        {
          "label": "Oui, je sais comment la limiter",
          "score": 3
        }
      ]
    },
    {
      "id": "q6",
      "question": "As-tu déjà utilisé une IA générative d'image ?",
      "options": [
        {
          "label": "Jamais",
          "score": 0
        },
        {
          "label": "Une ou deux fois",
          "score": 1
        },
        {
          "label": "Régulièrement",
          "score": 2
        },
        {
          "label": "Je maîtrise plusieurs (Midjourney, Flux...)",
          "score": 3
        }
      ]
    },
    {
      "id": "q7",
      "question": "As-tu déjà utilisé l'API d'une IA en code ?",
      "options": [
        {
          "label": "Non, je ne code pas",
          "score": 0
        },
        {
          "label": "Non mais ça m'intéresse",
          "score": 1
        },
        {
          "label": "Quelques essais",
          "score": 2
        },
        {
          "label": "Oui, en production",
          "score": 3
        }
      ]
    },
    {
      "id": "q8",
      "question": "Connais-tu la souveraineté IA et les modèles européens ?",
      "options": [
        {
          "label": "Pas du tout",
          "score": 0
        },
        {
          "label": "Vaguement",
          "score": 1
        },
        {
          "label": "Oui, je préfère les modèles européens quand possible",
          "score": 2
        },
        {
          "label": "Oui, c'est un critère majeur",
          "score": 3
        }
      ]
    }
  ]
} as const;
