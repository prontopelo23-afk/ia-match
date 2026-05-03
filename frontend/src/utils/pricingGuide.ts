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
    note: "Le gratuit suffit pour découvrir. Plus/Pro servent surtout si tu utilises l’IA souvent, avec fichiers, images, voix ou modèles avancés.",
    plans: [
      { name: "Gratuit", price: "0 €", bestFor: "tester, questions simples", limits: "accès limité aux meilleurs modèles et quotas variables", models: "GPT grand public selon disponibilité, accès limité aux modèles avancés", plus: ["découverte", "usage occasionnel", "pas d’engagement"] },
      { name: "Go", price: "petit abonnement selon pays", bestFor: "usage quotidien léger", limits: "moins complet que Plus/Pro", models: "modèles ChatGPT récents avec quotas supérieurs au gratuit selon pays", plus: ["plus de messages", "meilleur confort", "bon premier upgrade"] },
      { name: "Plus", price: "≈ 20 €/mois", bestFor: "étudiants, freelances, créateurs", limits: "quotas encore présents en heures de pointe", models: "GPT-4o/4.1/5 selon disponibilité, raisonnement, image, fichiers et outils avancés", plus: ["modèles avancés", "fichiers/images", "meilleur rapport simplicité/prix"] },
      { name: "Pro", price: "≈ 200 €/mois", bestFor: "power users, recherche, tâches lourdes", limits: "cher si usage occasionnel", models: "accès élargi aux modèles de raisonnement et quotas hauts sur les modèles avancés", plus: ["quotas beaucoup plus hauts", "raisonnement avancé", "travail intensif"] },
    ],
  },
  {
    family: "Claude",
    note: "Claude est très fort pour écrire, réfléchir et analyser de longs documents. Le gratuit dépanne, Pro/Max débloquent surtout plus de volume.",
    plans: [
      { name: "Gratuit", price: "0 €", bestFor: "découvrir Claude", limits: "messages limités, accès variable aux modèles", models: "Claude récent avec quotas bas, souvent Sonnet selon disponibilité", plus: ["très simple", "bon pour tester", "qualité rédactionnelle"] },
      { name: "Pro", price: "≈ 20 €/mois", bestFor: "rédaction, documents, travail régulier", limits: "quotas selon charge", models: "Claude Sonnet + accès aux modèles avancés selon disponibilité", plus: ["plus de messages", "meilleurs modèles", "projets/fichiers"] },
      { name: "Max", price: "≈ 100–200 €/mois", bestFor: "usage intensif pro", limits: "trop cher pour novice occasionnel", models: "quotas beaucoup plus hauts sur Sonnet/Opus selon disponibilité", plus: ["volumes élevés", "travail long", "analyse fréquente"] },
    ],
  },
  {
    family: "Gemini",
    note: "Très pratique si tu utilises déjà Google. À regarder pour multimodal, Drive, Gmail, recherche et contexte long.",
    plans: [
      { name: "Gratuit", price: "0 €", bestFor: "questions, recherche simple", limits: "capacités avancées limitées", models: "Gemini grand public, accès limité à Pro/Flash selon disponibilité", plus: ["facile avec compte Google", "bon multimodal", "démarrage rapide"] },
      { name: "Advanced", price: "≈ 20 €/mois", bestFor: "écosystème Google + gros contexte", limits: "intérêt maximal si tu utilises Google", models: "Gemini Pro/Advanced, contexte long et fonctions Google selon pays", plus: ["modèles avancés", "contexte long", "Drive/Gmail selon disponibilité"] },
    ],
  },
  {
    family: "Perplexity",
    note: "À choisir surtout pour chercher avec sources. Moins un assistant créatif complet, plus un moteur de réponse/recherche.",
    plans: [
      { name: "Gratuit", price: "0 €", bestFor: "recherche rapide sourcée", limits: "recherches avancées limitées", models: "moteur Perplexity standard + modèles limités selon disponibilité", plus: ["sources visibles", "rapide", "idéal pour vérifier"] },
      { name: "Pro", price: "≈ 20 €/mois", bestFor: "veille, recherche fréquente", limits: "pas le meilleur pour tout créer", models: "choix de modèles avancés type GPT/Claude/Sonar selon disponibilité", plus: ["plus de recherches pro", "modèles avancés", "fichiers"] },
    ],
  },
];

export function pricingFor(nameOrVendor: string): PricingFamily | undefined {
  const s = nameOrVendor.toLowerCase();
  return PRICING_GUIDE.find((p) => s.includes(p.family.toLowerCase()) || p.family.toLowerCase().includes(s));
}
