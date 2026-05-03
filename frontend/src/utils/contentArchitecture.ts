export type ContentFamily = {
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
  appCategories: string[];
  jsonCategories: string[];
  promptCategories: string[];
  keywords: string[];
};

export const CONTENT_FAMILIES: ContentFamily[] = [
  {
    slug: "general",
    label: "Modèles généralistes",
    shortLabel: "Général",
    description: "Les IA polyvalentes pour écrire, analyser, raisonner, chercher une première réponse ou démarrer un projet.",
    appCategories: ["texte", "recherche", "productivite"],
    jsonCategories: ["conversation", "general_models", "conversation_assistant", "writing_content"],
    promptCategories: ["writing_communication", "education_learning", "admin_daily_life"],
    keywords: ["chatgpt", "claude", "gemini", "mistral", "perplexity", "grok", "qwen", "llama", "deepseek", "texte", "assistant"],
  },
  {
    slug: "image-design",
    label: "Image & design",
    shortLabel: "Image",
    description: "Créer, retoucher ou préparer des visuels, logos, photos produit, miniatures et supports marketing.",
    appCategories: ["image"],
    jsonCategories: ["image", "image_generation", "image_design"],
    promptCategories: ["image_design", "marketing_sales", "social_content"],
    keywords: ["image", "photo", "logo", "midjourney", "dall", "gpt image", "flux", "firefly", "recraft", "ideogram", "canva", "topaz", "photoroom"],
  },
  {
    slug: "video-audio",
    label: "Vidéo, audio & voix",
    shortLabel: "Média",
    description: "Produire des vidéos, voix off, podcasts, musiques, transcriptions et contenus multimédias.",
    appCategories: ["video", "audio"],
    jsonCategories: ["video", "audio", "video_generation", "audio_voice"],
    promptCategories: ["video_creation", "audio_voice", "social_content"],
    keywords: ["video", "sora", "runway", "veo", "pika", "kling", "audio", "voice", "eleven", "suno", "udio", "whisper", "podcast"],
  },
  {
    slug: "code-apps",
    label: "Code, no-code & apps",
    shortLabel: "Code",
    description: "Coder, débugger, créer une app, automatiser un produit ou travailler avec des agents développeurs.",
    appCategories: ["code", "agent"],
    jsonCategories: ["code", "agents", "coding_dev", "app_builders", "open-weight"],
    promptCategories: ["coding_dev", "nocode_app_builder", "data_analysis"],
    keywords: ["code", "cursor", "copilot", "claude code", "codex", "replit", "lovable", "bolt", "v0", "devin", "app", "agent"],
  },
  {
    slug: "research-documents",
    label: "Recherche & documents",
    shortLabel: "Docs",
    description: "Chercher des sources, lire des PDF, comparer des documents, synthétiser et vérifier l’information.",
    appCategories: ["recherche", "productivite", "data"],
    jsonCategories: ["research", "documents", "research_search", "documents_pdf_office", "education"],
    promptCategories: ["research_analysis", "documents_office", "education_learning"],
    keywords: ["perplexity", "research", "recherche", "source", "document", "pdf", "office", "notion", "synthese", "veille", "data"],
  },
  {
    slug: "business-productivity",
    label: "Business, productivité & marketing",
    shortLabel: "Business",
    description: "Gagner du temps au quotidien : stratégie, marketing, ventes, RH, support client, organisation et contenus.",
    appCategories: ["productivite", "texte", "agent", "data"],
    jsonCategories: ["business", "productivity", "productivite", "education", "data"],
    promptCategories: ["business_strategy", "marketing_sales", "ecommerce", "hr_career", "customer_support", "productivity_organization", "finance_lite", "personal_life"],
    keywords: ["business", "marketing", "vente", "productivite", "support", "rh", "notion", "zapier", "make", "crm", "ecommerce", "organisation"],
  },
];

export function familyForSlug(slug?: string) {
  return CONTENT_FAMILIES.find((f) => f.slug === slug) ?? CONTENT_FAMILIES[0];
}

export function rowMatchesFamily(row: { slug: string; name: string; vendor: string }, family: ContentFamily) {
  const haystack = `${row.slug} ${row.name} ${row.vendor}`.toLowerCase();
  return family.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}

export function familyCategoryCoverage() {
  return CONTENT_FAMILIES.reduce((sum, family) => sum + family.jsonCategories.length + family.promptCategories.length, 0);
}
