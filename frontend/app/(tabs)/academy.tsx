import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Award, BookOpen, ChevronRight, FileText, Layers3, Library, Route, Sparkles } from "lucide-react-native";
import { colors as baseColors, fonts, radius, shadow, spacing } from "../../src/theme";
import { useTheme, usePremium } from "../../src/theme-context";
import { api, AcademyBadge, AcademyPath, Lesson, Resource, Template } from "../../src/api";
import PremiumGate from "../../src/components/PremiumGate";

type AcademyState = { lessons: Lesson[]; paths: AcademyPath[]; badges: AcademyBadge[]; templates: Template[]; resources: Resource[]; exercises: any[]; badExamples: any[]; beginnerTerms: any[] };
type LevelBucket = "ALL" | "beginner" | "intermediate" | "advanced";

const LEVEL_FILTERS: { key: LevelBucket; label: string }[] = [
  { key: "ALL", label: "Tous" },
  { key: "beginner", label: "Débutant" },
  { key: "intermediate", label: "Intermédiaire" },
  { key: "advanced", label: "Avancé" },
];

function normalizeLevel(value?: string): LevelBucket {
  const raw = String(value || "").toLowerCase();
  if (raw.includes("advance") || raw.includes("avanc")) return "advanced";
  if (raw.includes("inter")) return "intermediate";
  if (raw.includes("begin") || raw.includes("début") || raw.includes("debut")) return "beginner";
  return "intermediate";
}
function levelLabel(value?: string) {
  const bucket = normalizeLevel(value);
  if (bucket === "beginner") return "Débutant";
  if (bucket === "advanced") return "Avancé";
  return "Intermédiaire";
}

export default function AcademyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const [state, setState] = useState<AcademyState>({ lessons: [], paths: [], badges: [], templates: [], resources: [], exercises: [], badExamples: [], beginnerTerms: [] });
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<LevelBucket>("ALL");

  useEffect(() => {
    Promise.all([
      api.listLessons(),
      api.listAcademyPaths(),
      api.listAcademyBadges(),
      api.listTemplates(),
      api.listResources(),
      api.listAcademyExercises(),
      api.listAcademyBadToGood(),
      api.listBeginnerTerms(),
    ])
      .then(([lessons, paths, badges, templates, resources, exercises, badExamples, beginnerTerms]) => setState({ lessons, paths: paths.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)), badges, templates, resources, exercises, badExamples, beginnerTerms }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const levelCounts = useMemo(() => {
    const counts: Record<LevelBucket, number> = { ALL: state.lessons.length, beginner: 0, intermediate: 0, advanced: 0 };
    state.lessons.forEach((lesson) => { counts[normalizeLevel(lesson.level)] += 1; });
    return counts;
  }, [state.lessons]);

  const visibleLessons = useMemo(() => level === "ALL" ? state.lessons : state.lessons.filter((lesson) => normalizeLevel(lesson.level) === level), [state.lessons, level]);
  const visiblePaths = useMemo(() => level === "ALL" ? state.paths : state.paths.filter((path) => normalizeLevel(path.level) === level || path.course_ids?.some((id) => visibleLessons.some((lesson) => lesson.id === id))), [state.paths, visibleLessons, level]);
  const minutesTotal = useMemo(() => visibleLessons.reduce((sum, l) => sum + (l.minutes || 0), 0), [visibleLessons]);
  const firstLesson = visibleLessons[0] ?? state.lessons[0];

  if (!isPremium) {
    return (
      <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.bg }]} edges={["top"]}>
        <PremiumGate
          feature="Academy"
          description="Débloque le parcours complet IA Match : leçons guidées, quiz, badges, templates copiables et ressources triées. Le contenu reste complet, mais il est organisé en sous-pages pour éviter le scroll infini."
          benefits={["80 leçons progressives organisées en 10 parcours", "240 quiz courts liés aux leçons", "200 templates prêts à copier", "Ressources et badges de progression"]}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.crumb, { color: colors.textSecondary }]}>Workspace · Academy</Text>
        <Text style={[styles.eyebrow, { color: colors.coral }]}>ACADEMY · HUB</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Apprends sans te perdre dans une page infinie.</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Débutant, intermédiaire, avancé : les contenus sont regroupés par parcours, templates et ressources pour garder une navigation courte.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelRow}>
          {LEVEL_FILTERS.map((f) => (
            <TouchableOpacity key={f.key} onPress={() => setLevel(f.key)} style={[styles.levelChip, { backgroundColor: level === f.key ? colors.coral : colors.surface, borderColor: level === f.key ? colors.coral : colors.borderSubtle }]}>
              <Text style={[styles.levelChipText, { color: level === f.key ? "#fff" : colors.textPrimary }]}>{f.label} · {levelCounts[f.key]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? <ActivityIndicator color={colors.coral} style={{ marginVertical: spacing.xl }} /> : (
          <>
            <View style={styles.statsRow}>
              <StatCard value={String(visibleLessons.length)} label="leçons" />
              <StatCard value={String(visiblePaths.length)} label="parcours" />
              <StatCard value={String(state.templates.length)} label="templates" />
              <StatCard value={`${Math.max(1, Math.round(minutesTotal / 60))}h`} label="contenu" />
            </View>
            <View style={styles.statsRow}>
              <StatCard value={String(state.exercises.length)} label="exercices" />
              <StatCard value={String(state.badExamples.length)} label="avant/après" />
              <StatCard value={String(state.beginnerTerms.length)} label="termes" />
              <StatCard value={String(state.badges.length)} label="badges" />
            </View>

            {firstLesson ? (
              <TouchableOpacity onPress={() => router.push(`/academy/lesson/${firstLesson.id}`)} style={[styles.continueCard, { backgroundColor: baseColors.darkCard }]} activeOpacity={0.86}>
                <Text style={styles.continueLabel}>COMMENCER ICI · {level === "ALL" ? levelLabel(firstLesson.level) : LEVEL_FILTERS.find((f) => f.key === level)?.label}</Text>
                <Text style={styles.continueTitle}>{firstLesson.title}</Text>
                <Text style={styles.continueText}>Leçon {firstLesson.order} · {firstLesson.minutes} min · ouvrir le détail complet</Text>
                <ChevronRight size={18} color="#fff" />
              </TouchableOpacity>
            ) : null}

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{level === "ALL" ? "Parcours recommandés" : `Parcours ${LEVEL_FILTERS.find((f) => f.key === level)?.label.toLowerCase()}`}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pathRow}>
              {visiblePaths.map((path) => (
                <TouchableOpacity key={path.id} onPress={() => router.push(`/academy/path/${path.id}`)} style={[styles.pathCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} activeOpacity={0.86}>
                  <Route size={16} color={colors.coral} strokeWidth={2.5} />
                  <Text style={[styles.pathLevel, { color: colors.coral }]}>{levelLabel(path.level)}</Text>
                  <Text style={[styles.pathTitle, { color: colors.textPrimary }]} numberOfLines={2}>{path.title}</Text>
                  <Text style={[styles.pathMeta, { color: colors.textSecondary }]}>{path.course_ids?.length ?? 8} leçons</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.grid}>
              <HubCard icon={<BookOpen size={19} color={colors.coral} />} title="Parcours guidés" text={`${visiblePaths.length} parcours dans le niveau sélectionné`} onPress={() => router.push("/academy/paths")} />
              <HubCard icon={<FileText size={19} color={colors.coral} />} title="Templates" text={`${state.templates.length} prompts triés par famille`} onPress={() => router.push("/academy/templates")} />
              <HubCard icon={<Library size={19} color={colors.coral} />} title="Ressources" text={`${state.resources.length} sources et outils vérifiés`} onPress={() => router.push("/academy/resources")} />
              <HubCard icon={<Sparkles size={19} color={colors.coral} />} title="Quiz" text="Quiz par leçon, révélés au bon moment" onPress={() => firstLesson && router.push(`/academy/lesson/${firstLesson.id}`)} />
            </View>

            {state.badges.length > 0 ? (
              <View style={[styles.badgeBox, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
                <View style={styles.badgeTitleRow}><Award size={16} color={colors.coral} /><Text style={[styles.badgeTitle, { color: colors.textPrimary }]}>Badges à débloquer</Text></View>
                <View style={styles.badgeRow}>{state.badges.slice(0, 10).map((badge) => <Text key={badge.id} style={[styles.badgeChip, { color: colors.coral, borderColor: colors.coral }]}>{badge.name}</Text>)}</View>
              </View>
            ) : null}
          </>
        )}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  const { colors } = useTheme();
  return <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}><Text style={[styles.statValue, { color: colors.coral }]}>{value}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text></View>;
}
function HubCard({ icon, title, text, onPress }: { icon: React.ReactNode; title: string; text: string; onPress: () => void }) {
  const { colors } = useTheme();
  return <TouchableOpacity onPress={onPress} style={[styles.hubCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} activeOpacity={0.86}><View style={[styles.hubIcon, { backgroundColor: colors.coralSoft }]}>{icon}</View><Text style={[styles.hubTitle, { color: colors.textPrimary }]}>{title}</Text><Text style={[styles.hubText, { color: colors.textSecondary }]}>{text}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  crumb: { fontFamily: fonts.body, fontSize: 12, marginBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, letterSpacing: -1 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, marginBottom: spacing.md },
  levelRow: { gap: 8, paddingBottom: spacing.md },
  levelChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  levelChipText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: spacing.md },
  statCard: { flex: 1, borderWidth: 1, borderRadius: radius.lg, paddingVertical: spacing.sm, alignItems: "center" },
  statValue: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 26 },
  statLabel: { fontFamily: fonts.bodyBold, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.7 },
  continueCard: { borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg, ...shadow.dark },
  continueLabel: { fontFamily: fonts.bodyBold, color: baseColors.coral, fontSize: 10, letterSpacing: 1.7 },
  continueTitle: { fontFamily: fonts.serif, color: "#fff", fontSize: 25, lineHeight: 30, marginTop: 6 },
  continueText: { fontFamily: fonts.body, color: "rgba(255,255,255,0.72)", fontSize: 12, marginTop: 6 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 24, marginBottom: spacing.sm },
  pathRow: { gap: 10, paddingBottom: spacing.md },
  pathCard: { width: 190, minHeight: 124, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  pathLevel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 8 },
  pathTitle: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 21, marginTop: 5 },
  pathMeta: { fontFamily: fonts.bodyBold, fontSize: 10, marginTop: 7, textTransform: "uppercase" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  hubCard: { width: "48%", borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, minHeight: 130 },
  hubIcon: { width: 38, height: 38, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  hubTitle: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 23 },
  hubText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 4 },
  badgeBox: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  badgeTitleRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.sm },
  badgeTitle: { fontFamily: fonts.bodyBold, fontSize: 14 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  badgeChip: { overflow: "hidden", borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontFamily: fonts.bodyBold, fontSize: 10 },
});
