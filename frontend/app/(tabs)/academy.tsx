import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, Copy, Check } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { colors, fonts, radius, spacing } from "../../src/theme";
import { api, Lesson, Template } from "../../src/api";

type Tab = "fundamentals" | "templates";

export default function AcademyScreen() {
  const [tab, setTab] = useState<Tab>("fundamentals");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listLessons(), api.listTemplates()])
      .then(([ls, ts]) => {
        setLessons(ls);
        setTemplates(ts);
        if (ls.length) setActiveLessonId(ls[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  const copy = async (id: string, body: string) => {
    try {
      await Clipboard.setStringAsync(body);
    } catch {}
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.crumb}>Workspace · Academy</Text>
        <Text style={styles.eyebrow}>PROMPT ACADEMY</Text>
        <Text style={styles.title}>
          Apprends à <Text style={styles.titleAccent}>prompter</Text> comme un pro.
        </Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setTab("fundamentals")}
            style={[styles.tab, tab === "fundamentals" && styles.tabActive]}
            testID="academy-tab-fundamentals"
          >
            <Text style={[styles.tabText, tab === "fundamentals" && styles.tabTextActive]}>
              Fondamentaux
            </Text>
            <Text style={[styles.tabCount, tab === "fundamentals" && styles.tabCountActive]}>{lessons.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("templates")}
            style={[styles.tab, tab === "templates" && styles.tabActive]}
            testID="academy-tab-templates"
          >
            <Text style={[styles.tabText, tab === "templates" && styles.tabTextActive]}>Templates</Text>
            <Text style={[styles.tabCount, tab === "templates" && styles.tabCountActive]}>{templates.length}</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.xl }} />
        ) : tab === "fundamentals" ? (
          <View>
            {/* Lesson list */}
            {lessons.map((l) => (
              <TouchableOpacity
                key={l.id}
                onPress={() => setActiveLessonId(l.id)}
                style={[styles.lessonRow, activeLessonId === l.id && styles.lessonRowActive]}
                testID={`lesson-${l.id}`}
              >
                <View style={styles.lessonHeadRow}>
                  <Text style={styles.lessonOrder}>0{l.order} · {l.level}</Text>
                  <View style={styles.minRow}>
                    <Clock size={11} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={styles.lessonMin}>{l.minutes}M</Text>
                  </View>
                </View>
                <Text style={styles.lessonTitle}>{l.title}</Text>
              </TouchableOpacity>
            ))}

            {/* Active lesson detail */}
            {activeLesson ? (
              <View style={styles.lessonDetail} testID="lesson-detail">
                <Text style={styles.detailEyebrow}>LEÇON · {activeLesson.level} · {activeLesson.minutes} MIN</Text>
                <Text style={styles.detailTitle}>{activeLesson.title}</Text>
                <Text style={styles.detailIntro}>{activeLesson.intro}</Text>
                <Text style={styles.detailBody}>{activeLesson.body}</Text>

                <View style={styles.frameworkBox}>
                  <Text style={styles.frameworkLabel}>FRAMEWORK</Text>
                  <Text style={styles.frameworkText}>{activeLesson.framework}</Text>
                  {activeLesson.steps.map((s, i) => (
                    <View key={i} style={styles.stepRow}>
                      <Text style={styles.stepNum}>0{i + 1}</Text>
                      <Text style={styles.stepText}>{s}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.beforeAfter}>
                  <View style={styles.baBlock}>
                    <Text style={styles.baLabel}>AVANT</Text>
                    <Text style={styles.baText}>{activeLesson.before}</Text>
                  </View>
                  <View style={styles.baBlock}>
                    <Text style={styles.baLabel}>APRÈS</Text>
                    <Text style={styles.baText}>{activeLesson.after}</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.templatesGrid}>
            {templates.map((t) => (
              <View key={t.id} style={styles.templateCard} testID={`template-${t.id}`}>
                <View style={styles.templateHeader}>
                  <Text style={styles.templateLevel}>{t.level}</Text>
                  <TouchableOpacity onPress={() => copy(t.id, t.body)} style={styles.copyBtn} testID={`copy-${t.id}`}>
                    {copiedId === t.id ? (
                      <Check size={16} color={colors.success} strokeWidth={2.5} />
                    ) : (
                      <Copy size={16} color="rgba(253,251,247,0.5)" strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.templateTitle}>{t.title}</Text>
                <Text style={styles.templateBody} numberOfLines={6}>{t.body}</Text>
                <View style={styles.varsRow}>
                  {t.variables.slice(0, 5).map((v) => (
                    <Text key={v} style={styles.varTag}>{`{${v}}`}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.darkCard },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  crumb: { fontFamily: fonts.body, fontSize: 12, color: "rgba(253,251,247,0.5)", marginBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, color: colors.coral, marginBottom: spacing.sm },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    lineHeight: 42,
    color: colors.textInverse,
    letterSpacing: -1,
    marginBottom: spacing.lg,
  },
  titleAccent: { color: colors.coral, fontStyle: "italic" },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#0A0D14",
    borderRadius: radius.pill,
    padding: 4,
    alignSelf: "flex-start",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  tabActive: { backgroundColor: colors.surface },
  tabText: { fontFamily: fonts.bodySemi, fontSize: 13, color: "rgba(253,251,247,0.6)" },
  tabTextActive: { color: colors.textPrimary },
  tabCount: { fontFamily: fonts.bodyBold, fontSize: 11, color: "rgba(253,251,247,0.4)" },
  tabCountActive: { color: colors.coral },

  lessonRow: {
    backgroundColor: "#0A0D14",
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  lessonRowActive: { borderColor: colors.coral, backgroundColor: "rgba(255,90,69,0.08)" },
  lessonHeadRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  lessonOrder: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, color: "rgba(253,251,247,0.5)" },
  minRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  lessonMin: { fontFamily: fonts.bodyMd, fontSize: 11, color: "rgba(253,251,247,0.5)" },
  lessonTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.textInverse, lineHeight: 22 },

  lessonDetail: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: "#0A0D14",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  detailEyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, color: "rgba(253,251,247,0.5)" },
  detailTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textInverse,
    letterSpacing: -0.5,
    marginTop: spacing.sm,
  },
  detailIntro: { fontFamily: fonts.body, fontSize: 15, color: "rgba(253,251,247,0.85)", marginTop: spacing.md, lineHeight: 22 },
  detailBody: { fontFamily: fonts.body, fontSize: 14, color: "rgba(253,251,247,0.7)", marginTop: spacing.sm, lineHeight: 20 },

  frameworkBox: {
    backgroundColor: "#12151C",
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,90,69,0.2)",
  },
  frameworkLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, color: colors.coral },
  frameworkText: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, color: colors.coral, marginTop: 4, marginBottom: spacing.sm },
  stepRow: { flexDirection: "row", gap: 10, paddingVertical: 6 },
  stepNum: { fontFamily: fonts.body, fontSize: 12, color: "rgba(253,251,247,0.5)", width: 22 },
  stepText: { fontFamily: fonts.body, fontSize: 13, color: colors.textInverse, lineHeight: 18, flex: 1 },

  beforeAfter: { flexDirection: "row", gap: 8, marginTop: spacing.md },
  baBlock: {
    flex: 1,
    backgroundColor: "#12151C",
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  baLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, color: colors.coral, marginBottom: 6 },
  baText: { fontFamily: fonts.body, fontSize: 12, color: "rgba(253,251,247,0.85)", lineHeight: 18 },

  templatesGrid: { gap: spacing.md },
  templateCard: {
    backgroundColor: "#0A0D14",
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  templateHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  templateLevel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, color: colors.coral },
  copyBtn: { padding: 4 },
  templateTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.textInverse,
    marginTop: 8,
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  templateBody: { fontFamily: fonts.body, fontSize: 13, color: "rgba(253,251,247,0.7)", lineHeight: 18 },
  varsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: spacing.md },
  varTag: { fontFamily: fonts.body, fontSize: 11, color: "rgba(253,251,247,0.5)" },
});
