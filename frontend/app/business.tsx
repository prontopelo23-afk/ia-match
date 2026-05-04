import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, FileText, Users, ShieldCheck } from "lucide-react-native";
import { useTheme } from "../src/theme-context";
import { colors, fonts, radius, shadow, spacing } from "../src/theme";
import { BUSINESS_OFFERS } from "../src/data/growthContent";
import { CONTACT_EMAIL, openBusinessContact } from "../src/utils/contactLinks";

export default function BusinessScreen() {
  const router = useRouter();
  const { colors: theme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={[styles.back, { borderColor: theme.borderSubtle }]} onPress={() => router.back()}>
          <ArrowLeft size={18} color={theme.textPrimary} strokeWidth={2.5} />
          <Text style={[styles.backText, { color: theme.textPrimary }]}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.hero}>
          <View style={styles.icon}><BriefcaseBusiness size={25} color="#fff" strokeWidth={2.5} /></View>
          <Text style={styles.eyebrow}>ENTREPRISES & FORMATIONS</Text>
          <Text style={styles.title}>Aidez une équipe à choisir les bons outils IA sans perdre 2 mois.</Text>
          <Text style={styles.subtitle}>IA Match peut devenir un diagnostic simple pour PME, formateurs et écoles : stack recommandée, limites, budget, sources et plan d’action.</Text>
          <View style={styles.heroGrid}>
            <HeroMetric icon={<Users size={16} color={colors.coral} />} value="Équipe" label="besoins partagés" />
            <HeroMetric icon={<FileText size={16} color={colors.coral} />} value="PDF" label="décision claire" />
            <HeroMetric icon={<ShieldCheck size={16} color={colors.coral} />} value="RGPD" label="risques visibles" />
          </View>
        </View>

        <View style={[styles.explainCard, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]}> 
          <Text style={[styles.explainTitle, { color: theme.textPrimary }]}>Le problème que les entreprises paient pour résoudre</Text>
          <Text style={[styles.explainText, { color: theme.textSecondary }]}>Les équipes testent ChatGPT, Claude, Gemini, Canva, Perplexity ou des outils no-code au hasard. Résultat : abonnements doublons, données sensibles mal cadrées, adoption faible. IA Match vend une décision guidée, pas juste un catalogue.</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Offres à tester en priorité</Text>
        {BUSINESS_OFFERS.map((offer) => (
          <View key={offer.id} style={[styles.offer, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]}> 
            <View style={styles.offerTop}>
              <Text style={[styles.offerName, { color: theme.textPrimary }]}>{offer.name}</Text>
              <Text style={[styles.price, { color: theme.coral }]}>{offer.price}</Text>
            </View>
            <Text style={[styles.audience, { color: theme.textSecondary }]}>{offer.audience}</Text>
            <Text style={[styles.promise, { color: theme.textPrimary }]}>{offer.promise}</Text>
            {offer.includes.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <CheckCircle2 size={15} color={theme.coral} strokeWidth={2.5} />
                <Text style={[styles.bulletText, { color: theme.textPrimary }]}>{item}</Text>
              </View>
            ))}
            <Text style={[styles.proof, { color: theme.textSecondary }]}>{offer.proof}</Text>
            <TouchableOpacity style={[styles.offerCta, { backgroundColor: theme.coral }]} onPress={() => openBusinessContact(offer.name)}>
              <Text style={styles.offerCtaText}>Me recontacter pour cette offre</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={[styles.ctaBox, { backgroundColor: theme.coralSoft, borderColor: theme.coral }]}> 
          <Text style={[styles.ctaTitle, { color: theme.textPrimary }]}>Intéressé ? Contact direct</Text>
          <Text style={[styles.ctaText, { color: theme.textSecondary }]}>La page ne doit pas rester une vitrine fermée : un clic ouvre un email prérempli pour demander un diagnostic, un kit formateur ou un accès équipe bêta.</Text>
          <Text style={[styles.contactLine, { color: theme.textPrimary }]}>Email : {CONTACT_EMAIL}</Text>
          <TouchableOpacity style={[styles.cta, { backgroundColor: theme.coral }]} onPress={() => openBusinessContact()}>
            <Text style={styles.ctaBtn}>Envoyer une demande</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryCta, { borderColor: theme.coral }]} onPress={() => router.push("/newsletter")}>
            <Text style={[styles.secondaryCtaText, { color: theme.coral }]}>Voir aussi la newsletter</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function HeroMetric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <View style={styles.metric}>{icon}<Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  back: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 10, marginBottom: spacing.md },
  backText: { fontFamily: fonts.bodyBold, fontSize: 14 },
  hero: { backgroundColor: colors.darkCard, borderRadius: radius.xl, padding: spacing.lg, ...shadow.dark },
  icon: { width: 50, height: 50, borderRadius: 18, backgroundColor: colors.coral, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, color: colors.coral, fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  title: { fontFamily: fonts.serif, color: colors.textInverse, fontSize: 33, lineHeight: 38, letterSpacing: -0.8 },
  subtitle: { fontFamily: fonts.body, color: "rgba(253,251,247,0.76)", fontSize: 14, lineHeight: 21, marginTop: spacing.sm },
  heroGrid: { flexDirection: "row", gap: 8, marginTop: spacing.lg },
  metric: { flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: radius.md, padding: spacing.sm },
  metricValue: { color: colors.textInverse, fontFamily: fonts.bodyBold, fontSize: 13, marginTop: 4 },
  metricLabel: { color: "rgba(253,251,247,0.70)", fontFamily: fonts.body, fontSize: 12, lineHeight: 16 },
  explainCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  explainTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 29, marginBottom: 6 },
  explainText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 26, marginTop: spacing.lg, marginBottom: spacing.sm },
  offer: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  offerTop: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm, alignItems: "flex-start" },
  offerName: { flex: 1, fontFamily: fonts.serif, fontSize: 23, lineHeight: 27 },
  price: { fontFamily: fonts.bodyBold, fontSize: 13, textAlign: "right" },
  audience: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 },
  promise: { fontFamily: fonts.bodySemi, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, marginBottom: spacing.xs },
  bulletRow: { flexDirection: "row", gap: 8, alignItems: "flex-start", marginTop: 7 },
  bulletText: { flex: 1, fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  proof: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, fontStyle: "italic", marginTop: spacing.sm },
  offerCta: { borderRadius: radius.pill, paddingVertical: 12, alignItems: "center", marginTop: spacing.md },
  offerCtaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  ctaBox: { borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm },
  ctaTitle: { fontFamily: fonts.serif, fontSize: 24 },
  ctaText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, marginTop: 6 },
  contactLine: { fontFamily: fonts.bodyBold, fontSize: 13, marginTop: spacing.sm },
  cta: { borderRadius: radius.pill, paddingVertical: 13, alignItems: "center", marginTop: spacing.md },
  ctaBtn: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 13 },
  secondaryCta: { borderWidth: 1, borderRadius: radius.pill, paddingVertical: 12, alignItems: "center", marginTop: spacing.sm },
  secondaryCtaText: { fontFamily: fonts.bodyBold, fontSize: 13 },
});
