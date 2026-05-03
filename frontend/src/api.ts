import AsyncStorage from "@react-native-async-storage/async-storage";
import { FALLBACK_DATA } from "./fallbackData";

const API = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export type Tool = {
  slug: string;
  name: string;
  vendor: string;
  domain?: string;
  tagline: string;
  description: string;
  categorySlugs: string[];
  speedMs: number;
  accuracyPct: number;
  costPerPrompt: number;
  monthlyPrice: number;
  freeTier: boolean;
  languages: string[];
  features: string[];
  useCases: string[];
  score: number;
  categoryScores?: Record<string, number>;
  color: string;
  image: string;
  lastUpdated?: string;
  privacy?: {
    privacy_score?: number;
    eu_hosted?: boolean;
    trains_on_data?: string;
    rgpd?: boolean;
    note?: string;
  };
  example?: { prompt: string; output: string };
};

export type Category = { slug: string; name: string; description: string };
export type MatchResult = {
  tool: Tool;
  matchScore: number;
  reasons: string[];
  recommendationType?: "best" | "free_alternative" | "premium" | string;
  scoreExplanation?: string;
  avoidIf?: string[];
  readyPrompt?: string;
};
export type RatingSummary = { tool_slug: string; average: number; count: number };
export type BenchmarkRow = {
  slug: string;
  name: string;
  displayModel?: string;
  vendor: string;
  color: string;
  speedMs: number;
  accuracyPct: number;
  monthlyPrice: number;
  freeTier: boolean;
  score: number;
  languages: string[];
};

export type NewsItem = {
  id: string;
  category: string;
  editorialCategory?: string;
  title: string;
  summary: string;
  publishedAt: string;
  readMinutes: number;
  tag: string;
  highlight?: string;
  author?: string;
  intro?: string;
  body?: string;
  impactLevel?: "fort" | "moyen" | "faible" | string;
  impactLabel?: string;
  confidence?: "haute" | "moyenne" | "faible" | string;
  verificationStatus?: string;
  lastVerifiedAt?: string;
  sourceIds?: string[];
  toolSlugs?: string[];
  radarStatus?: string;
  decisionHint?: string;
  action?: string;
  tags?: string[];
};

export type EditorialCategory = { slug: string; label: string; description: string };
export type EditorialSource = { id: string; name: string; url: string; type: string };
export type EditorialHighlights = {
  generatedAt?: string;
  mode?: string;
  headline?: NewsItem | null;
  radar?: { label?: string; title?: string; action?: string; category?: string; impactLabel?: string; id?: string }[];
  methodology?: string;
};

export type Lesson = {
  id: string;
  order: number;
  level: string;
  minutes: number;
  title: string;
  intro: string;
  body: string;
  framework: string;
  steps: string[];
  before: string;
  after: string;
  access?: string;
  path_id?: string;
  recommended_template_ids?: string[];
};

export type Template = {
  id: string;
  level: string;
  title: string;
  body: string;
  variables: string[];
};

export type Resource = {
  id: string;
  category: string;
  title: string;
  author: string;
  summary: string;
  url: string;
};

export type BuilderPreset = {
  id: string;
  title: string;
  language?: string;
  audience?: string;
  difficulty?: string;
  output_goal?: string;
  outputGoal?: string;
  quality_gate?: string;
  premium_level?: string;
  premium?: boolean;
  steps?: { order?: number; template_id?: string; purpose?: string }[];
  blocks?: string[];
  quality_rules?: string[];
};

export type BuilderConfig = {
  config: any;
  quality_rules: any[];
  intent_router: any[];
  model_prompt_guides?: any[];
  bad_to_good_examples?: any[];
  safety_usage_notes?: any[];
};

export type AcademyPath = {
  id: string;
  title: string;
  order?: number;
  level?: string;
  audience?: string;
  access_strategy?: string;
  promise?: string;
  skills_taught?: string[];
  course_ids?: string[];
  final_badge_id?: string;
};

export type AcademyBadge = {
  id: string;
  name: string;
  description?: string;
  unlock_rule?: string;
  app_badge_style?: string;
};

export type AcademyQuiz = {
  id: string;
  course_id: string;
  difficulty?: string;
  question: string;
  answers?: { id?: string; label?: string; text?: string; correct?: boolean; is_correct?: boolean }[];
  explanation?: string;
};

export type ModelRankings = {
  generated_at?: string;
  models_general?: any[];
  specialization_rankings?: { categories?: any[] | Record<string, any> };
  agents_general?: any[];
  agents_coding?: any[];
  app_builders?: any[];
  import_ready_records?: any[];
};

export type AcademyExercise = {
  id: string;
  course_id?: string;
  title?: string;
  instructions?: string;
  expected_output?: string;
};

export type BeginnerTerm = {
  id?: string;
  term?: string;
  title?: string;
  simple_definition?: string;
  definition?: string;
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}/api${path}`);
  if (!res.ok) throw new Error(`GET ${path} ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} ${res.status}`);
  return res.json();
}

function asMutableArray<T>(items: readonly unknown[]): T[] {
  return JSON.parse(JSON.stringify(items)) as T[];
}

function isEmptyPayload(data: unknown): boolean {
  if (Array.isArray(data)) return data.length === 0;
  if (data && typeof data === "object" && "rows" in data) {
    const rows = (data as { rows?: unknown }).rows;
    return Array.isArray(rows) && rows.length === 0;
  }
  return data == null;
}

async function withFallback<T>(request: Promise<T>, fallback: () => T): Promise<T> {
  try {
    const data = await request;
    return isEmptyPayload(data) ? fallback() : data;
  } catch {
    return fallback();
  }
}

function fallbackTools(params: Record<string, string | number | boolean | undefined> = {}): Tool[] {
  let items = asMutableArray<Tool>(FALLBACK_DATA.TOOLS);
  const category = params.category ? String(params.category) : "";
  const search = params.search ? String(params.search).toLowerCase() : "";
  const minScore = params.min_score === undefined ? undefined : Number(params.min_score);
  const freeOnly = Boolean(params.free_only);
  const sort = params.sort ? String(params.sort) : "score";

  if (category) items = items.filter((t) => t.categorySlugs?.includes(category));
  if (freeOnly) items = items.filter((t) => t.freeTier);
  if (minScore !== undefined && !Number.isNaN(minScore)) items = items.filter((t) => t.score >= minScore);
  if (search) {
    items = items.filter((t) =>
      `${t.name} ${t.vendor} ${t.tagline} ${t.description} ${t.features?.join(" ") ?? ""} ${t.useCases?.join(" ") ?? ""}`
        .toLowerCase()
        .includes(search)
    );
  }

  if (sort === "speed") items.sort((a, b) => a.speedMs - b.speedMs);
  else if (sort === "accuracy") items.sort((a, b) => b.accuracyPct - a.accuracyPct);
  else if (sort === "price") items.sort((a, b) => Number(!a.freeTier) - Number(!b.freeTier) || a.monthlyPrice - b.monthlyPrice);
  else if (category) items.sort((a, b) => ((b.categoryScores?.[category] ?? b.score) - (a.categoryScores?.[category] ?? a.score)) || b.score - a.score);
  else items.sort((a, b) => b.score - a.score);
  return items;
}

const GENERAL_BENCHMARK_SLUGS = ["chatgpt", "claude", "gemini-25", "deepseek-r1", "llama", "qwen", "mistral", "kimi", "grok", "perplexity"];
const GENERAL_BENCHMARK_NAMES: Record<string, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  "gemini-25": "Gemini",
  "deepseek-r1": "DeepSeek",
  llama: "Llama",
  qwen: "Qwen",
  mistral: "Mistral",
  kimi: "Kimi",
  grok: "Grok",
  perplexity: "Perplexity",
};
const GENERAL_BENCHMARK_MODELS: Record<string, string> = {
  chatgpt: "GPT-5.5",
  claude: "Claude Sonnet 4",
  "gemini-25": "Gemini 2.5 Pro",
  "deepseek-r1": "DeepSeek R1",
  llama: "Llama 4",
  qwen: "Qwen 3",
  mistral: "Le Chat / modèles Mistral",
  kimi: "Kimi K2",
  grok: "Grok",
  perplexity: "Perplexity AI",
};

function fallbackBenchmarks(sort = "score", scope: "general" | "all" = "general"): { rows: BenchmarkRow[] } {
  const tools = fallbackTools({ sort });
  const source = scope === "all" ? tools : GENERAL_BENCHMARK_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter(Boolean) as Tool[];
  return {
    rows: source.map((t) => ({
      slug: t.slug,
      name: scope === "all" ? t.name : (GENERAL_BENCHMARK_NAMES[t.slug] ?? t.name),
      displayModel: scope === "all" ? t.name : (GENERAL_BENCHMARK_MODELS[t.slug] ?? t.name),
      vendor: t.vendor,
      color: t.color,
      speedMs: t.speedMs,
      accuracyPct: t.accuracyPct,
      monthlyPrice: t.monthlyPrice,
      freeTier: t.freeTier,
      score: t.score,
      languages: t.languages,
    })),
  };
}

function resolveTools(slugs: readonly string[]) {
  const tools = fallbackTools();
  return slugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean)
    .map((t) => ({ slug: t!.slug, name: t!.name, vendor: t!.vendor, image: t!.image, domain: t!.domain, color: t!.color, tagline: t!.tagline }));
}

function inferFallbackCategories(q: string): string[] {
  const rules: { category: string; words: string[] }[] = [
    { category: "video", words: ["vidéo", "video", "tiktok", "reel", "short", "youtube", "storyboard", "montage", "clip", "animation"] },
    { category: "audio", words: ["audio", "voix", "voice", "podcast", "doublage", "musique", "son", "transcription", "voix-off"] },
    { category: "image", words: ["image", "photo", "logo", "visuel", "illustration", "design", "miniature", "affiche", "créatif"] },
    { category: "code", words: ["code", "coder", "bug", "debug", "dev", "site", "app", "application", "python", "javascript", "typescript", "mvp", "saas"] },
    { category: "agent", words: ["automatiser", "automation", "workflow", "agent", "zapier", "make", "tâche répétitive", "process"] },
    { category: "recherche", words: ["recherche", "source", "actualité", "veille", "article", "résumer", "synthèse", "pdf", "document", "contrat", "analyse"] },
    { category: "data", words: ["data", "données", "tableau", "csv", "excel", "statistique", "dashboard", "analyse de données"] },
    { category: "productivite", words: ["productivité", "organisation", "planning", "notion", "réunion", "compte rendu", "emails", "admin"] },
    { category: "texte", words: ["écrire", "texte", "email", "mail", "rédaction", "post", "cv", "lettre", "blog", "linkedin", "marketing", "vente", "landing"] },
  ];
  const found = rules.filter((rule) => rule.words.some((w) => q.includes(w))).map((rule) => rule.category);
  return found.length ? found : ["texte"];
}

function fallbackMatch(need: string, priority: string, freeOnly: boolean): MatchResult[] {
  const q = need.toLowerCase();
  const categories = inferFallbackCategories(q);
  const userTask = need
    .split(". Mon niveau est ")[0]
    .replace(/\s+/g, " ")
    .replace(/^je\s+(veux|souhaite|cherche|dois|voudrais)\s+/i, "")
    .trim();
  const categoryLabels: Record<string, string> = {
    texte: "texte & écriture",
    image: "image & design",
    code: "code & dev",
    video: "vidéo",
    audio: "audio & voix",
    productivite: "productivité",
    recherche: "recherche & analyse",
    agent: "agents & automatisation",
    data: "data & analyse",
  };
  let tools = asMutableArray<Tool>(FALLBACK_DATA.TOOLS).filter((tool) =>
    tool.categorySlugs?.some((slug) => categories.includes(slug)) && (!freeOnly || tool.freeTier)
  );
  if (!tools.length && freeOnly) {
    tools = asMutableArray<Tool>(FALLBACK_DATA.TOOLS).filter((tool) => tool.categorySlugs?.some((slug) => categories.includes(slug)));
  }
  if (!tools.length) tools = fallbackTools({ sort: "score", free_only: freeOnly });

  const scoreFor = (tool: Tool) => {
    const categoryScore = Math.max(...categories.map((cat) => tool.categoryScores?.[cat] ?? (tool.categorySlugs?.includes(cat) ? tool.score : 0)));
    const text = `${tool.name} ${tool.vendor} ${tool.tagline} ${tool.description} ${tool.features?.join(" ") ?? ""} ${tool.useCases?.join(" ") ?? ""}`.toLowerCase();
    const keywordBonus = ["tiktok", "video", "vidéo", "image", "logo", "code", "pdf", "voix", "marketing", "automation"].reduce((sum, word) => sum + (q.includes(word) && text.includes(word) ? 4 : 0), 0);
    const priceBonus = priority === "price" && tool.freeTier ? 8 : priority === "price" ? -Math.min(8, tool.monthlyPrice / 5) : 0;
    const speedBonus = priority === "speed" ? Math.max(0, 8 - tool.speedMs / 100) : 0;
    const accuracyBonus = priority === "accuracy" ? tool.accuracyPct / 12 : 0;
    return categoryScore + keywordBonus + priceBonus + speedBonus + accuracyBonus;
  };

  tools.sort((a, b) => scoreFor(b) - scoreFor(a) || b.score - a.score || a.monthlyPrice - b.monthlyPrice);

  return tools.slice(0, 8).map((tool, index) => ({
    tool,
    matchScore: Math.max(72, Math.min(98, Math.round(scoreFor(tool) - index * 1.5))),
    reasons: [
      `Aligné avec la famille “${categoryLabels[categories[0]] ?? categories[0]}” détectée dans ton besoin`,
      priority === "price" && tool.freeTier ? "Plan gratuit disponible pour tester sans risque" : `Indice éditorial IA Match ${tool.score}/100`,
      tool.useCases?.[0] ?? tool.tagline ?? "Bon choix pour démarrer simplement",
    ],
    recommendationType: index === 0 ? "best" : tool.freeTier ? "free_alternative" : "premium",
    scoreExplanation: "Recommandation locale basée sur les catégories détectées, le budget, les prix publics, la vitesse, la qualité estimée et l’indice éditorial IA Match embarqué.",
    avoidIf: !tool.freeTier ? ["À éviter si tu veux absolument rester gratuit."] : [],
    readyPrompt: `Aide-moi pour : ${userTask.replace(/[.!?]+$/g, "")}. Pose-moi jusqu’à 3 questions si une information essentielle manque, puis propose une réponse claire, concrète et directement actionnable.`,
  }));
}

export const api = {
  listTools: (params: Record<string, string | number | boolean | undefined> = {}) => {
    const qs = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== "" && v !== false)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join("&");
    return withFallback(get<Tool[]>(`/tools${qs ? `?${qs}` : ""}`), () => fallbackTools(params));
  },
  getTool: (slug: string) => withFallback(get<Tool>(`/tools/${slug}`), () => fallbackTools().find((t) => t.slug === slug) ?? fallbackTools()[0]),
  listCategories: () => withFallback(get<Category[]>(`/categories`), () => asMutableArray<Category>(FALLBACK_DATA.CATEGORIES)),
  benchmarks: (sort: string = "score", scope: "general" | "all" = "general") => withFallback(get<{ rows: BenchmarkRow[] }>(`/benchmarks?sort=${sort}&scope=${scope}`), () => fallbackBenchmarks(sort, scope)),
  match: (need: string, priority: string, free_only: boolean, language: string = "fr") =>
    withFallback(post<MatchResult[]>(`/match`, { need, priority, free_only, language }), () => fallbackMatch(need, priority, free_only)),
  rate: async (tool_slug: string, score: number, note?: string) => {
    try {
      return await post<{ id: string }>(`/ratings`, { tool_slug, score, note });
    } catch {
      const id = `local-rating-${tool_slug}-${Date.now()}`;
      try {
        const raw = await AsyncStorage.getItem("ia_match_local_ratings_v1");
        const list = raw ? JSON.parse(raw) : [];
        list.unshift({ id, tool_slug, score, note, createdAt: Date.now() });
        await AsyncStorage.setItem("ia_match_local_ratings_v1", JSON.stringify(list.slice(0, 200)));
      } catch {}
      return { id };
    }
  },
  ratings: (slug: string) => withFallback(get<RatingSummary>(`/ratings/${slug}`), () => ({ tool_slug: slug, average: 0, count: 0 })),
  allRatings: () => withFallback(get<RatingSummary[]>(`/ratings`), () => []),
  listNews: () => withFallback(get<NewsItem[]>(`/news`), () => asMutableArray<NewsItem>(FALLBACK_DATA.NEWS)),
  getNews: (id: string) => withFallback(get<NewsItem>(`/news/${id}`), () => asMutableArray<NewsItem>(FALLBACK_DATA.NEWS).find((n) => n.id === id) ?? asMutableArray<NewsItem>(FALLBACK_DATA.NEWS)[0]),
  listEditorialFeed: () => withFallback(get<NewsItem[]>(`/editorial/feed`), () => asMutableArray<NewsItem>(FALLBACK_DATA.EDITORIAL_FEED ?? FALLBACK_DATA.NEWS)),
  listEditorialCategories: () => withFallback(get<EditorialCategory[]>(`/editorial/categories`), () => asMutableArray<EditorialCategory>(FALLBACK_DATA.EDITORIAL_CATEGORIES ?? [])),
  listEditorialSources: () => withFallback(get<EditorialSource[]>(`/editorial/sources`), () => asMutableArray<EditorialSource>(FALLBACK_DATA.EDITORIAL_SOURCES ?? [])),
  getEditorialHighlights: () => withFallback(get<EditorialHighlights>(`/editorial/highlights`), () => asMutableArray<EditorialHighlights>([FALLBACK_DATA.EDITORIAL_HIGHLIGHTS ?? { headline: asMutableArray<NewsItem>(FALLBACK_DATA.NEWS)[0] ?? null, radar: [], mode: "fallback" }])[0]),
  listLessons: () => withFallback(get<Lesson[]>(`/lessons`), () => asMutableArray<Lesson>(FALLBACK_DATA.LESSONS)),
  listTemplates: () => withFallback(get<Template[]>(`/templates`), () => asMutableArray<Template>(FALLBACK_DATA.TEMPLATES)),
  listResources: () => withFallback(get<Resource[]>(`/resources`), () => asMutableArray<Resource>(FALLBACK_DATA.RESOURCES)),
  listAcademyPaths: () => withFallback(get<AcademyPath[]>(`/academy/paths`), () => asMutableArray<AcademyPath>(FALLBACK_DATA.ACADEMY_PATHS ?? [])),
  listAcademyBadges: () => withFallback(get<AcademyBadge[]>(`/academy/badges`), () => asMutableArray<AcademyBadge>(FALLBACK_DATA.ACADEMY_BADGES ?? [])),
  listAcademyQuizzes: (courseId?: string) => withFallback(get<AcademyQuiz[]>(`/academy/quizzes${courseId ? `?course_id=${encodeURIComponent(courseId)}` : ""}`), () => asMutableArray<AcademyQuiz>(FALLBACK_DATA.ACADEMY_QUIZZES ?? []).filter((q) => !courseId || q.course_id === courseId)),
  listAcademyExercises: (courseId?: string) => withFallback(get<AcademyExercise[]>(`/academy/exercises${courseId ? `?course_id=${encodeURIComponent(courseId)}` : ""}`), () => asMutableArray<AcademyExercise>(FALLBACK_DATA.ACADEMY_EXERCISES ?? []).filter((e) => !courseId || e.course_id === courseId)),
  listAcademyBadToGood: () => withFallback(get<any[]>(`/academy/bad-to-good`), () => asMutableArray<any>(FALLBACK_DATA.ACADEMY_BAD_TO_GOOD ?? [])),
  listBeginnerTerms: () => withFallback(get<BeginnerTerm[]>(`/academy/beginner-terms`), () => asMutableArray<BeginnerTerm>(FALLBACK_DATA.BEGINNER_TERMS ?? [])),
  listBuilderPresets: () => withFallback(get<BuilderPreset[]>(`/builder/presets`), () => asMutableArray<BuilderPreset>(FALLBACK_DATA.BUILDER_PRESETS ?? [])),
  getBuilderConfig: () => withFallback(get<BuilderConfig>(`/builder/config`), () => asMutableArray<BuilderConfig>([FALLBACK_DATA.BUILDER_CONFIG ?? { config: {}, quality_rules: [], intent_router: [] }])[0]),
  getModelRankings: () => withFallback(get<ModelRankings>(`/models/rankings`), () => asMutableArray<ModelRankings>([FALLBACK_DATA.MODEL_RANKINGS ?? {}])[0]),
  listGlossary: () => withFallback(get<any[]>(`/glossary`), () => asMutableArray<any>(FALLBACK_DATA.GLOSSARY)),
  listFaq: () => withFallback(get<any[]>(`/faq`), () => asMutableArray<any>(FALLBACK_DATA.FAQ)),
  listUseCases: () => withFallback(get<any[]>(`/use-cases`), () => asMutableArray<any>(FALLBACK_DATA.USE_CASES).map((uc) => ({ ...uc, tools_resolved: resolveTools(uc.tools ?? []) }))),
  listPersonas: () => withFallback(get<any[]>(`/personas`), () => asMutableArray<any>(FALLBACK_DATA.PERSONAS).map((p) => ({ ...p, tools_resolved: resolveTools(p.tools ?? []) }))),
  listQuiz: () => withFallback(get<any[]>(`/quiz`), () => asMutableArray<any>(FALLBACK_DATA.QUIZ)),
  scoreQuiz: (answers: number[]) => withFallback(post<any>(`/quiz/score`, { answers }), () => {
    const total = answers.reduce((sum, selected, i) => {
      const q = (FALLBACK_DATA.QUIZ as readonly any[])[i];
      return sum + Number(q?.options?.[selected]?.score ?? 0);
    }, 0);
    const max = FALLBACK_DATA.QUIZ.length * 3;
    const level = total <= 6 ? "Débutant curieux" : total <= 15 ? "Explorateur" : "Pratiquant avancé";
    return { total, max, level, emoji: total <= 6 ? "🌱" : total <= 15 ? "🧭" : "🚀", color: "#FA520F", description: "Continue le parcours : IA Match te guide étape par étape." };
  }),
  builderRun: (prompt: string) => withFallback(post<{ output: string; model: string }>(`/builder/run`, { prompt }), () => ({ output: `Version test : ${prompt}\n\n1. Clarifie le contexte\n2. Demande le format attendu\n3. Vérifie le résultat`, model: "IA Match Demo" })),
};

// ---------- Local storage helpers ----------
const HISTORY_KEY = "ia_match_history_v1";
const COMPARE_KEY = "ia_match_compare_v2"; // v2: up to 4 slugs
const BOOKMARK_TOOLS_KEY = "ia_match_bm_tools_v1";
const BOOKMARK_NEWS_KEY = "ia_match_bm_news_v1";
const BUILDER_HISTORY_KEY = "ia_match_builder_v1";
const ONBOARD_KEY = "ia_match_onboarded_v1";
const ANALYTICS_EVENTS_KEY = "ia_match_beta_events_v1";
const MATCH_USAGE_KEY = "ia_match_free_match_usage_v1";
export const FREE_MATCH_LIMIT = 7;

export type HistoryItem = {
  need: string;
  priority: string;
  createdAt: number;
  bestToolSlug?: string;
  bestToolName?: string;
  readyPrompt?: string;
  matchScore?: number;
};

export const history = {
  async list(): Promise<HistoryItem[]> {
    try {
      const v = await AsyncStorage.getItem(HISTORY_KEY);
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  },
  async push(item: HistoryItem) {
    const list = await history.list();
    list.unshift(item);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 30)));
  },
  async clear() {
    await AsyncStorage.removeItem(HISTORY_KEY);
  },
};

export const COMPARE_LIMIT = 4;

export const compareStore = {
  async get(): Promise<string[]> {
    try {
      const v = await AsyncStorage.getItem(COMPARE_KEY);
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  },
  async set(slugs: string[]) {
    await AsyncStorage.setItem(COMPARE_KEY, JSON.stringify(slugs.slice(0, COMPARE_LIMIT)));
  },
  async toggle(slug: string): Promise<string[]> {
    const list = await compareStore.get();
    let next: string[];
    if (list.includes(slug)) {
      next = list.filter((s) => s !== slug);
    } else if (list.length >= COMPARE_LIMIT) {
      // drop the oldest, append new
      next = [...list.slice(1), slug];
    } else {
      next = [...list, slug];
    }
    await compareStore.set(next);
    return next;
  },
};

// Generic bookmark store factory
function makeBookmarkStore(key: string) {
  return {
    async list(): Promise<string[]> {
      try {
        const v = await AsyncStorage.getItem(key);
        return v ? JSON.parse(v) : [];
      } catch {
        return [];
      }
    },
    async toggle(id: string): Promise<string[]> {
      const list = await this.list();
      const next = list.includes(id) ? list.filter((s) => s !== id) : [id, ...list];
      await AsyncStorage.setItem(key, JSON.stringify(next.slice(0, 200)));
      return next;
    },
    async has(id: string): Promise<boolean> {
      const list = await this.list();
      return list.includes(id);
    },
  };
}

export const bookmarkTools = makeBookmarkStore(BOOKMARK_TOOLS_KEY);
export const bookmarkNews = makeBookmarkStore(BOOKMARK_NEWS_KEY);

// Builder history
export type BuilderHistoryItem = {
  id: string;
  prompt: string;
  output: string;
  model: string;
  createdAt: number;
};

export const builderHistory = {
  async list(): Promise<BuilderHistoryItem[]> {
    try {
      const v = await AsyncStorage.getItem(BUILDER_HISTORY_KEY);
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  },
  async push(item: BuilderHistoryItem) {
    const list = await builderHistory.list();
    list.unshift(item);
    await AsyncStorage.setItem(BUILDER_HISTORY_KEY, JSON.stringify(list.slice(0, 30)));
  },
  async remove(id: string) {
    const list = await builderHistory.list();
    await AsyncStorage.setItem(
      BUILDER_HISTORY_KEY,
      JSON.stringify(list.filter((i) => i.id !== id))
    );
  },
  async clear() {
    await AsyncStorage.removeItem(BUILDER_HISTORY_KEY);
  },
};

// Onboarding
export const onboardingStore = {
  async isDone(): Promise<boolean> {
    try {
      const v = await AsyncStorage.getItem(ONBOARD_KEY);
      return v === "1";
    } catch {
      return false;
    }
  },
  async markDone() {
    await AsyncStorage.setItem(ONBOARD_KEY, "1");
  },
  async reset() {
    await AsyncStorage.removeItem(ONBOARD_KEY);
  },
};

export const matchUsageStore = {
  async get(): Promise<number> {
    try {
      const raw = await AsyncStorage.getItem(MATCH_USAGE_KEY);
      return raw ? Number(raw) || 0 : 0;
    } catch {
      return 0;
    }
  },
  async increment(): Promise<number> {
    const next = (await matchUsageStore.get()) + 1;
    await AsyncStorage.setItem(MATCH_USAGE_KEY, String(next));
    return next;
  },
  async reset() {
    await AsyncStorage.removeItem(MATCH_USAGE_KEY);
  },
};

// Tracking bêta local : rien n'est envoyé à un serveur, on garde juste les signaux utiles pour apprendre pendant la bêta.
export type BetaEvent = { name: string; payload?: Record<string, unknown>; createdAt: number };

export const analyticsStore = {
  async track(name: string, payload: Record<string, unknown> = {}) {
    try {
      const raw = await AsyncStorage.getItem(ANALYTICS_EVENTS_KEY);
      const list: BetaEvent[] = raw ? JSON.parse(raw) : [];
      list.unshift({ name, payload, createdAt: Date.now() });
      await AsyncStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(list.slice(0, 200)));
    } catch {}
  },
  async list(): Promise<BetaEvent[]> {
    try {
      const raw = await AsyncStorage.getItem(ANALYTICS_EVENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  async clear() {
    await AsyncStorage.removeItem(ANALYTICS_EVENTS_KEY);
  },
};
