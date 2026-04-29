import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Lock, Crown, Check } from "lucide-react-native";
import { useTheme, usePremium } from "../theme-context";
import { fonts, radius, spacing } from "../theme";

type Props = { feature: string; description: string; benefits: string[] };

export default function PremiumGate({ feature, description, benefits }: Props) {
  const { colors } = useTheme();
  const { setPremium } = usePremium();
  return (
    <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: colors.bg }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.coralSoft }]}>
        <Lock size={28} color={colors.coral} strokeWidth={2.5} />
      </View>
      <Text style={[styles.eyebrow, { color: colors.coral }]}>RÉSERVÉ AU PLAN PREMIUM</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{feature}</Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>{description}</Text>

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

      <View style={[styles.priceRow, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>OFFRE DE LANCEMENT</Text>
          <Text style={[styles.price, { color: colors.textPrimary }]}>9,99€<Text style={[styles.priceMonth, { color: colors.textSecondary }]}> / mois</Text></Text>
          <Text style={[styles.priceCancel, { color: colors.textSecondary }]}>Sans engagement, annulable à tout moment.</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.cta, { backgroundColor: colors.coral }]}
        onPress={() => setPremium(true)}
        testID="premium-activate"
      >
        <Crown size={16} color="#fff" strokeWidth={2.5} />
        <Text style={styles.ctaText}>Activer Premium</Text>
      </TouchableOpacity>

      <Text style={[styles.demoNote, { color: colors.textSecondary }]}>
        Démo : activation simulée pour la preview. Une intégration paiement (Stripe) sera ajoutée en V2.
      </Text>

      <View style={{ height: 80 }} />
    </ScrollView>
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
  price: { fontFamily: fonts.serif, fontSize: 32, marginTop: 4 },
  priceMonth: { fontFamily: fonts.body, fontSize: 14 },
  priceCancel: { fontFamily: fonts.body, fontSize: 12, marginTop: 4 },
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
