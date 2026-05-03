"""Curated semi-live editorial base for IA Match.

The goal is not to scrape hype in real time. IA Match publishes a stable decision layer:
official/widely-recognized sources + categories + impact + action advice.
Dynamic LLM/news refreshes may be merged only as secondary items.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict, List

EDITORIAL_CATEGORIES = [
    {"slug": "modeles", "label": "Modèles", "description": "Nouveaux modèles, capacités, limites et choix entre généralistes."},
    {"slug": "outils", "label": "Outils", "description": "Applications IA concrètes à tester ou éviter selon l’usage."},
    {"slug": "image-video", "label": "Image & vidéo", "description": "Création visuelle, vidéo générative, design et production."},
    {"slug": "code-agents", "label": "Code & agents", "description": "Assistants développeurs, agents, automatisations et workflows."},
    {"slug": "business-prix", "label": "Business / prix", "description": "Plans, budgets, quotas, arbitrages gratuit vs premium."},
    {"slug": "open-local", "label": "Open-source & local", "description": "Modèles ouverts, IA locale, confidentialité et souveraineté."},
    {"slug": "confiance", "label": "Confiance", "description": "Sources, régulation, données, sécurité et vérification."},
    {"slug": "debutants", "label": "Débutants", "description": "Repères pédagogiques pour savoir quoi essayer sans jargon."},
]

EDITORIAL_SOURCES = [
    {"id": "openai-docs", "name": "OpenAI Docs", "url": "https://platform.openai.com/docs", "type": "officiel"},
    {"id": "anthropic-docs", "name": "Anthropic Docs", "url": "https://docs.anthropic.com/", "type": "officiel"},
    {"id": "google-ai-docs", "name": "Google AI for Developers", "url": "https://ai.google.dev/", "type": "officiel"},
    {"id": "mistral-docs", "name": "Mistral AI Docs", "url": "https://docs.mistral.ai/", "type": "officiel"},
    {"id": "meta-llama", "name": "Meta Llama", "url": "https://llama.meta.com/", "type": "officiel"},
    {"id": "ollama", "name": "Ollama", "url": "https://ollama.com/", "type": "outil"},
    {"id": "cursor", "name": "Cursor", "url": "https://cursor.com/", "type": "outil"},
    {"id": "perplexity", "name": "Perplexity", "url": "https://www.perplexity.ai/", "type": "outil"},
    {"id": "eu-ai-act", "name": "EU AI Act", "url": "https://artificialintelligenceact.eu/", "type": "régulation"},
]

CURATED_EDITORIAL_ARTICLES: List[Dict] = [
    {
        "id": "ed-modeles-generalistes-2026",
        "category": "MODÈLES",
        "editorialCategory": "modeles",
        "title": "Les assistants généralistes restent le meilleur point de départ",
        "summary": "ChatGPT, Claude, Gemini et Mistral couvrent maintenant assez de besoins pour éviter de multiplier les apps dès le départ.",
        "intro": "La meilleure décision pour la majorité des utilisateurs n’est pas de courir après le dernier modèle : c’est de choisir un assistant fiable, puis d’ajouter un outil spécialisé quand le besoin devient clair.",
        "body": "## Pourquoi c’est important\n\nLes assistants généralistes sont devenus le socle de beaucoup d’usages : écrire, résumer, analyser, coder un petit script, préparer un plan, expliquer un sujet ou transformer un document. Pour un débutant, commencer par un outil généraliste évite de se perdre dans une collection d’applications spécialisées.\n\n## La règle IA Match\n\nChoisis d’abord selon ton usage dominant : rédaction et documents longs, recherche sourcée, écosystème Google, code, confidentialité ou budget. Ensuite seulement, ajoute Midjourney, Canva, Perplexity, Cursor, Runway, Suno ou Ollama si ton besoin devient spécifique.\n\n## À vérifier avant de payer\n\nRegarde les limites du plan gratuit, la qualité en français, la gestion des fichiers, les connecteurs disponibles et les règles de confidentialité. Les prix et quotas changent souvent : l’app doit donc guider vers une décision, pas prétendre figer le marché.",
        "publishedAt": "2026-05-02",
        "readMinutes": 4,
        "tag": "Choix outil",
        "highlight": "Commencer simple bat souvent la chasse au modèle parfait.",
        "author": "IA Match · Rédaction",
        "impactLevel": "fort",
        "impactLabel": "Impact fort",
        "confidence": "haute",
        "verificationStatus": "curated_official_sources",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": ["openai-docs", "anthropic-docs", "google-ai-docs", "mistral-docs"],
        "toolSlugs": ["chatgpt", "claude", "gemini", "mistral"],
        "radarStatus": "À tester maintenant",
        "decisionHint": "Si tu débutes, choisis un assistant généraliste puis fais un Match seulement quand ton usage devient précis.",
        "action": "Lancer un Match avec ton besoin réel avant de choisir un abonnement.",
        "tags": ["débutants", "texte", "productivité", "modèles"],
    },
    {
        "id": "ed-recherche-sourcee",
        "category": "OUTILS",
        "editorialCategory": "outils",
        "title": "Recherche sourcée : Perplexity devient un réflexe, mais pas une vérité absolue",
        "summary": "Les moteurs de réponse font gagner du temps, à condition de lire les sources et de garder un assistant pour synthétiser.",
        "intro": "Pour chercher vite, la bonne stack n’est pas toujours un seul outil : moteur de réponse pour trouver, assistant généraliste pour transformer, humain pour vérifier.",
        "body": "## Le bon usage\n\nPerplexity et les recherches intégrées aux grands assistants rendent la veille beaucoup plus rapide. Le risque : confondre une réponse bien formulée avec une information validée. IA Match doit donc pousser l’utilisateur à vérifier les liens, dates et sources primaires.\n\n## Workflow recommandé\n\n1. Cherche les informations avec un outil orienté sources.\n2. Garde les liens importants.\n3. Demande ensuite à ChatGPT, Claude ou Gemini de produire un brief avec citations.\n4. Vérifie les chiffres sensibles dans les sources officielles.\n\n## Signal premium\n\nUne app utile ne dit pas seulement “utilise Perplexity”. Elle dit quand l’utiliser, quand repasser sur un assistant généraliste et quand ne pas faire confiance au résumé.",
        "publishedAt": "2026-05-02",
        "readMinutes": 3,
        "tag": "Recherche",
        "highlight": "Chercher plus vite ne remplace pas vérifier mieux.",
        "author": "IA Match · Rédaction",
        "impactLevel": "moyen",
        "impactLabel": "Workflow utile",
        "confidence": "haute",
        "verificationStatus": "curated_official_sources",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": ["perplexity", "openai-docs", "anthropic-docs"],
        "toolSlugs": ["perplexity", "chatgpt", "claude", "gemini"],
        "radarStatus": "À tester maintenant",
        "decisionHint": "Utilise la recherche sourcée pour trouver, puis un assistant pour structurer.",
        "action": "Tester un workflow recherche → brief → vérification.",
        "tags": ["recherche", "sources", "veille"],
    },
    {
        "id": "ed-code-agents-prudence",
        "category": "CODE & AGENTS",
        "editorialCategory": "code-agents",
        "title": "Agents de code : puissant, mais seulement avec tests et revue humaine",
        "summary": "Cursor, Copilot, Replit et les agents intégrés accélèrent le code, mais le vrai gain vient du workflow autour.",
        "intro": "Le bon agent de code n’est pas celui qui écrit le plus vite : c’est celui qui permet de vérifier, corriger et comprendre sans casser le projet.",
        "body": "## Ce qui change\n\nLes assistants de code savent modifier plusieurs fichiers, expliquer une erreur et proposer une architecture. Mais ils peuvent aussi introduire des régressions discrètes. Pour IA Match, la recommandation doit inclure le niveau de l’utilisateur, la taille du projet et la présence de tests.\n\n## Workflow propre\n\nAvant d’utiliser un agent, prépare une branche Git, un objectif court, des fichiers concernés et une commande de validation. Après génération, lis le diff, lance les tests, puis demande une revue ciblée.\n\n## À éviter\n\nNe donne pas à un agent un projet entier sans consigne précise. Ne valide pas une modification que tu ne peux pas expliquer. Pour les débutants, commencer par des petites tâches est plus rentable qu’un agent autonome complet.",
        "publishedAt": "2026-05-02",
        "readMinutes": 4,
        "tag": "Agents",
        "highlight": "Un agent sans tests est une accélération sans ceinture.",
        "author": "IA Match · Rédaction",
        "impactLevel": "fort",
        "impactLabel": "Workflow utile",
        "confidence": "haute",
        "verificationStatus": "curated_official_sources",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": ["cursor", "openai-docs", "anthropic-docs"],
        "toolSlugs": ["cursor", "github-copilot", "replit", "claude"],
        "radarStatus": "À surveiller",
        "decisionHint": "Bon pour projets structurés ; moins bon pour débuter sans comprendre le code.",
        "action": "Comparer les assistants de code puis ajouter une règle tests/revue.",
        "tags": ["code", "agents", "workflow"],
    },
    {
        "id": "ed-ia-locale-privee",
        "category": "OPEN-SOURCE",
        "editorialCategory": "open-local",
        "title": "IA locale : excellente pour la confidentialité, pas toujours pour la simplicité",
        "summary": "Ollama et les modèles ouverts rendent l’IA locale accessible, mais la qualité dépend du modèle, de la machine et du besoin.",
        "intro": "L’IA locale est un vrai plus pour apprendre, tester et garder des données sensibles hors du cloud. Mais elle n’est pas automatiquement meilleure qu’un assistant hébergé.",
        "body": "## Quand c’est pertinent\n\nL’IA locale est intéressante pour documents internes, expérimentation, confidentialité, coûts variables et apprentissage technique. Ollama simplifie beaucoup le lancement de modèles ouverts, mais il faut accepter des compromis : vitesse, mémoire machine, qualité selon modèle et absence de certains connecteurs.\n\n## Règle IA Match\n\nRecommande l’IA locale si la confidentialité ou le contrôle est prioritaire. Pour un usage débutant, rédaction quotidienne ou recherche web, un outil hébergé reste souvent plus ergonomique.\n\n## Action utile\n\nTester localement sur un cas simple : résumer un document non sensible ou générer un brouillon. Si le résultat demande trop de correction, repasser sur un assistant généraliste.",
        "publishedAt": "2026-05-02",
        "readMinutes": 3,
        "tag": "Local",
        "highlight": "Confidentialité oui ; magie automatique non.",
        "author": "IA Match · Rédaction",
        "impactLevel": "moyen",
        "impactLabel": "Alternative gratuite",
        "confidence": "haute",
        "verificationStatus": "curated_official_sources",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": ["ollama", "meta-llama", "mistral-docs"],
        "toolSlugs": ["ollama", "llama", "mistral", "qwen"],
        "radarStatus": "Bon si confidentialité",
        "decisionHint": "Choisis local si données sensibles ; choisis cloud si simplicité maximale.",
        "action": "Tester Ollama sur un cas simple avant de construire une stack locale.",
        "tags": ["local", "open-source", "confidentialité"],
    },
    {
        "id": "ed-image-production",
        "category": "IMAGE & VIDÉO",
        "editorialCategory": "image-video",
        "title": "Image IA : le vrai critère devient la production, pas seulement la beauté",
        "summary": "Midjourney, ChatGPT Image, Canva et Firefly ne servent pas au même moment du workflow créatif.",
        "intro": "Un beau visuel ne suffit pas. Pour une affiche, une pub, une miniature ou un post, il faut contrôler le texte, le format, les variantes et la retouche.",
        "body": "## Le bon découpage\n\nPour explorer une direction artistique, un outil créatif spécialisé peut être excellent. Pour produire vite un support publiable, Canva ou un éditeur orienté marque devient souvent plus utile. Pour modifier une image existante, choisis selon la précision de retouche et les droits d’usage.\n\n## Ce que IA Match doit expliquer\n\nL’utilisateur ne cherche pas “le meilleur modèle image”. Il cherche : créer une miniature YouTube, une publicité lisible, une affiche, une photo produit ou un concept artistique. La recommandation doit donc partir du livrable.\n\n## Action\n\nDéfinis le format final, le texte à afficher et le style. Ensuite seulement choisis l’outil.",
        "publishedAt": "2026-05-02",
        "readMinutes": 3,
        "tag": "Image",
        "highlight": "Le meilleur outil image dépend du livrable final.",
        "author": "IA Match · Rédaction",
        "impactLevel": "moyen",
        "impactLabel": "Utile débutants",
        "confidence": "moyenne",
        "verificationStatus": "curated_known_tools",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": ["openai-docs"],
        "toolSlugs": ["midjourney", "canva", "chatgpt", "adobe-firefly"],
        "radarStatus": "À tester maintenant",
        "decisionHint": "Image artistique, design de marque et retouche ne demandent pas le même outil.",
        "action": "Créer un prompt image à partir du format final.",
        "tags": ["image", "design", "canva", "midjourney"],
    },
    {
        "id": "ed-prix-plans",
        "category": "BUSINESS",
        "editorialCategory": "business-prix",
        "title": "Plans IA : le gratuit suffit souvent pour apprendre, pas toujours pour produire",
        "summary": "La bonne question n’est pas “quel plan est le meilleur ?”, mais “quelle limite va me bloquer ?”.",
        "intro": "Les abonnements IA se ressemblent en apparence, mais les limites changent : volume, modèles avancés, fichiers, images, vitesse, connecteurs et confidentialité.",
        "body": "## La grille simple\n\nGratuit : apprendre, tester, petites tâches. Pro : produire régulièrement, analyser des documents, gagner du temps. Team/Business : collaboration, sécurité, administration, données et contrôle.\n\n## Le piège\n\nPayer trop tôt peut créer une fausse impression de progrès. Si ton besoin est occasionnel, commence gratuit. Si tu répètes la même tâche chaque semaine, calcule le temps gagné.\n\n## Ce que IA Match doit faire\n\nAfficher “à éviter si…” et “plan gratuit suffisant si…” dans les fiches outils, plutôt que seulement un prix mensuel.",
        "publishedAt": "2026-05-02",
        "readMinutes": 3,
        "tag": "Prix",
        "highlight": "Le meilleur plan est celui qui supprime ta vraie limite.",
        "author": "IA Match · Rédaction",
        "impactLevel": "moyen",
        "impactLabel": "Change les prix",
        "confidence": "moyenne",
        "verificationStatus": "prices_change_check_official_site",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": ["openai-docs", "anthropic-docs", "google-ai-docs"],
        "toolSlugs": ["chatgpt", "claude", "gemini", "perplexity"],
        "radarStatus": "Pas urgent",
        "decisionHint": "Ne paie que si une limite claire te bloque.",
        "action": "Comparer gratuit vs premium selon ton volume réel.",
        "tags": ["prix", "abonnement", "gratuit"],
    },
    {
        "id": "ed-confiance-sources",
        "category": "CONFIANCE",
        "editorialCategory": "confiance",
        "title": "La confiance devient une fonctionnalité produit",
        "summary": "Sources, date de vérification, limites et avertissements doivent être visibles pour que l’utilisateur décide correctement.",
        "intro": "Une app IA premium ne doit pas seulement être jolie : elle doit montrer pourquoi une recommandation est fiable et où elle peut se tromper.",
        "body": "## Ce qui rend IA Match plus crédible\n\nChaque recommandation devrait afficher une logique simple : usage, budget, niveau, points forts, limites, fraîcheur des données et sources quand c’est possible. L’utilisateur doit comprendre la décision sans lire un rapport technique.\n\n## Le risque\n\nLes modèles, prix et quotas changent vite. Une app qui prétend tout savoir en live peut devenir moins fiable qu’une base curatée avec statut de vérification.\n\n## Action\n\nAjouter des badges : vérifié, à surveiller, prix à revérifier, source officielle, conseil IA Match. C’est plus premium qu’une liste brute.",
        "publishedAt": "2026-05-02",
        "readMinutes": 3,
        "tag": "Confiance",
        "highlight": "La transparence vaut mieux qu’une fausse certitude live.",
        "author": "IA Match · Rédaction",
        "impactLevel": "fort",
        "impactLabel": "Impact fort",
        "confidence": "haute",
        "verificationStatus": "editorial_methodology",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": ["eu-ai-act"],
        "toolSlugs": ["chatgpt", "claude", "gemini", "perplexity"],
        "radarStatus": "À intégrer partout",
        "decisionHint": "Montre les limites et la date de vérification, pas seulement un score.",
        "action": "Lire les badges de confiance avant de suivre une recommandation.",
        "tags": ["confiance", "sources", "régulation"],
    },
    {
        "id": "ed-automatisation-no-code",
        "category": "CODE & AGENTS",
        "editorialCategory": "code-agents",
        "title": "Automatisation no-code : commence par un workflow, pas par un agent autonome",
        "summary": "Make, Zapier et n8n restent souvent plus fiables qu’un agent libre pour les tâches répétitives simples.",
        "intro": "Beaucoup de gens veulent “un agent IA”. En pratique, un bon workflow no-code avec une étape IA contrôlée suffit souvent.",
        "body": "## La bonne séquence\n\nIdentifie une tâche répétée au moins trois fois. Décris l’entrée, la sortie, les exceptions et la validation humaine. Ensuite seulement, connecte un outil IA à Make, Zapier ou n8n.\n\n## Pourquoi c’est plus fiable\n\nUn workflow explicite est plus facile à débugger qu’un agent qui décide tout seul. Tu sais quelle étape a échoué, quelles données ont circulé et où ajouter une approbation.\n\n## Quand passer à l’agent\n\nQuand le workflow a trop de branches, demande des recherches, lit plusieurs sources ou doit prendre des décisions non triviales. Même là, garde un humain dans la boucle pour les actions sensibles.",
        "publishedAt": "2026-05-02",
        "readMinutes": 4,
        "tag": "No-code",
        "highlight": "Un workflow clair bat souvent un agent flou.",
        "author": "IA Match · Rédaction",
        "impactLevel": "moyen",
        "impactLabel": "Workflow utile",
        "confidence": "haute",
        "verificationStatus": "curated_known_tools",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": [],
        "toolSlugs": ["zapier", "make", "n8n", "chatgpt"],
        "radarStatus": "À tester maintenant",
        "decisionHint": "Automatise ce que tu sais déjà décrire étape par étape.",
        "action": "Créer une checklist entrée → action → validation avant d’automatiser.",
        "tags": ["automation", "agents", "no-code"],
    },
    {
        "id": "ed-debutants-premier-prompt",
        "category": "DÉBUTANTS",
        "editorialCategory": "debutants",
        "title": "Premier prompt : le bon réflexe est de décrire le résultat attendu",
        "summary": "Pour débuter, inutile d’apprendre tout le vocabulaire IA : rôle, objectif, contexte et format suffisent déjà.",
        "intro": "La plupart des mauvais résultats viennent d’une demande trop vague. IA Match doit aider à transformer une idée floue en demande testable.",
        "body": "## La formule simple\n\nDonne un rôle, explique ce que tu veux obtenir, ajoute le contexte utile et impose un format. Ce cadre suffit pour améliorer fortement les réponses.\n\n## Exemple\n\nAu lieu de “fais-moi un texte”, demande : “tu es un conseiller pédagogique, explique ce sujet à un débutant en 5 points avec un exemple”.\n\n## Action\n\nOuvre le Builder, génère une idée aléatoire puis remplace seulement le contexte par ton besoin réel.",
        "publishedAt": "2026-05-02",
        "readMinutes": 3,
        "tag": "Débutants",
        "highlight": "Un prompt clair bat un modèle cher mal briefé.",
        "author": "IA Match · Rédaction",
        "impactLevel": "moyen",
        "impactLabel": "Utile débutants",
        "confidence": "haute",
        "verificationStatus": "editorial_methodology",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": [],
        "toolSlugs": ["chatgpt", "claude", "gemini", "mistral"],
        "radarStatus": "À tester maintenant",
        "decisionHint": "Commence par améliorer la demande avant de changer d’outil.",
        "action": "Créer un prompt dans le Builder avec les 4 blocs essentiels.",
        "tags": ["débutants", "prompt", "builder"],
    },
    {
        "id": "ed-formateurs-kits-ia",
        "category": "BUSINESS",
        "editorialCategory": "business-prix",
        "title": "Formateurs : les kits IA valent plus qu’une simple liste d’outils",
        "summary": "Un bon support IA combine cas d’usage, prompts, exercices, risques et critères de correction.",
        "intro": "Pour vendre ou animer une formation IA, la valeur n’est pas la veille brute : c’est le parcours pédagogique prêt à utiliser.",
        "body": "## Ce qui fait la différence\n\nUn kit utile contient une explication simple, un prompt de départ, un exemple corrigé, un exercice et une règle de sécurité. Les apprenants comprennent mieux quand ils voient avant/après.\n\n## Signal business\n\nIA Match peut monétiser des diagnostics, supports de formation et stacks métier avant de construire un gros SaaS équipe.\n\n## Action\n\nTester une offre kit formateur avec 3 modules : débuter, prompter, vérifier.",
        "publishedAt": "2026-05-02",
        "readMinutes": 3,
        "tag": "Formation",
        "highlight": "La pédagogie vend mieux qu’un catalogue brut.",
        "author": "IA Match · Rédaction",
        "impactLevel": "moyen",
        "impactLabel": "Business utile",
        "confidence": "moyenne",
        "verificationStatus": "editorial_strategy",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": [],
        "toolSlugs": ["chatgpt", "claude", "canva", "notion"],
        "radarStatus": "À tester en offre",
        "decisionHint": "Vendre un résultat pédagogique, pas une base de données.",
        "action": "Préparer un mini kit formation avec prompts et exercices.",
        "tags": ["business", "formation", "academy"],
    },
    {
        "id": "ed-comparer-outils-sans-tableau",
        "category": "OUTILS",
        "editorialCategory": "outils",
        "title": "Comparer des IA : les cartes lisibles gagnent sur les tableaux géants",
        "summary": "Sur mobile, un bon comparatif doit montrer meilleur choix, alternative gratuite, limite et action suivante.",
        "intro": "Les comparaisons IA deviennent vite illisibles si elles empilent scores, prix, modèles et catégories. IA Match doit condenser la décision.",
        "body": "## Le format efficace\n\nPour chaque usage, montre : meilleur choix, pourquoi, prix/limite, à éviter si, et prompt de test. Le détail peut exister, mais pas bloquer la lecture.\n\n## Sur mobile\n\nPrivilégie des cartes empilées, filtres horizontaux et explications courtes plutôt qu’un grand tableau.\n\n## Action\n\nQuand tu compares deux outils, décide d’abord le critère principal : budget, qualité, vitesse, sources ou confidentialité.",
        "publishedAt": "2026-05-02",
        "readMinutes": 3,
        "tag": "Comparatif",
        "highlight": "Comparer sert à décider, pas à tout afficher.",
        "author": "IA Match · Rédaction",
        "impactLevel": "moyen",
        "impactLabel": "UX utile",
        "confidence": "haute",
        "verificationStatus": "editorial_methodology",
        "lastVerifiedAt": "2026-05-02",
        "sourceIds": [],
        "toolSlugs": ["chatgpt", "claude", "gemini", "perplexity"],
        "radarStatus": "À intégrer",
        "decisionHint": "Un comparatif doit finir par une recommandation actionnable.",
        "action": "Lancer un Match puis comparer seulement les 3 meilleurs résultats.",
        "tags": ["comparatif", "mobile", "décision"],
    },
]


def _today_iso() -> str:
    return datetime.now(timezone.utc).date().isoformat()


def get_editorial_categories() -> List[Dict]:
    return EDITORIAL_CATEGORIES


def get_editorial_sources() -> List[Dict]:
    return EDITORIAL_SOURCES


def get_curated_editorial_articles() -> List[Dict]:
    return [dict(a) for a in CURATED_EDITORIAL_ARTICLES]


def build_editorial_feed(static_news: List[Dict], dynamic_news: List[Dict] | None = None) -> List[Dict]:
    """Return decision-first feed: curated base first, then validated dynamic/static extras."""
    dynamic_news = dynamic_news or []
    curated = get_curated_editorial_articles()
    existing = {a["id"] for a in curated}
    extras: List[Dict] = []
    for item in dynamic_news + static_news:
        if not item or item.get("id") in existing:
            continue
        if item.get("verificationStatus") == "rejected":
            continue
        extra = dict(item)
        extra.setdefault("editorialCategory", _infer_editorial_category(extra))
        extra.setdefault("impactLabel", "À surveiller")
        extra.setdefault("impactLevel", "faible")
        extra.setdefault("confidence", "moyenne")
        extra.setdefault("verificationStatus", "legacy_or_dynamic_review_needed")
        extra.setdefault("lastVerifiedAt", extra.get("publishedAt") or _today_iso())
        extra.setdefault("sourceIds", [])
        extra.setdefault("toolSlugs", [])
        extra.setdefault("radarStatus", "À surveiller")
        extra.setdefault("decisionHint", "À lire comme un signal, pas comme une recommandation définitive.")
        extra.setdefault("action", "Lancer un Match si ce sujet correspond à ton besoin.")
        extras.append(extra)
    def rank(article: Dict) -> tuple:
        impact = {"fort": 0, "moyen": 1, "faible": 2}.get(str(article.get("impactLevel", "faible")).lower(), 2)
        return (impact, str(article.get("publishedAt", "")))
    return sorted(curated, key=rank) + extras[:8]


def get_editorial_highlights(feed: List[Dict]) -> Dict:
    items = feed[:]
    return {
        "generatedAt": _today_iso(),
        "mode": "semi-live-curated",
        "headline": items[0] if items else None,
        "radar": [
            {"label": a.get("radarStatus"), "title": a.get("title"), "action": a.get("action"), "category": a.get("editorialCategory"), "impactLabel": a.get("impactLabel"), "id": a.get("id")}
            for a in items[:6]
        ],
        "methodology": "Sources officielles ou outils reconnus, curation IA Match, date de vérification, impact et conseil actionnable. Le live brut n’est pas publié sans revue.",
    }


def _infer_editorial_category(item: Dict) -> str:
    h = " ".join(str(item.get(k, "")) for k in ("category", "title", "summary", "tag", "body")).lower()
    if any(w in h for w in ["image", "vidéo", "video", "midjourney", "runway", "canva"]):
        return "image-video"
    if any(w in h for w in ["code", "agent", "cursor", "copilot", "zapier", "make", "n8n"]):
        return "code-agents"
    if any(w in h for w in ["prix", "tarif", "abonnement", "business", "pro"]):
        return "business-prix"
    if any(w in h for w in ["local", "open", "llama", "ollama", "mistral"]):
        return "open-local"
    if any(w in h for w in ["régulation", "regulation", "confiance", "source", "privacy"]):
        return "confiance"
    if any(w in h for w in ["débutant", "apprendre", "pédagog"]):
        return "debutants"
    if any(w in h for w in ["gpt", "claude", "gemini", "modèle", "model"]):
        return "modeles"
    return "outils"
