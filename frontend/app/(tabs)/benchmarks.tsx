import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight, Layers3, Sparkles } from "lucide-react-native";
import { fonts, radius, shadow, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, BenchmarkRow } from "../../src/api";
import { GENERAL_MODEL_BY_SLUG } from "../../src/utils/generalRanking";
import { CONTENT_FAMILIES, rowMatchesFamily } from "../../src/utils/contentArchitecture";

type SortKey = "score" | "speed" | "accuracy" | "price";
const SORTS: { key: SortKey; label: string; helper: string }[] = [
  { key: "score", label: "Polyvalent", helper: "pour démarrer" },
  { key: "accuracy", label: "Résultat", helper: "qualité d’abord" },
  { key: "speed", label: "Rapide", helper: "répond vite" },
  { key: "price", label: "Budget", helper: "coût réduit" },
];

export default function BenchmarksScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [sort, setSort] = useState<SortKey>("score");
  const [generalRows, setGeneralRows] = useState<BenchmarkRow[]>([]);
  const [allRows, setAllRows] = useState<BenchmarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedTop, setShowAdvancedTop] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.benchmarks(sort, "general"), api.benchmarks(sort, "all")])
      .then(([general, all]) => {
        setGeneralRows(general.rows);
        setAllRows(all.rows);
      })
      .finally(() => setLoading(false));
  }, [sort]);

  const activeSort = SORTS.find((s) => s.key === sort) ?? SORTS[0];
  const familyStats = useMemo(() => CONTENT_FAMILIES.map((family) => ({ family, count: allRows.filter((row) => rowMatchesFamily(row, family)).length })), [allRows]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.eyebrow, { color: colors.coral }]}>CLASSEMENTS</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Classements IA</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Compare les outils par usage, qualité, vitesse ou budget. Commence par le top simple, puis affine selon ton besoin.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sorts}>
          {SORTS.map((item) => (
            <TouchableOpacity key={item.key} onPress={() => setSort(item.key)} style={[styles.sortChip, { backgroundColor: sort === item.key ? colors.coral : colors.surface, borderColor: sort === item.key ? colors.coral : colors.borderSubtle }]}>
              <Text style={[styles.sortLabel, { color: sort === item.key ? "#fff" : colors.textPrimary }]}>{item.label}</Text>
              <Text style={[styles.sortHelper, { color: sort === item.key ? "rgba(255,255,255,0.86)" : colors.textSecondary }]}>{item.helper}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Top · {activeSort.label}</Text>
          <Text style={[styles.sectionMeta, { color: colors.textSecondary }]}>Tri : {activeSort.helper}</Text>
        </View>
        {loading ? <ActivityIndicator color={colors.coral} /> : generalRows.slice(0, showAdvancedTop ? generalRows.length : 4).map((row, index) => <RankCard key={row.slug} row={row} rank={index + 1} compact={!showAdvancedTop} onPress={() => router.push(`/tool/${row.slug}`)} />)}
        {!loading && generalRows.length > 4 ? (
          <TouchableOpacity onPress={() => setShowAdvancedTop((v) => !v)} style={[styles.advancedBtn, { borderColor: colors.borderSubtle }]}>
            <Text style={[styles.advancedBtnText, { color: colors.coral }]}>{showAdvancedTop ? "Revenir au classement simple" : "Voir le classement avancé"}</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Choisir selon ton besoin</Text>
          <Text style={[styles.sectionMeta, { color: colors.textSecondary }]}>Usages regroupés pour éviter les classements interminables</Text>
        </View>
        <View style={styles.familyList}>
          {familyStats.map(({ family, count }) => (
            <TouchableOpacity key={family.slug} onPress={() => router.push(`/benchmarks/category/${family.slug}`)} style={[styles.familyCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
              <View style={[styles.familyIcon, { backgroundColor: colors.coralSoft }]}><Layers3 size={18} color={colors.coral} /></View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.familyTitle, { color: colors.textPrimary }]}>{family.label}</Text>
                <Text style={[styles.familyDesc, { color: colors.textSecondary }]} numberOfLines={2}>{family.description}</Text>
                <Text style={[styles.familyMeta, { color: colors.coral }]}>{count || "—"} outils app · top adapté à cet usage</Text>
              </View>
              <ChevronRight size={18} color={colors.coral} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function RankCard({ row, rank, compact, onPress }: { row: BenchmarkRow; rank: number; compact?: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const context = GENERAL_MODEL_BY_SLUG[row.slug];
  const bestFor = row.bestFor ?? context?.bestFor ?? "usage général";
  const whyRanked = row.whyRanked ?? context?.whyRanked ?? "Bon niveau global dans les données IA Match.";
  const limitation = row.limitation ?? context?.limitation ?? "À comparer selon ton besoin exact.";
  const confidence = row.confidence ?? context?.confidence ?? "moyenne";
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
      <View style={styles.cardTop}>
        <View style={[styles.rank, { backgroundColor: rank === 1 ? colors.coral : colors.coralSoft }]}><Text style={[styles.rankText, { color: rank === 1 ? "#fff" : colors.coral }]}>#{rank}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowName, { color: colors.textPrimary }]}>{row.name}</Text>
          <Text style={[styles.rowMeta, { color: colors.textSecondary }]}>{row.displayModel ?? row.vendor}</Text>
        </View>
        <View style={[styles.scoreBox, { backgroundColor: colors.coralSoft }]}>
          <Text style={[styles.score, { color: colors.textPrimary }]}>{row.score}</Text>
          <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>repère</Text>
        </View>
      </View>
      <Text style={[styles.pill, { color: colors.coral }]}><Sparkles size={12} color={colors.coral} /> Meilleur pour : {bestFor}</Text>
      <Text style={[styles.cardLine, { color: colors.textSecondary }]}><Text style={{ fontFamily: fonts.bodyBold }}>Pourquoi ici : </Text>{whyRanked}</Text>
      {!compact ? <Text style={[styles.cardLine, { color: colors.textSecondary }]}><Text style={{ fontFamily: fonts.bodyBold }}>Limite : </Text>{limitation}</Text> : null}
      {!compact && confidence === "haute" ? <Text style={[styles.confidence, { color: colors.textSecondary }]}>Confiance élevée</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 41, letterSpacing: -1 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, marginBottom: spacing.md },
  helpCard: { flexDirection: "row", gap: spacing.sm, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  helpText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, flex: 1 },
  sorts: { gap: 8, paddingBottom: spacing.md },
  sortChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.lg, borderWidth: 1, minWidth: 116 },
  sortLabel: { fontFamily: fonts.bodyBold, fontSize: 12 },
  sortHelper: { fontFamily: fonts.body, fontSize: 10, marginTop: 2 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30 },
  sectionHead: { marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionMeta: { fontFamily: fonts.bodyBold, fontSize: 11, marginTop: 2 },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, ...shadow.soft },
  cardTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  rank: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  rankText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  rowName: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 25 },
  rowMeta: { fontFamily: fonts.body, fontSize: 12 },
  scoreBox: { minWidth: 58, borderRadius: radius.md, alignItems: "center", paddingVertical: 6 },
  score: { fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 20 },
  scoreLabel: { fontFamily: fonts.bodyBold, fontSize: 9, textTransform: "uppercase" },
  pill: { fontFamily: fonts.bodyBold, fontSize: 12, lineHeight: 18, marginBottom: 6 },
  cardLine: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginTop: 3 },
  confidence: { fontFamily: fonts.bodyBold, fontSize: 10, marginTop: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  advancedBtn: { alignSelf: "center", borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 10, marginTop: spacing.sm },
  advancedBtnText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  familyList: { gap: spacing.sm },
  familyCard: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  familyIcon: { width: 40, height: 40, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  familyTitle: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 24 },
  familyDesc: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 3 },
  familyMeta: { fontFamily: fonts.bodyBold, fontSize: 10, marginTop: 6 },
});
