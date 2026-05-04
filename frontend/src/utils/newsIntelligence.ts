import type { NewsItem, Tool } from "../api";

export type NewsImpact = {
  label: string;
  tone: "strong" | "watch" | "beginner" | "price" | "free";
  why: string;
};

export type NewsIntel = {
  filter: string;
  impact: NewsImpact;
  quickSummary: string[];
  changes: string[];
  action: string;
  advice: string;
  toolKeywords: string[];
};

const KEYWORDS: Record<string, string[]> = {
  Image: ["image", "visuel", "photo", "design", "midjourney", "dall", "imagen", "firefly", "canva"],
  Texte: ["texte", "écrire", "gpt", "claude", "mistral", "llm", "modèle", "chatbot"],
  Code: ["code", "dev", "développe", "cursor", "copilot", "replit", "app", "claude code", "cline", "roo", "aider", "openclaw", "clawbot", "bolt", "lovable"],
  Agents: ["agent", "workflow", "automatis", "zapier", "make", "n8n", "tool-use", "openclaw", "clawbot", "cline", "roo"],
  Business: ["prix", "tarif", "startup", "business", "offre", "abonnement", "pro"],
  Gratuit: ["gratuit", "open source", "open-source", "local", "ollama", "llama", "mistral"],
};

function haystack(item: NewsItem) {
  return `${item.category} ${item.title} ${item.summary} ${item.intro ?? ""} ${item.body ?? ""}`.toLowerCase();
}

export const NEWS_FILTERS = ["Tout", "Modèles", "Outils", "Claude", "Image", "Code", "Agents", "Business", "Local", "Confiance", "À surveiller"];

const CATEGORY_TO_FILTER: Record<string, string> = {
  modeles: "Modèles",
  outils: "Outils",
  "image-video": "Image",
  "code-agents": "Agents",
  "business-prix": "Business",
  "open-local": "Local",
  confiance: "Confiance",
  debutants: "Outils",
};

export function getNewsIntel(item: NewsItem): NewsIntel {
  const h = haystack(item);
  let filter = item.editorialCategory ? CATEGORY_TO_FILTER[item.editorialCategory] ?? "Outils" : Object.entries(KEYWORDS).find(([, words]) => words.some((w) => h.includes(w)))?.[0] ?? "Outils";
  if (item.editorialCategory === "code-agents") {
    const codeSignal = /code|dévelop|dev|cursor|copilot|codex|claude code|cline|roo|aider|openclaw|clawbot|replit|github|bolt|lovable/.test(h);
    filter = codeSignal ? "Code" : "Agents";
  }
  if (/claude|anthropic/.test(h) && filter === "Outils") filter = "Claude";
  const isPrice = /prix|tarif|abonnement|offre|plan|pro|gratuit/.test(h) || item.editorialCategory === "business-prix";
  const isFree = /gratuit|open source|open-source|local|ollama|llama/.test(h) || item.editorialCategory === "open-local";
  const isAgent = /agent|workflow|automatis|tool-use|zapier|make|n8n/.test(h) || item.editorialCategory === "code-agents";
  const isBeginner = /débutant|simple|pédagog|sans jargon|grand public/.test(h) || item.editorialCategory === "debutants";
  const isStrong = item.impactLevel === "fort" || /nouveau|lance|sort|référence|percée|majeur|parfait|garantie/.test(h);

  const impact: NewsImpact = item.impactLabel
    ? { label: item.impactLabel, tone: item.impactLevel === "fort" ? "strong" : item.impactLevel === "moyen" ? "watch" : "beginner", why: item.decisionHint ?? "Signal éditorial IA Match à lire avant de choisir un outil." }
    : isPrice
    ? { label: "Change les prix", tone: "price", why: "À vérifier avant de payer ou de recommander un outil." }
    : isFree
      ? { label: "Alternative gratuite", tone: "free", why: "Peut éviter un abonnement si le besoin reste simple." }
      : isAgent
        ? { label: "Workflow utile", tone: "watch", why: "Intéressant si tu automatises des tâches répétitives." }
        : isBeginner
          ? { label: "Utile débutants", tone: "beginner", why: "Bon point d’entrée sans jargon technique." }
          : isStrong
            ? { label: "Impact fort", tone: "strong", why: "Peut changer le bon choix d’outil dans IA Match." }
            : { label: "À surveiller", tone: "watch", why: "Signal à garder en tête, pas forcément urgent." };

  const quickSummary = Array.from(new Set([
    item.highlight || item.summary,
    impact.why,
    item.decisionHint || (filter === "Image" ? "À relier aux outils de création visuelle." : filter === "Agents" ? "À relier aux outils d’automatisation et agents." : "À relier au choix du bon outil selon ton usage."),
  ].filter(Boolean))).slice(0, 3);

  const changes = [
    `Catégorie IA Match : ${filter}.`,
    `Impact estimé : ${impact.label}.`,
    item.confidence ? `Confiance éditoriale : ${item.confidence}.` : item.readMinutes <= 3 ? "Lecture courte : parfait pour décider vite." : "Lecture plus longue : utile pour comprendre le contexte.",
  ];

  const action = item.action || (filter === "Image"
    ? "Créer un prompt image ou comparer les outils visuels."
    : filter === "Code"
      ? "Comparer les assistants de code avant de démarrer un projet."
      : filter === "Agents"
        ? "Tester un workflow simple avant d’automatiser toute une chaîne."
        : isPrice
          ? "Vérifier si le plan gratuit suffit avant de payer."
          : "Lancer un Match pour savoir quel outil choisir maintenant.");

  const advice = item.decisionHint || (isPrice
    ? "Ne choisis pas un abonnement pour le nom du modèle : pars de ton usage réel, puis vérifie les limites du plan."
    : isFree
      ? "Teste d’abord l’option gratuite ou locale. Passe au payant seulement si la qualité ou le volume bloque."
      : filter === "Agents"
        ? "Automatise seulement une tâche répétée au moins trois fois. Sinon, un bon prompt suffit souvent."
        : filter === "Image"
          ? "Pour l’image, juge sur le rendu final et la lisibilité, pas seulement sur la hype du modèle."
          : "Si tu débutes, garde un assistant généraliste fiable et ajoute un outil spécialisé seulement quand le besoin devient clair.");

  const toolKeywords = [
    "chatgpt", "claude", "anthropic", "gemini", "mistral", "perplexity", "midjourney", "canva", "cursor", "copilot", "cline", "roo", "aider", "openclaw", "clawbot", "zapier", "make", "ollama", "llama", "deepseek", "qwen", "runway", "suno",
  ].filter((k) => h.includes(k));

  return { filter, impact, quickSummary, changes, action, advice, toolKeywords };
}

export function filterNews(items: NewsItem[], filter: string) {
  if (filter === "Tout") return items;
  if (filter === "À surveiller") return items.filter((item) => ["watch", "strong"].includes(getNewsIntel(item).impact.tone) || item.radarStatus?.toLowerCase().includes("surveiller"));
  if (filter === "Claude") return items.filter((item) => haystack(item).includes("claude") || haystack(item).includes("anthropic") || item.toolSlugs?.includes("claude"));
  if (filter === "Code") return items.filter((item) => getNewsIntel(item).filter === "Code" || /code|dev|cursor|copilot|claude code|cline|roo|aider|openclaw|clawbot|replit|bolt|lovable/.test(haystack(item)));
  if (filter === "Agents") return items.filter((item) => getNewsIntel(item).filter === "Agents" || /agent|workflow|automatis|openclaw|clawbot|cline|roo|n8n|zapier|make/.test(haystack(item)));
  return items.filter((item) => getNewsIntel(item).filter === filter || (filter === "Local" && item.editorialCategory === "open-local"));
}

export function relatedToolsForNews(item: NewsItem, tools: Tool[], max = 4) {
  const intel = getNewsIntel(item);
  const h = haystack(item);
  const scored = tools.map((tool) => {
    const text = `${tool.slug} ${tool.name} ${tool.vendor} ${tool.domain ?? ""} ${tool.categorySlugs.join(" ")} ${tool.features.join(" ")} ${tool.useCases.join(" ")}`.toLowerCase();
    let score = 0;
    const explicit = item.toolSlugs?.includes(tool.slug) || item.toolSlugs?.some((slug) => text.includes(slug));
    if (explicit) score += 12;
    if (intel.toolKeywords.some((k) => text.includes(k))) score += 6;
    if (h.includes(tool.name.toLowerCase())) score += 8;
    if (h.includes(tool.vendor.toLowerCase())) score += 6;
    if (intel.filter === "Image" && tool.categorySlugs.includes("image")) score += 3;
    if (intel.filter === "Code" && tool.categorySlugs.includes("coding")) score += 3;
    if (intel.filter === "Agents" && tool.categorySlugs.includes("agent")) score += 3;
    if (intel.filter === "Texte" && tool.categorySlugs.includes("writing")) score += 2;
    return { tool, score };
  });
  return scored.filter((x) => x.score > 0).sort((a, b) => b.score - a.score || b.tool.score - a.tool.score).slice(0, max).map((x) => x.tool);
}
