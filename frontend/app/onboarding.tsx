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
import { useI18n } from "../src/i18n";
import { api, MatchResult, onboardingStore } from "../src/api";
import ToolCard from "../src/components/ToolCard";

const Q1 = [
  { value: "écrire", label: "Écrire", emoji: "✍️", hint: "emails, articles, posts, CV" },
  { value: "créer une image", label: "Créer une image", emoji: "🎨", hint: "visuels, illustrations, design" },
  { value: "faire une vidéo", label: "Faire une vidéo", emoji: "🎬", hint: "clips, montage, animation" },
  { value: "coder", label: "Coder", emoji: "💻", hint: "scripts, debug, apps" },
  { value: "créer une app", label: "Créer une app", emoji: "📱", hint: "prototype, MVP, interface" },
  { value: "automatiser", label: "Automatiser", emoji: "⚙️", hint: "workflows, tâches répétitives" },
  { value: "apprendre", label: "Apprendre", emoji: "🎓", hint: "cours, explications, quiz" },
  { value: "faire du marketing", label: "Marketing", emoji: "📣", hint: "ads, landing pages, contenus" },
  { value: "créer une voix", label: "Créer une voix", emoji: "🎙️", hint: "voix-off, doublage, audio" },
  { value: "analyser un document", label: "Analyser un document", emoji: "📄", hint: "PDF, synthèse, extraction" },
];

const Q2 = [
  { value: "beginner", label: "Débutant", hint: "Je veux quelque chose de simple, guidé et rassurant" },
  { value: "intermediate", label: "Intermédiaire", hint: "Je veux un bon équilibre entre puissance et simplicité" },
  { value: "pro", label: "Pro", hint: "Je veux l'outil le plus solide, même s'il demande plus d'effort" },
];

const Q3 = [
  { value: "free", label: "Gratuit uniquement", hint: "Ne me propose que des outils avec un vrai plan gratuit" },
  { value: "under10", label: "Moins de 10 €/mois", hint: "Je peux payer un peu si ça vaut le coup" },
  { value: "best", label: "Peu importe si c'est le meilleur", hint: "Priorité à la meilleure recommandation" },
];

export default function Onboarding() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, apiLanguage } = useI18n();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [domain, setDomain] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [budget, setBudget] = useState<string>("free");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const need = domain && level
    ? `Je veux ${domain}. Mon niveau est ${level === "beginner" ? "débutant" : level === "intermediate" ? "intermédiaire" : "pro"}. Mon budget : ${budget === "free" ? "gratuit uniquement" : budget === "under10" ? "moins de 10 €/mois" : "peu importe si c'est le meilleur"}.`
    : "";

  const submit = async () => {
    if (!domain || !level) return;
    setLoading(true);
    try {
      const priority = budget === "best" || level === "pro" ? "accuracy" : budget === "free" ? "price" : "balanced";
      const res = await api.match(need, priority, budget === "free", apiLanguage);
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
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>{t("common.skip")}</Text>
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
            <Text style={[styles.eyebrow, { color: colors.coral }]}>{t("onboarding.welcomeLabel")}</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t("onboarding.needTitle")}
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              {t("onboarding.needSub")}
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
            <Text style={[styles.eyebrow, { color: colors.coral }]}>{t("onboarding.levelLabel")}</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Quel est ton <Text style={[styles.titleAccent, { color: colors.coral }]}>niveau</Text> ?
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              Le Match adapte la recommandation : simplicité pour débuter, puissance si tu es déjà à l'aise.
            </Text>
            <View style={[styles.options, { gap: 10 }]}>
              {Q2.map((q) => (
                <TouchableOpacity
                  key={q.value}
                  onPress={() => {
                    setLevel(q.value);
                    setStep(2);
                  }}
                  style={[
                    styles.optionRow,
                    { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
                    level === q.value && { borderColor: colors.coral, backgroundColor: colors.coralSoft },
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
            <Text style={[styles.eyebrow, { color: colors.coral }]}>{t("onboarding.budgetLabel")}</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Ton <Text style={[styles.titleAccent, { color: colors.coral }]}>budget</Text> ?
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              On filtre ou on privilégie le gratuit selon ta réponse, sans te bloquer avec un paywall.
            </Text>
            <View style={[styles.options, { gap: 10 }]}>
              {Q3.map((q) => (
                <TouchableOpacity
                  key={q.value}
                  onPress={() => setBudget(q.value)}
                  style={[
                    styles.optionRow,
                    { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
                    budget === q.value && { borderColor: colors.coral, backgroundColor: colors.coralSoft },
                  ]}
                  testID={`onboard-q3-${q.value}`}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>{q.label}</Text>
                    <Text style={[styles.optionHint, { color: colors.textSecondary, marginTop: 2 }]}>{q.hint}</Text>
                  </View>
                  {budget === q.value ? (
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
                  <Text style={styles.ctaText}>Lancer mon Match</Text>
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
              Voici tes premières recommandations : une meilleure option, une alternative gratuite quand possible, et une piste premium si elle vaut vraiment le coup.
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
