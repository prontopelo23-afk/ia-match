import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Sparkles, Zap, Target } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../theme";
import ScoreRing from "./ScoreRing";
import type { Tool } from "../api";

type Props = {
  tool: Tool;
  matchScore?: number;
  onCompare?: () => void;
  inCompare?: boolean;
  testID?: string;
};

export default function ToolCard({ tool, matchScore, onCompare, inCompare, testID }: Props) {
  const router = useRouter();
  const score = matchScore ?? tool.score;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/tool/${tool.slug}`)}
      style={styles.card}
      testID={testID || `tool-card-${tool.slug}`}
    >
      <View style={styles.row}>
        <Image source={{ uri: tool.image }} style={styles.thumb} />
        <View style={styles.info}>
          <Text style={styles.vendor} numberOfLines={1}>
            {tool.vendor.toUpperCase()}
          </Text>
          <Text style={styles.name} numberOfLines={1}>
            {tool.name}
          </Text>
          <Text style={styles.tagline} numberOfLines={2}>
            {tool.tagline}
          </Text>
        </View>
        <ScoreRing score={score} size={56} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Zap size={14} color={colors.textSecondary} strokeWidth={2} />
          <Text style={styles.statText}>
            {tool.speedMs < 1000 ? `${tool.speedMs}ms` : `${(tool.speedMs / 1000).toFixed(1)}s`}
          </Text>
        </View>
        <View style={styles.stat}>
          <Target size={14} color={colors.textSecondary} strokeWidth={2} />
          <Text style={styles.statText}>{tool.accuracyPct}%</Text>
        </View>
        <View style={styles.stat}>
          <Sparkles size={14} color={colors.textSecondary} strokeWidth={2} />
          <Text style={styles.statText}>
            {tool.freeTier ? "Gratuit" : `${tool.monthlyPrice.toFixed(0)}€/m`}
          </Text>
        </View>
      </View>

      {onCompare ? (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onCompare();
          }}
          style={[styles.compareBtn, inCompare && styles.compareBtnActive]}
          testID={`compare-toggle-${tool.slug}`}
        >
          <Text style={[styles.compareText, inCompare && styles.compareTextActive]}>
            {inCompare ? "Retirer du comparatif" : "Ajouter au comparatif"}
          </Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadow.soft,
  },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  thumb: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: "#eee" },
  info: { flex: 1, marginHorizontal: spacing.sm },
  vendor: {
    fontFamily: fonts.bodySemi,
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2,
  },
  name: { fontFamily: fonts.serif, fontSize: 20, color: colors.textPrimary, lineHeight: 24 },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  stat: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontFamily: fonts.bodyMd, fontSize: 12, color: colors.textSecondary },
  compareBtn: {
    marginTop: spacing.sm,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: "center",
  },
  compareBtnActive: { borderColor: colors.pink, backgroundColor: colors.pinkSoft },
  compareText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.textPrimary },
  compareTextActive: { color: colors.pink },
});
