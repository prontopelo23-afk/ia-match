import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ChevronLeft, GitBranch, ShieldCheck, Sparkles } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, NewsItem, Tool } from "../../src/api";
import { getNewsIntel, relatedToolsForNews } from "../../src/utils/newsIntelligence";
import LogoTile from "../../src/components/LogoTile";

export default function NewsDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getNews(id), api.listTools({ sort: "score" })])
      .then(([news, allTools]) => { setItem(news); setTools(allTools); })
      .catch(() => setItem(null));
  }, [id]);

  const intel = useMemo(() => item ? getNewsIntel(item) : null, [item]);
  const related = useMemo(() => item ? relatedToolsForNews(item, tools, 4) : [], [item, tools]);

  if (!item || !intel) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
        <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.xxl }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} testID="news-back">
          <ChevronLeft size={20} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.duration(420)}>
          <View style={styles.metaRow}>
            <Text style={[styles.impact, { backgroundColor: colors.coralSoft, color: colors.coral }]}>{intel.impact.label}</Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>{formatDate(item.publishedAt)} · {item.readMinutes} min</Text>
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
          {item.author ? <Text style={[styles.author, { color: colors.textSecondary }]}>Par {item.author}</Text> : null}
          <View style={[styles.trustRow, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }] }>
            <ShieldCheck size={15} color={colors.coral} strokeWidth={2.5} />
            <Text style={[styles.trustText, { color: colors.textSecondary }]}>Confiance {item.confidence ?? "moyenne"} · {item.verificationStatus ? "source/curation vérifiée" : "signal éditorial"} · vérifié {formatDate(item.lastVerifiedAt || item.publishedAt)}</Text>
          </View>
          {item.intro ? <Text style={[styles.intro, { color: colors.textPrimary }]}>{item.intro}</Text> : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(420)} style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.coral }] }>
          <View style={styles.cardTitleRow}>
            <Sparkles size={17} color={colors.coral} strokeWidth={2.5} />
            <Text style={[styles.summaryTitle, { color: colors.coral }]}>Résumé en 30 secondes</Text>
          </View>
          {intel.quickSummary.map((line) => <Text key={line} style={[styles.summaryLine, { color: colors.textPrimary }]}>• {line}</Text>)}
        </Animated.View>

        <View style={[styles.decisionCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }] }>
          <Text style={[styles.decisionTitle, { color: colors.textPrimary }]}>Ce que ça change</Text>
          {intel.changes.map((line) => <Text key={line} style={[styles.decisionLine, { color: colors.textSecondary }]}>• {line}</Text>)}
          {item.radarStatus ? <Text style={[styles.radarLine, { color: colors.coral }]}>Radar : {item.radarStatus}</Text> : null}
          <Text style={[styles.nextAction, { color: colors.coral }]}>Action conseillée : {intel.action}</Text>
        </View>

        {related.length ? (
          <View style={[styles.relatedCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }] }>
            <Text style={[styles.decisionTitle, { color: colors.textPrimary }]}>Outils concernés</Text>
            <Text style={[styles.relatedIntro, { color: colors.textSecondary }]}>Liés par mots-clés, catégorie et score IA Match — à vérifier selon ton usage.</Text>
            {related.map((tool) => (
              <TouchableOpacity key={tool.slug} onPress={() => router.push(`/tool/${tool.slug}`)} style={[styles.toolRow, { borderColor: colors.borderSubtle }]}>
                <LogoTile uri={tool.image} name={tool.name} bg={tool.color} domain={tool.domain} size={38} rounded={12} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.toolName, { color: colors.textPrimary }]}>{tool.name}</Text>
                  <Text numberOfLines={1} style={[styles.toolMeta, { color: colors.textSecondary }]}>{tool.tagline}</Text>
                </View>
                <Text style={[styles.toolScore, { color: colors.coral }]}>{tool.score}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <View style={[styles.adviceCard, { backgroundColor: colors.coralSoft, borderColor: colors.coral }] }>
          <GitBranch size={18} color={colors.coral} strokeWidth={2.5} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.adviceTitle, { color: colors.textPrimary }]}>Le conseil IA Match</Text>
            <Text style={[styles.adviceText, { color: colors.textSecondary }]}>{intel.advice}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push("/match")} style={[styles.matchBtn, { backgroundColor: colors.coral }]}>
          <Text style={styles.matchText}>Lancer un Match avec ce contexte</Text>
        </TouchableOpacity>

        {(item.body || "").split("\n\n").map((para, i) => renderBlock(para, i, colors))}
        <View style={{ height: 70 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function renderBlock(para: string, i: number, colors: any) {
  const trimmed = para.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("## ")) return <Text key={i} style={[styles.h2, { color: colors.textPrimary }]}>{trimmed.replace(/^##\s+/, "")}</Text>;
  if (trimmed.startsWith("### ")) return <Text key={i} style={[styles.h3, { color: colors.textPrimary }]}>{trimmed.replace(/^###\s+/, "")}</Text>;
  const schemaMatch = trimmed.match(/^`?([^`\n]*→[^`\n]*)`?$/);
  if (schemaMatch) return <SchemaBlock key={i} steps={schemaMatch[1].split("→").map((x) => x.trim()).filter(Boolean)} colors={colors} />;
  if (trimmed.startsWith("- ")) {
    return <View key={i} style={{ marginVertical: spacing.sm }}>{trimmed.split("\n").map((l, j) => <View key={j} style={styles.bulletRow}><Text style={[styles.bulletDot, { color: colors.coral }]}>·</Text><Text style={[styles.bulletText, { color: colors.textPrimary }]}>{renderInline(l.replace(/^-\s+/, ""))}</Text></View>)}</View>;
  }
  if (/^\d+\.\s/.test(trimmed)) return <View key={i} style={{ marginVertical: spacing.sm }}>{trimmed.split("\n").map((b, j) => <Text key={j} style={[styles.numberedLine, { color: colors.textPrimary }]}>{renderInline(b)}</Text>)}</View>;
  return <Text key={i} style={[styles.para, { color: colors.textPrimary }]}>{renderInline(trimmed)}</Text>;
}

function SchemaBlock({ steps, colors }: { steps: string[]; colors: any }) {
  return (
    <View style={[styles.schemaCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }] }>
      {steps.map((step, index) => (
        <React.Fragment key={`${step}-${index}`}>
          <View style={styles.schemaItem}>
            <View style={[styles.schemaBubble, { backgroundColor: colors.coralSoft, borderColor: colors.coral }]}>
              <Text style={[styles.schemaIndex, { color: colors.coral }]}>{index + 1}</Text>
            </View>
            <Text style={[styles.schemaText, { color: colors.textPrimary }]}>{step}</Text>
          </View>
          {index < steps.length - 1 ? <View style={[styles.schemaConnector, { backgroundColor: colors.borderSubtle }]} /> : null}
        </React.Fragment>
      ))}
    </View>
  );
}

function renderInline(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) => p.startsWith("**") && p.endsWith("**") ? <Text key={i} style={{ fontFamily: fonts.bodyBold }}>{p.slice(2, -2)}</Text> : p);
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 1, marginBottom: spacing.lg },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.sm, flexWrap: "wrap" },
  impact: { overflow: "hidden", borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 0.8 },
  meta: { fontFamily: fonts.body, fontSize: 12 },
  title: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, letterSpacing: -1, marginBottom: spacing.sm },
  author: { fontFamily: fonts.body, fontSize: 13, marginBottom: spacing.sm },
  trustRow: { flexDirection: "row", gap: 8, alignItems: "flex-start", borderWidth: 1, borderRadius: radius.lg, padding: spacing.sm, marginBottom: spacing.lg },
  trustText: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 17 },
  intro: { fontFamily: fonts.body, fontSize: 17, lineHeight: 26, marginBottom: spacing.lg, fontStyle: "italic" },
  summaryCard: { borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 7 },
  summaryTitle: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  summaryLine: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, marginBottom: 3 },
  decisionCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  decisionTitle: { fontFamily: fonts.serif, fontSize: 20, marginBottom: 6 },
  decisionLine: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, marginBottom: 2 },
  radarLine: { fontFamily: fonts.bodyBold, fontSize: 12, lineHeight: 18, marginTop: spacing.sm },
  nextAction: { fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 19, marginTop: spacing.sm },
  relatedCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  relatedIntro: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginBottom: spacing.sm },
  toolRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderRadius: radius.md, padding: 9, marginBottom: 7 },
  toolName: { fontFamily: fonts.bodyBold, fontSize: 13 },
  toolMeta: { fontFamily: fonts.body, fontSize: 11, marginTop: 2 },
  toolScore: { fontFamily: fonts.bodyBold, fontSize: 13 },
  adviceCard: { flexDirection: "row", gap: spacing.sm, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  adviceTitle: { fontFamily: fonts.bodyBold, fontSize: 14 },
  adviceText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, marginTop: 3 },
  matchBtn: { borderRadius: radius.pill, paddingVertical: 14, alignItems: "center", marginBottom: spacing.lg },
  matchText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  h2: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30, marginTop: spacing.lg, marginBottom: spacing.sm, letterSpacing: -0.5 },
  h3: { fontFamily: fonts.bodyBold, fontSize: 17, marginTop: spacing.md, marginBottom: 6 },
  para: { fontFamily: fonts.body, fontSize: 16, lineHeight: 25, marginBottom: spacing.sm },
  bulletRow: { flexDirection: "row", gap: 8, marginVertical: 3 },
  bulletDot: { fontSize: 18, fontFamily: fonts.bodyBold, lineHeight: 22 },
  bulletText: { flex: 1, fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  numberedLine: { fontFamily: fonts.body, fontSize: 16, lineHeight: 25, marginVertical: 3 },
  schemaCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm, marginBottom: spacing.md },
  schemaItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  schemaBubble: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  schemaIndex: { fontFamily: fonts.bodyBold, fontSize: 12 },
  schemaText: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 14, lineHeight: 19 },
  schemaConnector: { width: 2, height: 18, marginLeft: 14, marginVertical: 3 },
});
