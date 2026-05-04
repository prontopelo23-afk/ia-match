import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowRight, Image as ImageIcon, Code2, Mic2, Video, PenLine, Search, Bot, BarChart3, BriefcaseBusiness, Wand2 } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { useI18n } from "../../src/i18n";
import { api, Category, Tool } from "../../src/api";
import LogoTile from "../../src/components/LogoTile";

type CategoryBlock = Category & { tools: Tool[]; bestUse: string; icon: React.ReactNode };

function iconFor(slug: string, color: string) {
  const props = { size: 20, color, strokeWidth: 2.5 };
  if (slug === "texte") return <PenLine {...props} />;
  if (slug === "image") return <ImageIcon {...props} />;
  if (slug === "code") return <Code2 {...props} />;
  if (slug === "video") return <Video {...props} />;
  if (slug === "audio") return <Mic2 {...props} />;
  if (slug === "recherche") return <Search {...props} />;
  if (slug === "agent") return <Bot {...props} />;
  if (slug === "data") return <BarChart3 {...props} />;
  return <BriefcaseBusiness {...props} />;
}

function categoryFamilyKey(tool: Tool, category: string) {
  const slug = tool.slug;
  const name = tool.name.toLowerCase();
  const vendor = tool.vendor.toLowerCase();
  if (category === "image") {
    if (["dalle", "gpt-image-2", "gpt-image-2-high", "gpt-image-15", "gpt-image-1-5-high"].includes(slug)) return "openai-chatgpt-image";
    if (slug.startsWith("nano-banana") || name.includes("nano banana")) return "google-nano-banana";
    if (slug.startsWith("seedream") || name.includes("seedream")) return "bytedance-seedream";
    if (slug.startsWith("imagen") || name.includes("imagen")) return "google-imagen";
    if (slug.startsWith("flux") || name.includes("flux")) return "black-forest-flux";
  }
  if (category === "texte") {
    if (slug === "chatgpt" || vendor === "openai") return slug === "o3" ? "openai-o3" : "openai-chatgpt";
    if (slug.startsWith("claude") || vendor === "anthropic") return "anthropic-claude";
    if (slug.startsWith("gemini") || vendor === "google") return "google-gemini";
  }
  return slug;
}

function dedupeCategoryTools(items: Tool[], category: string) {
  const best = new Map<string, Tool>();
  items.forEach((tool) => {
    const key = categoryFamilyKey(tool, category);
    const current = best.get(key);
    const score = tool.categoryScores?.[category] ?? tool.score;
    const currentScore = current ? current.categoryScores?.[category] ?? current.score : -1;
    if (!current || score > currentScore || (score === currentScore && tool.score > current.score)) best.set(key, tool);
  });
  return Array.from(best.values());
}

function bestUseFor(slug: string, t: (key: string) => string) {
  return {
    texte: t("catalog.useText"),
    image: t("catalog.useImage"),
    code: t("catalog.useCode"),
    video: t("catalog.useVideo"),
    audio: t("catalog.useAudio"),
    productivite: t("catalog.useProductivity"),
    recherche: t("catalog.useResearch"),
    agent: t("catalog.useAgent"),
    data: t("catalog.useData"),
  }[slug] || t("catalog.useDefault");
}

export default function CategoriesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useI18n();
  const [cats, setCats] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("ALL");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<"all" | "free" | "beginner" | "french">("all");

  useEffect(() => {
    Promise.all([api.listCategories(), api.listTools({ sort: "score" })])
      .then(([categories, allTools]) => {
        const uniqueCategories = Array.from(new Map(categories.map((cat) => [cat.slug, cat])).values());
        const uniqueTools = Array.from(new Map(allTools.map((tool) => [tool.slug, tool])).values());
        setCats(uniqueCategories);
        setTools(uniqueTools);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const blocks = useMemo<CategoryBlock[]>(() => cats.map((cat) => {
    const categoryTools = dedupeCategoryTools(Array.from(new Map(tools
      .filter((tool) => tool.categorySlugs.includes(cat.slug))
      .map((tool) => [tool.slug, tool])).values()), cat.slug)
      .sort((a, b) => (b.categoryScores?.[cat.slug] ?? b.score) - (a.categoryScores?.[cat.slug] ?? a.score));
    return {
      ...cat,
      tools: categoryTools,
      bestUse: bestUseFor(cat.slug, t),
      icon: iconFor(cat.slug, colors.coral),
    };
  }), [cats, tools, colors.coral, t]);

  const selectedBlocks = selected === "ALL" ? blocks : blocks.filter((block) => block.slug === selected);
  const normalizedQuery = query.trim().toLowerCase();
  const matchesFilters = (tool: Tool) => {
    const text = [tool.name, tool.vendor, tool.tagline, tool.description, ...(tool.features ?? []), ...(tool.useCases ?? [])].join(" ").toLowerCase();
    const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
    const matchesQuick = quickFilter === "all" ||
      (quickFilter === "free" && tool.freeTier) ||
      (quickFilter === "beginner" && (text.includes("débutant") || tool.score >= 84 || tool.freeTier)) ||
      (quickFilter === "french" && (tool.languages ?? []).some((lang) => lang.toLowerCase().startsWith("fr")));
    return matchesQuery && matchesQuick;
  };
  const filteredBlocks = selectedBlocks
    .map((block) => ({ ...block, tools: block.tools.filter(matchesFilters) }))
    .filter((block) => block.tools.length > 0 || (!normalizedQuery && quickFilter === "all"));
  const visibleBlocks = selected === "ALL" && !showAllCategories ? filteredBlocks.slice(0, 6) : filteredBlocks;
  const hasHiddenCategories = selected === "ALL" && filteredBlocks.length > visibleBlocks.length;
  const searchActive = normalizedQuery.length > 0 || quickFilter !== "all";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.eyebrow, { color: colors.coral }]}>{t("catalog.eyebrow")}</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t("catalog.title")}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t("catalog.subtitle")}</Text>

        <TouchableOpacity style={[styles.matchCta, { backgroundColor: colors.coral }]} onPress={() => router.push("/match")} activeOpacity={0.86}>
          <Wand2 size={16} color="#fff" strokeWidth={2.5} />
          <Text style={styles.matchCtaText}>Je ne sais pas quoi choisir · lancer le Match</Text>
          <ArrowRight size={15} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
          <Search size={17} color={colors.textSecondary} strokeWidth={2.4} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un outil ou un usage"
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.textPrimary }]}
            autoCapitalize="none"
            autoCorrect={false}
            testID="catalog-search"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickFilterRow}>
          <FilterChip label="Tous" active={quickFilter === "all"} onPress={() => setQuickFilter("all")} />
          <FilterChip label="Gratuit" active={quickFilter === "free"} onPress={() => setQuickFilter("free")} />
          <FilterChip label="Débutant" active={quickFilter === "beginner"} onPress={() => setQuickFilter("beginner")} />
          <FilterChip label="Bon en français" active={quickFilter === "french"} onPress={() => setQuickFilter("french")} />
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <FilterChip label={t("common.all")} active={selected === "ALL"} onPress={() => setSelected("ALL")} />
          {blocks.map((cat) => <FilterChip key={cat.slug} label={cat.name.replace(" & ", " /")} active={selected === cat.slug} onPress={() => setSelected(cat.slug)} />)}
        </ScrollView>

        {loading ? <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.xl }} /> : null}

        {!loading ? (
          <View style={[styles.guideBox, { backgroundColor: colors.coralSoft, borderColor: colors.coral }]}>
            <Text style={[styles.guideTitle, { color: colors.coral }]}>{searchActive ? "Résultats filtrés" : "Choisis d’abord un usage"}</Text>
            <Text style={[styles.guideText, { color: colors.textSecondary }]}>{searchActive ? "La recherche combine nom, usage, fonctionnalités, prix et langue. Touche une IA pour ouvrir sa fiche." : "Chaque famille montre trois repères simples : le plus simple, le meilleur résultat, puis une alternative gratuite quand elle existe."}</Text>
          </View>
        ) : null}

        {!loading && visibleBlocks.map((cat) => (
          <View key={cat.slug} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
            <View style={styles.cardHead}>
              <View style={[styles.iconBox, { backgroundColor: colors.coralSoft }]}>{cat.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.catName, { color: colors.textPrimary }]}>{cat.name}</Text>
                <Text style={[styles.catUse, { color: colors.textSecondary }]}>Pour {cat.bestUse}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const isOpen = selected === cat.slug || expanded[cat.slug];
                  if (isOpen) {
                    setExpanded((prev) => ({ ...prev, [cat.slug]: false }));
                    setSelected("ALL");
                  } else {
                    setExpanded((prev) => ({ ...prev, [cat.slug]: true }));
                    setSelected(cat.slug);
                  }
                }}
                style={[styles.openBtn, { backgroundColor: colors.coral }]}
                accessibilityLabel={`Voir la liste complète ${cat.name}`}
              >
                <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <View style={styles.listHeader}>
              <Text style={[styles.listTitle, { color: colors.textPrimary }]}>
                {selected === cat.slug || expanded[cat.slug] ? `${t("catalog.fullList")} · ${cat.tools.length} IA` : t("catalog.top3")}
              </Text>
              {cat.tools.length > 3 ? (
                <TouchableOpacity
                  onPress={() => {
                    const isOpen = selected === cat.slug || expanded[cat.slug];
                    if (isOpen) {
                      setExpanded((prev) => ({ ...prev, [cat.slug]: false }));
                      setSelected("ALL");
                    } else {
                      setExpanded((prev) => ({ ...prev, [cat.slug]: true }));
                      setSelected(cat.slug);
                    }
                  }}
                  testID={`category-toggle-${cat.slug}`}
                >
                  <Text style={[styles.listToggle, { color: colors.coral }]}>{selected === cat.slug || expanded[cat.slug] ? t("common.reduce") : t("catalog.fullList")}</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.topTools}>
              {(selected === cat.slug || expanded[cat.slug] ? cat.tools : cat.tools.slice(0, 3)).map((tool, index) => (
                <TouchableOpacity key={tool.slug} onPress={() => router.push(`/tool/${tool.slug}`)} style={[styles.toolMini, { borderColor: colors.borderSubtle }]}>
                  <Text style={[styles.rank, { color: colors.coral }]}>{recommendationLabel(index, tool)}</Text>
                  <LogoTile uri={tool.image} name={tool.name} bg={tool.color} size={34} rounded={10} domain={tool.domain} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.toolName, { color: colors.textPrimary }]} numberOfLines={1}>{tool.name}</Text>
                    <Text style={[styles.toolMeta, { color: colors.textSecondary }]} numberOfLines={1}>{tool.freeTier ? t("tool.freeAvailable") : `${tool.monthlyPrice} €/mois`} · {t("tool.index")} {tool.categoryScores?.[cat.slug] ?? tool.score}</Text>
                  </View>
                  <View style={[styles.toolHint, { backgroundColor: colors.coralSoft }]}>
                    <Text style={[styles.toolHintText, { color: colors.coral }]}>Voir la fiche</Text>
                    <ArrowRight size={13} color={colors.coral} strokeWidth={2.6} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {!loading && visibleBlocks.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Aucun outil trouvé</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Essaie un autre mot-clé, retire un filtre ou lance le Match pour partir de ton besoin.</Text>
            <TouchableOpacity onPress={() => { setQuery(""); setQuickFilter("all"); setSelected("ALL"); }} style={[styles.emptyBtn, { borderColor: colors.coral }]}>
              <Text style={[styles.emptyBtnText, { color: colors.coral }]}>Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {hasHiddenCategories || showAllCategories ? (
          <TouchableOpacity onPress={() => setShowAllCategories((v) => !v)} style={[styles.moreBtn, { borderColor: colors.borderSubtle }]}>
            <Text style={[styles.moreBtnText, { color: colors.coral }]}>{showAllCategories ? "Réduire les familles" : "Voir toutes les familles"}</Text>
          </TouchableOpacity>
        ) : null}

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function recommendationLabel(index: number, tool: Tool) {
  if (index === 0) return "Simple";
  if (index === 1) return "Résultat";
  if (tool.freeTier) return "Gratuit";
  return "Alternative";
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.filterChip, { backgroundColor: active ? colors.coral : colors.surface, borderColor: active ? colors.coral : colors.borderSubtle }]}>
      <Text style={[styles.filterChipText, { color: active ? "#fff" : colors.textPrimary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 38, lineHeight: 43, letterSpacing: -1 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, marginBottom: spacing.md },
  matchCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: radius.pill, paddingVertical: 13, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  matchCtaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 13, flex: 1, textAlign: "center" },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: 12, paddingVertical: 10, marginBottom: spacing.sm },
  searchInput: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 14, paddingVertical: 0, outlineWidth: 0 } as any,
  quickFilterRow: { gap: 8, paddingBottom: spacing.sm },
  filterRow: { gap: 8, paddingBottom: spacing.md },
  filterChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  filterChipText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  guideBox: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  guideTitle: { fontFamily: fonts.bodyBold, fontSize: 13, marginBottom: 4 },
  guideText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18 },
  card: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.md, marginBottom: spacing.md },
  cardHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  iconBox: { width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  catName: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 29 },
  catUse: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 2 },
  openBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.md },
  listTitle: { fontFamily: fonts.bodyBold, fontSize: 13 },
  listToggle: { fontFamily: fonts.bodyBold, fontSize: 12 },
  topTools: { marginTop: spacing.sm, gap: 8 },
  toolMini: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: radius.lg, padding: 10 },
  rank: { width: 62, fontFamily: fonts.bodyBold, fontSize: 11 },
  toolName: { fontFamily: fonts.bodyBold, fontSize: 13 },
  toolMeta: { fontFamily: fonts.body, fontSize: 11, marginTop: 1 },
  toolHint: { flexDirection: "row", alignItems: "center", gap: 3, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  toolHintText: { fontFamily: fonts.bodyBold, fontSize: 10 },
  emptyState: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.lg, alignItems: "center", gap: 8, marginTop: spacing.sm },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 22 },
  emptyText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, textAlign: "center" },
  emptyBtn: { borderWidth: 1.5, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9, marginTop: 4 },
  emptyBtnText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  moreBtn: { alignSelf: "center", borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 10, marginTop: spacing.sm },
  moreBtnText: { fontFamily: fonts.bodyBold, fontSize: 12 },
});
