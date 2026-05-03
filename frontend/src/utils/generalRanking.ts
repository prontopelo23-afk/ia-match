// frontend/src/utils/generalRanking.ts
// Classement général = aide au choix pour débuter avec l’IA, pas benchmark scientifique brut.
// Les modèles précis (Haiku/Sonnet/Opus, Gemini Flash/Pro, etc.) restent classés dans les catégories selon leurs capacités.
export interface GeneralModel {
  generic: string;
  slug: string;
  displayModel: string;
  note: string;
  bestFor: string;
  whyRanked: string;
  limitation: string;
  confidence: "élevée" | "moyenne" | "prudente";
}

export const GENERAL_MODELS: GeneralModel[] = [
  {
    generic: "ChatGPT",
    slug: "chatgpt",
    displayModel: "GPT-5.5",
    note: "Le choix le plus simple pour démarrer : texte, idées, productivité et usages du quotidien.",
    bestFor: "polyvalence, débutants, tâches quotidiennes",
    whyRanked: "Très connu, riche en fonctions, bon en français et facile à recommander sans explication technique.",
    limitation: "Pas toujours le moins cher ni le meilleur choix pour recherche sourcée stricte.",
    confidence: "élevée",
  },
  {
    generic: "Claude",
    slug: "claude",
    displayModel: "Claude Sonnet 4.6",
    note: "Excellent pour rédaction longue, documents, analyse et raisonnement posé.",
    bestFor: "écriture, synthèse, analyse de documents",
    whyRanked: "Très fiable pour produire des réponses structurées et nuancées, avec un bon confort de lecture.",
    limitation: "Moins central si ton besoin principal est l’image, l’actualité en direct ou l’écosystème Google.",
    confidence: "élevée",
  },
  {
    generic: "Gemini",
    slug: "gemini-25",
    displayModel: "Gemini 3.1 Pro Preview",
    note: "Très bon si tu utilises Google, le multimodal ou des contextes longs.",
    bestFor: "Google Workspace, multimodal, contexte long",
    whyRanked: "Fort pour les utilisateurs déjà dans l’écosystème Google et les usages mêlant texte, images et documents.",
    limitation: "L’expérience peut dépendre fortement du pays, du forfait et des intégrations activées.",
    confidence: "élevée",
  },
  {
    generic: "Perplexity",
    slug: "perplexity",
    displayModel: "Perplexity AI",
    note: "Le plus clair pour chercher vite avec des sources et comprendre l’actualité.",
    bestFor: "recherche sourcée, veille, compréhension rapide",
    whyRanked: "Ce n’est pas seulement un modèle : c’est une interface de recherche très utile pour vérifier et sourcer.",
    limitation: "Moins adapté comme assistant général de production longue ou automatisation complète.",
    confidence: "élevée",
  },
  {
    generic: "Mistral",
    slug: "mistral",
    displayModel: "Mistral Large 3 / Le Chat",
    note: "Option européenne intéressante pour productivité, texte, code et enjeux de souveraineté.",
    bestFor: "Europe, productivité, souveraineté",
    whyRanked: "Bon compromis pour une app française : accessible, crédible et plus facile à expliquer côté RGPD/Europe.",
    limitation: "Écosystème grand public moins installé que ChatGPT, Claude ou Gemini.",
    confidence: "moyenne",
  },
  {
    generic: "DeepSeek",
    slug: "deepseek-r1",
    displayModel: "DeepSeek-V3.2 / R1",
    note: "Très intéressant pour raisonnement, code et rapport puissance/prix.",
    bestFor: "raisonnement, code, coût/API",
    whyRanked: "Puissant et compétitif, mais plus pertinent pour utilisateurs avertis ou usages techniques.",
    limitation: "Moins évident comme produit grand public français pour débuter sans contexte.",
    confidence: "moyenne",
  },
  {
    generic: "Qwen",
    slug: "qwen",
    displayModel: "Qwen3",
    note: "Famille solide en multilingue, code et modèles avancés.",
    bestFor: "multilingue, code, intégrations techniques",
    whyRanked: "Très capable, surtout côté modèles/API, mais demande plus de pédagogie pour un public novice.",
    limitation: "Moins identifiable qu’un assistant grand public comme ChatGPT ou Claude.",
    confidence: "moyenne",
  },
  {
    generic: "Kimi",
    slug: "kimi",
    displayModel: "Kimi K2 Thinking",
    note: "Intéressant pour recherche, contexte long et usages agentiques.",
    bestFor: "contexte long, recherche, workflows avancés",
    whyRanked: "À surveiller pour les usages longs et complexes, mais moins connu du grand public.",
    limitation: "Pas encore le premier choix pédagogique pour une première expérience IA.",
    confidence: "prudente",
  },
  {
    generic: "Llama",
    slug: "llama",
    displayModel: "Llama 4 Scout/Maverick",
    note: "Référence open-weight pour développeurs, local, confidentialité et intégrations.",
    bestFor: "open-source, local, intégration développeur",
    whyRanked: "Excellent comme famille technique, mais pas toujours comme app prête à l’emploi pour débutants.",
    limitation: "Demande souvent une interface, un hébergement ou des compétences techniques autour du modèle.",
    confidence: "moyenne",
  },
  {
    generic: "Grok",
    slug: "grok",
    displayModel: "Grok 4.3",
    note: "Utile pour actualité et écosystème X, mais moins prioritaire pour apprendre l’IA.",
    bestFor: "actualité, culture web, écosystème X",
    whyRanked: "Pertinent dans certains contextes, mais moins universel pour un classement débutant français.",
    limitation: "Dépend fortement de l’accès à X et de ton besoin d’actualité en temps réel.",
    confidence: "prudente",
  },
];

export const GENERAL_MODEL_BY_SLUG = Object.fromEntries(GENERAL_MODELS.map((model) => [model.slug, model])) as Record<string, GeneralModel>;
