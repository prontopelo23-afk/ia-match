import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react-native";
import { colors, fonts, radius, spacing } from "../../src/theme";
import { api, Tool, Category, compareStore } from "../../src/api";
import ToolCard from "../../src/components/ToolCard";

export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(params.category);
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState<"score" | "speed" | "accuracy" | "price">("score");
  const [tools, setTools] = useState<Tool[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  const load = useCallback(() => {
    setLoading(true);
    api
      .listTools({ search, category: activeCategory, free_only: freeOnly, sort })
      .then(setTools)
      .catch(() => setTools([]))
      .finally(() => setLoading(false));
  }, [search, activeCategory, freeOnly, sort]);

  useEffect(() => {
    api.listCategories().then(setCats).catch(() => {});
    compareStore.get().then(setCompareList);
  }, []);
  useEffect(() => {
    const id = setTimeout(load, 250);
    return () => clearTimeout(id);
  }, [load]);

  const toggleCompare = async (slug: string) => {
    const next = await compareStore.toggle(slug);
    setCompareList(next);
  };

  const sortOptions: { key: typeof sort; label: string }[] = [
    { key: "score", label: "Score" },
    { key: "speed", label: "Vitesse" },
    { key: "accuracy", label: "Précision" },
    { key: "price", label: "Prix" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Recherche</Text>
        <Text style={styles.subtitle}>Trouve l'IA exacte qu'il te faut.</Text>
      </View>

      <View style={styles.searchBox}>
        <SearchIcon size={20} color={colors.textSecondary} strokeWidth={2} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Mot-clé, IA, besoin..."
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          testID="search-input"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")} testID="search-clear">
            <X size={18} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        <TouchableOpacity
          onPress={() => setActiveCategory(undefined)}
          style={[styles.chip, !activeCategory && styles.chipActive]}
          testID="filter-cat-all"
        >
          <Text style={[styles.chipText, !activeCategory && styles.chipTextActive]}>Tout</Text>
        </TouchableOpacity>
        {cats.map((c) => (
          <TouchableOpacity
            key={c.slug}
            onPress={() => setActiveCategory(activeCategory === c.slug ? undefined : c.slug)}
            style={[styles.chip, activeCategory === c.slug && styles.chipActive]}
            testID={`filter-cat-${c.slug}`}
          >
            <Text style={[styles.chipText, activeCategory === c.slug && styles.chipTextActive]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.filtersRow}>
        <View style={styles.sortRow}>
          <SlidersHorizontal size={14} color={colors.textSecondary} strokeWidth={2} />
          {sortOptions.map((o) => (
            <TouchableOpacity
              key={o.key}
              onPress={() => setSort(o.key)}
              style={[styles.sortBtn, sort === o.key && styles.sortBtnActive]}
              testID={`sort-${o.key}`}
            >
              <Text style={[styles.sortText, sort === o.key && styles.sortTextActive]}>{o.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => setFreeOnly((v) => !v)}
          style={[styles.freeChip, freeOnly && styles.freeChipActive]}
          testID="filter-free-only"
        >
          <Text style={[styles.freeText, freeOnly && styles.freeTextActive]}>
            {freeOnly ? "Gratuit ✓" : "Gratuit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator color={colors.pink} style={{ marginTop: spacing.lg }} />
        ) : tools.length === 0 ? (
          <Text style={styles.empty}>Aucune IA ne correspond à ces critères.</Text>
        ) : (
          tools.map((t) => (
            <ToolCard
              key={t.slug}
              tool={t}
              onCompare={() => toggleCompare(t.slug)}
              inCompare={compareList.includes(t.slug)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 32, color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginTop: spacing.sm,
  },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.textPrimary },
  chipsRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: 8 },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.darkCard, borderColor: colors.darkCard },
  chipText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.textPrimary },
  chipTextActive: { color: colors.textInverse },
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
  },
  sortRow: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1, flexWrap: "wrap" },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  sortBtnActive: { backgroundColor: colors.pinkSoft },
  sortText: { fontFamily: fonts.bodyMd, fontSize: 12, color: colors.textSecondary },
  sortTextActive: { color: colors.pink, fontFamily: fonts.bodySemi },
  freeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  freeChipActive: { backgroundColor: colors.pink, borderColor: colors.pink },
  freeText: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.textPrimary },
  freeTextActive: { color: "#fff" },
  empty: {
    textAlign: "center",
    fontFamily: fonts.body,
    color: colors.textSecondary,
    marginTop: spacing.xl,
  },
});
