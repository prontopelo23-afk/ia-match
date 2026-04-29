import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, Copy, Check, ExternalLink } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme, usePremium } from "../../src/theme-context";
import { api, Lesson, Template, Resource } from "../../src/api";
import PremiumGate from "../../src/components/PremiumGate";

type Tab = "fundamentals" | "templates" | "resources";

export default function AcademyScreen() {
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const [tab, setTab] = useState<Tab>("fundamentals");
  const [levelFilter, setLevelFilter] = useState<"ALL" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED">("ALL");
  const [resourceFilter, setResourceFilter] = useState<"ALL" | "YOUTUBE" | "BLOG" | "PODCAST" | "NEWSLETTER" | "OUTIL">("ALL");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listLessons(), api.listTemplates(), api.listResources()])
      .then(([ls, ts, rs]) => {
        setLessons(ls);
        setTemplates(ts);
        setResources(rs);
        if (ls.length) setActiveLessonId(ls[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!isPremium) {
    return (
      <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.bg }]} edges={["top"]}>
        <PremiumGate
          feature="Academy"
          description="Apprends à prompter comme un pro avec des leçons illustrées, des templates copiables et des ressources françaises triées sur le volet."
          benefits={[
            "10 leçons fondamentales avec framework et avant/après",
            "15 templates de prompts copiables (CV, recherche, code, pitch…)",
            "16 ressources 100% françaises (YouTubers, blogs, podcasts, newsletters)",
            "Accès au Builder IA et au Comparateur avancé",
          ]}
        />
      </SafeAreaView>
    );
  }

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  const copy = async (id: string, body: string) => {
    try {
      await Clipboard.setStringAsync(body);
    } catch {}
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredResources =
    resourceFilter === "ALL" ? resources : resources.filter((r) => r.category === resourceFilter);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.crumb, { color: colors.textSecondary }]}>Workspace · Academy</Text>
        <Text style={[styles.eyebrow, { color: colors.coral }]}>PROMPT ACADEMY</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Apprends à <Text style={[styles.titleAccent, { color: colors.coral }]}>prompter</Text> comme un pro.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
          <View style={[styles.tabs, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
            <TouchableOpacity
              onPress={() => setTab("fundamentals")}
              style={[styles.tab, tab === "fundamentals" && { backgroundColor: colors.coralSoft }]}
              testID="academy-tab-fundamentals"
            >
              <Text style={[styles.tabText, { color: tab === "fundamentals" ? colors.coral : colors.textSecondary }]}>
                Fondamentaux
              </Text>
              <Text style={[styles.tabCount, { color: colors.textSecondary }]}>{lessons.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab("templates")}
              style={[styles.tab, tab === "templates" && { backgroundColor: colors.coralSoft }]}
              testID="academy-tab-templates"
            >
              <Text style={[styles.tabText, { color: tab === "templates" ? colors.coral : colors.textSecondary }]}>
                Templates
              </Text>
              <Text style={[styles.tabCount, { color: colors.textSecondary }]}>{templates.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab("resources")}
              style={[styles.tab, tab === "resources" && { backgroundColor: colors.coralSoft }]}
              testID="academy-tab-resources"
            >
              <Text style={[styles.tabText, { color: tab === "resources" ? colors.coral : colors.textSecondary }]}>
                Ressources FR
              </Text>
              <Text style={[styles.tabCount, { color: colors.textSecondary }]}>{resources.length}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {loading ? (
          <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.xl }} />
        ) : tab === "fundamentals" ? (
          <View>
            {lessons.map((l) => (
              <TouchableOpacity
                key={l.id}
                onPress={() => setActiveLessonId(l.id)}
                style={[
                  styles.lessonRow,
                  { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
                  activeLessonId === l.id && { borderColor: colors.coral, backgroundColor: colors.coralSoft },
                ]}
                testID={`lesson-${l.id}`}
              >
                <View style={styles.lessonHeadRow}>
                  <Text style={[styles.lessonOrder, { color: colors.textSecondary }]}>0{l.order} · {l.level}</Text>
                  <View style={styles.minRow}>
                    <Clock size={11} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={[styles.lessonMin, { color: colors.textSecondary }]}>{l.minutes}M</Text>
                  </View>
                </View>
                <Text style={[styles.lessonTitle, { color: colors.textPrimary }]}>{l.title}</Text>
              </TouchableOpacity>
            ))}

            {activeLesson ? (
              <View
                style={[styles.lessonDetail, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
                testID="lesson-detail"
              >
                <Text style={[styles.detailEyebrow, { color: colors.textSecondary }]}>
                  LEÇON · {activeLesson.level} · {activeLesson.minutes} MIN
                </Text>
                <Text style={[styles.detailTitle, { color: colors.textPrimary }]}>{activeLesson.title}</Text>
                <Text style={[styles.detailIntro, { color: colors.textPrimary }]}>{activeLesson.intro}</Text>
                <Text style={[styles.detailBody, { color: colors.textSecondary }]}>{activeLesson.body}</Text>

                <View style={[styles.frameworkBox, { borderColor: colors.coral }]}>
                  <Text style={[styles.frameworkLabel, { color: colors.coral }]}>FRAMEWORK</Text>
                  <Text style={[styles.frameworkText, { color: colors.coral }]}>{activeLesson.framework}</Text>
                  {activeLesson.steps.map((s, i) => (
                    <View key={i} style={styles.stepRow}>
                      <Text style={[styles.stepNum, { color: colors.textSecondary }]}>0{i + 1}</Text>
                      <Text style={[styles.stepText, { color: colors.textPrimary }]}>{s}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.beforeAfter}>
                  <View style={[styles.baBlock, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]}>
                    <Text style={[styles.baLabel, { color: colors.coral }]}>AVANT</Text>
                    <Text style={[styles.baText, { color: colors.textPrimary }]}>{activeLesson.before}</Text>
                  </View>
                  <View style={[styles.baBlock, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]}>
                    <Text style={[styles.baLabel, { color: colors.coral }]}>APRÈS</Text>
                    <Text style={[styles.baText, { color: colors.textPrimary }]}>{activeLesson.after}</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        ) : tab === "templates" ? (
          <View style={styles.templatesGrid}>
            <View style={styles.levelRow}>
              {(["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map((lv) => (
                <TouchableOpacity
                  key={lv}
                  onPress={() => setLevelFilter(lv)}
                  style={[
                    styles.levelChip,
                    { borderColor: colors.borderSubtle },
                    levelFilter === lv && { backgroundColor: colors.coralSoft, borderColor: colors.coral },
                  ]}
                  testID={`level-${lv}`}
                >
                  <Text style={[styles.levelChipText, { color: levelFilter === lv ? colors.coral : colors.textSecondary }]}>
                    {lv === "ALL" ? "Tous" : lv === "BEGINNER" ? "Débutant" : lv === "INTERMEDIATE" ? "Intermédiaire" : "Avancé"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {templates.filter((t) => levelFilter === "ALL" || t.level === levelFilter).map((t) => (
              <View
                key={t.id}
                style={[styles.templateCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
                testID={`template-${t.id}`}
              >
                <View style={styles.templateHeader}>
                  <Text style={[styles.templateLevel, { color: colors.coral }]}>{t.level}</Text>
                  <TouchableOpacity onPress={() => copy(t.id, t.body)} style={styles.copyBtn} testID={`copy-${t.id}`}>
                    {copiedId === t.id ? (
                      <Check size={16} color={colors.success} strokeWidth={2.5} />
                    ) : (
                      <Copy size={16} color={colors.textSecondary} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={[styles.templateTitle, { color: colors.textPrimary }]}>{t.title}</Text>
                <Text style={[styles.templateBody, { color: colors.textSecondary }]} numberOfLines={6}>
                  {t.body}
                </Text>
                <View style={styles.varsRow}>
                  {t.variables.slice(0, 5).map((v) => (
                    <Text key={v} style={[styles.varTag, { color: colors.textSecondary }]}>{`{${v}}`}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          // Resources tab
          <View style={styles.templatesGrid}>
            <Text style={[styles.resourcesIntro, { color: colors.textSecondary }]}>
              16 ressources 100% françaises pour aller plus loin sur l'IA. YouTubers, blogs, podcasts, newsletters et outils — tous vérifiés.
            </Text>
            <View style={styles.levelRow}>
              {(["ALL", "YOUTUBE", "BLOG", "PODCAST", "NEWSLETTER", "OUTIL"] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setResourceFilter(cat)}
                  style={[
                    styles.levelChip,
                    { borderColor: colors.borderSubtle },
                    resourceFilter === cat && { backgroundColor: colors.coralSoft, borderColor: colors.coral },
                  ]}
                  testID={`res-cat-${cat}`}
                >
                  <Text style={[styles.levelChipText, { color: resourceFilter === cat ? colors.coral : colors.textSecondary }]}>
                    {cat === "ALL" ? "Tout" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {filteredResources.map((r) => (
              <TouchableOpacity
                key={r.id}
                onPress={() => Linking.openURL(r.url).catch(() => {})}
                style={[styles.resourceCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
                testID={`resource-${r.id}`}
                activeOpacity={0.85}
              >
                <View style={styles.resourceHead}>
                  <Text style={[styles.resourceCat, { color: colors.coral }]}>{r.category}</Text>
                  <ExternalLink size={14} color={colors.textSecondary} strokeWidth={2} />
                </View>
                <Text style={[styles.resourceTitle, { color: colors.textPrimary }]}>{r.title}</Text>
                <Text style={[styles.resourceAuthor, { color: colors.textSecondary }]}>par {r.author}</Text>
                <Text style={[styles.resourceSummary, { color: colors.textSecondary }]} numberOfLines={3}>
                  {r.summary}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  crumb: { fontFamily: fonts.body, fontSize: 12, marginBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, letterSpacing: -1, marginBottom: spacing.lg },
  titleAccent: { fontStyle: "italic" },
  tabs: {
    flexDirection: "row",
    borderRadius: radius.pill,
    padding: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
  },
  tab: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
  tabText: { fontFamily: fonts.bodySemi, fontSize: 13 },
  tabCount: { fontFamily: fonts.bodyBold, fontSize: 11 },
  lessonRow: { padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1 },
  lessonHeadRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  lessonOrder: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  minRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  lessonMin: { fontFamily: fonts.bodyMd, fontSize: 11 },
  lessonTitle: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 22 },
  lessonDetail: { marginTop: spacing.lg, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1 },
  detailEyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  detailTitle: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 34, letterSpacing: -0.5, marginTop: spacing.sm },
  detailIntro: { fontFamily: fonts.body, fontSize: 15, marginTop: spacing.md, lineHeight: 22 },
  detailBody: { fontFamily: fonts.body, fontSize: 14, marginTop: spacing.sm, lineHeight: 20 },
  frameworkBox: { borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg, borderWidth: 1.5 },
  frameworkLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  frameworkText: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, marginTop: 4, marginBottom: spacing.sm },
  stepRow: { flexDirection: "row", gap: 10, paddingVertical: 6 },
  stepNum: { fontFamily: fonts.body, fontSize: 12, width: 22 },
  stepText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, flex: 1 },
  beforeAfter: { flexDirection: "row", gap: 8, marginTop: spacing.md },
  baBlock: { flex: 1, padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  baLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: 6 },
  baText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18 },
  templatesGrid: { gap: spacing.md },
  levelRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.sm },
  levelChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  levelChipText: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 0.5 },
  templateCard: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1 },
  templateHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  templateLevel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  copyBtn: { padding: 4 },
  templateTitle: { fontFamily: fonts.serif, fontSize: 20, marginTop: 8, marginBottom: spacing.sm, lineHeight: 24 },
  templateBody: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  varsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: spacing.md },
  varTag: { fontFamily: fonts.body, fontSize: 11 },
  resourcesIntro: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, marginBottom: spacing.sm },
  resourceCard: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1 },
  resourceHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resourceCat: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  resourceTitle: { fontFamily: fonts.serif, fontSize: 20, marginTop: 6, lineHeight: 24 },
  resourceAuthor: { fontFamily: fonts.body, fontSize: 11, marginTop: 2, fontStyle: "italic" },
  resourceSummary: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 8 },
});
