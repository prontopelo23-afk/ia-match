export type NewsletterIssue = {
  id: string;
  title: string;
  promise: string;
  audience: string;
  bullets: string[];
  cta: string;
  premiumTeaser: string;
};

export type BusinessOffer = {
  id: string;
  name: string;
  price: string;
  audience: string;
  promise: string;
  includes: string[];
  proof: string;
};

export const NEWSLETTER_ISSUES: NewsletterIssue[] = [
  {
    id: "pmes-3-outils",
    title: "Les 3 IA utiles cette semaine pour gagner du temps",
    promise: "Un digest court, en français, pour savoir quoi tester sans lire 40 threads LinkedIn.",
    audience: "Indépendants, PME, formateurs, équipes marketing",
    bullets: [
      "1 outil à tester maintenant, avec cas d’usage concret",
      "1 limite à connaître avant de payer",
      "1 prompt prêt à copier pour vérifier la valeur en 10 minutes",
    ],
    cta: "Recevoir le digest gratuit",
    premiumTeaser: "Premium ajoute l’analyse complète : alternatives, prix, limites du gratuit et prompts métier.",
  },
  {
    id: "stack-metier",
    title: "La stack IA d’un métier expliquée simplement",
    promise: "Chaque semaine : quelle IA choisir pour RH, vente, formation, support, contenu ou direction.",
    audience: "Managers et responsables d’équipe",
    bullets: [
      "La combinaison d’outils recommandée",
      "Les erreurs de choix qui coûtent cher",
      "Le budget mensuel réaliste par profil",
    ],
    cta: "Suivre les stacks IA",
    premiumTeaser: "Premium débloque les stacks complètes avec fiches de décision et plan d’adoption.",
  },
  {
    id: "gratuit-vs-payant",
    title: "Gratuit ou payant : quand l’abonnement vaut vraiment le coup ?",
    promise: "Une lecture claire des plans gratuits, quotas, modèles inclus et pièges de pricing.",
    audience: "Tout public qui veut éviter les abonnements inutiles",
    bullets: [
      "Ce que le gratuit permet vraiment",
      "Le moment où passer au payant devient rentable",
      "L’alternative moins chère si ton besoin est simple",
    ],
    cta: "Éviter les mauvais abonnements",
    premiumTeaser: "Premium calcule le meilleur choix selon ton besoin, ton niveau et ton budget.",
  },
];

export const BUSINESS_OFFERS: BusinessOffer[] = [
  {
    id: "diagnostic-pme",
    name: "Diagnostic IA PME",
    price: "à partir de 149 €",
    audience: "Dirigeant, office manager, responsable marketing ou RH",
    promise: "Identifier les 5 à 10 outils IA vraiment utiles à ton équipe, sans multiplier les abonnements.",
    includes: [
      "Questionnaire besoin/niveau/budget pour l’équipe",
      "Stack IA recommandée par métier",
      "Risques : données sensibles, RGPD, coûts cachés",
      "PDF synthèse prêt à partager en interne",
    ],
    proof: "Idéal avant de former une équipe ou de choisir des abonnements payants.",
  },
  {
    id: "formation-kit",
    name: "Kit Formateurs",
    price: "99 € à 299 €",
    audience: "Organismes de formation, coachs, écoles, consultants IA",
    promise: "Transformer IA Match en support pédagogique : outils, prompts, exercices et comparatifs simples.",
    includes: [
      "Sélections d’outils par niveau débutant/intermédiaire",
      "Prompts prêts à distribuer aux apprenants",
      "Mini-quiz et cas d’usage métier",
      "Newsletter personnalisable pour garder le lien après la formation",
    ],
    proof: "Plus simple qu’un tableur de 200 outils : l’apprenant sait quoi tester et pourquoi.",
  },
  {
    id: "team-access",
    name: "Accès équipe IA Match",
    price: "50 € à 200 € / mois",
    audience: "PME qui veulent cadrer l’usage IA en équipe",
    promise: "Un espace pour choisir, comparer et documenter les outils IA validés par l’organisation.",
    includes: [
      "Historique de Match partagé",
      "Stack validée par l’admin",
      "Export PDF/CSV pour décideurs",
      "Veille IA Match + alertes prix/limites",
    ],
    proof: "À construire en bêta avec les premières entreprises intéressées, pour éviter de coder un dashboard inutile.",
  },
];

export const PREMIUM_REASON_TO_PAY = [
  "Éviter de payer le mauvais outil IA : IA Match compare prix, limites du gratuit et usage réel.",
  "Gagner du temps : Match illimité, prompts prêts à copier, historique et favoris.",
  "Décider avec confiance : indice éditorial IA Match, sources, niveau de confiance et date de mise à jour.",
  "Passer du test à l’action : stacks métier, Academy complète, Builder avancé et comparatif détaillé.",
];
