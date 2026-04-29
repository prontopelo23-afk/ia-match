import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from "react-native-reanimated";
import { ChevronLeft, Plus, Minus, Zap, Target, DollarSign, Globe, GitCompare, ExternalLink } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, Tool, RatingSummary, compareStore } from "../../src/api";
import ScoreRing from "../../src/components/ScoreRing";
import LogoTile from "../../src/components/LogoTile";

export default function ToolDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { colors: theme } = useTheme();
  const [tool, setTool] = useState<Tool | null>(null);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [userScore, setUserScore] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inCompare, setInCompare] = useState(false);
  const scale = useSharedValue(1);

  const animatedScore = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const reload = useCallback(async () => {
    if (!slug) return;
    const [t, r, c] = await Promise.all([
      api.getTool(slug).catch(() => null),
      api.ratings(slug).catch(() => null),
      compareStore.get(),
    ]);
    setTool(t);
    setSummary(r);
    setInCompare(c.includes(slug));
  }, [slug]);

  useEffect(() => {
    reload();
  }, [reload]);

  const bump = (delta: number) => {
    setUserScore((s) => Math.max(0, Math.min(100, s + delta)));
    scale.value = withSequence(withSpring(1.15, { damping: 6 }), withSpring(1, { damping: 8 }));
  };

  const submitRating = async () => {
    if (!slug) return;
    setSubmitting(true);
    try {
      await api.rate(slug, userScore);
      setSubmitted(true);
      await reload();
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCompare = async () => {
    if (!slug) return;
    const next = await compareStore.toggle(slug);
    setInCompare(next.includes(slug));
  };

  if (!tool) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.pink} style={{ marginTop: spacing.xl }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80, backgroundColor: theme.bg }}>
        <View style={[styles.headerImg, { backgroundColor: tool.color }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="tool-back">
            <ChevronLeft size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => tool.domain && Linking.openURL(`https://${tool.domain}`).catch(() => {})}
            activeOpacity={0.8}
            style={styles.headerLogoWrap}
            testID="tool-logo-link"
          >
            <LogoTile uri={tool.image} name={tool.name} bg="#fff" size={96} rounded={24} domain={tool.domain} />
            <View style={styles.openBadge}>
              <ExternalLink size={14} color="#fff" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.vendor}>{tool.vendor.toUpperCase()}</Text>
          <Text style={styles.name}>{tool.name}</Text>
          <Text style={styles.tagline}>{tool.tagline}</Text>

          <View style={styles.statsBlock}>
            <Stat icon={<Zap size={16} color={colors.pink} strokeWidth={2.5} />} label="Vitesse"
              value={tool.speedMs < 1000 ? `${tool.speedMs}ms` : `${(tool.speedMs / 1000).toFixed(1)}s`} />
            <Stat icon={<Target size={16} color={colors.pink} strokeWidth={2.5} />} label="Précision"
              value={`${tool.accuracyPct}%`} />
            <Stat icon={<DollarSign size={16} color={colors.pink} strokeWidth={2.5} />} label="Prix"
              value={tool.freeTier ? "Gratuit" : `${tool.monthlyPrice}€/m`} />
            <Stat icon={<Globe size={16} color={colors.pink} strokeWidth={2.5} />} label="Langues"
              value={`${tool.languages.length}`} />
          </View>

          <Text style={styles.section}>À propos</Text>
          <Text style={styles.desc}>{tool.description}</Text>

          <Text style={styles.section}>Points forts</Text>
          <View style={styles.featureRow}>
            {tool.features.map((f) => (
              <View key={f} style={styles.featureChip}>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.section}>Cas d'usage</Text>
          {tool.useCases.map((u) => (
            <Text key={u} style={styles.useCase}>· {u}</Text>
          ))}

          <View style={styles.ratingBlock}>
            <Text style={styles.ratingLabel}>NOTE COMMUNAUTAIRE</Text>
            <Text style={styles.ratingAvg}>
              {summary && summary.count > 0 ? `${summary.average}/100` : "Pas encore de note"}
            </Text>
            {summary && summary.count > 0 ? (
              <Text style={styles.ratingCount}>{summary.count} évaluation(s)</Text>
            ) : null}

            <Text style={[styles.ratingLabel, { marginTop: spacing.lg }]}>TA NOTE</Text>
            <Animated.View style={[styles.ratingRow, animatedScore]}>
              <TouchableOpacity onPress={() => bump(-10)} style={styles.modBtn} testID="rating-minus">
                <Minus size={20} color={colors.textPrimary} strokeWidth={2.5} />
              </TouchableOpacity>
              <ScoreRing score={userScore} size={96} />
              <TouchableOpacity onPress={() => bump(10)} style={styles.modBtn} testID="rating-plus">
                <Plus size={20} color={colors.textPrimary} strokeWidth={2.5} />
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              onPress={submitRating}
              style={[styles.submitBtn, submitted && { backgroundColor: colors.success }]}
              disabled={submitting || submitted}
              testID="rating-submit"
            >
              <Text style={styles.submitText}>
                {submitted ? "Merci pour ta note !" : submitting ? "Envoi..." : "Envoyer la note"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={toggleCompare}
            style={[styles.compareBtn, inCompare && styles.compareBtnActive]}
            testID="tool-toggle-compare"
          >
            <GitCompare size={18} color={inCompare ? "#fff" : colors.textPrimary} strokeWidth={2.5} />
            <Text style={[styles.compareText, inCompare && { color: "#fff" }]}>
              {inCompare ? "Dans le comparatif" : "Ajouter au comparatif"}
            </Text>
          </TouchableOpacity>

          {tool.domain ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(`https://${tool.domain}`).catch(() => {})}
              style={[styles.visitBtn, { borderColor: theme.borderSubtle }]}
              testID="tool-visit-website"
            >
              <ExternalLink size={16} color={theme.textPrimary} strokeWidth={2} />
              <Text style={[styles.visitText, { color: theme.textPrimary }]}>
                Visiter {tool.domain}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      {icon}
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerImg: {
    height: 220,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogoWrap: { position: "relative" },
  openBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(18,21,28,0.35)" },
  backBtn: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: spacing.lg, marginTop: -spacing.lg, backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  vendor: { fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 2, color: colors.pink },
  name: {
    fontFamily: fonts.serif,
    fontSize: 36,
    color: colors.textPrimary,
    letterSpacing: -1,
    marginTop: 4,
  },
  tagline: { fontFamily: fonts.body, fontSize: 16, color: colors.textSecondary, marginTop: 4, lineHeight: 22 },
  statsBlock: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  statBox: {
    flexBasis: "47%",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadow.soft,
  },
  statLabel: { fontFamily: fonts.bodySemi, fontSize: 11, color: colors.textSecondary, marginTop: 4, letterSpacing: 1 },
  statValue: { fontFamily: fonts.bodyBold, fontSize: 20, color: colors.textPrimary, marginTop: 2 },
  section: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  desc: { fontFamily: fonts.body, fontSize: 15, color: colors.textPrimary, lineHeight: 24 },
  featureRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  featureChip: {
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  featureText: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.pink },
  useCase: { fontFamily: fonts.body, fontSize: 14, color: colors.textPrimary, marginTop: 4 },
  ratingBlock: {
    marginTop: spacing.xl,
    backgroundColor: colors.darkCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.dark,
  },
  ratingLabel: { fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 2, color: colors.pink },
  ratingAvg: { fontFamily: fonts.serif, fontSize: 32, color: colors.textInverse, marginTop: 4 },
  ratingCount: { fontFamily: fonts.body, fontSize: 13, color: "rgba(253,251,247,0.6)" },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: "#fff",
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  modBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtn: {
    backgroundColor: colors.coral,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: "center",
    marginTop: spacing.md,
  },
  submitText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 15 },
  compareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginTop: spacing.lg,
  },
  compareBtnActive: { backgroundColor: colors.pink, borderColor: colors.pink },
  compareText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.textPrimary },
  visitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  visitText: { fontFamily: fonts.bodySemi, fontSize: 14 },
});
