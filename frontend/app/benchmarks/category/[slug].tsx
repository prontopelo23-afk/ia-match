import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, Layers3, Sparkles } from "lucide-react-native";
import { fonts, radius, shadow, spacing } from "../../../src/theme";
import { useTheme } from "../../../src/theme-context";
import { api, BenchmarkRow, ModelRankings } from "../../../src/api";
import { ContentFamily, familyForSlug, rowMatchesFamily } from "../../../src/utils/contentArchitecture";

type UsageHint = { title: string; items: string[] };

const USAGE_HINTS: Record<string, UsageHint> = {
  general: { title: "Ce classement aide à choisir une IA pour…", items: ["écrire", "résumer", "raisonner", "chercher une première réponse"] },
  "image-design": { title: "Ce classement regroupe les outils utiles pour…", items: ["créer une image", "retoucher un visuel", "préparer une miniature", "produire des supports marketing"] },
  "video-audio": { title: "Ce classement regroupe les outils utiles pour…", items: ["créer une vidéo", "générer une voix", "produire un podcast", "préparer du contenu média"] },
  "code-apps": { title: "Ce classement regroupe les outils utiles pour…", items: ["coder", "débugger", "créer une app", "automatiser", "travailler avec des agents"] },
  "research-documents": { title: "Ce classement regroupe les outils utiles pour…", items: ["chercher des sources", "lire des PDF", "synthétiser", "vérifier l’information"] },
  "business-productivity": { title: "Ce classement regroupe les outils utiles pour…", items: ["organiser", "vendre", "rédiger", "automatiser", "analyser"] },
};

export default function BenchmarkFamilyDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const family = familyForSlug(slug);
  const router = useRouter();
  const { colors } = useTheme();
  const [rows, setRows] = useState<BenchmarkRow[]>([]);
  const [rankings, setRankings] = useState<ModelRankings>({});
  const [loading, setLoading] = useState(true);
  const [showAllModels, setShowAllModels] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.benchmarks("score", "all"), api.getModelRankings()])
      .then(([all, r]) => {
        const matched = all.rows.filter((row) => rowMatchesFamily(row, family));
        setRows(dedupeBenchmarkRows(matched).slice(0, 20));
        setRankings(r);
      })
      .finally(() => setLoading(false));
  }, [family.slug]);

  const specialized = useMemo(() => extractSpecialized(rankings, family.slug), [rankings, family.slug]);
  const visibleModels = showAllModels ? specialized.slice(0, 6) : specialized.slice(0, 3);
  const visibleRows = showAllTools ? rows.slice(0, 12) : rows.slice(0, 5);
  const usage = usageForFamily(family);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <ChevronLeft size={18} color={colors.textPrimary} />
          <Text style={[styles.backText, { color: colors.textPrimary }]}>Benchmarks</Text>
        </TouchableOpacity>

        <Text style={[styles.eyebrow, { color: colors.coral }]}>CLASSEMENT PAR USAGE</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{family.label}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{family.description}</Text>

        <View style={[styles.usageBox, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
          <View style={styles.usageHeader}>
            <View style={[styles.usageIcon, { backgroundColor: colors.coralSoft }]}><Layers3 size={17} color={colors.coral} /></View>
            <Text style={[styles.usageTitle, { color: colors.textPrimary }]}>{usage.title}</Text>
          </View>
          <View style={styles.chipWrap}>
            {usage.items.map((item) => (
              <Text key={item} style={[styles.usageChip, { backgroundColor: colors.coralSoft, color: colors.coral }]}>{item}</Text>
            ))}
          </View>
        </View>

        {specialized.length ? (
          <View style={[styles.modelBox, { backgroundColor: colors.coralSoft, borderColor: colors.coral }]}>
            <View style={styles.modelHead}>
              <Sparkles size={17} color={colors.coral} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Meilleurs modèles pour cet usage</Text>
            </View>
            {visibleModels.map((m: any, i: number) => (
              <Text key={`${m.model ?? m.name}-${i}`} style={[styles.modelLine, { color: colors.textPrimary }]}>#{i + 1} {displayModelName(m)} · {m.score ?? m.overall_score ?? "—"}/100</Text>
            ))}
            {specialized.length > 3 ? (
              <TouchableOpacity onPress={() => setShowAllModels((v) => !v)} style={styles.moreBtn}>
                <Text style={[styles.moreText, { color: colors.coral }]}>{showAllModels ? "Réduire" : `Voir ${Math.min(6, specialized.length) - 3} modèle(s) de plus`}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Outils IA Match liés</Text>
        <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>Des outils concrets à ouvrir selon ton besoin exact.</Text>
        {loading ? <ActivityIndicator color={colors.coral} /> : visibleRows.map((row, index) => (
          <TouchableOpacity key={row.slug} onPress={() => router.push(`/tool/${row.slug}`)} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} activeOpacity={0.85}>
            <View style={[styles.rank, { backgroundColor: index === 0 ? colors.coral : colors.coralSoft }]}>
              <Text style={[styles.rankText, { color: index === 0 ? "#fff" : colors.coral }]}>#{index + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowName, { color: colors.textPrimary }]}>{displayToolName(row)}</Text>
              <Text style={[styles.rowMeta, { color: colors.textSecondary }]} numberOfLines={1}>{row.bestFor ?? row.vendor}</Text>
            </View>
            <View style={styles.scoreWrap}>
              <Text style={[styles.score, { color: colors.textPrimary }]}>{row.score}</Text>
              <ChevronRight size={16} color={colors.coral} />
            </View>
          </TouchableOpacity>
        ))}
        {!loading && rows.length > 5 ? (
          <TouchableOpacity onPress={() => setShowAllTools((v) => !v)} style={[styles.outlineBtn, { borderColor: colors.borderSubtle }]}>
            <Text style={[styles.moreText, { color: colors.coral }]}>{showAllTools ? "Afficher moins" : "Voir plus d’outils"}</Text>
          </TouchableOpacity>
        ) : null}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function usageForFamily(family: ContentFamily) {
  return USAGE_HINTS[family.slug] ?? { title: "Ce classement regroupe les outils utiles pour…", items: family.keywords.slice(0, 5) };
}

function publicNameKey(name: string) {
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (normalized.includes("chatgpt image") || normalized.includes("gpt image") || normalized.includes("dall")) return "openai-chatgpt-image";
  if (normalized.includes("nano banana")) return "google-nano-banana";
  if (normalized.includes("midjourney")) return "midjourney";
  if (normalized.includes("seedream")) return "bytedance-seedream";
  if (normalized.includes("imagen")) return "google-imagen";
  if (normalized.includes("flux")) return "black-forest-flux";
  if (normalized.includes("stable diffusion") || normalized.includes("sdxl")) return "stability-stable-diffusion";
  return normalized
    .replace(/openai\s+/g, "")
    .replace(/\b(v\d+|\d+(\.\d+)?|preview|pro|max|high|turbo|flash)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function dedupeBenchmarkRows(rows: BenchmarkRow[]) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = publicNameKey(`${row.slug} ${row.name} ${row.vendor}`);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function displayToolName(row: BenchmarkRow) {
  const names: Record<string, string> = {
    "openai-chatgpt-image": "ChatGPT Image",
    "google-nano-banana": "Nano Banana",
    midjourney: "Midjourney",
    "bytedance-seedream": "Seedream",
    "google-imagen": "Google Imagen",
    "black-forest-flux": "FLUX",
    "stability-stable-diffusion": "Stable Diffusion",
  };
  return names[publicNameKey(`${row.slug} ${row.name} ${row.vendor}`)] ?? row.name;
}

function extractSpecialized(rankings: ModelRankings, familySlug: string) {
  const cats: any = rankings.specialization_rankings?.categories;
  if (!cats) return [];
  const aliases: Record<string, string[]> = {
    "image-design": ["image_generation"],
    "video-audio": ["video_generation", "audio_voice"],
    "code-apps": ["coding_dev"],
    "research-documents": ["research_search", "documents_pdf_office"],
    general: ["conversation_assistant", "writing_content"],
    "business-productivity": ["writing_content", "documents_pdf_office"],
  };
  const keys = aliases[familySlug] ?? [];
  if (Array.isArray(cats)) return dedupeModelRows(cats.filter((c: any) => keys.includes(c.id ?? c.slug)));
  return dedupeModelRows(keys.flatMap((k) => Array.isArray(cats[k]) ? cats[k] : []));
}

function modelFamilyKey(value: string) {
  const name = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (name.includes("chatgpt image") || name.includes("gpt image") || name.includes("dall")) return "openai-chatgpt-image";
  if (name.includes("nano banana")) return "google-nano-banana";
  if (name.includes("midjourney")) return "midjourney";
  if (name.includes("seedream")) return "bytedance-seedream";
  if (name.includes("imagen")) return "google-imagen";
  if (name.includes("flux")) return "black-forest-flux";
  if (name.includes("stable diffusion") || name.includes("sdxl")) return "stability-stable-diffusion";
  return name
    .replace(/openai\s+/g, "")
    .replace(/\b(v\d+|\d+(\.\d+)?|preview|pro|max|high|turbo|flash)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function displayModelName(model: any) {
  const raw = String(model.model ?? model.name ?? "Modèle IA");
  const names: Record<string, string> = {
    "openai-chatgpt-image": "ChatGPT Image",
    "google-nano-banana": "Nano Banana",
    midjourney: "Midjourney",
    "bytedance-seedream": "Seedream",
    "google-imagen": "Google Imagen",
    "black-forest-flux": "FLUX",
    "stability-stable-diffusion": "Stable Diffusion",
  };
  return names[modelFamilyKey(raw)] ?? raw;
}

function dedupeModelRows(models: any[]) {
  const seen = new Set<string>();
  return models.filter((model) => {
    const key = modelFamilyKey(String(model.model ?? model.name ?? ""));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  back: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.md },
  backText: { fontFamily: fonts.bodyBold, fontSize: 13 },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2 },
  title: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 40, marginVertical: spacing.sm },
  subtitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  usageBox: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  usageHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  usageIcon: { width: 34, height: 34, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  usageTitle: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 14, lineHeight: 20 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  usageChip: { overflow: "hidden", borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6, fontFamily: fonts.bodyBold, fontSize: 12 },
  modelBox: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg },
  modelHead: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 23, lineHeight: 29, marginBottom: spacing.xs },
  sectionHint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginBottom: spacing.sm },
  modelLine: { fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 20, marginBottom: 3 },
  moreBtn: { alignSelf: "flex-start", paddingTop: 8 },
  outlineBtn: { alignSelf: "center", borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 10, marginTop: spacing.sm },
  moreText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  card: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, ...shadow.soft },
  rank: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  rankText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  rowName: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 25 },
  rowMeta: { fontFamily: fonts.body, fontSize: 12 },
  scoreWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  score: { fontFamily: fonts.bodyBold, fontSize: 18 },
});
