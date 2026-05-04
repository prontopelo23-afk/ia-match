import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BookOpen, ChevronRight, ClipboardList, FileText, Library, Route } from "lucide-react-native";
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
  const firstLesson = visibleLessons[0] ?? state.lessons[0];

  if (!isPremium) {
    return (
      <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.bg }]} edges={["top"]}>
        <PremiumGate
          feature="Academy"
          description="Débloque un parcours guidé pour comprendre l’IA, pratiquer avec des prompts copiables et progresser sans te perdre dans trop de contenu."
          benefits={["Parcours guidés par niveau", "Prompts prêts à copier", "Exercices courts et quiz utiles", "Ressources triées pour apprendre vite"]}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.eyebrow, { color: colors.coral }]}>ACADEMY</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Apprends l’IA par petits pas.</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Choisis une porte d’entrée : commencer, pratiquer ou explorer. Le reste reste accessible, mais sans noyer l’écran.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelRow}>
          {LEVEL_FILTERS.map((f) => (
            <TouchableOpacity key={f.key} onPress={() => setLevel(f.key)} style={[styles.levelChip, { backgroundColor: level === f.key ? colors.coral : colors.surface, borderColor: level === f.key ? colors.coral : colors.borderSubtle }]}>
              <Text style={[styles.levelChipText, { color: level === f.key ? "#fff" : colors.textPrimary }]}>{f.label} · {levelCounts[f.key]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? <ActivityIndicator color={colors.coral} style={{ marginVertical: spacing.xl }} /> : (
          <>
            <View style={styles.doorGrid}>
              <DoorCard title="Commencer" text="Le parcours le plus simple pour démarrer maintenant." />
              <DoorCard title="Pratiquer" text="Prompts, exercices et avant/après à copier." />
              <DoorCard title="Explorer" text="Ressources et chemins avancés quand tu es prêt." />
            </View>

            {firstLesson ? (
              <TouchableOpacity onPress={() => router.push(`/academy/lesson/${firstLesson.id}`)} style={[styles.continueCard, { backgroundColor: baseColors.darkCard }]} activeOpacity={0.86}>
                <Text style={styles.continueLabel}>COMMENCER ICI</Text>
                <Text style={styles.continueTitle}>{firstLesson.title}</Text>
                <Text style={styles.continueText}>Une leçon courte pour comprendre, voir un exemple, pratiquer puis vérifier.</Text>
                <ChevronRight size={18} color="#fff" />
              </TouchableOpacity>
            ) : null}

            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{level === "ALL" ? "Parcours recommandés" : `Parcours ${LEVEL_FILTERS.find((f) => f.key === level)?.label.toLowerCase()}`}</Text>
                <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>Quelques chemins utiles. Le détail complet reste derrière “Tout voir”.</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/academy/paths")} style={[styles.smallLink, { borderColor: colors.borderSubtle }]}><Text style={[styles.smallLinkText, { color: colors.coral }]}>Tout voir</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pathRow}>
              {visiblePaths.slice(0, 3).map((path) => (
                <TouchableOpacity key={path.id} onPress={() => router.push(`/academy/path/${path.id}`)} style={[styles.pathCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} activeOpacity={0.86}>
                  <Route size={16} color={colors.coral} strokeWidth={2.5} />
                  <Text style={[styles.pathLevel, { color: colors.coral }]}>{levelLabel(path.level)}</Text>
                  <Text style={[styles.pathTitle, { color: colors.textPrimary }]} numberOfLines={2}>{path.title}</Text>
                  <Text style={[styles.pathMeta, { color: colors.textSecondary }]}>{path.course_ids?.length ?? 8} leçons</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Bibliothèque</Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>Accès rapide aux contenus utiles, sans afficher tout le catalogue ici.</Text>
            <View style={styles.grid}>
              <HubCard icon={<BookOpen size={19} color={colors.coral} />} title="Parcours" text="Chemins guidés par niveau" onPress={() => router.push("/academy/paths")} />
              <HubCard icon={<FileText size={19} color={colors.coral} />} title="Templates" text="Prompts prêts à adapter" onPress={() => router.push("/academy/templates")} />
              <HubCard icon={<ClipboardList size={19} color={colors.coral} />} title="Pratiquer" text="Exercices courts et avant/après" onPress={() => firstLesson && router.push(`/academy/lesson/${firstLesson.id}`)} />
              <HubCard icon={<Library size={19} color={colors.coral} />} title="Ressources" text="Repères fiables pour progresser" onPress={() => router.push("/academy/resources")} />
            </View>
          </>
        )}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function HubCard({ icon, title, text, onPress }: { icon: React.ReactNode; title: string; text: string; onPress: () => void }) {
  const { colors } = useTheme();
  return <TouchableOpacity onPress={onPress} style={[styles.hubCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} activeOpacity={0.86}><View style={[styles.hubIcon, { backgroundColor: colors.coralSoft }]}>{icon}</View><Text style={[styles.hubTitle, { color: colors.textPrimary }]}>{title}</Text><Text style={[styles.hubText, { color: colors.textSecondary }]}>{text}</Text></TouchableOpacity>;
}

function DoorCard({ title, text }: { title: string; text: string }) {
  const { colors } = useTheme();
  return <View style={[styles.doorCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}><Text style={[styles.doorTitle, { color: colors.coral }]}>{title}</Text><Text style={[styles.doorText, { color: colors.textSecondary }]}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, letterSpacing: -1 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, marginBottom: spacing.md },
  levelRow: { gap: 8, paddingBottom: spacing.md },
  levelChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  levelChipText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  doorGrid: { gap: 8, marginBottom: spacing.md },
  doorCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  doorTitle: { fontFamily: fonts.bodyBold, fontSize: 13, marginBottom: 3 },
  doorText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
  continueCard: { borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg, ...shadow.dark },
  continueLabel: { fontFamily: fonts.bodyBold, color: baseColors.coral, fontSize: 10, letterSpacing: 1.7 },
  continueTitle: { fontFamily: fonts.serif, color: "#fff", fontSize: 25, lineHeight: 30, marginTop: 6 },
  continueText: { fontFamily: fonts.body, color: "rgba(255,255,255,0.72)", fontSize: 12, marginTop: 6 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, marginTop: spacing.sm },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 24, marginBottom: spacing.xs },
  sectionHint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginBottom: spacing.sm },
  smallLink: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8, marginTop: 2 },
  smallLinkText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  pathRow: { gap: 10, paddingBottom: spacing.md },
  pathCard: { width: 190, minHeight: 124, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  pathLevel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 8 },
  pathTitle: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 21, marginTop: 5 },
  pathMeta: { fontFamily: fonts.bodyBold, fontSize: 10, marginTop: 7, textTransform: "uppercase" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  hubCard: { width: "48%", borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, minHeight: 120 },
  hubIcon: { width: 38, height: 38, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  hubTitle: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 23 },
  hubText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 4 },
});
