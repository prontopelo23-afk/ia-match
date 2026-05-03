import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Mail, Sparkles, CheckCircle2, LockKeyhole } from "lucide-react-native";
import { useTheme } from "../src/theme-context";
import { colors, fonts, radius, shadow, spacing } from "../src/theme";
import { NEWSLETTER_ISSUES, PREMIUM_REASON_TO_PAY } from "../src/data/growthContent";
import { CONTACT_EMAIL, openNewsletterSignup } from "../src/utils/contactLinks";

export default function NewsletterScreen() {
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
          <View style={styles.heroIcon}><Mail size={24} color="#fff" strokeWidth={2.5} /></View>
          <Text style={styles.eyebrow}>NEWSLETTER PUBLIQUE</Text>
          <Text style={styles.title}>Le digest IA qui te dit quoi tester, quoi éviter et quand payer.</Text>
          <Text style={styles.subtitle}>Chaque édition transforme la veille IA en décision simple : meilleur outil, limites du gratuit, prompt de test et sources. Gratuit pour apprendre, Premium pour décider vite.</Text>
          <TouchableOpacity style={styles.cta} onPress={() => openNewsletterSignup()}>
            <Sparkles size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.ctaText}>Recevoir le digest par email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroSecondary} onPress={() => router.push("/match")}>
            <Text style={styles.heroSecondaryText}>Tester le Match avant de s’inscrire</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Formats prêts pour le public</Text>
        {NEWSLETTER_ISSUES.map((issue) => (
          <View key={issue.id} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]}> 
            <Text style={[styles.cardLabel, { color: theme.coral }]}>{issue.audience}</Text>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{issue.title}</Text>
            <Text style={[styles.cardText, { color: theme.textSecondary }]}>{issue.promise}</Text>
            {issue.bullets.map((b) => (
              <View key={b} style={styles.bulletRow}>
                <CheckCircle2 size={15} color={theme.coral} strokeWidth={2.5} />
                <Text style={[styles.bulletText, { color: theme.textPrimary }]}>{b}</Text>
              </View>
            ))}
            <View style={[styles.teaserBox, { backgroundColor: theme.coralSoft }]}> 
              <LockKeyhole size={14} color={theme.coral} strokeWidth={2.5} />
              <Text style={[styles.teaserText, { color: theme.textPrimary }]}>{issue.premiumTeaser}</Text>
            </View>
            <TouchableOpacity style={[styles.secondaryCta, { borderColor: theme.coral }]} onPress={() => openNewsletterSignup(issue.title)}>
              <Text style={[styles.secondaryText, { color: theme.coral }]}>{issue.cta}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={[styles.valueCard, { backgroundColor: colors.darkCard }]}> 
          <Text style={styles.valueTitle}>Pourquoi payer Premium si la newsletter est gratuite ?</Text>
          {PREMIUM_REASON_TO_PAY.map((line) => <Text key={line} style={styles.valueLine}>• {line}</Text>)}
          <Text style={styles.contactNote}>Inscription/contact provisoire : {CONTACT_EMAIL}. À remplacer par le vrai lien Beehiiv/Substack dès que le compte est créé.</Text>
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  back: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 10, marginBottom: spacing.md },
  backText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  hero: { backgroundColor: colors.darkCard, borderRadius: radius.xl, padding: spacing.lg, ...shadow.dark },
  heroIcon: { width: 48, height: 48, borderRadius: 18, backgroundColor: colors.coral, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, color: colors.coral, fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  title: { fontFamily: fonts.serif, color: colors.textInverse, fontSize: 34, lineHeight: 39, letterSpacing: -0.8 },
  subtitle: { fontFamily: fonts.body, color: "rgba(253,251,247,0.76)", fontSize: 14, lineHeight: 21, marginTop: spacing.sm },
  cta: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.coral, borderRadius: radius.pill, paddingVertical: 13, paddingHorizontal: spacing.md, alignSelf: "flex-start", marginTop: spacing.lg },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 13 },
  heroSecondary: { borderWidth: 1, borderColor: "rgba(253,251,247,0.28)", borderRadius: radius.pill, paddingVertical: 11, paddingHorizontal: spacing.md, alignSelf: "flex-start", marginTop: spacing.sm },
  heroSecondaryText: { color: "rgba(253,251,247,0.84)", fontFamily: fonts.bodyBold, fontSize: 12 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 26, marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  cardLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 },
  cardTitle: { fontFamily: fonts.serif, fontSize: 23, lineHeight: 28 },
  cardText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: spacing.sm },
  bulletRow: { flexDirection: "row", gap: 8, alignItems: "flex-start", marginTop: 7 },
  bulletText: { flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  teaserBox: { flexDirection: "row", gap: 8, borderRadius: radius.md, padding: spacing.sm, marginTop: spacing.md },
  teaserText: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 17 },
  secondaryCta: { borderWidth: 1, borderRadius: radius.pill, paddingVertical: 11, alignItems: "center", marginTop: spacing.sm },
  secondaryText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  valueCard: { borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm },
  valueTitle: { color: colors.textInverse, fontFamily: fonts.serif, fontSize: 23, marginBottom: spacing.sm },
  valueLine: { color: "rgba(253,251,247,0.82)", fontFamily: fonts.body, fontSize: 13, lineHeight: 20, marginBottom: 5 },
  contactNote: { color: "rgba(253,251,247,0.68)", fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 18, marginTop: spacing.sm },
});
