export type PricingPlan = {
  name: string;
  price: string;
  bestFor: string;
  limits: string;
  models: string;
  plus: string[];
};

export type PricingFamily = {
  family: string;
  note: string;
  plans: PricingPlan[];
};

export const PRICING_GUIDE: PricingFamily[] = [
  {
    family: "ChatGPT",
    note: "Prix public vérifié en mai 2026 : le gratuit reste suffisant pour tester ; Plus/Pro valent surtout pour gros volume, fichiers, image, voix, agents et modèles récents. Les montants exacts varient par pays/taxes.",
    plans: [
      { name: "Free", price: "0 $", bestFor: "découverte et questions simples", limits: "quotas bas, accès variable aux modèles avancés", models: "modèles ChatGPT grand public selon disponibilité", plus: ["découverte", "usage occasionnel", "pas d’engagement"] },
      { name: "Go", price: "selon pays", bestFor: "usage quotidien léger", limits: "palier disponible seulement dans certains pays", models: "modèles récents avec quotas supérieurs au gratuit", plus: ["plus de messages", "premier upgrade", "prix local"] },
      { name: "Plus", price: "≈ 20 $/mois", bestFor: "étudiants, freelances, créateurs", limits: "quotas encore présents", models: "GPT récents, raisonnement, image, fichiers, voix et outils selon disponibilité", plus: ["meilleur rapport simplicité/prix", "fichiers/images", "agents/GPTs"] },
      { name: "Pro", price: "≈ 200 $/mois", bestFor: "power users et tâches lourdes", limits: "cher si usage occasionnel", models: "accès élargi aux modèles avancés et quotas beaucoup plus élevés", plus: ["gros volume", "raisonnement avancé", "travail intensif"] },
    ],
  },
  {
    family: "Claude",
    note: "Claude est très fort pour écrire, coder et analyser de longs documents. Pro est le palier grand public ; Max sert surtout si tu touches les limites tous les jours.",
    plans: [
      { name: "Free", price: "0 $", bestFor: "découvrir Claude", limits: "messages limités et accès variable aux modèles", models: "Claude récent selon disponibilité", plus: ["simple", "bon pour tester", "qualité rédactionnelle"] },
      { name: "Pro", price: "≈ 20 $/mois", bestFor: "rédaction, documents, code, travail régulier", limits: "quotas selon charge", models: "Sonnet et modèles avancés selon disponibilité", plus: ["plus de messages", "Projects", "Artefacts/fichiers"] },
      { name: "Max", price: "≈ 100–200 $/mois", bestFor: "usage intensif pro", limits: "trop cher pour novice occasionnel", models: "quotas beaucoup plus hauts sur Sonnet/Opus selon disponibilité", plus: ["volumes élevés", "analyse longue", "travail fréquent"] },
    ],
  },
  {
    family: "Gemini",
    note: "Très pratique si tu utilises déjà Google. Les plans Google AI Pro/Ultra débloquent surtout meilleurs modèles, contexte, quotas et intégrations selon pays.",
    plans: [
      { name: "Free", price: "0 €", bestFor: "questions, recherche simple, multimodal léger", limits: "capacités avancées limitées", models: "Gemini grand public avec accès limité aux modèles avancés", plus: ["compte Google", "multimodal", "démarrage rapide"] },
      { name: "Google AI Pro", price: "≈ 19,99 €/mois", bestFor: "écosystème Google + gros contexte", limits: "intérêt maximal si tu utilises Google", models: "Gemini Pro/Advanced, contexte long, Drive/Gmail selon pays", plus: ["modèles avancés", "contexte long", "intégrations Google"] },
      { name: "Google AI Ultra", price: "premium selon pays", bestFor: "power users Google", limits: "prix élevé et disponibilité régionale", models: "accès/quotas supérieurs sur les modèles et médias Google", plus: ["quotas hauts", "multimodal avancé", "accès premium"] },
    ],
  },
  {
    family: "Perplexity",
    note: "À choisir surtout pour chercher avec sources. Moins un assistant créatif complet, plus un moteur de réponse/recherche vérifiable.",
    plans: [
      { name: "Free", price: "0 $", bestFor: "recherche rapide sourcée", limits: "recherches avancées limitées", models: "moteur Perplexity standard + modèles limités selon disponibilité", plus: ["sources visibles", "rapide", "vérification"] },
      { name: "Pro", price: "≈ 20 $/mois", bestFor: "veille, recherche fréquente, fichiers", limits: "pas le meilleur pour tout créer", models: "choix de modèles avancés type GPT/Claude/Sonar selon disponibilité", plus: ["plus de recherches Pro", "modèles avancés", "fichiers"] },
    ],
  },
];

export function pricingFor(nameOrVendor: string): PricingFamily | undefined {
  const s = nameOrVendor.toLowerCase();
  return PRICING_GUIDE.find((p) => s.includes(p.family.toLowerCase()) || p.family.toLowerCase().includes(s));
}
