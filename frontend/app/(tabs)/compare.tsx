import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Plus, GitCompare } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../../src/theme";
import { api, Tool, compareStore } from "../../src/api";
import ScoreRing from "../../src/components/ScoreRing";

export default function CompareScreen() {
  const router = useRouter();
  const [tools, setTools] = useState<(Tool | null)[]>([null, null]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const slugs = await compareStore.get();
    const fetched = await Promise.all(slugs.map((s) => api.getTool(s).catch(() => null)));
    while (fetched.length < 2) fetched.push(null);
    setTools(fetched.slice(0, 2));
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const removeAt = async (i: number) => {
    const slugs = await compareStore.get();
    const next = slugs.filter((_, idx) => idx !== i);
    await compareStore.set(next);
    load();
  };

  const rows = tools[0] && tools[1] ? buildRows(tools[0], tools[1]) : [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Comparer</Text>
        <Text style={styles.subtitle}>Compare deux IA côte à côte.</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.pink} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
          <View style={styles.grid}>
            {[0, 1].map((i) => {
              const t = tools[i];
              if (!t) {
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.slot, styles.slotEmpty]}
                    onPress={() => router.push("/search")}
                    testID={`compare-add-${i}`}
                  >
                    <Plus size={28} color={colors.pink} strokeWidth={2.5} />
                    <Text style={styles.slotEmptyText}>Choisir une IA</Text>
                  </TouchableOpacity>
                );
              }
              return (
                <View key={t.slug} style={styles.slot} testID={`compare-slot-${i}`}>
                  <Image source={{ uri: t.image }} style={styles.slotImg} />
                  <View style={{ alignItems: "center", marginTop: -28 }}>
                    <ScoreRing score={t.score} size={56} />
                  </View>
                  <Text style={styles.slotName} numberOfLines={1}>
                    {t.name}
                  </Text>
                  <Text style={styles.slotVendor}>{t.vendor}</Text>
                  <TouchableOpacity onPress={() => removeAt(i)} style={styles.removeBtn}>
                    <Text style={styles.removeText}>Retirer</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {rows.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.headerRow}>
                <GitCompare size={16} color={colors.pink} strokeWidth={2.5} />
                <Text style={styles.tableHeader}>Comparatif détaillé</Text>
              </View>
              {rows.map((r) => (
                <View key={r.label} style={styles.row}>
                  <Text style={styles.rowLabel}>{r.label}</Text>
                  <View style={styles.rowVals}>
                    <Text style={[styles.rowVal, r.winner === 0 && styles.winner]}>{r.left}</Text>
                    <Text style={[styles.rowVal, r.winner === 1 && styles.winner]}>{r.right}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.empty}>
              Sélectionne deux IA depuis la recherche pour voir le comparatif détaillé.
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function buildRows(a: Tool, b: Tool) {
  const fmtSpeed = (ms: number) => (ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`);
  const fmtPrice = (t: Tool) => (t.freeTier ? "Gratuit" : `${t.monthlyPrice.toFixed(2)}€/mois`);
  return [
    { label: "Score global", left: `${a.score}/100`, right: `${b.score}/100`, winner: a.score >= b.score ? 0 : 1 },
    {
      label: "Vitesse",
      left: fmtSpeed(a.speedMs),
      right: fmtSpeed(b.speedMs),
      winner: a.speedMs <= b.speedMs ? 0 : 1,
    },
    {
      label: "Précision",
      left: `${a.accuracyPct}%`,
      right: `${b.accuracyPct}%`,
      winner: a.accuracyPct >= b.accuracyPct ? 0 : 1,
    },
    {
      label: "Tarif",
      left: fmtPrice(a),
      right: fmtPrice(b),
      winner:
        (a.freeTier ? 0 : a.monthlyPrice) <= (b.freeTier ? 0 : b.monthlyPrice) ? 0 : 1,
    },
    {
      label: "Langues",
      left: `${a.languages.length}`,
      right: `${b.languages.length}`,
      winner: a.languages.length >= b.languages.length ? 0 : 1,
    },
  ];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 32, color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  grid: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  slot: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    paddingTop: 0,
    overflow: "hidden",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadow.soft,
    minHeight: 220,
  },
  slotImg: {
    width: "100%",
    height: 100,
    marginHorizontal: -spacing.md,
    backgroundColor: "#eee",
    marginTop: 0,
  },
  slotEmpty: {
    paddingTop: spacing.md,
    justifyContent: "center",
    borderStyle: "dashed",
    borderColor: colors.pink,
    backgroundColor: colors.pinkSoft,
  },
  slotEmptyText: { fontFamily: fonts.bodySemi, color: colors.pink, marginTop: 8 },
  slotName: { fontFamily: fonts.serif, fontSize: 20, color: colors.textPrimary, marginTop: 8 },
  slotVendor: { fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary },
  removeBtn: { marginTop: spacing.sm, paddingVertical: 6, paddingHorizontal: 12 },
  removeText: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.error },
  table: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadow.soft,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.sm },
  tableHeader: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.textPrimary },
  row: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  rowLabel: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  rowVals: { flexDirection: "row", justifyContent: "space-between" },
  rowVal: { flex: 1, fontFamily: fonts.bodyMd, fontSize: 14, color: colors.textPrimary, textAlign: "left" },
  winner: { color: colors.pink, fontFamily: fonts.bodyBold },
  empty: {
    textAlign: "center",
    fontFamily: fonts.body,
    color: colors.textSecondary,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
