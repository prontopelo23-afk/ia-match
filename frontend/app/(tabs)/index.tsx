import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowRight, Newspaper, Layers3, Sparkles, Wand2, BookOpen, Radar, Mail, BriefcaseBusiness, GitCompare, GraduationCap, Network, Send, CheckCircle2, MessageCircle } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { useI18n } from "../../src/i18n";
import { api, BenchmarkRow, NewsItem, Tool } from "../../src/api";
import { GENERAL_MODELS } from "../../src/utils/generalRanking";
import { CONTENT_FAMILIES } from "../../src/utils/contentArchitecture";
import { RADAR_TRENDS } from "../../src/data/radarContent";
import { openNewsletterSignup } from "../../src/utils/contactLinks";
import { shareApp } from "../../src/utils/shareLinks";

export default function Accueil() {
  const router = useRouter();
  const { colors: theme } = useTheme();
  const { t } = useI18n();
  const [generalTools, setGeneralTools] = useState<Tool[]>([]);
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listTools({ sort: "score" }), api.benchmarks("score"), api.getEditorialHighlights()])
      .then(([allTools, benchmarks, highlights]) => {
        setGeneralTools(buildGeneralToolCards(allTools, benchmarks.rows).slice(0, 3));
        setNews(highlights.headline ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const familyPreview = useMemo(() => CONTENT_FAMILIES.slice(1, 5), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandLockup}>
            <Image source={require("../../assets/brand/ia-match-logo.png")} style={styles.brandLogo} resizeMode="contain" />
            <View>
              <Text style={[styles.brandName, { color: theme.textPrimary }]}>IA Match</Text>
              <Text style={[styles.brandSub, { color: theme.textSecondary }]}>{t("home.tagline")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.hero} testID="hero-section">
          <Text style={styles.heroLabel}>{t("home.heroLabel")}</Text>
          <Text style={styles.heroTitle}>{t("home.heroTitle")}</Text>
          <Text style={styles.heroSub}>{t("home.heroSub")}</Text>
          <TouchableOpacity style={styles.cta} onPress={() => router.push("/match")} testID="cta-start-match">
            <Wand2 size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.ctaText}>{t("home.ctaMatch")}</Text>
            <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.primaryActions}>
          <QuickCard icon={<Layers3 size={20} color={colors.coral} />} title="Trouver une IA" text="Explore par usage si tu sais déjà ce que tu veux faire." onPress={() => router.push("/(tabs)/categories")} />
          <QuickCard icon={<Wand2 size={20} color={colors.coral} />} title="Créer un prompt" text="Transforme une idée vague en consigne claire pour l’IA." onPress={() => router.push("/(tabs)/builder")} />
          <QuickCard icon={<BookOpen size={20} color={colors.coral} />} title="Apprendre" text="Comprends l’IA par petits pas, sans jargon." onPress={() => router.push("/(tabs)/academy")} />
        </View>

        <View style={[styles.moreCard, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]}>
          <Text style={[styles.moreTitle, { color: theme.textPrimary }]}>Autres raccourcis utiles</Text>
          <View style={styles.moreGrid}>
            <CompactLink icon={<Newspaper size={15} color={theme.coral} />} title="Actu" onPress={() => router.push("/(tabs)/actue")} />
            <CompactLink icon={<Sparkles size={15} color={theme.coral} />} title={t("home.quickRankingsTitle")} onPress={() => router.push("/(tabs)/benchmarks")} />
            <CompactLink icon={<GitCompare size={15} color={theme.coral} />} title="Comparer" onPress={() => router.push("/(tabs)/compare")} />
            <CompactLink icon={<GraduationCap size={15} color={theme.coral} />} title="Apprendre" onPress={() => router.push("/learn")} />
            <CompactLink icon={<Network size={15} color={theme.coral} />} title="Écosystème" onPress={() => router.push("/ecosystem")} />
            <CompactLink icon={<Mail size={15} color={theme.coral} />} title={t("home.quickNewsletterTitle")} onPress={() => router.push("/newsletter")} />
            <CompactLink icon={<BriefcaseBusiness size={15} color={theme.coral} />} title={t("home.quickBusinessTitle")} onPress={() => router.push("/business")} />
            <CompactLink icon={<MessageCircle size={15} color={theme.coral} />} title="Avis bêta" onPress={() => router.push("/feedback" as any)} />
          </View>
        </View>

        <MiniRadar onOpen={() => router.push("/(tabs)/actue")} />

        <View style={[styles.retentionCard, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]}>
          <View style={styles.retentionIconRow}>
            <View style={[styles.retentionIcon, { backgroundColor: theme.coralSoft }]}><Mail size={18} color={theme.coral} strokeWidth={2.5} /></View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.retentionLabel, { color: theme.coral }]}>DIGEST UTILE · DISCRET</Text>
              <Text style={[styles.retentionTitle, { color: theme.textPrimary }]}>3 IA utiles, 1 piège à éviter, 1 prompt prêt à copier.</Text>
            </View>
          </View>
          <Text style={[styles.retentionText, { color: theme.textSecondary }]}>Un résumé court pour suivre l’IA sans te noyer : recommandations, pièges concrets et prompts prêts à essayer.</Text>
          <View style={styles.retentionActions}>
            <TouchableOpacity style={[styles.retentionCta, { backgroundColor: theme.coral }]} onPress={() => openNewsletterSignup("Digest compact IA Match") }>
              <Text style={styles.retentionCtaText}>Recevoir le digest</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.retentionGhost, { borderColor: theme.borderSubtle }]} onPress={() => shareApp("Tu connais quelqu’un perdu avec l’IA ?") }>
              <Send size={14} color={theme.coral} strokeWidth={2.5} />
              <Text style={[styles.retentionGhostText, { color: theme.coral }]}>Partager</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.hubCard, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]}> 
          <View style={styles.sectionHeadCompact}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t("home.exploreFamilies")}</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/benchmarks")}><Text style={[styles.sectionLink, { color: theme.coral }]}>{t("common.seeAll")}</Text></TouchableOpacity>
          </View>
          <View style={styles.familyGrid}>
            {familyPreview.map((family) => (
              <TouchableOpacity key={family.slug} onPress={() => router.push(`/benchmarks/category/${family.slug}`)} style={[styles.familyPill, { backgroundColor: theme.coralSoft }]}>
                <Text style={[styles.familyTitle, { color: theme.coral }]}>{family.shortLabel}</Text>
                <Text style={[styles.familyText, { color: theme.textSecondary }]} numberOfLines={2}>{family.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {news ? (
          <TouchableOpacity style={[styles.newsCard, { backgroundColor: theme.coralSoft, borderColor: theme.coral }]} onPress={() => router.push("/(tabs)/actue")} activeOpacity={0.86}>
            <View style={styles.newsTopRow}>
              <Radar size={17} color={theme.coral} strokeWidth={2.5} />
              <Text style={[styles.newsLabel, { color: theme.coral }]}>{t("home.radar")}</Text>
            </View>
            <Text style={[styles.newsTitle, { color: theme.textPrimary }]}>{news.title}</Text>
            <Text style={[styles.newsText, { color: theme.textSecondary }]} numberOfLines={2}>{news.summary}</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t("home.topStart")}</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/benchmarks")}><Text style={[styles.sectionLink, { color: theme.coral }]}>{t("common.fullTop")}</Text></TouchableOpacity>
        </View>
        {loading ? <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.lg }} /> : generalTools.map((tool, index) => <CompactToolRow key={tool.slug} tool={tool} rank={index + 1} onPress={() => router.push(`/tool/${tool.slug}`)} />)}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


function MiniRadar({ onOpen }: { onOpen: () => void }) {
  const { colors } = useTheme();
  const preview = RADAR_TRENDS.slice(0, 4);
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onOpen} style={[styles.radarMini, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
      <View style={styles.radarMiniHead}>
        <View style={[styles.radarOrb, { backgroundColor: colors.coralSoft }]}><Radar size={18} color={colors.coral} strokeWidth={2.5} /></View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.radarMiniLabel, { color: colors.coral }]}>RADAR IA MATCH · CETTE SEMAINE</Text>
          <Text style={[styles.radarMiniTitle, { color: colors.textPrimary }]}>Tester, surveiller, éviter, apprendre — en 4 repères.</Text>
        </View>
      </View>
      <View style={styles.radarMiniGrid}>
        {preview.map((trend) => (
          <View key={trend.id} style={[styles.radarMiniPill, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]}>
            <CheckCircle2 size={13} color={colors.coral} strokeWidth={2.5} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.radarMiniPillLabel, { color: colors.coral }]}>{trend.label}</Text>
              <Text style={[styles.radarMiniPillText, { color: colors.textPrimary }]} numberOfLines={2}>{trend.title}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={[styles.radarMiniOpen, { color: colors.coral }]}>Voir le radar complet →</Text>
    </TouchableOpacity>
  );
}

function buildGeneralToolCards(allTools: Tool[], benchmarkRows: BenchmarkRow[]): Tool[] {
  const bySlug = new Map(allTools.map((tool) => [tool.slug, tool]));
  const rowBySlug = new Map(benchmarkRows.map((row) => [row.slug, row]));
  return GENERAL_MODELS.map((model) => {
    const base = bySlug.get(model.slug);
    const row = rowBySlug.get(model.slug);
    if (!base && !row) return null;
    const fallback = allTools.find((tool) => tool.vendor.toLowerCase().includes(model.generic.toLowerCase())) ?? allTools[0];
    const source = base ?? fallback;
    if (!source) return null;
    return { ...source, slug: model.slug, name: model.generic, tagline: `${model.displayModel} — ${model.note}`, vendor: row?.vendor ?? source.vendor, color: row?.color ?? source.color, speedMs: row?.speedMs ?? source.speedMs, accuracyPct: row?.accuracyPct ?? source.accuracyPct, monthlyPrice: row?.monthlyPrice ?? source.monthlyPrice, freeTier: row?.freeTier ?? source.freeTier, score: row?.score ?? source.score };
  }).filter((tool): tool is Tool => Boolean(tool));
}

function CompactToolRow({ tool, rank, onPress }: { tool: Tool; rank: number; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.toolRow, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} activeOpacity={0.84}>
      <Text style={[styles.toolRank, { color: colors.coral }]}>#{rank}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.toolRowName, { color: colors.textPrimary }]}>{tool.name}</Text>
        <Text style={[styles.toolRowText, { color: colors.textSecondary }]} numberOfLines={1}>{tool.tagline}</Text>
      </View>
      <Text style={[styles.toolRowScore, { color: colors.coral }]}>{tool.score}</Text>
    </TouchableOpacity>
  );
}

function QuickCard({ icon, title, text, onPress }: { icon: React.ReactNode; title: string; text: string; onPress: () => void }) {
  const { colors } = useTheme();
  return <TouchableOpacity onPress={onPress} style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}><View style={[styles.quickIcon, { backgroundColor: colors.coralSoft }]}>{icon}</View><Text style={[styles.quickTitle, { color: colors.textPrimary }]}>{title}</Text><Text style={[styles.quickText, { color: colors.textSecondary }]}>{text}</Text></TouchableOpacity>;
}

function CompactLink({ icon, title, onPress }: { icon: React.ReactNode; title: string; onPress: () => void }) {
  const { colors } = useTheme();
  return <TouchableOpacity onPress={onPress} style={[styles.compactLink, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]}>{icon}<Text style={[styles.compactLinkText, { color: colors.textPrimary }]}>{title}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.sm },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandLogo: { width: 44, height: 44, borderRadius: 8 },
  brandName: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 20 },
  brandSub: { fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 1.2 },
  hero: { backgroundColor: colors.darkCard, borderRadius: radius.xl, padding: spacing.lg, paddingVertical: spacing.xl, marginTop: spacing.sm, ...shadow.dark },
  heroLabel: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 1.6, color: colors.coral, marginBottom: spacing.sm },
  heroTitle: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, color: colors.textInverse, letterSpacing: -1 },
  heroTitleAccent: { color: colors.coral, fontStyle: "italic" },
  heroSub: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: "rgba(253,251,247,0.72)", marginTop: spacing.sm, marginBottom: spacing.md },
  cta: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.coral, paddingHorizontal: spacing.md, paddingVertical: 12, borderRadius: radius.pill, alignSelf: "flex-start" },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  primaryActions: { gap: spacing.sm, marginTop: spacing.md },
  quickCard: { width: "100%", borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, minHeight: 92 },
  quickIcon: { width: 38, height: 38, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  quickTitle: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 23 },
  quickText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, marginTop: 4 },
  moreCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm },
  moreTitle: { fontFamily: fonts.bodyBold, fontSize: 14, marginBottom: spacing.sm },
  moreGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  compactLink: { width: "48%", minHeight: 42, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 7 },
  compactLinkText: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 13 },
  hubCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  sectionHeadCompact: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: spacing.sm },
  familyGrid: { gap: 8 },
  familyPill: { borderRadius: radius.lg, padding: spacing.sm },
  familyTitle: { fontFamily: fonts.bodyBold, fontSize: 13 },
  familyText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 2 },
  newsCard: { borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  newsTopRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 6 },
  newsLabel: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.2 },
  newsTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 26 },
  newsText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 4 },
  sectionHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30 },
  sectionLink: { fontFamily: fonts.bodyBold, fontSize: 12 },
  toolRow: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: 8 },
  toolRank: { fontFamily: fonts.bodyBold, fontSize: 12, width: 28 },
  toolRowName: { fontFamily: fonts.bodyBold, fontSize: 14 },
  toolRowText: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  toolRowScore: { fontFamily: fonts.bodyBold, fontSize: 14 },
  monetizeCard: { borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  monetizeLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.8, color: colors.coral, marginBottom: 6 },
  monetizeTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 29, color: colors.textInverse },
  monetizeText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: "rgba(253,251,247,0.76)", marginTop: 8 },
  monetizeCta: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", backgroundColor: colors.coral, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 11, marginTop: spacing.md },
  monetizeCtaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 12 },
  radarMini: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.md, marginTop: spacing.md, ...shadow.soft },
  radarMiniHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: spacing.sm },
  radarOrb: { width: 42, height: 42, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  radarMiniLabel: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.2 },
  radarMiniTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 25, marginTop: 2 },
  radarMiniGrid: { gap: 7 },
  radarMiniPill: { flexDirection: "row", alignItems: "flex-start", gap: 7, borderWidth: 1, borderRadius: radius.md, padding: 9 },
  radarMiniPillLabel: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase" },
  radarMiniPillText: { fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 18, marginTop: 1 },
  radarMiniOpen: { fontFamily: fonts.bodyBold, fontSize: 13, marginTop: spacing.sm },
  retentionCard: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.md, marginTop: spacing.md },
  retentionIconRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  retentionIcon: { width: 40, height: 40, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  retentionLabel: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.1 },
  retentionTitle: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 26, marginTop: 2 },
  retentionText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  retentionActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.md },
  retentionCta: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 11 },
  retentionCtaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 13 },
  retentionGhost: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 10 },
  retentionGhostText: { fontFamily: fonts.bodyBold, fontSize: 13 },
});
