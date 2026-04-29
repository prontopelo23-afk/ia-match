import AsyncStorage from "@react-native-async-storage/async-storage";

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
  color: string;
  image: string;
};

export type Category = { slug: string; name: string; description: string };
export type MatchResult = { tool: Tool; matchScore: number; reasons: string[] };
export type RatingSummary = { tool_slug: string; average: number; count: number };
export type BenchmarkRow = {
  slug: string;
  name: string;
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
  title: string;
  summary: string;
  publishedAt: string;
  readMinutes: number;
  tag: string;
  highlight?: string;
  author?: string;
  intro?: string;
  body?: string;
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

export const api = {
  listTools: (params: Record<string, string | number | boolean | undefined> = {}) => {
    const qs = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== "" && v !== false)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join("&");
    return get<Tool[]>(`/tools${qs ? `?${qs}` : ""}`);
  },
  getTool: (slug: string) => get<Tool>(`/tools/${slug}`),
  listCategories: () => get<Category[]>(`/categories`),
  benchmarks: (sort: string = "score") => get<{ rows: BenchmarkRow[] }>(`/benchmarks?sort=${sort}`),
  match: (need: string, priority: string, free_only: boolean, language: string = "fr") =>
    post<MatchResult[]>(`/match`, { need, priority, free_only, language }),
  rate: (tool_slug: string, score: number, note?: string) =>
    post<{ id: string }>(`/ratings`, { tool_slug, score, note }),
  ratings: (slug: string) => get<RatingSummary>(`/ratings/${slug}`),
  allRatings: () => get<RatingSummary[]>(`/ratings`),
  listNews: () => get<NewsItem[]>(`/news`),
  getNews: (id: string) => get<NewsItem>(`/news/${id}`),
  listLessons: () => get<Lesson[]>(`/lessons`),
  listTemplates: () => get<Template[]>(`/templates`),
  listResources: () => get<Resource[]>(`/resources`),
  builderRun: (prompt: string) => post<{ output: string; model: string }>(`/builder/run`, { prompt }),
};

// ---------- Local storage helpers ----------
const HISTORY_KEY = "ia_match_history_v1";
const COMPARE_KEY = "ia_match_compare_v2"; // v2: up to 4 slugs
const BOOKMARK_TOOLS_KEY = "ia_match_bm_tools_v1";
const BOOKMARK_NEWS_KEY = "ia_match_bm_news_v1";
const BUILDER_HISTORY_KEY = "ia_match_builder_v1";
const ONBOARD_KEY = "ia_match_onboarded_v1";

export type HistoryItem = { need: string; priority: string; createdAt: number };

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
