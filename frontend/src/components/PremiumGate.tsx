import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Lock, Crown, Check } from "lucide-react-native";
import { useTheme, usePremium } from "../theme-context";
import { fonts, radius, spacing } from "../theme";

type Props = { feature: string; description: string; benefits: string[] };

export default function PremiumGate({ feature, description, benefits }: Props) {
  const { colors } = useTheme();
  const { setPremium } = usePremium();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");
  const planLabel = selectedPlan === "monthly" ? "Premium mensuel · 6,99 €/mois" : "Premium annuel · 49,99 €/an";
  return (
    <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: colors.bg }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.coralSoft }]}>
        <Lock size={28} color={colors.coral} strokeWidth={2.5} />
      </View>
      <Text style={[styles.eyebrow, { color: colors.coral }]}>RÉSERVÉ AU PLAN PREMIUM</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{feature}</Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>{description}</Text>

      <View style={[styles.priceRow, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}> 
        <View style={{ flex: 1 }}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>PLAN PREMIUM IA MATCH</Text>
          <Text style={[styles.priceIntro, { color: colors.textPrimary }]}>Prix public prévu : choisis selon ton rythme. Aucun jargon : tu sais exactement ce que tu débloques.</Text>
          <View style={styles.planGrid}>
            <TouchableOpacity
              onPress={() => setSelectedPlan("monthly")}
              activeOpacity={0.85}
              style={[
                styles.planCard,
                selectedPlan === "monthly" && styles.planCardFeatured,
                { borderColor: selectedPlan === "monthly" ? colors.coral : colors.borderSubtle, backgroundColor: selectedPlan === "monthly" ? colors.coralSoft : colors.bg },
              ]}
              testID="premium-plan-monthly"
            >
              <Text style={[styles.planBadge, { color: selectedPlan === "monthly" ? colors.coral : colors.textSecondary }]}>MENSUEL</Text>
              <Text style={[styles.price, { color: colors.textPrimary }]}>6,99 €<Text style={[styles.priceMonth, { color: colors.textSecondary }]}> / mois</Text></Text>
              <Text style={[styles.planHelp, { color: colors.textSecondary }]}>Pour tester Premium sans engagement.</Text>
              {selectedPlan === "monthly" ? <Text style={[styles.selectedText, { color: colors.coral }]}>✓ Sélectionné</Text> : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedPlan("annual")}
              activeOpacity={0.85}
              style={[
                styles.planCard,
                selectedPlan === "annual" && styles.planCardFeatured,
                { borderColor: selectedPlan === "annual" ? colors.coral : colors.borderSubtle, backgroundColor: selectedPlan === "annual" ? colors.coralSoft : colors.bg },
              ]}
              testID="premium-plan-annual"
            >
              <Text style={[styles.planBadge, { color: selectedPlan === "annual" ? colors.coral : colors.textSecondary }]}>ANNUEL · MEILLEUR PRIX</Text>
              <Text style={[styles.price, { color: colors.textPrimary }]}>49,99 €<Text style={[styles.priceMonth, { color: colors.textSecondary }]}> / an</Text></Text>
              <Text style={[styles.planHelp, { color: colors.textSecondary }]}>Économise environ 40% vs 12 mois.</Text>
              {selectedPlan === "annual" ? <Text style={[styles.selectedText, { color: colors.coral }]}>✓ Sélectionné</Text> : null}
            </TouchableOpacity>
          </View>
          <Text style={[styles.priceCancel, { color: colors.textSecondary }]}>Gratuit : découvrir les outils, lire la newsletter et lancer quelques Match. Premium : éviter les mauvais abonnements grâce au Match illimité, aux sources/confiance/MAJ, aux prompts métier, aux stacks par usage, à l’Academy complète, au Builder avancé et au comparatif détaillé.</Text>
        </View>
      </View>

      <View style={[styles.benefitsBox, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
        <Text style={[styles.compareTitle, { color: colors.textPrimary }]}>Gratuit vs Premium</Text>
        <PlanLine label="Gratuit" text="Match limités, catalogue, newsletter publique, fiches outils avec indice éditorial, favoris et apprentissage de base." />
        <PlanLine label="Premium" text="Décision plus rapide : Match illimité, comparatif avancé, prompts métier, Academy complète, benchmarks détaillés, sources/confiance/MAJ et historique enrichi." />
      </View>

      <View style={[styles.benefitsBox, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
        <View style={styles.benefitsHeader}>
          <Crown size={16} color={colors.coral} strokeWidth={2.5} />
          <Text style={[styles.benefitsTitle, { color: colors.textPrimary }]}>Avec Premium tu débloques</Text>
        </View>
        {benefits.map((b, i) => (
          <View key={i} style={styles.benefitRow}>
            <Check size={14} color={colors.coral} strokeWidth={2.5} />
            <Text style={[styles.benefitText, { color: colors.textPrimary }]}>{b}</Text>
          </View>
        ))}
      </View>



      <TouchableOpacity
        style={[styles.cta, { backgroundColor: colors.coral }]}
        onPress={() => setPremium(true)}
        testID="premium-activate"
      >
        <Crown size={16} color="#fff" strokeWidth={2.5} />
        <Text style={styles.ctaText}>Débloquer {planLabel}</Text>
      </TouchableOpacity>

      <Text style={[styles.demoNote, { color: colors.textSecondary }]}>
        Preview : le bouton simule l’activation Premium. Paiement réel Stripe prévu en V2.
      </Text>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

function PlanLine({ label, text }: { label: string; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.planLine}>
      <Text style={[styles.planLineLabel, { color: colors.coral }]}>{label}</Text>
      <Text style={[styles.planLineText, { color: colors.textSecondary }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingTop: spacing.xl, alignItems: "center", flexGrow: 1 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, marginBottom: spacing.sm },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  desc: { fontFamily: fonts.body, fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: spacing.xl },
  benefitsBox: {
    width: "100%",
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  compareTitle: { fontFamily: fonts.serif, fontSize: 22, marginBottom: spacing.sm },
  planLine: { borderTopWidth: 1, borderTopColor: "rgba(120,120,120,0.18)", paddingTop: 10, marginTop: 10 },
  planLineLabel: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
  planLineText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, marginTop: 3 },
  benefitsHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.sm },
  benefitsTitle: { fontFamily: fonts.bodyBold, fontSize: 14 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  benefitText: { fontFamily: fonts.body, fontSize: 14 },
  priceRow: {
    width: "100%",
    flexDirection: "row",
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  priceLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2 },
  priceIntro: { fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: spacing.sm },
  planGrid: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs, marginBottom: spacing.sm },
  planCard: { flex: 1, borderWidth: 1, borderRadius: radius.md, padding: spacing.sm },
  planCardFeatured: { borderWidth: 2 },
  planBadge: { fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.1, marginBottom: 2 },
  price: { fontFamily: fonts.serif, fontSize: 24, marginTop: 4 },
  priceMonth: { fontFamily: fonts.body, fontSize: 14 },
  planHelp: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 4 },
  selectedText: { fontFamily: fonts.bodyBold, fontSize: 12, marginTop: 8 },
  priceCancel: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginTop: 4 },
  cta: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: radius.pill,
  },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 15 },
  demoNote: { fontFamily: fonts.body, fontSize: 11, textAlign: "center", marginTop: spacing.md, lineHeight: 16 },
});
