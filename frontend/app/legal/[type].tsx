import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";

const COMPANY = "{{NOM_SOCIETE}}";
const ADDRESS = "{{ADRESSE_POSTALE}}";
const EMAIL = "{{EMAIL_CONTACT}}";
const APP = "IA Match";
const SITE = "https://iamatch.app";
const HOST = "Cloudflare / Emergent Cloud";

const TITLES: Record<string, string> = {
  mentions: "Mentions légales",
  cgu: "Conditions Générales d'Utilisation",
  cgv: "Conditions Générales de Vente",
  privacy: "Politique de confidentialité (RGPD)",
};

function Mentions() {
  return (
    <View style={{ gap: spacing.md }}>
      <Section title="Éditeur">
        <P>Le service <B>{APP}</B> est édité par <B>{COMPANY}</B>.</P>
        <P>Adresse du siège : {ADDRESS}.</P>
        <P>Email de contact : <B>{EMAIL}</B>.</P>
        <P>Directeur de la publication : représentant légal de {COMPANY}.</P>
      </Section>
      <Section title="Hébergement">
        <P>L'application et son back-end sont hébergés par <B>{HOST}</B>. Les données utilisateurs sont stockées sur des infrastructures situées dans l'Union européenne.</P>
      </Section>
      <Section title="Propriété intellectuelle">
        <P>L'ensemble des contenus de {APP} (textes, marques, logos, interfaces, codes sources, fiches IA, fiches éducatives) est protégé par le droit d'auteur et le droit des marques. Toute reproduction, extraction ou réutilisation non autorisée est interdite.</P>
        <P>Les marques, noms commerciaux et logos de tiers (modèles d'IA présentés dans le catalogue) demeurent la propriété de leurs titulaires respectifs et sont cités à des fins purement informatives.</P>
      </Section>
      <Section title="Responsabilité">
        <P>{APP} fournit des informations à titre indicatif sur les outils et modèles d'IA. Aucune garantie ne porte sur l'exhaustivité ou la mise à jour permanente de ces données. L'utilisateur reste seul responsable de l'usage qu'il fait des outils tiers.</P>
      </Section>
      <Section title="Contact">
        <P>Pour toute question, écris à <B>{EMAIL}</B>.</P>
      </Section>
    </View>
  );
}

function CGU() {
  return (
    <View style={{ gap: spacing.md }}>
      <Section title="1. Objet">
        <P>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'usage du service <B>{APP}</B>, application qui aide à choisir des modèles d'IA, propose des fiches éducatives, des templates de prompts et un constructeur de prompts.</P>
      </Section>
      <Section title="2. Création de compte">
        <P>L'utilisateur peut créer un compte avec une adresse email et un mot de passe. Il garantit la sincérité des informations fournies et reste seul responsable de la confidentialité de ses identifiants.</P>
        <P>{APP} se réserve le droit de suspendre tout compte présentant un comportement frauduleux, abusif ou contraire à la loi.</P>
      </Section>
      <Section title="3. Description du service">
        <P>{APP} propose les fonctionnalités suivantes : Catalogue d'outils IA, Actualités, Academy (leçons et templates), Builder de prompt avec exécution LLM, Comparateur, Favoris.</P>
        <P>Une partie des fonctionnalités est réservée aux utilisateurs disposant d'un plan <B>Premium</B>. La liste des fonctionnalités payantes peut évoluer.</P>
      </Section>
      <Section title="4. Comportement de l'utilisateur">
        <P>L'utilisateur s'engage à ne pas utiliser {APP} pour des finalités illégales, à ne pas tenter d'accéder à des comptes ou données qui ne lui appartiennent pas, à ne pas perturber le service par des attaques ou un usage abusif des API.</P>
      </Section>
      <Section title="5. Contenu généré par IA">
        <P>Les sorties générées par les modèles d'IA via {APP} (Builder, Match) peuvent contenir des erreurs, des biais ou des informations obsolètes. L'utilisateur reste seul responsable de la vérification, de la diffusion et de l'usage commercial de ces contenus.</P>
      </Section>
      <Section title="6. Disponibilité et évolution">
        <P>{APP} est fourni en l'état. Le service peut être interrompu pour maintenance, mis à jour ou modifié sans préavis. Aucune garantie de disponibilité ininterrompue n'est offerte.</P>
      </Section>
      <Section title="7. Résiliation">
        <P>L'utilisateur peut supprimer son compte à tout moment depuis le profil. {APP} peut suspendre un compte en cas de manquement aux présentes.</P>
      </Section>
      <Section title="8. Loi applicable">
        <P>Les CGU sont régies par le droit français. En cas de litige, et après tentative de résolution amiable, les juridictions compétentes seront celles du siège social de {COMPANY}.</P>
      </Section>
    </View>
  );
}

function CGV() {
  return (
    <View style={{ gap: spacing.md }}>
      <Section title="1. Champ d'application">
        <P>Les présentes Conditions Générales de Vente (CGV) s'appliquent à toute souscription au plan <B>Premium</B> de {APP}, proposée par {COMPANY}.</P>
      </Section>
      <Section title="2. Description de l'offre Premium">
        <P>L'offre Premium donne accès aux fonctionnalités étendues de l'application : Academy, Builder LLM, Comparateur avancé, Benchmarks, et toute future fonctionnalité explicitement marquée Premium.</P>
        <P>Le prix, la durée et les modalités de l'abonnement sont indiqués dans l'application au moment de la souscription.</P>
      </Section>
      <Section title="3. Commande et paiement">
        <P>La souscription s'effectue via les moyens de paiement proposés dans l'application (carte bancaire, etc.). Le paiement est sécurisé par notre prestataire technique. L'abonnement démarre à la confirmation du paiement.</P>
      </Section>
      <Section title="4. Reconduction et résiliation">
        <P>L'abonnement est renouvelé automatiquement à chaque période, sauf résiliation. L'utilisateur peut résilier à tout moment depuis son espace de gestion. La résiliation prend effet à la fin de la période en cours.</P>
      </Section>
      <Section title="5. Droit de rétractation">
        <P>Conformément à l'article L. 221-28 du Code de la consommation, l'utilisateur reconnaît expressément renoncer à son droit de rétractation dès lors que l'exécution du service Premium a commencé avec son accord, sauf exception légale.</P>
      </Section>
      <Section title="6. Remboursement">
        <P>Aucun remboursement partiel n'est effectué pour les périodes commencées. Les demandes de remboursement spécifiques peuvent être adressées à <B>{EMAIL}</B> et sont traitées au cas par cas.</P>
      </Section>
      <Section title="7. Garantie et limitation de responsabilité">
        <P>Les sorties d'IA sont fournies sans garantie de résultat. La responsabilité de {COMPANY} ne saurait être engagée pour les conséquences indirectes liées à un usage du service.</P>
      </Section>
      <Section title="8. Service client">
        <P>Pour toute réclamation : <B>{EMAIL}</B>.</P>
      </Section>
    </View>
  );
}

function Privacy() {
  return (
    <View style={{ gap: spacing.md }}>
      <Section title="1. Responsable du traitement">
        <P><B>{COMPANY}</B>, joignable à <B>{EMAIL}</B>, est responsable du traitement des données personnelles collectées via {APP}.</P>
      </Section>
      <Section title="2. Données collectées">
        <P>Lors de l'inscription : email, prénom, mot de passe (haché avec bcrypt). Lors de l'usage : préférences (thème, plan), favoris, historique du Builder, prompts envoyés au modèle d'IA.</P>
        <P>Aucune donnée bancaire n'est stockée par {APP} : les paiements sont gérés par notre prestataire de paiement.</P>
      </Section>
      <Section title="3. Bases légales et finalités">
        <P>• Exécution du contrat (création de compte, accès aux fonctionnalités).</P>
        <P>• Consentement (envoi de communications, mesure d'audience non essentielle).</P>
        <P>• Intérêt légitime (sécurité, prévention de la fraude).</P>
      </Section>
      <Section title="4. Durée de conservation">
        <P>Les données du compte sont conservées tant que l'utilisateur dispose d'un compte actif, et pendant 12 mois après suppression pour les obligations comptables et de sécurité.</P>
      </Section>
      <Section title="5. Sous-traitants">
        <P>Hébergement : {HOST}. Modèles d'IA : Anthropic (Claude). Paiement : prestataire identifié dans l'application au moment du paiement. Tous nos sous-traitants présentent des garanties adéquates conformes au RGPD.</P>
      </Section>
      <Section title="6. Transferts hors UE">
        <P>Lorsqu'un transfert hors UE est nécessaire (ex. inférence LLM aux États-Unis), il est encadré par des clauses contractuelles types et des mesures supplémentaires conformément au RGPD.</P>
      </Section>
      <Section title="7. Tes droits">
        <P>Tu disposes des droits d'accès, de rectification, d'effacement, de limitation, de portabilité, d'opposition et du droit de retirer ton consentement à tout moment. Pour les exercer : <B>{EMAIL}</B>.</P>
        <P>Tu peux également introduire une réclamation auprès de la CNIL (www.cnil.fr).</P>
      </Section>
      <Section title="8. Cookies et SDK">
        <P>{APP} ne dépose aucun cookie tiers ni SDK de mesure d'audience sans ton consentement explicite (RGPD + Directive ePrivacy). Tu peux modifier ton choix à tout moment depuis ton profil → Préférences de cookies.</P>
      </Section>
      <Section title="9. Sécurité">
        <P>Mots de passe stockés hachés (bcrypt). Connexions HTTPS chiffrées. Authentification par jeton JWT. Accès aux données limité au strict nécessaire.</P>
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={[s.h2, { color: colors.textPrimary }]}>{title}</Text>
      <View style={{ gap: 6, marginTop: 6 }}>{children}</View>
    </View>
  );
}

function P({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <Text style={[s.p, { color: colors.textSecondary }]}>{children}</Text>;
}

function B({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <Text style={[s.b, { color: colors.textPrimary }]}>{children}</Text>;
}

export default function LegalScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { type } = useLocalSearchParams<{ type: string }>();
  const t = (type as string) || "mentions";
  const title = TITLES[t] || "Mentions légales";

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={[s.back, { borderColor: colors.borderSubtle }]} testID="legal-back">
          <ArrowLeft size={18} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[s.brand, { color: colors.textSecondary }]}>{APP}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[s.eyebrow, { color: colors.coral }]}>RGPD · LÉGAL</Text>
        <Text style={[s.title, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[s.lastUpdate, { color: colors.textSecondary }]}>Dernière mise à jour : 29 avril 2026</Text>
        <View style={{ height: spacing.lg }} />
        {t === "mentions" ? <Mentions /> : null}
        {t === "cgu" ? <CGU /> : null}
        {t === "cgv" ? <CGV /> : null}
        {t === "privacy" ? <Privacy /> : null}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  brand: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 4 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
    marginTop: spacing.sm,
  },
  lastUpdate: { fontFamily: fonts.body, fontSize: 12, marginTop: 6 },
  h2: { fontFamily: fonts.bodyBold, fontSize: 16 },
  p: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22 },
  b: { fontFamily: fonts.bodyBold },
});
