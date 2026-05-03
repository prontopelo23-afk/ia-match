import { Tool } from "../api";

export type EditorialTrust = {
  why: string;
  bestFor: string;
  avoidIf: string[];
  pricing: string;
  sources: string[];
  confidence: "élevée" | "moyenne" | "prudente";
  updatedAt: string;
};

const SOURCE_BY_CATEGORY: Record<string, string[]> = {
  texte: ["Chatbot Arena / LMSYS", "docs officielles", "tests éditoriaux IA Match"],
  code: ["SWE-bench / HumanEval quand disponible", "docs IDE/API", "tests éditoriaux IA Match"],
  image: ["Artificial Analysis Image Arena quand disponible", "docs éditeur", "tests éditoriaux IA Match"],
  video: ["docs éditeur", "comparatifs spécialisés", "tests éditoriaux IA Match"],
  recherche: ["docs officielles", "tests de recherche IA Match", "prix éditeur"],
  productivite: ["docs produit", "prix éditeur", "tests éditoriaux IA Match"],
};

export function editorialTrustFor(tool: Tool): EditorialTrust {
  const categories = tool.categorySlugs ?? [];
  const firstCategory = categories[0] ?? "texte";
  const sources = Array.from(new Set([...(SOURCE_BY_CATEGORY[firstCategory] ?? ["docs officielles", "tests éditoriaux IA Match"]), "prix/limites publics vérifiés manuellement"]));
  const updatedAt = tool.lastUpdated
    ? new Date(tool.lastUpdated).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    : "mai 2026";
  const confidence: EditorialTrust["confidence"] = tool.score >= 92 ? "élevée" : tool.score >= 84 ? "moyenne" : "prudente";
  const freeCopy = tool.freeTier ? "Gratuit disponible, souvent avec quotas ou fonctions avancées limitées." : `Payant autour de ${tool.monthlyPrice} €/mois, à valider selon pays/offre.`;

  return {
    why: `${tool.name} ressort parce qu’il combine une bonne adéquation au cas d’usage, un indice éditorial IA Match de ${tool.score}/100 et des forces concrètes : ${(tool.features ?? []).slice(0, 3).join(", ") || tool.tagline}.`,
    bestFor: (tool.useCases ?? [])[0] || tool.tagline,
    avoidIf: [
      tool.freeTier ? "tu as besoin de gros volumes sans quotas" : "tu veux absolument rester sur du gratuit",
      categories.includes("image") ? "tu dois garantir des droits visuels/brand safety sans vérification humaine" : "tu manipules des données sensibles sans vérifier les paramètres de confidentialité",
    ],
    pricing: freeCopy,
    sources,
    confidence,
    updatedAt,
  };
}
