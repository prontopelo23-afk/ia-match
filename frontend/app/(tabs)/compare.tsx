import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { Plus, GitCompare, Copy, Check, X } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme, usePremium } from "../../src/theme-context";
import { api, Tool, compareStore, COMPARE_LIMIT } from "../../src/api";
import ScoreRing from "../../src/components/ScoreRing";
import LogoTile from "../../src/components/LogoTile";
import PremiumGate from "../../src/components/PremiumGate";

export default function CompareScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const slugs = await compareStore.get();
    if (slugs.length === 0) {
      setTools([]);
      setLoading(false);
      return;
    }
    const fetched = await Promise.all(slugs.map((s) => api.getTool(s).catch(() => null)));
    setTools(fetched.filter((t): t is Tool => !!t));
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const removeAt = async (slug: string) => {
    const slugs = await compareStore.get();
    await compareStore.set(slugs.filter((s) => s !== slug));
    load();
  };

  const exportText = async () => {
    if (tools.length < 2) return;
    const fmtSpeed = (ms: number) => (ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`);
    const fmtPrice = (t: Tool) => (t.freeTier ? "Gratuit" : `${t.monthlyPrice.toFixed(2)}€/mois`);
    const headerLine = "IA Match — Comparatif détaillé\n";
    const colsHeader = ["Critère", ...tools.map((t) => t.name)].join(" | ");
    const sep = ["---", ...tools.map(() => "---")].join(" | ");
    const rows = [
      ["Score", ...tools.map((t) => `${t.score}/100`)],
      ["Vitesse", ...tools.map((t) => fmtSpeed(t.speedMs))],
      ["Précision", ...tools.map((t) => `${t.accuracyPct}%`)],
      ["Tarif", ...tools.map(fmtPrice)],
      ["Langues", ...tools.map((t) => t.languages.join(", "))],
      ["Lien", ...tools.map((t) => t.domain ? `https://${t.domain}` : "—")],
    ];
    const out = [headerLine, colsHeader, sep, ...rows.map((r) => r.join(" | "))].join("\n");
    try { await Clipboard.setStringAsync(out); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
        <PremiumGate
          feature="Comparateur"
          description="Mets jusqu'à 4 IA face à face avec un comparatif détaillé : score, vitesse, précision, tarif, langues. Détection du gagnant pour chaque critère + export."
          benefits={[
            "Compare jusqu'à 4 IA simultanément",
            "Score global, vitesse, précision, tarif, couverture langues",
            "Mise en évidence du gagnant par critère",
            "Export du tableau au presse-papiers",
          ]}
        />
      </SafeAreaView>
    );
  }

  const renderRow = (label: string, valueFn: (t: Tool) => string, winnerFn: (a: Tool, b: Tool) => number) => {
    if (tools.length < 2) return null;
    const winnerIdx = tools.reduce((bestIdx, t, i) => (winnerFn(t, tools[bestIdx]) <= 0 ? i : bestIdx), 0);
    return (
      <View style={[styles.row, { borderTopColor: colors.borderSubtle }]} key={label}>
        <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
        <View style={styles.rowVals}>
          {tools.map((t, i) => (
            <Text
              key={t.slug}
              style={[
                styles.rowVal,
                { color: colors.textPrimary },
                i === winnerIdx && { color: colors.coral, fontFamily: fonts.bodyBold },
              ]}
            >
              {valueFn(t)}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Comparer</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Compare jusqu'à {COMPARE_LIMIT} IA côte à côte. {tools.length}/{COMPARE_LIMIT} sélectionnée{tools.length > 1 ? "s" : ""}.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
          {/* Tool cards row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
            {tools.map((t) => (
              <View key={t.slug} style={[styles.slot, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
                <TouchableOpacity
                  onPress={() => removeAt(t.slug)}
                  style={[styles.removeIcon, { backgroundColor: colors.coral }]}
                  testID={`compare-remove-${t.slug}`}
                >
                  <X size={12} color="#fff" strokeWidth={3} />
                </TouchableOpacity>
                <LogoTile uri={t.image} name={t.name} bg={t.color} size={56} rounded={14} domain={t.domain} />
                <Text style={[styles.slotName, { color: colors.textPrimary }]} numberOfLines={1}>{t.name}</Text>
                <Text style={[styles.slotVendor, { color: colors.textSecondary }]} numberOfLines={1}>{t.vendor}</Text>
                <ScoreRing score={t.score} size={48} />
              </View>
            ))}
            {tools.length < COMPARE_LIMIT ? (
              <TouchableOpacity
                style={[styles.slot, styles.slotEmpty, { borderColor: colors.coral, backgroundColor: colors.coralSoft }]}
                onPress={() => router.push("/(tabs)")}
                testID="compare-add"
              >
                <Plus size={28} color={colors.coral} strokeWidth={2.5} />
                <Text style={[styles.slotEmptyText, { color: colors.coral }]}>Choisir une IA</Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>

          {tools.length < 2 ? (
            <Text style={[styles.empty, { color: colors.textSecondary }]}>
              Sélectionne au moins 2 IA depuis le Catalogue pour démarrer le comparatif.
            </Text>
          ) : (
            <View style={[styles.table, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
              <View style={styles.headerRow}>
                <GitCompare size={16} color={colors.coral} strokeWidth={2.5} />
                <Text style={[styles.tableHeader, { color: colors.textPrimary }]}>Comparatif détaillé</Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={exportText} style={[styles.exportBtn, { borderColor: colors.borderSubtle }]} testID="compare-export">
                  {copied ? <Check size={14} color={colors.success} strokeWidth={2.5} /> : <Copy size={14} color={colors.textPrimary} strokeWidth={2} />}
                  <Text style={[styles.exportText, { color: colors.textPrimary }]}>{copied ? "Copié" : "Exporter"}</Text>
                </TouchableOpacity>
              </View>

              {renderRow(
                "Score global",
                (t) => `${t.score}/100`,
                (a, b) => b.score - a.score
              )}
              {renderRow(
                "Vitesse",
                (t) => (t.speedMs < 1000 ? `${t.speedMs}ms` : `${(t.speedMs / 1000).toFixed(1)}s`),
                (a, b) => a.speedMs - b.speedMs
              )}
              {renderRow(
                "Précision",
                (t) => `${t.accuracyPct}%`,
                (a, b) => b.accuracyPct - a.accuracyPct
              )}
              {renderRow(
                "Tarif",
                (t) => (t.freeTier ? "Gratuit" : `${t.monthlyPrice.toFixed(2)}€/m`),
                (a, b) => (a.freeTier ? 0 : a.monthlyPrice) - (b.freeTier ? 0 : b.monthlyPrice)
              )}
              {renderRow(
                "Langues",
                (t) => `${t.languages.length}`,
                (a, b) => b.languages.length - a.languages.length
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 32, letterSpacing: -0.5 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, marginTop: 4 },
  cardsRow: { gap: spacing.sm, paddingVertical: spacing.sm, paddingRight: spacing.lg },
  slot: {
    width: 140,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    minHeight: 200,
    gap: 6,
    position: "relative",
  },
  removeIcon: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  slotEmpty: {
    paddingTop: spacing.lg,
    justifyContent: "center",
    borderStyle: "dashed",
  },
  slotEmptyText: { fontFamily: fonts.bodySemi, marginTop: 8 },
  slotName: { fontFamily: fonts.serif, fontSize: 16, marginTop: 4 },
  slotVendor: { fontFamily: fonts.body, fontSize: 11 },
  table: {
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    marginTop: spacing.lg,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.sm },
  tableHeader: { fontFamily: fonts.bodyBold, fontSize: 14 },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  exportText: { fontFamily: fonts.bodySemi, fontSize: 11 },
  row: { paddingVertical: 12, borderTopWidth: 1 },
  rowLabel: { fontFamily: fonts.bodySemi, fontSize: 12, marginBottom: 6 },
  rowVals: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  rowVal: { flex: 1, fontFamily: fonts.bodyMd, fontSize: 13, textAlign: "left" },
  empty: {
    textAlign: "center",
    fontFamily: fonts.body,
    fontSize: 14,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
