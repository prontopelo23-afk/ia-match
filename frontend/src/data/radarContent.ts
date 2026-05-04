export type RadarTrend = {
  id: string;
  lane: "tester" | "surveiller" | "eviter" | "apprendre";
  label: string;
  title: string;
  short: string;
  why: string;
  action: string;
  schema: string[];
  score: number;
  articleId?: string;
};

export const RADAR_TRENDS: RadarTrend[] = [
  {
    id: "agents-controles",
    lane: "surveiller",
    label: "À surveiller",
    title: "Agents IA contrôlés",
    short: "Les agents deviennent utiles quand ils travaillent avec tickets, logs, tests et validation humaine.",
    why: "La tendance forte n’est pas le robot autonome magique : c’est l’agent encadré qui exécute une tâche vérifiable.",
    action: "Tester seulement avec une petite tâche, un résultat attendu et une revue humaine.",
    schema: ["Tâche claire", "Agent", "Tests", "Revue", "Décision"],
    score: 86,
    articleId: "ed-agents-orchestration-codex-symphony",
  },
  {
    id: "securite-comptes-ia",
    lane: "eviter",
    label: "À faire maintenant",
    title: "Comptes IA sensibles",
    short: "Un compte IA peut contenir fichiers, habitudes, prompts, idées business et données clients.",
    why: "Plus on utilise l’IA comme espace de travail, plus le compte devient une cible proche d’une boîte mail principale.",
    action: "Activer 2FA, séparer perso/pro et ne jamais coller de secrets ou clés API.",
    schema: ["Compte", "Fichiers", "Historique", "Accès", "Protection"],
    score: 92,
    articleId: "ed-openai-securite-compte-2026",
  },
  {
    id: "recherche-avec-sources",
    lane: "apprendre",
    label: "À apprendre",
    title: "Réflexe sources",
    short: "Les navigateurs et assistants résument mieux, mais une décision fiable demande encore d’ouvrir les sources.",
    why: "Le résumé IA accélère la compréhension ; la source évite les erreurs de date, prix, disponibilité ou contexte.",
    action: "Pour chaque réponse importante : ouvrir deux sources primaires et noter la date.",
    schema: ["Question", "Résumé", "Sources", "Comparaison", "Décision"],
    score: 88,
    articleId: "ed-google-ai-mode-chrome",
  },
  {
    id: "generaliste-dabord",
    lane: "tester",
    label: "À tester",
    title: "Un assistant généraliste d’abord",
    short: "ChatGPT, Claude, Gemini ou Mistral suffisent souvent avant d’empiler des apps spécialisées.",
    why: "Pour débuter, le meilleur gain vient souvent d’un bon workflow, pas d’un nouvel abonnement à chaque usage.",
    action: "Faire un Match avec ton vrai besoin avant de payer un outil niche.",
    schema: ["Besoin", "Assistant", "Prompt", "Résultat", "Amélioration"],
    score: 84,
    articleId: "ed-modeles-generalistes-2026",
  },
  {
    id: "images-privees",
    lane: "eviter",
    label: "À tester prudemment",
    title: "Images personnelles",
    short: "Les outils image deviennent plus personnalisés : pratique, mais une photo privée n’est pas un simple fichier.",
    why: "Visages, lieux, documents et enfants peuvent apparaître dans une image. Il faut choisir ce qu’on accepte d’envoyer.",
    action: "Tester d’abord avec une image neutre puis lire les paramètres de confidentialité.",
    schema: ["Image", "Données", "Outil", "Création", "Contrôle"],
    score: 78,
    articleId: "ed-gemini-images-personnalisees",
  },
];

export const RADAR_LANES = [
  { key: "tester", label: "À tester", helper: "Ce qui peut donner un gain rapide sans gros risque." },
  { key: "surveiller", label: "À surveiller", helper: "Tendance prometteuse, mais à encadrer." },
  { key: "eviter", label: "À éviter / sécuriser", helper: "Pièges ou réflexes à corriger avant d’aller plus loin." },
  { key: "apprendre", label: "À apprendre", helper: "Compétence simple qui rend tous les outils plus utiles." },
] as const;
