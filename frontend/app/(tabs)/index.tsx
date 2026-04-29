import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search as SearchIcon,
  X,
  Sparkles,
  ArrowRight,
  Wand2,
  GitCompare,
  BarChart3,
  Copy,
  Check,
} from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { colors, fonts, radius, shadow, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, Category, Tool, Template, compareStore } from "../../src/api";
import ToolCard from "../../src/components/ToolCard";

export default function Catalogue() {
  const router = useRouter();
  const { colors: theme } = useTheme();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState<"score" | "speed" | "accuracy" | "price">("score");
  const [tools, setTools] = useState<Tool[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [potdCopied, setPotdCopied] = useState(false);

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
    api.listTemplates().then(setTemplates).catch(() => {});
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

  // Daily prompt: pick deterministically from templates by day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const potd = templates.length > 0 ? templates[dayOfYear % templates.length] : null;

  const copyPotd = async () => {
    if (!potd) return;
    try {
      await Clipboard.setStringAsync(potd.body);
    } catch {}
    setPotdCopied(true);
    setTimeout(() => setPotdCopied(false), 1500);
  };

  const totalCount = tools.length;
  const filtersActive = !!search || !!activeCategory || freeOnly;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View style={styles.brandLockup}>
            <Image source={require("../../assets/brand/ia-match-logo.png")} style={styles.brandLogo} resizeMode="contain" />
            <View>
              <Text style={[styles.brandName, { color: theme.textPrimary }]}>IA Match</Text>
              <Text style={[styles.brandSub, { color: theme.textSecondary }]}>SEED · {totalCount} IA</Text>
            </View>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push("/benchmarks")}
              testID="open-benchmarks"
            >
              <BarChart3 size={18} color={colors.textPrimary} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push("/compare")}
              testID="open-compare"
            >
              <GitCompare size={18} color={colors.textPrimary} strokeWidth={2} />
              {compareList.length > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{compareList.length}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO */}
        <View style={styles.hero} testID="hero-section">
          <Text style={styles.heroLabel}>WORKSPACE · CATALOGUE</Text>
          <Text style={styles.heroTitle}>
            Trouve l'IA{"\n"}
            <Text style={styles.heroTitleAccent}>idéale</Text> pour ton besoin.
          </Text>
          <Text style={styles.heroSub}>
            111 IA testées, classées et notées par spécialité. 3 questions et tu sais laquelle utiliser.
          </Text>
          <TouchableOpacity
            style={styles.cta}
            onPress={() => router.push("/match")}
            testID="cta-start-match"
          >
            <Wand2 size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.ctaText}>Lancer le Match</Text>
            <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* HOW IT WORKS — pédagogie 3 étapes */}
        <View style={[styles.howCard, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]} testID="how-it-works">
          <Text style={[styles.howTitle, { color: theme.textPrimary }]}>Comment ça marche ?</Text>
          <View style={styles.howStep}>
            <View style={[styles.howNum, { backgroundColor: theme.coral }]}>
              <Text style={styles.howNumText}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.howStepTitle, { color: theme.textPrimary }]}>Choisis ta spécialité</Text>
              <Text style={[styles.howStepDesc, { color: theme.textSecondary }]}>
                Texte, image, code… filtre par catégorie pour voir le top 3 par spécialité (badge #1).
              </Text>
            </View>
          </View>
          <View style={styles.howStep}>
            <View style={[styles.howNum, { backgroundColor: theme.coral }]}>
              <Text style={styles.howNumText}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.howStepTitle, { color: theme.textPrimary }]}>Compare les scores</Text>
              <Text style={[styles.howStepDesc, { color: theme.textSecondary }]}>
                Note générale (toutes spécialités) et note par catégorie. Une IA peut être 88/100 en général mais 95/100 en image.
              </Text>
            </View>
          </View>
          <View style={styles.howStep}>
            <View style={[styles.howNum, { backgroundColor: theme.coral }]}>
              <Text style={styles.howNumText}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.howStepTitle, { color: theme.textPrimary }]}>Teste sans risque</Text>
              <Text style={[styles.howStepDesc, { color: theme.textSecondary }]}>
                Touche une carte pour la fiche détaillée, ou lance le Match si tu hésites.
              </Text>
            </View>
          </View>
        </View>

        {/* PROMPT DU JOUR */}
        {potd ? (
          <View style={[styles.potdCard, { backgroundColor: theme.coralSoft, borderColor: theme.coral }]} testID="potd-card">
            <View style={styles.potdHead}>
              <Sparkles size={14} color={theme.coral} strokeWidth={2.5} />
              <Text style={[styles.potdLabel, { color: theme.coral }]}>PROMPT DU JOUR · {potd.level}</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={copyPotd} style={styles.potdCopy} testID="potd-copy">
                {potdCopied ? (
                  <Check size={14} color={theme.success} strokeWidth={2.5} />
                ) : (
                  <Copy size={14} color={theme.coral} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={[styles.potdTitle, { color: theme.textPrimary }]}>{potd.title}</Text>
            <Text style={[styles.potdBody, { color: theme.textSecondary }]} numberOfLines={3}>
              {potd.body}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/builder")}
              style={[styles.potdCta, { backgroundColor: theme.coral }]}
              testID="potd-open-builder"
            >
              <Wand2 size={14} color="#fff" strokeWidth={2.5} />
              <Text style={styles.potdCtaText}>Ouvrir dans le Builder</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <SearchIcon size={18} color={colors.textSecondary} strokeWidth={2} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Mot-clé, IA, besoin..."
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
            testID="search-input"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")} testID="search-clear">
              <X size={16} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* CATEGORIES */}
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
              <Text style={[styles.chipText, activeCategory === c.slug && styles.chipTextActive]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SORT + FREE */}
        <View style={styles.filtersRow}>
          <View style={styles.sortRow}>
            {(["score", "speed", "accuracy", "price"] as const).map((k) => (
              <TouchableOpacity
                key={k}
                onPress={() => setSort(k)}
                style={[styles.sortBtn, sort === k && styles.sortBtnActive]}
                testID={`sort-${k}`}
              >
                <Text style={[styles.sortText, sort === k && styles.sortTextActive]}>
                  {k === "score" ? "Score" : k === "speed" ? "Vitesse" : k === "accuracy" ? "Précision" : "Prix"}
                </Text>
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

        {/* RESULTS */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultLabel}>{filtersActive ? "RÉSULTATS" : "TOUTES LES IA"}</Text>
          <Text style={styles.resultCount}>{totalCount}</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.lg }} />
        ) : tools.length === 0 ? (
          <Text style={styles.empty}>Aucune IA ne correspond à ces critères.</Text>
        ) : (
          tools.map((t, i) => (
            <ToolCard
              key={t.slug}
              tool={t}
              onCompare={() => toggleCompare(t.slug)}
              inCompare={compareList.includes(t.slug)}
              activeCategory={activeCategory || undefined}
              rank={activeCategory ? i + 1 : undefined}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandLogo: { width: 44, height: 44, borderRadius: 8 },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.coral,
    alignItems: "center",
    justifyContent: "center",
  },
  brandIconText: { color: "#fff", fontFamily: fonts.serif, fontSize: 22, lineHeight: 26 },
  brandName: { fontFamily: fonts.serif, fontSize: 18, color: colors.textPrimary, lineHeight: 20 },
  brandSub: { fontFamily: fonts.bodySemi, fontSize: 10, letterSpacing: 1.5, color: colors.textSecondary },
  topActions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.coral,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 10 },

  hero: {
    backgroundColor: colors.darkCard,
    borderRadius: radius.xl,
    padding: spacing.lg,
    paddingVertical: spacing.xl,
    marginTop: spacing.sm,
    ...shadow.dark,
  },
  heroLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.coral,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 38,
    lineHeight: 44,
    color: colors.textInverse,
    letterSpacing: -1,
  },
  heroTitleAccent: { color: colors.coral, fontStyle: "italic" },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(253,251,247,0.7)",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.coral,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },

  potdCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  potdHead: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  potdLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  potdCopy: { padding: 4 },
  potdTitle: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 24, marginBottom: 6 },
  potdBody: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  potdCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    marginTop: spacing.sm,
  },
  potdCtaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 12 },

  howCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  howTitle: { fontFamily: fonts.serif, fontSize: 20, marginBottom: spacing.sm },
  howStep: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  howNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  howNumText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 13 },
  howStepTitle: { fontFamily: fonts.bodyBold, fontSize: 14 },
  howStepDesc: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 2 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginTop: spacing.lg,
  },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.textPrimary, outlineWidth: 0 } as any,

  chipsRow: { paddingVertical: spacing.sm, gap: 8 },
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
    paddingVertical: 6,
    flexWrap: "wrap",
    gap: 8,
  },
  sortRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  sortBtnActive: { backgroundColor: "rgba(255,90,69,0.12)" },
  sortText: { fontFamily: fonts.bodyMd, fontSize: 12, color: colors.textSecondary },
  sortTextActive: { color: colors.coral, fontFamily: fonts.bodySemi },
  freeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  freeChipActive: { backgroundColor: colors.coral, borderColor: colors.coral },
  freeText: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.textPrimary },
  freeTextActive: { color: "#fff" },

  resultHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  resultLabel: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, color: colors.coral },
  resultCount: { fontFamily: fonts.serif, fontSize: 14, color: colors.textSecondary },
  empty: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
