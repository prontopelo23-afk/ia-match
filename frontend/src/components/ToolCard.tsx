import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Sparkles, Zap, Target } from "lucide-react-native";
import { fonts, radius, spacing } from "../theme";
import { useTheme } from "../theme-context";
import ScoreRing from "./ScoreRing";
import LogoTile from "./LogoTile";
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
  const { colors } = useTheme();
  const score = matchScore ?? tool.score;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/tool/${tool.slug}`)}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
      ]}
      testID={testID || `tool-card-${tool.slug}`}
    >
      <View style={styles.row}>
        <LogoTile uri={tool.image} name={tool.name} bg={tool.color} size={56} rounded={radius.md} />
        <View style={styles.info}>
          <Text style={[styles.vendor, { color: colors.textSecondary }]} numberOfLines={1}>
            {tool.vendor.toUpperCase()}
          </Text>
          <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {tool.name}
          </Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]} numberOfLines={2}>
            {tool.tagline}
          </Text>
        </View>
        <ScoreRing score={score} size={56} />
      </View>

      <View style={[styles.statsRow, { borderTopColor: colors.borderSubtle }]}>
        <View style={styles.stat}>
          <Zap size={14} color={colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {tool.speedMs < 1000 ? `${tool.speedMs}ms` : `${(tool.speedMs / 1000).toFixed(1)}s`}
          </Text>
        </View>
        <View style={styles.stat}>
          <Target size={14} color={colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>{tool.accuracyPct}%</Text>
        </View>
        <View style={styles.stat}>
          <Sparkles size={14} color={colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
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
          style={[
            styles.compareBtn,
            { borderColor: colors.borderSubtle },
            inCompare && { borderColor: colors.coral, backgroundColor: colors.coralSoft },
          ]}
          testID={`compare-toggle-${tool.slug}`}
        >
          <Text
            style={[
              styles.compareText,
              { color: colors.textPrimary },
              inCompare && { color: colors.coral },
            ]}
          >
            {inCompare ? "Retirer du comparatif" : "Ajouter au comparatif"}
          </Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  info: { flex: 1, marginHorizontal: spacing.sm },
  vendor: { fontFamily: fonts.bodySemi, fontSize: 10, letterSpacing: 1, marginBottom: 2 },
  name: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 24 },
  tagline: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 2 },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  stat: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontFamily: fonts.bodyMd, fontSize: 12 },
  compareBtn: {
    marginTop: spacing.sm,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: "center",
  },
  compareText: { fontFamily: fonts.bodySemi, fontSize: 13 },
});
