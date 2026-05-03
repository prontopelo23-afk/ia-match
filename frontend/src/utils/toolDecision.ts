import type { Tool } from "../api";

export function toolDecisionCopy(tool: Tool) {
  const cats = tool.categorySlugs ?? [];
  const primaryUse = tool.useCases?.[0] || tool.tagline;
  const isImage = cats.includes("image");
  const isCode = cats.includes("coding");
  const isAgent = cats.includes("agent");
  const isResearch = cats.includes("research");

  const plain = isImage
    ? `${tool.name} est surtout utile si tu veux produire ou améliorer des visuels avec l’IA.`
    : isCode
      ? `${tool.name} est surtout utile si tu veux accélérer le code, prototyper ou corriger des bugs.`
      : isAgent
        ? `${tool.name} est surtout utile si tu veux connecter plusieurs outils ou automatiser une tâche répétitive.`
        : isResearch
          ? `${tool.name} est surtout utile si tu veux chercher, vérifier ou résumer des informations.`
          : `${tool.name} est surtout utile pour ${primaryUse.toLowerCase()}.`;

  const avoid = [
    tool.freeTier ? "tu as besoin de gros volumes sans abonnement" : "tu veux absolument rester sur du gratuit",
    tool.accuracyPct < 88 ? "tu as besoin d’un résultat très fiable sans vérification" : "tu ne veux jamais relire ou vérifier la réponse",
    isAgent ? "le workflow n’est pas encore répété ou clairement défini" : "ton besoin est très spécialisé et demande un outil métier dédié",
  ];

  const complements = isImage
    ? ["Canva pour finaliser le visuel", "ChatGPT ou Claude pour améliorer le brief", "Un outil de stockage pour classer les versions"]
    : isCode
      ? ["GitHub pour versionner", "Tests/lint pour vérifier", "Claude ou ChatGPT pour relire l’architecture"]
      : isAgent
        ? ["Notion ou Airtable comme base", "Zapier/Make/n8n pour connecter", "Un contrôle humain avant action sensible"]
        : isResearch
          ? ["Perplexity pour les sources", "Notion pour archiver", "Claude/ChatGPT pour synthétiser"]
          : ["Un outil de notes pour garder les prompts", "Un comparatif IA Match pour choisir une alternative", "Le Builder IA Match pour structurer la demande"];

  return { plain, avoid, complements };
}
