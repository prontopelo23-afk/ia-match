// frontend/src/utils/generalRanking.ts
// Classement général = familles LLM généralistes, sans doublons de variantes.
// Les modèles précis (Haiku/Sonnet/Opus, Gemini Flash/Pro, etc.) restent classés dans les catégories selon leurs capacités.
export interface GeneralModel {
  generic: string;
  slug: string;
  displayModel: string;
  note: string;
}

export const GENERAL_MODELS: GeneralModel[] = [
  {
    generic: "ChatGPT",
    slug: "chatgpt",
    displayModel: "GPT-5.5",
    note: "Meilleur généraliste pour texte, productivité, recherche et polyvalence.",
  },
  {
    generic: "Claude",
    slug: "claude",
    displayModel: "Claude Sonnet 4",
    note: "Excellent raisonnement, rédaction longue et analyse de documents.",
  },
  {
    generic: "Gemini",
    slug: "gemini-25",
    displayModel: "Gemini 2.5 Pro",
    note: "Très fort en multimodal, contexte long et écosystème Google.",
  },
  {
    generic: "DeepSeek",
    slug: "deepseek-r1",
    displayModel: "DeepSeek R1",
    note: "Solide en raisonnement et code avec bon rapport puissance/prix.",
  },
  {
    generic: "Llama",
    slug: "llama",
    displayModel: "Llama 4",
    note: "Référence open-source, flexible pour usages avancés et intégrations.",
  },
  {
    generic: "Qwen",
    slug: "qwen",
    displayModel: "Qwen 3",
    note: "Très bon équilibre texte/code/recherche, fort en multilingue.",
  },
  {
    generic: "Mistral",
    slug: "mistral",
    displayModel: "Le Chat / modèles Mistral",
    note: "Option européenne pratique pour productivité, texte et code.",
  },
  {
    generic: "Kimi",
    slug: "kimi",
    displayModel: "Kimi K2",
    note: "Intéressant pour recherche, agentique et contexte long.",
  },
  {
    generic: "Perplexity",
    slug: "perplexity",
    displayModel: "Perplexity AI",
    note: "Très utile pour chercher, sourcer et synthétiser l'information rapidement.",
  },
  {
    generic: "Grok",
    slug: "grok",
    displayModel: "Grok",
    note: "Bon généraliste connecté à l'actualité et à l'écosystème X.",
  },
];
