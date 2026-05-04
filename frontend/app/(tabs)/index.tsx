import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowRight, Newspaper, Layers3, Sparkles, Wand2, BookOpen, Radar, Mail, BriefcaseBusiness, GitCompare, GraduationCap, Network, Send, CheckCircle2 } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { useI18n } from "../../src/i18n";
import { api, BenchmarkRow, NewsItem, Tool } from "../../src/api";
import ToolCard from "../../src/components/ToolCard";
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

        <View style={styles.quickGrid}>
          <QuickCard icon={<Layers3 size={20} color={colors.coral} />} title={t("home.quickCatalogTitle")} text={t("home.quickCatalog")} onPress={() => router.push("/(tabs)/categories")} />
          <QuickCard icon={<BookOpen size={20} color={colors.coral} />} title={t("home.quickAcademyTitle")} text={t("home.quickAcademy")} onPress={() => router.push("/(tabs)/academy")} />
          <QuickCard icon={<Sparkles size={20} color={colors.coral} />} title={t("home.quickRankingsTitle")} text={t("home.quickRankings")} onPress={() => router.push("/(tabs)/benchmarks")} />
          <QuickCard icon={<Wand2 size={20} color={colors.coral} />} title={t("home.quickPromptTitle")} text={t("home.quickPrompt")} onPress={() => router.push("/(tabs)/builder")} />
          <QuickCard icon={<Newspaper size={20} color={colors.coral} />} title="Actu" text="Radar IA, sources et conseils actionnables." onPress={() => router.push("/(tabs)/actue")} />
          <QuickCard icon={<GitCompare size={20} color={colors.coral} />} title="Comparer" text="Comparer jusqu’à 4 outils avec favoris et notes." onPress={() => router.push("/(tabs)/compare")} />
          <QuickCard icon={<GraduationCap size={20} color={colors.coral} />} title="Apprendre" text="Glossaire, FAQ, cas d’usage et quiz gratuit." onPress={() => router.push("/learn")} />
          <QuickCard icon={<Network size={20} color={colors.coral} />} title="Écosystème" text="Stacks IA, ressources et workflows concrets." onPress={() => router.push("/ecosystem")} />
          <QuickCard icon={<Mail size={20} color={colors.coral} />} title={t("home.quickNewsletterTitle")} text={t("home.quickNewsletter")} onPress={() => router.push("/newsletter")} />
          <QuickCard icon={<BriefcaseBusiness size={20} color={colors.coral} />} title={t("home.quickBusinessTitle")} text={t("home.quickBusiness")} onPress={() => router.push("/business")} />
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
          <Text style={[styles.retentionText, { color: theme.textSecondary }]}>La newsletter quitte le centre de l’accueil : elle devient un rappel compact et personnalisable dans Profil → Préférences de veille.</Text>
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
        {loading ? <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.lg }} /> : generalTools.map((t, index) => <ToolCard key={t.slug} tool={t} rank={index + 1} />)}
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

function QuickCard({ icon, title, text, onPress }: { icon: React.ReactNode; title: string; text: string; onPress: () => void }) {
  const { colors } = useTheme();
  return <TouchableOpacity onPress={onPress} style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}><View style={[styles.quickIcon, { backgroundColor: colors.coralSoft }]}>{icon}</View><Text style={[styles.quickTitle, { color: colors.textPrimary }]}>{title}</Text><Text style={[styles.quickText, { color: colors.textSecondary }]}>{text}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.sm },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandLogo: { width: 44, height: 44, borderRadius: 8 },
  brandName: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 20 },
  brandSub: { fontFamily: fonts.bodySemi, fontSize: 10, letterSpacing: 1.5 },
  hero: { backgroundColor: colors.darkCard, borderRadius: radius.xl, padding: spacing.lg, paddingVertical: spacing.xl, marginTop: spacing.sm, ...shadow.dark },
  heroLabel: { fontFamily: fonts.bodySemi, fontSize: 10, letterSpacing: 2, color: colors.coral, marginBottom: spacing.sm },
  heroTitle: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, color: colors.textInverse, letterSpacing: -1 },
  heroTitleAccent: { color: colors.coral, fontStyle: "italic" },
  heroSub: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: "rgba(253,251,247,0.72)", marginTop: spacing.sm, marginBottom: spacing.md },
  cta: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.coral, paddingHorizontal: spacing.md, paddingVertical: 12, borderRadius: radius.pill, alignSelf: "flex-start" },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  quickCard: { width: "48%", borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, minHeight: 118 },
  quickIcon: { width: 38, height: 38, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  quickTitle: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 23 },
  quickText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 4 },
  hubCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  sectionHeadCompact: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginBottom: spacing.sm },
  familyGrid: { gap: 8 },
  familyPill: { borderRadius: radius.lg, padding: spacing.sm },
  familyTitle: { fontFamily: fonts.bodyBold, fontSize: 13 },
  familyText: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16, marginTop: 2 },
  newsCard: { borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  newsTopRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 6 },
  newsLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  newsTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 26 },
  newsText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 4 },
  sectionHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30 },
  sectionLink: { fontFamily: fonts.bodyBold, fontSize: 12 },
  monetizeCard: { borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  monetizeLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.8, color: colors.coral, marginBottom: 6 },
  monetizeTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 29, color: colors.textInverse },
  monetizeText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, color: "rgba(253,251,247,0.76)", marginTop: 8 },
  monetizeCta: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", backgroundColor: colors.coral, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 11, marginTop: spacing.md },
  monetizeCtaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 12 },
  radarMini: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.md, marginTop: spacing.md, ...shadow.soft },
  radarMiniHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: spacing.sm },
  radarOrb: { width: 42, height: 42, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  radarMiniLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  radarMiniTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 25, marginTop: 2 },
  radarMiniGrid: { gap: 7 },
  radarMiniPill: { flexDirection: "row", alignItems: "flex-start", gap: 7, borderWidth: 1, borderRadius: radius.md, padding: 9 },
  radarMiniPillLabel: { fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase" },
  radarMiniPillText: { fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 16, marginTop: 1 },
  radarMiniOpen: { fontFamily: fonts.bodyBold, fontSize: 12, marginTop: spacing.sm },
  retentionCard: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.md, marginTop: spacing.md },
  retentionIconRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  retentionIcon: { width: 40, height: 40, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  retentionLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.4 },
  retentionTitle: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 26, marginTop: 2 },
  retentionText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginTop: spacing.sm },
  retentionActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.md },
  retentionCta: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 11 },
  retentionCtaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 12 },
  retentionGhost: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 10 },
  retentionGhostText: { fontFamily: fonts.bodyBold, fontSize: 12 },
});
