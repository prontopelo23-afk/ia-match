import { Linking } from "react-native";

export const CONTACT_EMAIL = "prontopelo23@gmail.com";

function mailtoUrl(subject: string, body: string) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

export function openContactEmail(subject: string, body: string) {
  return Linking.openURL(mailtoUrl(subject, body)).catch(() => {});
}

export function openBusinessContact(offerName?: string) {
  const subject = offerName ? `IA Match — ${offerName}` : "IA Match — demande B2B";
  const body = [
    "Bonjour,",
    "",
    offerName ? `Je souhaite être recontacté(e) à propos de l’offre : ${offerName}.` : "Je souhaite être recontacté(e) à propos d’IA Match pour mon organisation.",
    "",
    "Mon contexte :",
    "- Organisation :",
    "- Nombre de personnes concernées :",
    "- Besoin principal : diagnostic / formation / accès équipe / autre",
    "- Délai souhaité :",
    "",
    "Merci,",
  ].join("\n");
  return openContactEmail(subject, body);
}

export function openFeedbackEmail(type: "avis" | "outil" | "erreur" = "avis") {
  const labels = { avis: "avis bêta", outil: "outil à ajouter", erreur: "recommandation à corriger" };
  const subject = `IA Match — ${labels[type]}`;
  const body = [
    "Bonjour,",
    "",
    type === "outil" ? "Je voudrais proposer un outil IA à ajouter :" : type === "erreur" ? "Je pense qu’une recommandation / actu est à corriger :" : "Voici mon retour sur la bêta IA Match :",
    "",
    "- Page concernée :",
    "- Ce qui bloque / manque :",
    "- Mon besoin principal :",
    "",
    "Merci,",
  ].join("\n");
  return openContactEmail(subject, body);
}

export function openNewsletterSignup(issueTitle?: string, email?: string) {
  const subject = "IA Match — inscription newsletter";
  const body = [
    "Bonjour,",
    "",
    "Je souhaite recevoir le digest IA Match.",
    issueTitle ? `Format qui m’intéresse : ${issueTitle}` : "Format qui m’intéresse : digest IA / stacks métier / gratuit vs payant",
    "",
    `Mon email d’inscription : ${email?.trim() || ""}`,
    "",
    "Merci,",
  ].join("\n");
  return openContactEmail(subject, body);
}
