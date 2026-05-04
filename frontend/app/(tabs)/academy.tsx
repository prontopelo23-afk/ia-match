import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BookOpen, ChevronRight, ClipboardList, FileText, Library, MousePointerClick, Route, Sparkles } from "lucide-react-native";
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
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Une entrée calme pour comprendre, pratiquer et garder les bons réflexes sans tout lire d’un coup.</Text>

        {loading ? <ActivityIndicator color={colors.coral} style={{ marginVertical: spacing.xl }} /> : (
          <>
            {firstLesson ? (
              <TouchableOpacity onPress={() => router.push(`/academy/lesson/${firstLesson.id}`)} style={[styles.continueCard, { backgroundColor: baseColors.darkCard }]} activeOpacity={0.86}>
                <View style={styles.continueHead}>
                  <Text style={styles.continueLabel}>COMMENCER ICI</Text>
                  <ChevronRight size={18} color="#fff" />
                </View>
                <Text style={styles.continueTitle}>{firstLesson.title}</Text>
                <Text style={styles.continueText}>Une leçon courte, un exemple, puis un petit quiz.</Text>
              </TouchableOpacity>
            ) : null}

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Choisis ton chemin</Text>
            <View style={styles.doorGrid}>
              <DoorCard title="Comprendre" cta="Leçons" text="Bases simples et quiz courts." steps={["Base", "Exemple", "Quiz"]} icon="1" onPress={() => firstLesson && router.push(`/academy/lesson/${firstLesson.id}`)} />
              <DoorCard title="Utiliser" cta="Templates" text="Prompts prêts à adapter." steps={["Prompt", "Essai", "Corrige"]} icon="2" onPress={() => router.push("/academy/templates")} />
              <DoorCard title="Progresser" cta="Ressources" text="Parcours et sources fiables." steps={["Sources", "Parcours", "Usage"]} icon="3" onPress={() => router.push("/academy/resources")} />
            </View>

            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{level === "ALL" ? "Parcours recommandés" : `Parcours ${LEVEL_FILTERS.find((f) => f.key === level)?.label.toLowerCase()}`}</Text>
                <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>Trois chemins visibles ici. Le reste est rangé derrière “Tout voir”.</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/academy/paths")} style={[styles.smallLink, { borderColor: colors.borderSubtle }]}><Text style={[styles.smallLinkText, { color: colors.coral }]}>Tout voir</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelRow}>
              {LEVEL_FILTERS.map((f) => (
                <TouchableOpacity key={f.key} onPress={() => setLevel(f.key)} style={[styles.levelChip, { backgroundColor: level === f.key ? colors.coral : colors.surface, borderColor: level === f.key ? colors.coral : colors.borderSubtle }]}>
                  <Text style={[styles.levelChipText, { color: level === f.key ? "#fff" : colors.textPrimary }]}>{f.label} · {levelCounts[f.key]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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

            <View style={[styles.visualLoop, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }] }>
              <View style={styles.visualLoopHead}>
                <View style={[styles.visualIcon, { backgroundColor: colors.coralSoft }]}><Sparkles size={17} color={colors.coral} strokeWidth={2.5} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.visualTitle, { color: colors.textPrimary }]}>Le réflexe Academy</Text>
                  <Text style={[styles.visualText, { color: colors.textSecondary }]}>Comprendre, tester, vérifier. Le schéma reste là comme repère, sans bloquer le début.</Text>
                </View>
              </View>
              <LearningDiagram />
            </View>

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Bibliothèque</Text>
            <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>Tout le contenu est gardé, mais rangé par type.</Text>
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

function DoorCard({ title, cta, text, steps, icon, onPress }: { title: string; cta: string; text: string; steps: string[]; icon: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.doorCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} activeOpacity={0.86}>
      <View style={styles.doorTop}>
        <View style={[styles.doorNumber, { backgroundColor: colors.coralSoft }]}><Text style={[styles.doorNumberText, { color: colors.coral }]}>{icon}</Text></View>
        <View style={styles.doorCtaRow}><MousePointerClick size={14} color={colors.coral} strokeWidth={2.5} /><Text style={[styles.doorCta, { color: colors.coral }]}>{cta}</Text><ChevronRight size={15} color={colors.coral} strokeWidth={2.5} /></View>
      </View>
      <Text style={[styles.doorTitle, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.doorText, { color: colors.textSecondary }]}>{text}</Text>
      <MiniWorkflow steps={steps} compact />
    </TouchableOpacity>
  );
}

function LearningDiagram() {
  const { colors } = useTheme();
  const cards = [
    { title: "Comprendre", text: "une idée simple", emoji: "💡" },
    { title: "Tester", text: "dans ChatGPT, Claude…", emoji: "🧪" },
    { title: "Vérifier", text: "sources, limites, résultat", emoji: "✅" },
  ];
  return (
    <View style={styles.diagramWrap}>
      {cards.map((card, index) => (
        <React.Fragment key={card.title}>
          <View style={[styles.diagramCard, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]}>
            <Text style={styles.diagramEmoji}>{card.emoji}</Text>
            <Text style={[styles.diagramTitle, { color: colors.textPrimary }]}>{card.title}</Text>
            <Text style={[styles.diagramText, { color: colors.textSecondary }]}>{card.text}</Text>
          </View>
          {index < cards.length - 1 ? <View style={[styles.diagramArrow, { backgroundColor: colors.coral }]} /> : null}
        </React.Fragment>
      ))}
    </View>
  );
}

function MiniWorkflow({ steps, compact = false }: { steps: string[]; compact?: boolean }) {
  const { colors } = useTheme();
  return <View style={[styles.workflowRow, compact && styles.workflowCompact]}>{steps.map((step, index) => <React.Fragment key={`${step}-${index}`}><View style={[styles.workflowDot, { backgroundColor: colors.coralSoft, borderColor: colors.coral }]}><Text style={[styles.workflowDotText, { color: colors.coral }]}>{index + 1}</Text></View><Text style={[styles.workflowStep, { color: colors.textPrimary }]} numberOfLines={1}>{step}</Text>{index < steps.length - 1 ? <View style={[styles.workflowLine, { backgroundColor: colors.borderSubtle }]} /> : null}</React.Fragment>)}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, letterSpacing: -1 },
  subtitle: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23, marginTop: spacing.sm, marginBottom: spacing.md },
  levelRow: { gap: 8, paddingBottom: spacing.md },
  levelChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  levelChipText: { fontFamily: fonts.bodyBold, fontSize: 13 },
  doorGrid: { gap: 9, marginBottom: spacing.lg },
  doorCard: { borderWidth: 1, borderRadius: radius.lg, padding: 14 },
  doorTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  doorNumber: { width: 24, height: 24, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  doorNumberText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  doorCtaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  doorCta: { fontFamily: fonts.bodyBold, fontSize: 13 },
  doorTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 25, marginBottom: 3 },
  doorText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  visualLoop: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg }, 
  visualLoopHead: { flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: spacing.sm },
  visualIcon: { width: 38, height: 38, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  visualTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 25 },
  visualText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 2 },
  workflowRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6, marginTop: 4 },
  workflowCompact: { marginTop: spacing.sm },
  workflowDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  workflowDotText: { fontFamily: fonts.bodyBold, fontSize: 11 },
  workflowStep: { fontFamily: fonts.bodySemi, fontSize: 13, maxWidth: 86 },
  workflowLine: { width: 16, height: 2, borderRadius: 2 },
  diagramWrap: { gap: 8, marginTop: spacing.sm },
  diagramCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, minHeight: 88 },
  diagramEmoji: { fontSize: 24, marginBottom: 5 },
  diagramTitle: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 26 },
  diagramText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: 2 },
  diagramArrow: { alignSelf: "center", width: 3, height: 18, borderRadius: 3 },
  continueCard: { borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg, ...shadow.dark },
  continueHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  continueLabel: { fontFamily: fonts.bodyBold, color: baseColors.coral, fontSize: 10, letterSpacing: 1.7 },
  continueTitle: { fontFamily: fonts.serif, color: "#fff", fontSize: 25, lineHeight: 30, marginTop: 6 },
  continueText: { fontFamily: fonts.body, color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 20, marginTop: 6 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, marginTop: spacing.sm },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 24, marginBottom: spacing.xs },
  sectionHint: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginBottom: spacing.sm },
  smallLink: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8, marginTop: 2 },
  smallLinkText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  pathRow: { gap: 10, paddingBottom: spacing.md },
  pathCard: { width: 190, minHeight: 124, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  pathLevel: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.1, textTransform: "uppercase", marginTop: 8 },
  pathTitle: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 21, marginTop: 5 },
  pathMeta: { fontFamily: fonts.bodyBold, fontSize: 12, marginTop: 7, textTransform: "uppercase" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.sm },
  hubCard: { width: "48%", borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, minHeight: 120 },
  hubIcon: { width: 38, height: 38, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  hubTitle: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 23 },
  hubText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: 4 },
});
