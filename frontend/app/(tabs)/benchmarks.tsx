import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fonts, radius, shadow, spacing } from "../../src/theme";
import { api, BenchmarkRow } from "../../src/api";

type SortKey = "score" | "speed" | "accuracy" | "price";

export default function BenchmarksScreen() {
  const router = useRouter();
  const [sort, setSort] = useState<SortKey>("score");
  const [rows, setRows] = useState<BenchmarkRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .benchmarks(sort)
      .then((d) => setRows(d.rows))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sort]);

  const fmtSpeed = (ms: number) => (ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`);
  const sorts: { key: SortKey; label: string }[] = [
    { key: "score", label: "Score" },
    { key: "speed", label: "Vitesse" },
    { key: "accuracy", label: "Précision" },
    { key: "price", label: "Prix" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Benchmarks</Text>
        <Text style={styles.subtitle}>Performances comparées de toutes les IA.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {sorts.map((s) => (
          <TouchableOpacity
            key={s.key}
            onPress={() => setSort(s.key)}
            style={[styles.tab, sort === s.key && styles.tabActive]}
            testID={`bench-sort-${s.key}`}
          >
            <Text style={[styles.tabText, sort === s.key && styles.tabTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={colors.pink} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
          <View style={styles.table}>
            <View style={styles.headRow}>
              <Text style={[styles.headCell, { flex: 2 }]}>IA</Text>
              <Text style={[styles.headCell, { flex: 1, textAlign: "right" }]}>Vitesse</Text>
              <Text style={[styles.headCell, { flex: 1, textAlign: "right" }]}>Préc.</Text>
              <Text style={[styles.headCell, { flex: 1, textAlign: "right" }]}>Score</Text>
            </View>
            {rows.map((r, i) => (
              <TouchableOpacity
                key={r.slug}
                onPress={() => router.push(`/tool/${r.slug}`)}
                style={[styles.row, i % 2 === 1 && { backgroundColor: colors.bgSoft }]}
                testID={`bench-row-${r.slug}`}
              >
                <View style={{ flex: 2 }}>
                  <Text style={styles.rowName}>{r.name}</Text>
                  <Text style={styles.rowVendor}>{r.vendor}</Text>
                </View>
                <Text style={[styles.rowVal, { flex: 1, textAlign: "right" }]}>{fmtSpeed(r.speedMs)}</Text>
                <Text style={[styles.rowVal, { flex: 1, textAlign: "right" }]}>{r.accuracyPct}%</Text>
                <View style={[styles.scorePill, { flex: 1 }]}>
                  <View style={styles.scoreBarBg}>
                    <View style={[styles.scoreBarFill, { width: `${r.score}%` }]} />
                  </View>
                  <Text style={styles.scoreText}>{r.score}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 32, color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  tabs: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  tabActive: { backgroundColor: colors.darkCard, borderColor: colors.darkCard },
  tabText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.textPrimary },
  tabTextActive: { color: colors.textInverse },
  table: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadow.soft,
  },
  headRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.darkCard,
  },
  headCell: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.textInverse, letterSpacing: 1 },
  row: { flexDirection: "row", paddingHorizontal: spacing.md, paddingVertical: 14, alignItems: "center" },
  rowName: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.textPrimary },
  rowVendor: { fontFamily: fonts.body, fontSize: 11, color: colors.textSecondary },
  rowVal: { fontFamily: fonts.bodyMd, fontSize: 13, color: colors.textPrimary },
  scorePill: { alignItems: "flex-end", justifyContent: "center" },
  scoreBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: colors.pinkSoft,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  scoreBarFill: { height: "100%", backgroundColor: colors.pink },
  scoreText: { marginTop: 4, fontFamily: fonts.bodyBold, fontSize: 12, color: colors.textPrimary },
});
