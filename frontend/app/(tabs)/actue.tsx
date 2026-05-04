import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { ArrowUpRight, Bookmark, Radar, ShieldCheck, Sparkles, Zap, Share2, CheckCircle2 } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, EditorialHighlights, NewsItem, Tool, bookmarkNews } from "../../src/api";
import { filterNews, getNewsIntel, NEWS_FILTERS, relatedToolsForNews } from "../../src/utils/newsIntelligence";
import LogoTile from "../../src/components/LogoTile";
import { RADAR_LANES, RADAR_TRENDS, RadarTrend } from "../../src/data/radarContent";
import { ScoreGauge } from "../../src/components/VisualExplainers";
import { shareRadar } from "../../src/utils/shareLinks";

export default function ActueScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [highlights, setHighlights] = useState<EditorialHighlights | null>(null);
  const [loading, setLoading] = useState(true);
  const [bms, setBms] = useState<string[]>([]);
  const [filter, setFilter] = useState("Tout");
  const pulse = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  useEffect(() => {
    Promise.all([api.listEditorialFeed(), api.listTools({ sort: "score" }), api.getEditorialHighlights()])
      .then(([news, allTools, editorialHighlights]) => { setItems(news); setTools(allTools); setHighlights(editorialHighlights); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { bookmarkNews.list().then(setBms); }, []));

  const visibleItems = useMemo(() => filterNews(items, filter), [items, filter]);
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
          <Text style={[styles.eyebrow, { color: colors.coral }]}>ACTU IA · À RETENIR</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Les nouveautés IA qui peuvent changer ton choix d’outil.</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Ici, on ne met pas toute l’actualité : on garde les infos utiles pour décider quoi tester, quoi comparer et quoi ignorer.</Text>
          <View style={styles.metricsRow}>
            <Metric label="Articles" value={String(items.length || "—")} />
            <Metric label="Objectif" value="décider" />
            <Metric label="Tri" value="utile" />
          </View>
          <View style={[styles.methodBox, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }] }>
            <ShieldCheck size={15} color={colors.coral} strokeWidth={2.5} />
            <Text style={[styles.methodText, { color: colors.textSecondary }]}>Chaque carte dit simplement : ce que ça change, l’action conseillée, les outils concernés et le niveau de confiance. Les prix restent à vérifier sur les sites officiels.</Text>
          </View>
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
            <RadarStrip />
            <View style={[styles.actionStrip, { backgroundColor: colors.coralSoft, borderColor: colors.coral }] }>
              <Zap size={16} color={colors.coral} strokeWidth={2.5} />
              <Text style={[styles.actionStripText, { color: colors.textPrimary }]}>Astuce : une bonne veille IA doit finir par une action — tester, surveiller, comparer ou ignorer.</Text>
            </View>
            {rest.map((n, index) => (
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
        <Text style={[styles.featuredTitle, { color: colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.featuredSummary, { color: colors.textSecondary }]}>{item.summary}</Text>
  {item.confidence ? <Text style={[styles.confidenceText, { color: colors.textSecondary }]}>Confiance {item.confidence} · vérifié {formatDate(item.lastVerifiedAt || item.publishedAt)}</Text> : null}
        <View style={[styles.intelBox, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]}>
          <Text style={[styles.intelTitle, { color: colors.coral }]}>Résumé en 30 secondes</Text>
          {intel.quickSummary.map((line) => <Text key={line} style={[styles.intelLine, { color: colors.textPrimary }]}>• {line}</Text>)}
          <Text style={[styles.advice, { color: colors.textSecondary }]}>Conseil IA Match : {intel.advice}</Text>
        </View>
        {related.length ? <RelatedMiniTools tools={related} /> : null}
        <View style={styles.readLink}><Text style={[styles.readLinkText, { color: colors.coral }]}>Pourquoi ça compte ?</Text><ArrowUpRight size={16} color={colors.coral} strokeWidth={2.5} /></View>
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
        <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.rowSummary, { color: colors.textSecondary }]} numberOfLines={2}>{item.summary}</Text>
        <Text style={[styles.rowAction, { color: colors.coral }]}>{intel.action}</Text>
        {related.length ? <RelatedMiniTools tools={related} compact /> : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

function RadarStrip() {
  const router = useRouter();
  const { colors } = useTheme();
  const [lane, setLane] = useState<RadarTrend["lane"] | "tout">("tout");
  const selected = lane === "tout" ? RADAR_TRENDS : RADAR_TRENDS.filter((trend) => trend.lane === lane);
  const top = selected[0] ?? RADAR_TRENDS[0];
  return (
    <Animated.View entering={FadeInDown.delay(140).duration(420)} style={[styles.radarBox, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }] }>
      <View style={styles.radarHead}>
        <View style={[styles.radarIcon, { backgroundColor: colors.coralSoft }]}><Radar size={18} color={colors.coral} strokeWidth={2.5} /></View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.radarTitle, { color: colors.textPrimary }]}>Radar IA Match</Text>
          <Text style={[styles.radarSubtitle, { color: colors.textSecondary }]}>Une boussole pratique : quoi tester, surveiller, éviter et apprendre — sans hype inutile.</Text>
        </View>
      </View>

      <View style={[styles.radarMethod, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }] }>
        {top.schema.map((step, index) => (
          <React.Fragment key={`${top.id}-${step}`}>
            <View style={[styles.schemaNode, { backgroundColor: index === 0 ? colors.coral : colors.coralSoft }] }>
              <Text style={[styles.schemaText, { color: index === 0 ? "#fff" : colors.coral }]}>{step}</Text>
            </View>
            {index < top.schema.length - 1 ? <Text style={[styles.schemaArrow, { color: colors.coral }]}>→</Text> : null}
          </React.Fragment>
        ))}
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

      <ScoreGauge label="Efficacité réelle estimée" value={top.score} helper="Score éditorial : utilité concrète + maturité + risque maîtrisable. Ce n’est pas un benchmark labo." />

      <View style={styles.radarGrid}>
        {selected.map((trend) => (
          <TouchableOpacity key={trend.id} onPress={() => trend.articleId ? router.push({ pathname: "/news/[id]", params: { id: trend.articleId } }) : undefined} style={[styles.radarCard, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]} activeOpacity={0.84}>
            <View style={styles.radarCardTop}>
              <Text style={[styles.radarStatus, { color: colors.coral }]}>{trend.label}</Text>
              <TouchableOpacity onPress={() => shareRadar(trend.title)} style={styles.radarShare}>
                <Share2 size={14} color={colors.coral} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.radarCardTitle, { color: colors.textPrimary }]}>{trend.title}</Text>
            <Text style={[styles.radarAction, { color: colors.textSecondary }]}>{trend.short}</Text>
            <View style={[styles.whyBox, { borderColor: colors.borderSubtle }]}>
              <CheckCircle2 size={13} color={colors.coral} strokeWidth={2.5} />
              <Text style={[styles.whyText, { color: colors.textPrimary }]}>{trend.action}</Text>
            </View>
            <Text style={[styles.radarOpen, { color: colors.coral }]}>{trend.articleId ? "Lire l’explication" : "Info à surveiller"}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
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

function Metric({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return <View style={[styles.metric, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]}><Text style={[styles.metricValue, { color: colors.textPrimary }]}>{value}</Text><Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{label}</Text></View>;
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  hero: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.lg },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 40, letterSpacing: -1 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  metricsRow: { flexDirection: "row", gap: 8, marginTop: spacing.md },
  methodBox: { flexDirection: "row", gap: 8, borderWidth: 1, borderRadius: radius.lg, padding: spacing.sm, marginTop: spacing.md, alignItems: "flex-start" },
  methodText: { flex: 1, fontFamily: fonts.body, fontSize: 11, lineHeight: 16 },
  metric: { flex: 1, borderWidth: 1, borderRadius: radius.md, padding: 10 },
  metricValue: { fontFamily: fonts.bodyBold, fontSize: 14 },
  metricLabel: { fontFamily: fonts.body, fontSize: 10, marginTop: 2 },
  filterRow: { gap: 8, paddingVertical: spacing.md },
  filterChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  filterText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  featuredCard: { borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1.5, marginBottom: spacing.md },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.sm },
  impactBadge: { overflow: "hidden", borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 0.5 },
  impactCompact: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 9 },
  metaText: { fontFamily: fonts.body, fontSize: 11 },
  bmBtn: { padding: 5 },
  featuredTitle: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 34, letterSpacing: -0.5, marginBottom: spacing.sm },
  featuredSummary: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginBottom: spacing.sm },
  confidenceText: { fontFamily: fonts.bodySemi, fontSize: 11, marginBottom: spacing.md },
  intelBox: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  intelTitle: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: 6 },
  intelLine: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginBottom: 3 },
  advice: { fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 18, marginTop: 6 },
  relatedRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: spacing.sm },
  relatedPill: { borderWidth: 1, borderRadius: radius.pill, paddingVertical: 5, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 6, maxWidth: 150 },
  relatedText: { fontFamily: fonts.bodySemi, fontSize: 11, flexShrink: 1 },
  readLink: { flexDirection: "row", alignItems: "center", gap: 6 },
  readLinkText: { fontFamily: fonts.bodySemi, fontSize: 14 },
  actionStrip: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  radarBox: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.md, marginBottom: spacing.md },
  radarHead: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: spacing.sm },
  radarTitle: { fontFamily: fonts.serif, fontSize: 23, lineHeight: 27 },
  radarSubtitle: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 2 },
  radarIcon: { width: 40, height: 40, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  radarMethod: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 5, borderWidth: 1, borderRadius: radius.lg, padding: spacing.sm, marginBottom: spacing.sm },
  schemaNode: { borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  schemaText: { fontFamily: fonts.bodyBold, fontSize: 10 },
  schemaArrow: { fontFamily: fonts.bodyBold, fontSize: 13 },
  laneRow: { gap: 7, paddingVertical: spacing.sm },
  laneChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8 },
  laneText: { fontFamily: fonts.bodyBold, fontSize: 11 },
  radarGrid: { gap: 8, marginTop: spacing.sm },
  radarRow: { gap: 8, paddingRight: spacing.md },
  radarCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  radarCardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  radarShare: { padding: 4 },
  radarStatus: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 },
  radarCardTitle: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 24, marginTop: 4 },
  radarAction: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 6 },
  whyBox: { flexDirection: "row", alignItems: "flex-start", gap: 6, borderTopWidth: 1, marginTop: spacing.sm, paddingTop: spacing.sm },
  whyText: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 17 },
  radarOpen: { fontFamily: fonts.bodyBold, fontSize: 11, marginTop: 10 },
  actionStripText: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 17 },
  rowCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  rowTop: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  rowDate: { fontFamily: fonts.body, fontSize: 11, flex: 1 },
  rowTitle: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 25, marginBottom: 4 },
  rowSummary: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  rowAction: { fontFamily: fonts.bodyBold, fontSize: 12, marginTop: spacing.sm, marginBottom: 6 },
  empty: { fontFamily: fonts.body, textAlign: "center", marginTop: spacing.xl },
});
