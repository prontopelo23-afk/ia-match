import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Sparkles, ChevronRight, X, Check } from "lucide-react-native";
import { fonts, radius, spacing } from "../src/theme";
import { useTheme } from "../src/theme-context";
import { api, MatchResult, onboardingStore } from "../src/api";
import ToolCard from "../src/components/ToolCard";

const Q1 = [
  { value: "texte", label: "Écrire & Rédiger", emoji: "✍️", hint: "CV, emails, articles, résumés" },
  { value: "image", label: "Créer des Images", emoji: "🎨", hint: "Visuels, illustrations, design" },
  { value: "code", label: "Coder une App", emoji: "💻", hint: "Apps, sites, scripts" },
  { value: "video", label: "Faire de la Vidéo", emoji: "🎬", hint: "Animation, montage, clips" },
  { value: "audio", label: "Voix & Audio", emoji: "🎙️", hint: "Voix-off, transcription, musique" },
  { value: "recherche", label: "Rechercher & Analyser", emoji: "🔍", hint: "Veille, fact-check, synthèses" },
];

const Q2 = [
  { value: "balanced", label: "Équilibré", hint: "Le meilleur compromis qualité/vitesse/prix" },
  { value: "accuracy", label: "Qualité maximale", hint: "Je veux la meilleure précision possible" },
  { value: "speed", label: "Rapide", hint: "La réponse doit arriver en moins d'une seconde" },
  { value: "price", label: "Économique", hint: "Je préfère gratuit ou peu coûteux" },
];

const Q3 = [
  { value: "fr", label: "Français en priorité", hint: "Travail dans ma langue, données européennes" },
  { value: "en", label: "Anglais OK", hint: "Je travaille principalement en anglais" },
];

export default function Onboarding() {
  const router = useRouter();
  const { colors } = useTheme();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [domain, setDomain] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("fr");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const need = domain
    ? `Je veux ${
        domain === "texte"
          ? "écrire et rédiger des contenus"
          : domain === "image"
          ? "créer des images et visuels"
          : domain === "code"
          ? "coder une application"
          : domain === "video"
          ? "faire de la vidéo"
          : domain === "audio"
          ? "travailler sur de la voix ou audio"
          : "faire de la recherche et analyse"
      }`
    : "";

  const submit = async () => {
    if (!domain || !priority) return;
    setLoading(true);
    try {
      const res = await api.match(need, priority, false, language);
      setResults(res.slice(0, 3));
      setStep(3);
    } catch {
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const finish = async () => {
    await onboardingStore.markDone();
    router.replace("/(tabs)");
  };

  const skip = async () => {
    await onboardingStore.markDone();
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={styles.topBar}>
        <Text style={[styles.brand, { color: colors.textPrimary }]}>IA MATCH</Text>
        <TouchableOpacity onPress={skip} style={[styles.skipBtn, { borderColor: colors.borderSubtle }]} testID="onboard-skip">
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Passer</Text>
          <X size={16} color={colors.textSecondary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.progressRow}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor: i <= step ? colors.coral : colors.borderSubtle,
                  width: i === step ? 28 : 8,
                },
              ]}
            />
          ))}
        </View>

        {step === 0 && (
          <View>
            <Text style={[styles.eyebrow, { color: colors.coral }]}>BIENVENUE · 1 / 3</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Tu veux faire <Text style={[styles.titleAccent, { color: colors.coral }]}>quoi</Text> avec l'IA ?
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              Choisis ton terrain de jeu principal. Tu pourras toujours en explorer d'autres.
            </Text>
            <View style={styles.options}>
              {Q1.map((q) => (
                <TouchableOpacity
                  key={q.value}
                  onPress={() => {
                    setDomain(q.value);
                    setStep(1);
                  }}
                  style={[
                    styles.optionCard,
                    { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
                    domain === q.value && { borderColor: colors.coral, backgroundColor: colors.coralSoft },
                  ]}
                  testID={`onboard-q1-${q.value}`}
                >
                  <Text style={styles.optionEmoji}>{q.emoji}</Text>
                  <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>{q.label}</Text>
                  <Text style={[styles.optionHint, { color: colors.textSecondary }]}>{q.hint}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={[styles.eyebrow, { color: colors.coral }]}>PRIORITÉ · 2 / 3</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Quelle est ta <Text style={[styles.titleAccent, { color: colors.coral }]}>priorité</Text> ?
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              On adaptera nos recommandations à ce qui compte le plus pour toi.
            </Text>
            <View style={[styles.options, { gap: 10 }]}>
              {Q2.map((q) => (
                <TouchableOpacity
                  key={q.value}
                  onPress={() => {
                    setPriority(q.value);
                    setStep(2);
                  }}
                  style={[
                    styles.optionRow,
                    { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
                    priority === q.value && { borderColor: colors.coral, backgroundColor: colors.coralSoft },
                  ]}
                  testID={`onboard-q2-${q.value}`}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>{q.label}</Text>
                    <Text style={[styles.optionHint, { color: colors.textSecondary, marginTop: 2 }]}>{q.hint}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.textSecondary} strokeWidth={2.5} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={[styles.eyebrow, { color: colors.coral }]}>LANGUE · 3 / 3</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Et ta <Text style={[styles.titleAccent, { color: colors.coral }]}>langue</Text> ?
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              On privilégiera des modèles forts dans ta langue principale.
            </Text>
            <View style={[styles.options, { gap: 10 }]}>
              {Q3.map((q) => (
                <TouchableOpacity
                  key={q.value}
                  onPress={() => setLanguage(q.value)}
                  style={[
                    styles.optionRow,
                    { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
                    language === q.value && { borderColor: colors.coral, backgroundColor: colors.coralSoft },
                  ]}
                  testID={`onboard-q3-${q.value}`}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>{q.label}</Text>
                    <Text style={[styles.optionHint, { color: colors.textSecondary, marginTop: 2 }]}>{q.hint}</Text>
                  </View>
                  {language === q.value ? (
                    <Check size={20} color={colors.coral} strokeWidth={3} />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={submit}
              style={[styles.cta, { backgroundColor: colors.coral }]}
              disabled={loading}
              testID="onboard-submit"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Sparkles size={16} color="#fff" strokeWidth={2.5} />
                  <Text style={styles.ctaText}>Découvrir mes 3 IA</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={[styles.eyebrow, { color: colors.coral }]}>RÉSULTATS</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Tes <Text style={[styles.titleAccent, { color: colors.coral }]}>3 meilleures</Text> IA.
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              Sur la base de ton profil, voici les outils à tester en priorité.
            </Text>
            <View style={{ marginTop: spacing.lg }}>
              {results.length === 0 ? (
                <Text style={[styles.empty, { color: colors.textSecondary }]}>
                  On n'a pas pu récupérer les recommandations. Tu pourras lancer un Match depuis l'app.
                </Text>
              ) : (
                results.map((r) => (
                  <ToolCard key={r.tool.slug} tool={r.tool} matchScore={r.matchScore} />
                ))
              )}
            </View>
            <TouchableOpacity onPress={finish} style={[styles.cta, { backgroundColor: colors.coral }]} testID="onboard-finish">
              <Text style={styles.ctaText}>Entrer dans IA Match</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  brand: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 4 },
  skipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  skipText: { fontFamily: fonts.bodySemi, fontSize: 12 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  progressRow: { flexDirection: "row", gap: 6, marginBottom: spacing.xl },
  progressDot: { height: 8, borderRadius: 4 },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, marginBottom: spacing.sm },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -1,
  },
  titleAccent: { fontStyle: "italic" },
  sub: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: spacing.sm },
  options: { marginTop: spacing.xl, gap: spacing.sm },
  optionCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  optionEmoji: { fontSize: 28, marginBottom: 6 },
  optionLabel: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 22 },
  optionHint: { fontFamily: fonts.body, fontSize: 12, marginTop: 4, lineHeight: 16 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: radius.pill,
    marginTop: spacing.xl,
  },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 15 },
  empty: { fontFamily: fonts.body, fontSize: 14, textAlign: "center", marginTop: spacing.lg },
});
