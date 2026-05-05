import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { ArrowUpRight, Bookmark, Radar, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, EditorialHighlights, NewsItem, Tool, bookmarkNews } from "../../src/api";
import { filterNews, getNewsIntel, NEWS_FILTERS, relatedToolsForNews } from "../../src/utils/newsIntelligence";
import LogoTile from "../../src/components/LogoTile";
import { RADAR_LANES, RADAR_TRENDS, RadarTrend } from "../../src/data/radarContent";

export default function ActueScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [highlights, setHighlights] = useState<EditorialHighlights | null>(null);
  const [loading, setLoading] = useState(true);
  const [bms, setBms] = useState<string[]>([]);
  const [filter, setFilter] = useState("Tout");
  const [showRadar, setShowRadar] = useState(false);
  const pulse = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  useEffect(() => {
    Promise.all([api.listEditorialFeed(), api.listTools({ sort: "score" }), api.getEditorialHighlights()])
      .then(([news, allTools, editorialHighlights]) => { setItems(news); setTools(allTools); setHighlights(editorialHighlights); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { bookmarkNews.list().then(setBms); }, []));

  const visibleItems = useMemo(() => {
    const filtered = filterNews(items, filter);
    if (filter !== "Tout") return filtered;
    const priority = (item: NewsItem) => {
      const h = `${item.title} ${item.summary} ${item.tag ?? ""} ${item.toolSlugs?.join(" ") ?? ""}`.toLowerCase();
      if (h.includes("claude code") || h.includes("cline") || h.includes("roo") || h.includes("aider") || h.includes("openclaw") || h.includes("clawbot")) return 0;
      if (h.includes("claude") || h.includes("anthropic")) return 1;
      if (h.includes("agent") || h.includes("code")) return 2;
      return 5;
    };
    return [...filtered].sort((a, b) => priority(a) - priority(b));
  }, [items, filter]);
  const featured = visibleItems[0];
  const rest = visibleItems.slice(1);

  const toggleBm = async (id: string) => {
    pulse.value = withSpring(1.12, { damping: 7 }, () => { pulse.value = withSpring(1); });
    const next = await bookmarkNews.toggle(id);
    setBms(next);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)} style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }] }>
          <Text style={[styles.eyebrow, { color: colors.coral }]}>ACTU IA</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>L’actu IA utile</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Ce qui mérite d’être testé, surveillé ou ignoré.</Text>

        </Animated.View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {NEWS_FILTERS.map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterChip, { backgroundColor: filter === f ? colors.coral : colors.surface, borderColor: filter === f ? colors.coral : colors.borderSubtle }]}>
              <Text style={[styles.filterText, { color: filter === f ? "#fff" : colors.textPrimary }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.xl }} />
        ) : !featured ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>Aucune actualité dans ce filtre.</Text>
        ) : (
          <>
            <FeaturedNews item={featured} tools={tools} bookmarked={bms.includes(featured.id)} onBookmark={() => toggleBm(featured.id)} pulseStyle={pulseStyle} />
            <TouchableOpacity onPress={() => setShowRadar((v) => !v)} style={[styles.radarToggle, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} activeOpacity={0.85}>
              <View style={[styles.radarIcon, { backgroundColor: colors.coralSoft }]}><Radar size={18} color={colors.coral} strokeWidth={2.5} /></View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.radarToggleTitle, { color: colors.textPrimary }]}>Radar IA Match</Text>
                <Text style={[styles.radarToggleSub, { color: colors.textSecondary }]}>Tendances à ouvrir seulement si tu veux creuser.</Text>
              </View>
              {showRadar ? <ChevronUp size={18} color={colors.coral} /> : <ChevronDown size={18} color={colors.coral} />}
            </TouchableOpacity>
            {showRadar ? <RadarStrip /> : null}
            {rest.slice(0, 5).map((n, index) => (
              <NewsRow key={n.id} item={n} index={index} tools={tools} bookmarked={bms.includes(n.id)} onBookmark={() => toggleBm(n.id)} />
            ))}
          </>
        )}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FeaturedNews({ item, tools, bookmarked, onBookmark, pulseStyle }: { item: NewsItem; tools: Tool[]; bookmarked: boolean; onBookmark: () => void; pulseStyle: any }) {
  const router = useRouter();
  const { colors } = useTheme();
  const intel = getNewsIntel(item);
  const related = relatedToolsForNews(item, tools, 3);
  return (
    <Animated.View entering={FadeInDown.delay(90).duration(450)}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/news/${item.id}`)} style={[styles.featuredCard, { backgroundColor: colors.surface, borderColor: colors.coral }]} testID="news-featured">
        <View style={styles.tagRow}>
          <ImpactBadge label={intel.impact.label} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formatDate(item.publishedAt)} · {item.readMinutes} min</Text>
          <View style={{ flex: 1 }} />
          <Animated.View style={pulseStyle}>
            <TouchableOpacity onPress={onBookmark} testID={`news-bm-${item.id}`} style={styles.bmBtn}>
              <Bookmark size={16} color={bookmarked ? colors.coral : colors.textSecondary} fill={bookmarked ? colors.coral : "transparent"} strokeWidth={2} />
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Text style={[styles.featuredTitle, { color: colors.textPrimary }]}>{shortenNewsTitle(item.title)}</Text>
        <Text style={[styles.featuredSummary, { color: colors.textSecondary }]} numberOfLines={2}>{item.summary}</Text>
        <Text style={[styles.featuredAction, { color: colors.coral }]}>{intel.action}</Text>
        <View style={styles.readLink}><Text style={[styles.readLinkText, { color: colors.coral }]}>Lire le détail</Text><ArrowUpRight size={16} color={colors.coral} strokeWidth={2.5} /></View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function NewsRow({ item, tools, bookmarked, onBookmark, index }: { item: NewsItem; tools: Tool[]; bookmarked: boolean; onBookmark: () => void; index: number }) {
  const router = useRouter();
  const { colors } = useTheme();
  const intel = getNewsIntel(item);
  const related = relatedToolsForNews(item, tools, 2);
  return (
    <Animated.View entering={FadeInDown.delay(index * 45).duration(380)}>
      <TouchableOpacity onPress={() => router.push(`/news/${item.id}`)} style={[styles.rowCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} testID={`news-row-${item.id}`} activeOpacity={0.75}>
        <View style={styles.rowTop}>
          <ImpactBadge label={intel.impact.label} compact />
          <Text style={[styles.rowDate, { color: colors.textSecondary }]}>{formatDate(item.publishedAt)} · {item.readMinutes} min</Text>
          <TouchableOpacity onPress={onBookmark} style={styles.bmBtn} testID={`news-bm-${item.id}`}>
            <Bookmark size={14} color={bookmarked ? colors.coral : colors.textSecondary} fill={bookmarked ? colors.coral : "transparent"} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{shortenNewsTitle(item.title)}</Text>
        <Text style={[styles.rowSummary, { color: colors.textSecondary }]} numberOfLines={2}>{item.summary}</Text>
        <Text style={[styles.rowAction, { color: colors.coral }]} numberOfLines={1}>{intel.action}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function RadarStrip() {
  const router = useRouter();
  const { colors } = useTheme();
  const [lane, setLane] = useState<RadarTrend["lane"] | "tout">("tout");
  const [showAll, setShowAll] = useState(false);
  const selected = lane === "tout" ? RADAR_TRENDS : RADAR_TRENDS.filter((trend) => trend.lane === lane);
  const top = selected[0] ?? RADAR_TRENDS[0];
  const visibleTrends = showAll ? selected : selected.slice(0, lane === "tout" ? 2 : 3);
  const hasMore = selected.length > visibleTrends.length;
  return (
    <Animated.View entering={FadeInDown.delay(140).duration(420)} style={[styles.radarBox, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }] }>
      <View style={styles.radarHead}>
        <View style={[styles.radarIcon, { backgroundColor: colors.coralSoft }]}><Radar size={18} color={colors.coral} strokeWidth={2.5} /></View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.radarTitle, { color: colors.textPrimary }]}>Radar pratique</Text>
          <Text style={[styles.radarSubtitle, { color: colors.textSecondary }]}>Un repère par action, pour décider vite.</Text>
        </View>
      </View>

      <View style={[styles.radarPriority, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]}>
        <Text style={[styles.radarPriorityLabel, { color: colors.coral }]}>Priorité du moment</Text>
        <Text style={[styles.radarPriorityTitle, { color: colors.textPrimary }]}>{top.title}</Text>
        <Text style={[styles.radarPriorityText, { color: colors.textSecondary }]}>{top.action}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.laneRow}>
        <TouchableOpacity onPress={() => setLane("tout")} style={[styles.laneChip, { backgroundColor: lane === "tout" ? colors.coral : colors.bg, borderColor: lane === "tout" ? colors.coral : colors.borderSubtle }] }>
          <Text style={[styles.laneText, { color: lane === "tout" ? "#fff" : colors.textPrimary }]}>Tout</Text>
        </TouchableOpacity>
        {RADAR_LANES.map((item) => (
          <TouchableOpacity key={item.key} onPress={() => setLane(item.key)} style={[styles.laneChip, { backgroundColor: lane === item.key ? colors.coral : colors.bg, borderColor: lane === item.key ? colors.coral : colors.borderSubtle }] }>
            <Text style={[styles.laneText, { color: lane === item.key ? "#fff" : colors.textPrimary }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.radarGrid}>
        {visibleTrends.map((trend) => (
          <TouchableOpacity key={trend.id} onPress={() => trend.articleId ? router.push({ pathname: "/news/[id]", params: { id: trend.articleId } }) : undefined} style={[styles.radarCard, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]} activeOpacity={0.84}>
            <View style={styles.radarCardTop}>
              <Text style={[styles.radarStatus, { color: colors.coral }]}>{trend.label}</Text>

            </View>
            <Text style={[styles.radarCardTitle, { color: colors.textPrimary }]}>{trend.title}</Text>
            <Text style={[styles.radarAction, { color: colors.textSecondary }]}>{trend.short}</Text>
            <SchemaMini steps={trend.schema} />
            <View style={[styles.whyBox, { borderColor: colors.borderSubtle }]}>
              <CheckCircle2 size={13} color={colors.coral} strokeWidth={2.5} />
              <Text style={[styles.whyText, { color: colors.textPrimary }]}>{trend.action}</Text>
            </View>
            <Text style={[styles.radarOpen, { color: colors.coral }]}>{trend.articleId ? "Lire l’explication" : "Info à surveiller"}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {hasMore || showAll ? (
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={[styles.radarMoreBtn, { borderColor: colors.borderSubtle }] }>
          <Text style={[styles.radarMoreText, { color: colors.coral }]}>{showAll ? "Réduire le radar" : `Voir ${selected.length - visibleTrends.length} repère(s) de plus`}</Text>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
}

function SchemaMini({ steps }: { steps: string[] }) {
  const { colors } = useTheme();
  return <View style={[styles.schemaBox, { borderColor: colors.borderSubtle }]}>{steps.map((step, index) => <React.Fragment key={`${step}-${index}`}><View style={[styles.schemaNode, { backgroundColor: colors.coralSoft, borderColor: colors.coral }]}><Text style={[styles.schemaIndex, { color: colors.coral }]}>{index + 1}</Text></View><Text style={[styles.schemaLabel, { color: colors.textPrimary }]} numberOfLines={1}>{step}</Text>{index < steps.length - 1 ? <View style={[styles.schemaLine, { backgroundColor: colors.borderSubtle }]} /> : null}</React.Fragment>)}</View>;
}

function RelatedMiniTools({ tools, compact = false }: { tools: Tool[]; compact?: boolean }) {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={styles.relatedRow}>
      {tools.map((t) => (
        <TouchableOpacity key={t.slug} onPress={() => router.push(`/tool/${t.slug}`)} style={[styles.relatedPill, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]}>
          <LogoTile uri={t.image} name={t.name} bg={t.color} domain={t.domain} size={compact ? 22 : 26} rounded={7} />
          <Text numberOfLines={1} style={[styles.relatedText, { color: colors.textPrimary }]}>{t.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ImpactBadge({ label, compact = false }: { label: string; compact?: boolean }) {
  const { colors } = useTheme();
  return <Text style={[styles.impactBadge, { backgroundColor: colors.coralSoft, color: colors.coral }, compact && styles.impactCompact]}>{label}</Text>;
}

function shortenNewsTitle(title: string) {
  if (title === "Claude Code, Cline, Roo, Aider : les assistants IA de dev ne se valent pas") return "Claude Code, Cline, Roo, Aider : lequel choisir ?";
  if (title === "Agents de code orchestrés : la prochaine étape après le simple copilote") return "Agents de code : après le simple copilote";
  return title;
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  hero: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.lg },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.6, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 40, letterSpacing: -1 },
  subtitle: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23, marginTop: spacing.sm },
  filterRow: { gap: 8, paddingVertical: spacing.md },
  filterChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  filterText: { fontFamily: fonts.bodyBold, fontSize: 14 },
  featuredCard: { borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1.5, marginBottom: spacing.md },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.sm },
  impactBadge: { overflow: "hidden", borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.3 },
  impactCompact: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 11 },
  metaText: { fontFamily: fonts.body, fontSize: 13 },
  bmBtn: { padding: 5 },
  featuredTitle: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 34, letterSpacing: -0.5, marginBottom: spacing.sm },
  featuredSummary: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginBottom: spacing.sm },
  featuredAction: { fontFamily: fonts.bodyBold, fontSize: 14, lineHeight: 20, marginBottom: spacing.sm },
  confidenceText: { fontFamily: fonts.bodySemi, fontSize: 13, marginBottom: spacing.md },
  intelBox: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  intelTitle: { fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 1, marginBottom: 6 },
  intelLine: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginBottom: 3 },
  advice: { fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 19, marginTop: 6 },
  relatedRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: spacing.sm },
  relatedPill: { borderWidth: 1, borderRadius: radius.pill, paddingVertical: 5, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 6, maxWidth: 150 },
  relatedText: { fontFamily: fonts.bodySemi, fontSize: 12, flexShrink: 1 },
  readLink: { flexDirection: "row", alignItems: "center", gap: 6 },
  readLinkText: { fontFamily: fonts.bodySemi, fontSize: 14 },
  radarToggle: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  radarToggleTitle: { fontFamily: fonts.bodyBold, fontSize: 15 },
  radarToggleSub: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: 2 },
  radarBox: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.md, marginBottom: spacing.md },
  radarHead: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: spacing.sm },
  radarTitle: { fontFamily: fonts.serif, fontSize: 23, lineHeight: 27 },
  radarSubtitle: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, marginTop: 2 },
  radarIcon: { width: 40, height: 40, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  radarPriority: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  radarPriorityLabel: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.1, textTransform: "uppercase" },
  radarPriorityTitle: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 27, marginTop: 4 },
  radarPriorityText: { fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 19, marginTop: 5 },
  laneRow: { gap: 7, paddingVertical: spacing.sm },
  laneChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8 },
  laneText: { fontFamily: fonts.bodyBold, fontSize: 13 },
  radarGrid: { gap: 8, marginTop: spacing.sm },
  radarRow: { gap: 8, paddingRight: spacing.md },
  radarCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  radarCardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  radarStatus: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 6 },
  radarCardTitle: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 24, marginTop: 4 },
  radarAction: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: 6 },
  schemaBox: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, borderTopWidth: 1, marginTop: spacing.sm, paddingTop: spacing.sm },
  schemaNode: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  schemaIndex: { fontFamily: fonts.bodyBold, fontSize: 10 },
  schemaLabel: { fontFamily: fonts.bodySemi, fontSize: 12, maxWidth: 74 },
  schemaLine: { width: 12, height: 2, borderRadius: 2 },
  whyBox: { flexDirection: "row", alignItems: "flex-start", gap: 6, borderTopWidth: 1, marginTop: spacing.sm, paddingTop: spacing.sm },
  whyText: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 19 },
  radarOpen: { fontFamily: fonts.bodyBold, fontSize: 13, marginTop: 10 },
  radarMoreBtn: { borderWidth: 1, borderRadius: radius.pill, paddingVertical: 11, alignItems: "center", marginTop: spacing.sm },
  radarMoreText: { fontFamily: fonts.bodyBold, fontSize: 13 },
  rowCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  rowTop: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  rowDate: { fontFamily: fonts.body, fontSize: 13, flex: 1 },
  rowTitle: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 25, marginBottom: 4 },
  rowSummary: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  rowAction: { fontFamily: fonts.bodyBold, fontSize: 14, marginTop: spacing.sm, marginBottom: 6 },
  empty: { fontFamily: fonts.body, textAlign: "center", marginTop: spacing.xl },
});
