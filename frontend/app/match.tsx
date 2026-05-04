import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowRight, Check, Copy, ExternalLink, X, GitCompare, ThumbsUp, ThumbsDown, Bookmark, ChevronDown, ChevronUp } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { colors, fonts, radius, shadow, spacing } from "../src/theme";
import { api, history, MatchResult, matchUsageStore, FREE_MATCH_LIMIT, analyticsStore } from "../src/api";
import { usePremium } from "../src/theme-context";
import { useI18n } from "../src/i18n";
import PremiumGate from "../src/components/PremiumGate";
import ToolCard from "../src/components/ToolCard";
import { editorialTrustFor } from "../src/utils/editorialTrust";

type Level = "beginner" | "intermediate" | "pro";
type Budget = "free" | "low" | "best";
type MatchPriority = "balanced" | "price" | "accuracy" | "speed";

const NEEDS = [
  { value: "écrire", label: "Écrire", hint: "emails, articles, CV, posts" },
  { value: "créer une image", label: "Image", hint: "logo, visuel, miniature" },
  { value: "faire une vidéo", label: "Vidéo", hint: "TikTok, pub, storyboard" },
  { value: "coder", label: "Coder", hint: "site, script, debug" },
  { value: "créer une app", label: "Créer une app", hint: "no-code, prototype, SaaS" },
  { value: "automatiser", label: "Automatiser", hint: "workflows, tâches répétitives" },
  { value: "apprendre", label: "Apprendre", hint: "cours, résumé, quiz" },
  { value: "faire du marketing", label: "Marketing", hint: "contenu, pub, stratégie" },
  { value: "créer une voix", label: "Voix", hint: "voice-over, podcast, audio" },
  { value: "analyser un document", label: "Analyser", hint: "PDF, contrat, tableau" },
  { value: "découvrir l'IA", label: "Je ne sais pas", hint: "guide-moi avec des exemples" },
];

const LEVELS: { value: Level; label: string; hint: string }[] = [
  { value: "beginner", label: "Débutant", hint: "Je veux simple, guidé et fiable" },
  { value: "intermediate", label: "Intermédiaire", hint: "Je connais déjà quelques outils" },
  { value: "pro", label: "Pro", hint: "Je veux le meilleur et des options avancées" },
];

const BUDGETS: { value: Budget; label: string; hint: string }[] = [
  { value: "free", label: "Gratuit uniquement", hint: "Pas d'abonnement pour commencer" },
  { value: "low", label: "Moins de 10 €/mois", hint: "Bon rapport qualité/prix" },
  { value: "best", label: "Peu importe si c'est le meilleur", hint: "Priorité au résultat" },
];

const PRIORITIES: { value: MatchPriority; label: string; hint: string }[] = [
  { value: "balanced", label: "Équilibré", hint: "Bon compromis qualité, prix et simplicité" },
  { value: "accuracy", label: "Meilleur résultat", hint: "Je privilégie la qualité, même si c'est payant" },
  { value: "speed", label: "Rapidité", hint: "Je veux obtenir vite une réponse exploitable" },
  { value: "price", label: "Prix", hint: "Je veux réduire le coût au maximum" },
];

function defaultPriorityForBudget(budget: Budget): MatchPriority {
  if (budget === "free") return "price";
  if (budget === "low") return "balanced";
  return "accuracy";
}

function buildNeed(task: string, level: Level, budget: Budget, priority: MatchPriority) {
  const levelText = level === "beginner" ? "débutant" : level === "intermediate" ? "intermédiaire" : "professionnel";
  const budgetText = budget === "free" ? "gratuit uniquement" : budget === "low" ? "moins de 10 euros par mois" : "meilleur outil possible même payant";
  const priorityText = priority === "price" ? "prix" : priority === "accuracy" ? "qualité du résultat" : priority === "speed" ? "rapidité" : "équilibre qualité/prix/simplicité";
  const cleanTask = task.trim().replace(/[.!?]+$/g, "");
  const taskSentence = /^je\s+(veux|souhaite|cherche|dois|voudrais)\b/i.test(cleanTask) ? cleanTask : `Je veux ${cleanTask}`;
  return `${taskSentence}. Mon niveau est ${levelText}. Mon budget : ${budgetText}. Ma priorité : ${priorityText}. Je veux une recommandation fiable, simple à comprendre, avec une alternative gratuite, une option premium distincte si utile et un prompt prêt à copier.`;
}

function firstDistinctResult(results: MatchResult[], usedSlugs: Set<string>, predicate: (result: MatchResult) => boolean) {
  const found = results.find((result) => predicate(result) && !usedSlugs.has(result.tool.slug));
  if (found) usedSlugs.add(found.tool.slug);
  return found;
}

export default function MatchWizard() {
  const router = useRouter();
  const { isPremium } = usePremium();
  const { t, apiLanguage } = useI18n();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [customNeed, setCustomNeed] = useState("");
  const [task, setTask] = useState("");
  const [level, setLevel] = useState<Level | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [priority, setPriority] = useState<MatchPriority | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [usedMatches, setUsedMatches] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showAllNeeds, setShowAllNeeds] = useState(false);

  useEffect(() => { matchUsageStore.get().then(setUsedMatches); }, []);

  const selectedTask = customNeed.trim() || task;
  const visibleNeeds = showAllNeeds ? NEEDS : NEEDS.slice(0, 5);
  const remainingMatches = Math.max(0, FREE_MATCH_LIMIT - usedMatches);

  const submit = async (chosenBudget = budget, chosenPriority = priority) => {
    if (!selectedTask || !level || !chosenBudget) return;
    const finalPriority = chosenPriority || defaultPriorityForBudget(chosenBudget);
    if (!isPremium && usedMatches >= FREE_MATCH_LIMIT) {
      setStep(3);
      setResults([]);
      return;
    }
    const finalNeed = buildNeed(selectedTask, level, chosenBudget, finalPriority);
    setBudget(chosenBudget);
    setPriority(finalPriority);
    setLoading(true);
    try {
      const res = await api.match(finalNeed, finalPriority, chosenBudget === "free", apiLanguage);
      const topResults = res.slice(0, 8);
      const top = topResults[0];
      setResults(topResults);
      await history.push({
        need: finalNeed,
        priority: finalPriority,
        createdAt: Date.now(),
        bestToolSlug: top?.tool.slug,
        bestToolName: top?.tool.name,
        readyPrompt: top?.readyPrompt,
        matchScore: top?.matchScore,
      });
      await analyticsStore.track("match_completed", { need: selectedTask, priority: finalPriority, budget: chosenBudget, bestToolSlug: top?.tool.slug });
      setFeedback(null);
      if (!isPremium) setUsedMatches(await matchUsageStore.increment());
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const best = results[0];
  const usedRecommendationSlugs = new Set<string>(best ? [best.tool.slug] : []);
  const freeAlternative = firstDistinctResult(results, usedRecommendationSlugs, (r) => r.tool.freeTier);
  const premium = firstDistinctResult(results, usedRecommendationSlugs, (r) => !r.tool.freeTier);
  const bestTrust = best ? editorialTrustFor(best.tool) : null;
  const readyPrompt = best?.readyPrompt || (best ? `Agis comme un assistant expert de ${best.tool.name}. Aide-moi à ${selectedTask}. Mon niveau est ${level === "beginner" ? "débutant" : level === "intermediate" ? "intermédiaire" : "professionnel"}. Réponds en français simple, avec les étapes concrètes, les erreurs à éviter et une version finale prête à utiliser.` : "");
  const openBestTool = async () => {
    if (!best?.tool.domain) return;
    await analyticsStore.track("match_open_tool", { slug: best.tool.slug, domain: best.tool.domain });
    Linking.openURL(`https://${best.tool.domain}`).catch(() => {});
  };
  const copyReadyPrompt = async () => {
    if (!readyPrompt) return;
    try { await Clipboard.setStringAsync(readyPrompt); } catch {}
    await analyticsStore.track("match_prompt_copied", { bestToolSlug: best?.tool.slug, need: selectedTask });
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1500);
  };
  const sendFeedback = async (value: "up" | "down") => {
    setFeedback(value);
    await analyticsStore.track("match_feedback", { value, bestToolSlug: best?.tool.slug, need: selectedTask });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>IA MATCH</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} testID="match-close">
          <X size={20} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {!isPremium ? <Text style={styles.freeCounter}>{t("match.freeCounter", { remaining: remainingMatches, limit: FREE_MATCH_LIMIT })}</Text> : <Text style={styles.freeCounter}>{t("match.premiumCounter")}</Text>}
          <View style={styles.progressRow}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.progressDot, { width: i === Math.min(step, 2) ? 28 : 8, backgroundColor: i <= Math.min(step, 2) ? colors.coral : colors.borderSubtle }]} />
            ))}
          </View>

          {step === 0 && (
            <View>
              <Text style={styles.stepLabel}>{t("match.stepNeed")}</Text>
              <Text style={styles.stepTitle}>{t("match.needTitle")}</Text>
              <Text style={styles.stepSub}>{t("match.needSub")}</Text>

              <TextInput
                value={customNeed}
                onChangeText={(v) => {
                  setCustomNeed(v);
                  if (v.trim()) setTask("");
                }}
                placeholder={t("match.placeholder")}
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                testID="match-custom-need"
              />

              <TouchableOpacity disabled={!selectedTask} style={[styles.cta, !selectedTask && styles.ctaDisabled, { marginTop: spacing.md }]} onPress={() => setStep(1)} testID="match-next-level">
                <Text style={styles.ctaText}>{t("common.continue")}</Text>
                <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
              </TouchableOpacity>

              <Text style={styles.sectionMiniTitle}>Ou choisis un raccourci</Text>
              <View style={styles.grid}>
                {visibleNeeds.map((item) => {
                  const active = task === item.value && !customNeed.trim();
                  return (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => {
                        setTask(item.value);
                        setCustomNeed("");
                        setResults([]);
                        setStep(1);
                      }}
                      style={[styles.choiceCard, active && styles.choiceCardActive]}
                      testID={`match-need-${item.value}`}
                    >
                      <Text style={[styles.choiceTitle, active && styles.choiceTitleActive]}>{item.label}</Text>
                      <Text style={styles.choiceHint}>{item.hint}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {NEEDS.length > visibleNeeds.length || showAllNeeds ? (
                <TouchableOpacity onPress={() => setShowAllNeeds((v) => !v)} style={styles.showMoreNeeds}>
                  <Text style={styles.showMoreNeedsText}>{showAllNeeds ? "Réduire les raccourcis" : "Voir plus de besoins"}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={styles.stepLabel}>{t("match.stepLevel")}</Text>
              <Text style={styles.stepTitle}>{t("match.levelTitle")}</Text>
              <Text style={styles.stepSub}>{t("match.levelSub")}</Text>
              <View style={styles.list}>
                {LEVELS.map((item) => {
                  const active = level === item.value;
                  return (
                    <TouchableOpacity key={item.value} onPress={() => setLevel(item.value)} style={[styles.rowChoice, active && styles.choiceCardActive]} testID={`match-level-${item.value}`}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.rowTitle, active && styles.choiceTitleActive]}>{item.label}</Text>
                        <Text style={styles.choiceHint}>{item.hint}</Text>
                      </View>
                      {active ? <Check size={20} color={colors.coral} strokeWidth={3} /> : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity disabled={!level} style={[styles.cta, !level && styles.ctaDisabled]} onPress={() => setStep(2)} testID="match-next-budget">
                <Text style={styles.ctaText}>{t("common.continue")}</Text>
                <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.stepLabel}>{t("match.stepBudget")}</Text>
              <Text style={styles.stepTitle}>{t("match.budgetTitle")}</Text>
              <Text style={styles.stepSub}>{t("match.budgetSub")}</Text>
              <Text style={styles.sectionMiniTitle}>Budget</Text>
              <View style={styles.list}>
                {BUDGETS.map((item) => {
                  const active = budget === item.value;
                  return (
                    <TouchableOpacity key={item.value} onPress={() => { setBudget(item.value); if (!priority) setPriority(defaultPriorityForBudget(item.value)); }} style={[styles.rowChoice, active && styles.choiceCardActive]} disabled={loading} testID={`match-budget-${item.value}`}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.rowTitle, active && styles.choiceTitleActive]}>{item.label}</Text>
                        <Text style={styles.choiceHint}>{item.hint}</Text>
                      </View>
                      {active ? <Check size={20} color={colors.coral} strokeWidth={3} /> : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.sectionMiniTitle}>Priorité</Text>
              <View style={styles.grid}>
                {PRIORITIES.map((item) => {
                  const active = (priority || (budget ? defaultPriorityForBudget(budget) : null)) === item.value;
                  return (
                    <TouchableOpacity key={item.value} onPress={() => setPriority(item.value)} style={[styles.choiceCard, active && styles.choiceCardActive]} disabled={loading} testID={`match-priority-${item.value}`}>
                      <Text style={[styles.choiceTitle, active && styles.choiceTitleActive]}>{item.label}</Text>
                      <Text style={styles.choiceHint}>{item.hint}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity disabled={!budget || loading} style={[styles.cta, (!budget || loading) && styles.ctaDisabled]} onPress={() => submit(budget, priority || (budget ? defaultPriorityForBudget(budget) : null))} testID="match-submit">
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Voir mes recommandations</Text>}
                {!loading ? <ArrowRight size={18} color="#fff" strokeWidth={2.5} /> : null}
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && !isPremium && usedMatches >= FREE_MATCH_LIMIT && results.length === 0 ? (
            <PremiumGate
              feature="Match illimité"
              description={`Tu as utilisé tes ${FREE_MATCH_LIMIT} Match gratuits. Premium garde le Match illimité, les comparatifs pédagogiques, les benchmarks par catégorie et le Builder avancé.`}
              benefits={["Match illimité", "Comparatif ludique complet", "Benchmarks par catégorie", "Builder multi-LLM", "Historique et favoris"]}
            />
          ) : null}

          {step === 3 && !( !isPremium && usedMatches >= FREE_MATCH_LIMIT && results.length === 0) && (
            <View>
              <Text style={styles.stepLabel}>RÉSULTATS</Text>
              <Text style={styles.stepTitle}>{best ? `Je te recommande ${best.tool.name}.` : "Voici les IA les plus adaptées."}</Text>
              <Text style={styles.stepSub}>Besoin : {selectedTask}</Text>

              {best ? (
                <View style={styles.resultHero}>
                  <Text style={styles.resultHeroLabel}>MEILLEURE RECOMMANDATION</Text>
                  <ToolCard tool={best.tool} matchScore={best.matchScore} testID={`match-best-${best.tool.slug}`} />
                  <View style={styles.decisionStrip}>
                    <View style={styles.decisionPill}><Text style={styles.decisionPillText}>#{Math.round(best.matchScore)} adapté</Text></View>
                    <View style={styles.decisionPill}><Text style={styles.decisionPillText}>{best.tool.freeTier ? "Gratuit dispo" : `${best.tool.monthlyPrice}€/mois env.`}</Text></View>
                    <View style={styles.decisionPill}><Text style={styles.decisionPillText}>{level === "beginner" ? "Simple" : "Puissant"}</Text></View>
                  </View>
                  <View style={styles.reasonsBox}>
                    <Text style={styles.resultSummaryTitle}>Pourquoi ce choix ?</Text>
                    {best.reasons.slice(0, 3).map((reason) => <Text key={reason} style={styles.reasonText}>• {reason}</Text>)}
                    <View style={styles.nextStepBox}>
                      <Text style={styles.nextStepTitle}>Ce que tu fais maintenant</Text>
                      <Text style={styles.reasonText}>1. Copie le prompt ci-dessous.</Text>
                      <Text style={styles.reasonText}>2. Ouvre {best.tool.name}.</Text>
                      <Text style={styles.reasonText}>3. Colle, teste, puis ajuste avec ton contexte.</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowDetails((v) => !v)} style={styles.detailsToggle}>
                      <Text style={styles.detailsToggleText}>Pourquoi ce classement ?</Text>
                      {showDetails ? <ChevronUp size={16} color={colors.coral} /> : <ChevronDown size={16} color={colors.coral} />}
                    </TouchableOpacity>
                    {showDetails ? (
                      <View style={styles.avoidBox}>
                        {best.scoreExplanation ? <Text style={styles.scoreExplanation}>Méthode : {best.scoreExplanation}</Text> : null}
                        {bestTrust ? <>
                          <Text style={styles.avoidTitle}>Détails utiles</Text>
                          <Text style={styles.reasonText}>👤 Pour qui : {bestTrust.bestFor}</Text>
                          <Text style={styles.reasonText}>⚠️ À éviter si : {bestTrust.avoidIf.join(" · ")}</Text>
                          <Text style={styles.reasonText}>💸 Prix / limites : {bestTrust.pricing}</Text>
                          <Text style={styles.reasonText}>🔎 Sources : {bestTrust.sources.join(" · ")}</Text>
                        </> : null}
                        {best.avoidIf?.length ? best.avoidIf.map((item) => <Text key={item} style={styles.reasonText}>• {item}</Text>) : null}
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : (
                <Text style={styles.empty}>Aucun match. Reformule ton besoin.</Text>
              )}

              {(freeAlternative || premium) ? (
                <View style={styles.resultBlock}>
                  <TouchableOpacity onPress={() => setShowAlternatives((v) => !v)} style={styles.altToggle}>
                    <Text style={styles.blockLabel}>ALTERNATIVES</Text>
                    {showAlternatives ? <ChevronUp size={16} color={colors.coral} /> : <ChevronDown size={16} color={colors.coral} />}
                  </TouchableOpacity>
                  {showAlternatives && freeAlternative ? (
                    <View style={styles.altCard}>
                      <Text style={styles.blockLabel}>GRATUIT</Text>
                      <ToolCard tool={freeAlternative.tool} matchScore={freeAlternative.matchScore} testID={`match-free-${freeAlternative.tool.slug}`} />
                    </View>
                  ) : null}
                  {showAlternatives && premium ? (
                    <View style={styles.altCard}>
                      <Text style={styles.blockLabel}>OPTION PAYANTE</Text>
                      <ToolCard tool={premium.tool} matchScore={premium.matchScore} testID={`match-premium-${premium.tool.slug}`} />
                    </View>
                  ) : null}
                </View>
              ) : null}

              {best ? (
                <View style={styles.promptBox}>
                  <Text style={styles.blockLabel}>PROMPT PRÊT À COPIER</Text>
                  <Text style={styles.promptText}>{readyPrompt}</Text>
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.promptAction} onPress={copyReadyPrompt} testID="match-copy-prompt">
                      {copiedPrompt ? <Check size={16} color="#fff" strokeWidth={2.5} /> : <Copy size={16} color="#fff" strokeWidth={2.5} />}
                      <Text style={styles.promptActionText}>{copiedPrompt ? "Copié" : "Copier le prompt"}</Text>
                    </TouchableOpacity>
                    {best.tool.domain ? (
                      <TouchableOpacity style={styles.promptActionGhost} onPress={openBestTool} testID="match-open-tool">
                        <ExternalLink size={16} color="#fff" strokeWidth={2.5} />
                        <Text style={styles.promptActionText}>Ouvrir l’outil</Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity style={styles.promptActionGhost} onPress={() => router.push("/(tabs)/compare")} testID="match-compare">
                      <GitCompare size={16} color="#fff" strokeWidth={2.5} />
                      <Text style={styles.promptActionText}>Comparer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.promptActionGhost} onPress={() => router.push(`/tool/${best.tool.slug}`)} testID="match-save-detail">
                      <Bookmark size={16} color="#fff" strokeWidth={2.5} />
                      <Text style={styles.promptActionText}>Voir la fiche</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              {best ? (
                <View style={styles.feedbackBox}>
                  <Text style={styles.feedbackTitle}>Cette recommandation t'aide ?</Text>
                  <View style={styles.feedbackRow}>
                    <TouchableOpacity onPress={() => sendFeedback("up")} style={[styles.feedbackBtn, feedback === "up" && styles.feedbackActive]}>
                      <ThumbsUp size={16} color={feedback === "up" ? "#fff" : colors.coral} strokeWidth={2.5} />
                      <Text style={[styles.feedbackText, feedback === "up" && styles.feedbackTextActive]}>Utile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => sendFeedback("down")} style={[styles.feedbackBtn, feedback === "down" && styles.feedbackActive]}>
                      <ThumbsDown size={16} color={feedback === "down" ? "#fff" : colors.coral} strokeWidth={2.5} />
                      <Text style={[styles.feedbackText, feedback === "down" && styles.feedbackTextActive]}>À améliorer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              <TouchableOpacity style={styles.ctaSecondary} onPress={() => { setStep(0); setResults([]); }} testID="match-restart">
                <Text style={styles.ctaSecondaryText}>Nouveau besoin</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  brand: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 4, color: colors.textPrimary },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.borderSubtle },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.md },
  freeCounter: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.coral, marginBottom: spacing.sm },
  progressRow: { flexDirection: "row", gap: 6, marginBottom: spacing.lg },
  progressDot: { height: 8, borderRadius: 4 },
  stepLabel: { fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 2, color: colors.pink, marginBottom: 8 },
  stepTitle: { fontFamily: fonts.serif, fontSize: 38, color: colors.textPrimary, lineHeight: 42, letterSpacing: -1 },
  stepSub: { fontFamily: fonts.body, fontSize: 15, color: colors.textSecondary, marginTop: 8, lineHeight: 21 },
  input: { marginTop: spacing.lg, backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, fontFamily: fonts.body, fontSize: 15, color: colors.textPrimary, ...shadow.soft },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: spacing.md },
  choiceCard: { width: "48%", minHeight: 86, backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  choiceCardActive: { borderColor: colors.coral, backgroundColor: colors.pinkSoft },
  choiceTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.textPrimary },
  choiceTitleActive: { color: colors.coral },
  choiceHint: { fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginTop: 4 },
  showMoreNeeds: { alignSelf: "center", borderRadius: radius.pill, borderWidth: 1, borderColor: colors.borderSubtle, paddingHorizontal: 14, paddingVertical: 9, marginTop: spacing.sm },
  showMoreNeedsText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.coral },
  list: { gap: spacing.sm, marginTop: spacing.lg },
  sectionMiniTitle: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.2, color: colors.coral, marginTop: spacing.lg, marginBottom: -spacing.sm, textTransform: "uppercase" },
  rowChoice: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  rowTitle: { fontFamily: fonts.serif, fontSize: 21, color: colors.textPrimary },
  cta: { marginTop: spacing.xl, backgroundColor: colors.coral, borderRadius: radius.pill, paddingVertical: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 15 },
  resultHero: { marginTop: spacing.lg },
  decisionStrip: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: -8, marginBottom: spacing.sm },
  decisionPill: { backgroundColor: colors.coral, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  decisionPillText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 11 },
  resultHeroLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.7, color: colors.coral, marginBottom: spacing.sm },
  resultBlock: { marginTop: spacing.lg },
  altToggle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: radius.lg, padding: spacing.md },
  altCard: { marginTop: spacing.sm },
  blockLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.7, color: colors.coral, marginBottom: spacing.sm },
  reasonsBox: { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginTop: -spacing.sm, marginBottom: spacing.md },
  resultSummaryTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.textPrimary, marginBottom: 8 },
  nextStepBox: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  nextStepTitle: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.coral, marginBottom: 4 },
  reasonText: { fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  scoreExplanation: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.textPrimary, lineHeight: 18, marginTop: spacing.sm },
  avoidBox: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  avoidTitle: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.textPrimary, marginBottom: 4 },
  detailsToggle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  detailsToggleText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.coral },
  promptBox: { backgroundColor: colors.darkCard, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg },
  promptText: { fontFamily: fonts.body, fontSize: 13, color: colors.textInverse, lineHeight: 20 },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: spacing.md },
  promptAction: { flexGrow: 1, justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.coral, borderRadius: radius.pill, paddingVertical: 11, paddingHorizontal: spacing.md },
  promptActionGhost: { flexGrow: 1, justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 8, borderColor: colors.borderDark, borderWidth: 1, borderRadius: radius.pill, paddingVertical: 11, paddingHorizontal: spacing.md },
  promptActionText: { fontFamily: fonts.bodyBold, fontSize: 12, color: "#fff" },
  feedbackBox: { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  feedbackTitle: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm },
  feedbackRow: { flexDirection: "row", gap: 10 },
  feedbackBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1, borderColor: colors.coral, borderRadius: radius.pill, paddingVertical: 11 },
  feedbackActive: { backgroundColor: colors.coral },
  feedbackText: { fontFamily: fonts.bodyBold, color: colors.coral, fontSize: 12 },
  feedbackTextActive: { color: "#fff" },
  empty: { fontFamily: fonts.body, color: colors.textSecondary, marginTop: spacing.lg },
  ctaSecondary: { marginTop: spacing.lg, borderRadius: radius.pill, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: colors.borderSubtle },
  ctaSecondaryText: { fontFamily: fonts.bodyBold, color: colors.textPrimary },
});
