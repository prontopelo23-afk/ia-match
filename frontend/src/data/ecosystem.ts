export type EcosystemItem = {
  id: string;
  kind: "outil" | "agent" | "workflow" | "ressource" | "modèle";
  title: string;
  subtitle: string;
  description: string;
  verified: string;
  url?: string;
  tags: string[];
  stack?: string[];
  steps?: string[];
};

export const ECOSYSTEM_ITEMS: EcosystemItem[] = [
  {
    id: "research-to-brief",
    kind: "workflow",
    title: "Recherche → brief fiable",
    subtitle: "Perplexity + Claude/ChatGPT + Notion",
    description: "Chercher des sources, synthétiser sans perdre les liens, puis transformer en brief clair.",
    verified: "Workflow basé sur usages publics des outils : recherche sourcée, synthèse longue, prise de notes.",
    tags: ["recherche", "sources", "rédaction"],
    stack: ["Perplexity", "Claude", "ChatGPT", "Notion"],
    steps: ["Chercher avec sources", "Coller les extraits importants", "Demander une synthèse structurée", "Archiver le brief"],
  },
  {
    id: "idea-to-visual",
    kind: "workflow",
    title: "Idée → visuel publiable",
    subtitle: "ChatGPT/Mistral + Midjourney/DALL·E + Canva",
    description: "Passer d’une idée floue à un prompt image propre, puis finaliser le visuel dans un outil graphique.",
    verified: "Ne promet pas un rendu garanti : le résultat dépend du modèle image et du prompt.",
    tags: ["image", "design", "marketing"],
    stack: ["ChatGPT", "Mistral", "Midjourney", "DALL·E", "Canva"],
    steps: ["Décrire l’objectif", "Générer 3 prompts", "Tester l’image", "Finaliser texte et format dans Canva"],
  },
  {
    id: "support-agent-lite",
    kind: "agent",
    title: "Mini-agent support client",
    subtitle: "Base de connaissances + modèle + automatisation",
    description: "Un agent utile commence souvent simple : FAQ, règles de ton, escalade humaine, puis automatisation.",
    verified: "Approche prudente : validation humaine recommandée pour les réponses sensibles.",
    tags: ["agent", "support", "workflow"],
    stack: ["Claude", "ChatGPT", "Notion", "Zapier", "Make"],
    steps: ["Centraliser la FAQ", "Créer les règles de réponse", "Tester sur 20 cas", "Automatiser seulement les cas répétitifs"],
  },
  {
    id: "coding-copilot-stack",
    kind: "workflow",
    title: "Coder avec filet de sécurité",
    subtitle: "Cursor/Replit + GitHub Copilot + tests",
    description: "Utiliser l’IA pour accélérer le code sans perdre le contrôle : petites tâches, tests, review.",
    verified: "Bonnes pratiques générales de développement assisté par IA, pas une garantie d’absence de bugs.",
    tags: ["code", "agent", "tests"],
    stack: ["Cursor", "Replit", "GitHub Copilot", "Claude", "ChatGPT"],
    steps: ["Écrire une demande précise", "Limiter le périmètre", "Lancer tests/lint", "Relire les changements"],
  },
  {
    id: "local-private-ai",
    kind: "workflow",
    title: "IA locale privée",
    subtitle: "Ollama + modèles ouverts + documents non sensibles",
    description: "Tester des modèles en local quand la confidentialité compte, en acceptant parfois moins de confort.",
    verified: "Ollama est un outil réel pour lancer des modèles localement ; qualité variable selon machine et modèle.",
    tags: ["local", "privacy", "modèle"],
    stack: ["Ollama", "Llama", "Mistral", "Qwen"],
    steps: ["Choisir un modèle adapté", "Tester sur un petit document", "Comparer avec un modèle cloud", "Garder les données sensibles hors cloud"],
  },
  {
    id: "automation-hub",
    kind: "outil",
    title: "Automatisation no-code",
    subtitle: "Zapier / Make / n8n",
    description: "Connecter formulaires, emails, CRM, tableurs et modèles IA pour réduire les tâches répétitives.",
    verified: "Outils réels et connus ; les capacités exactes dépendent des connecteurs et plans disponibles.",
    tags: ["automatisation", "no-code", "agents"],
    stack: ["Zapier", "Make", "n8n", "OpenAI", "Google Sheets"],
    steps: ["Déclencheur", "Étape IA", "Contrôle humain", "Action finale"],
  },
];

export const ECOSYSTEM_GUIDES = [
  "Commence par ton usage, pas par le nom du modèle.",
  "Un workflow premium = un modèle + des données + une vérification + une action.",
  "Un agent autonome doit avoir des limites claires, un journal d’actions et une escalade humaine.",
  "Les créateurs, blogs et articles sont utiles pour comprendre ; IA Match doit rester l’outil qui aide à décider.",
];
