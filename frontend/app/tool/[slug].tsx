import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from "react-native-reanimated";
import { ChevronLeft, ChevronDown, Plus, Minus, Zap, Target, DollarSign, Globe, GitCompare, ExternalLink, Bookmark } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, Tool, RatingSummary, compareStore, bookmarkTools, analyticsStore } from "../../src/api";
import { pricingFor } from "../../src/utils/pricingGuide";
import { toolDecisionCopy } from "../../src/utils/toolDecision";
import { editorialTrustFor } from "../../src/utils/editorialTrust";
import CategoryScoreBars from "../../src/components/CategoryScoreBars";
import ScoreRing from "../../src/components/ScoreRing";
import LogoTile from "../../src/components/LogoTile";
import { ScoreGauge, WorkflowMap } from "../../src/components/VisualExplainers";

export default function ToolDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { colors: theme } = useTheme();
  const [tool, setTool] = useState<Tool | null>(null);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [userScore, setUserScore] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inCompare, setInCompare] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const scale = useSharedValue(1);

  const animatedScore = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const pricing = tool ? pricingFor(`${tool.name} ${tool.vendor}`) : undefined;
  const decision = tool ? toolDecisionCopy(tool) : undefined;
  const editorialTrust = tool ? editorialTrustFor(tool) : undefined;

  const reload = useCallback(async () => {
    if (!slug) return;
    const [t, r, c, b] = await Promise.all([
      api.getTool(slug).catch(() => null),
      api.ratings(slug).catch(() => null),
      compareStore.get(),
      bookmarkTools.has(slug),
    ]);
    setTool(t);
    setSummary(r);
    setInCompare(c.includes(slug));
    setBookmarked(b);
  }, [slug]);

  useEffect(() => {
    reload();
  }, [reload]);

  const bump = (delta: number) => {
    setUserScore((s) => Math.max(0, Math.min(100, s + delta)));
    scale.value = withSequence(withSpring(1.15, { damping: 6 }), withSpring(1, { damping: 8 }));
  };

  const submitRating = async () => {
    if (!slug) return;
    setSubmitting(true);
    try {
      await api.rate(slug, userScore);
      setSubmitted(true);
      await reload();
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCompare = async () => {
    if (!slug) return;
    const next = await compareStore.toggle(slug);
    setInCompare(next.includes(slug));
  };

  const toggleBookmark = async () => {
    if (!slug) return;
    const next = await bookmarkTools.toggle(slug);
    setBookmarked(next.includes(slug));
  };

  const openOfficial = async () => {
    if (!tool?.domain) return;
    await analyticsStore.track("official_link_clicked", { slug: tool.slug, domain: tool.domain });
    Linking.openURL(`https://${tool.domain}`).catch(() => {});
  };

  const copySuggestedPrompt = async () => {
    if (!tool) return;
    const prompt = tool.example?.prompt || `Tu es ${tool.name}. Aide-moi à ${tool.useCases[0] || "réaliser mon objectif"}. Donne-moi une réponse claire, actionnable, en français, avec les étapes, les erreurs à éviter et une version finale prête à utiliser.`;
    await Clipboard.setStringAsync(prompt);
    await analyticsStore.track("tool_prompt_copied", { slug: tool.slug });
    Alert.alert("Prompt copié", "Tu peux maintenant le coller dans l'outil recommandé.");
  };

  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  if (!tool) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.pink} style={{ marginTop: spacing.xl }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80, backgroundColor: theme.bg }}>
        <View style={[styles.headerImg, { backgroundColor: tool.color }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="tool-back">
            <ChevronLeft size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkBtn} testID="tool-bookmark">
            <Bookmark
              size={20}
              color="#fff"
              fill={bookmarked ? "#fff" : "transparent"}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openOfficial}
            activeOpacity={0.8}
            style={styles.headerLogoWrap}
            testID="tool-logo-link"
          >
            <LogoTile uri={tool.image} name={tool.name} bg="#fff" size={96} rounded={24} domain={tool.domain} />
            <View style={styles.openBadge}>
              <ExternalLink size={14} color="#fff" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.vendor}>{tool.vendor.toUpperCase()}</Text>
          <Text style={styles.name}>{tool.name}</Text>
          <Text style={styles.tagline}>{tool.tagline}</Text>

          <View style={styles.statsBlock}>
            <Stat icon={<Zap size={16} color={colors.pink} strokeWidth={2.5} />} label="Vitesse"
              value={tool.speedMs < 1000 ? `${tool.speedMs}ms` : `${(tool.speedMs / 1000).toFixed(1)}s`} />
            <Stat icon={<Target size={16} color={colors.pink} strokeWidth={2.5} />} label="Qualité estimée"
              value={`${tool.accuracyPct}%`} />
            <Stat icon={<DollarSign size={16} color={colors.pink} strokeWidth={2.5} />} label="Prix"
              value={tool.freeTier ? "Gratuit" : `${tool.monthlyPrice}€/m`} />
            <Stat icon={<Globe size={16} color={colors.pink} strokeWidth={2.5} />} label="Langues"
              value={`${tool.languages.length}`} />
          </View>

          <View style={styles.quickSummaryCard}>
            <Text style={styles.quickSummaryTitle}>En bref</Text>
            <Text style={styles.desc} numberOfLines={3}>{tool.description}</Text>
            <View style={styles.featureRowCompact}>
              {tool.features.slice(0, 4).map((f) => (
                <View key={f} style={styles.featureChip}>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          <CompactSection title="Pourquoi le choisir" subtitle="Recommandation, limites et cas où l’éviter" open={!!openSections.trust} onToggle={() => toggleSection("trust")}>
            {editorialTrust ? (
              <View style={styles.trustCard}>
                <Text style={styles.trustTitle}>Pourquoi IA Match le recommande</Text>
                <Text style={styles.trustLine}>✅ Pourquoi : {editorialTrust.why}</Text>
                <Text style={styles.trustLine}>👤 Pour qui : {editorialTrust.bestFor}</Text>
                <Text style={styles.trustLine}>⚠️ À éviter si : {editorialTrust.avoidIf.join(" · ")}</Text>
                <Text style={styles.trustLine}>💸 Prix / limites du gratuit : {editorialTrust.pricing}</Text>
                <Text style={styles.trustLine}>🔎 Sources : {editorialTrust.sources.join(" · ")}</Text>
                <Text style={styles.trustLine}>🧭 Niveau de confiance : {editorialTrust.confidence}</Text>
                <Text style={styles.trustLine}>📅 Dernière mise à jour : {editorialTrust.updatedAt}</Text>
              </View>
            ) : null}
            {decision ? (
              <View style={styles.decisionCard}>
                <Text style={styles.decisionTitle}>En clair</Text>
                <Text style={styles.decisionText}>{decision.plain}</Text>
                <Text style={styles.decisionTitleSmall}>À éviter si…</Text>
                {decision.avoid.map((line) => <Text key={line} style={styles.decisionBullet}>• {line}</Text>)}
                <Text style={styles.decisionTitleSmall}>Outils complémentaires / workflow</Text>
                {decision.complements.map((line) => <Text key={line} style={styles.decisionBullet}>• {line}</Text>)}
              </View>
            ) : null}
          </CompactSection>

          <CompactSection title="Prix et score" subtitle="Plans, indice éditorial et méthode" open={!!openSections.score} onToggle={() => toggleSection("score")}>
            {pricing ? (
              <View style={styles.pricingCard}>
                <Text style={styles.pricingTitle}>💸 Prix expliqué simplement</Text>
                <Text style={styles.pricingNote}>{pricing.note}</Text>
                {pricing.plans.map((plan) => (
                  <View key={plan.name} style={styles.planRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.planName}>{plan.name} · {plan.price}</Text>
                      <Text style={styles.planMeta}>Pour : {plan.bestFor}</Text>
                      <Text style={styles.planModels}>Modèles : {plan.models}</Text>
                      <Text style={styles.planLimit}>Limite : {plan.limits}</Text>
                      <Text style={styles.planPlus}>+ {plan.plus.join(" · ")}</Text>
                    </View>
                  </View>
                ))}
                <Text style={styles.pricingFoot}>Les prix changent selon pays/offres. IA Match t’aide surtout à savoir quel palier vaut le coup pour ton usage.</Text>
              </View>
            ) : null}
            <CategoryScoreBars scores={tool.categoryScores || {}} generalScore={tool.score} />
            <View style={styles.scoreInfoCard}>
              <Text style={styles.scoreInfoTitle}>Comment est calculé ce score ?</Text>
              <Text style={styles.scoreInfoText}>
                IA Match combine des benchmarks publics quand ils existent, les prix officiels, les limites produit, les langues, les tests internes et des indices éditoriaux par catégorie. Le chiffre sert à aider le choix : ce n’est pas une mesure scientifique absolue ni une promesse de performance réelle.
              </Text>
            </View>
            <ScoreGauge label="Indice éditorial IA Match" value={Math.max(tool.score, tool.accuracyPct)} helper="Repère d’aide au choix basé sur sources publiques, prix, limites et tests éditoriaux. Ce n’est pas un benchmark scientifique absolu." />
            {tool.lastUpdated ? (
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSecondary, fontStyle: "italic", marginTop: spacing.sm }}>
                ⓘ Indice éditorial IA Match mis à jour le {new Date(tool.lastUpdated).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} · sources publiques, prix officiels et tests éditoriaux
              </Text>
            ) : null}
          </CompactSection>

          <CompactSection title="Prompt et méthode" subtitle="Prompt prêt à copier + workflow" open={!!openSections.prompt} onToggle={() => toggleSection("prompt")}>
            <WorkflowMap title="Comment l’utiliser proprement" steps={["Choisir le bon cas d’usage", "Préparer un prompt clair", "Tester une première sortie", "Comparer avec une alternative", "Garder seulement si le résultat est meilleur"]} />
            {tool.example ? (
              <View style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md }}>
                <Text style={{ fontFamily: fonts.serif, fontSize: 18, color: colors.textPrimary, marginBottom: 8 }}>
                  ✨ Prompt conseillé : Avant / Après
                </Text>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, color: colors.coral, marginBottom: 4 }}>PROMPT À COPIER</Text>
                <View style={{ backgroundColor: colors.bg, padding: 10, borderRadius: 8, marginBottom: 10 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 12, lineHeight: 18, color: colors.textPrimary }}>{tool.example.prompt}</Text>
                </View>
                <TouchableOpacity onPress={copySuggestedPrompt} style={styles.copyPromptBtn} testID="tool-copy-prompt">
                  <Text style={styles.copyPromptText}>Copier ce prompt</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, color: colors.coral, marginBottom: 4, marginTop: 10 }}>RÉSULTAT ATTENDU</Text>
                <View style={{ backgroundColor: colors.bg, padding: 10, borderRadius: 8 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 12, lineHeight: 18, color: colors.textPrimary }}>{tool.example.output}</Text>
                </View>
              </View>
            ) : (
              <View style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md }}>
                <Text style={{ fontFamily: fonts.serif, fontSize: 18, color: colors.textPrimary, marginBottom: 8 }}>✨ Prompt conseillé</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 12, lineHeight: 18, color: colors.textPrimary }}>
                  Tu es {tool.name}. Aide-moi à {tool.useCases[0] || "réaliser mon objectif"}. Donne-moi une réponse claire, actionnable, en français, avec les étapes et les erreurs à éviter.
                </Text>
                <TouchableOpacity onPress={copySuggestedPrompt} style={styles.copyPromptBtn} testID="tool-copy-prompt">
                  <Text style={styles.copyPromptText}>Copier ce prompt</Text>
                </TouchableOpacity>
              </View>
            )}
          </CompactSection>

          <CompactSection title="Détails complets" subtitle="Confidentialité, points forts, cas d’usage" open={!!openSections.details} onToggle={() => toggleSection("details")}>
            <Text style={styles.section}>À propos</Text>
            <Text style={styles.desc}>{tool.description}</Text>
            {tool.privacy ? (
              <View style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, marginTop: spacing.md }}>
                <Text style={{ fontFamily: fonts.serif, fontSize: 18, color: colors.textPrimary, marginBottom: 8 }}>
                  🛡️ Confidentialité & souveraineté
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: (tool.privacy.privacy_score || 0) >= 80 ? "#10B981" : (tool.privacy.privacy_score || 0) >= 60 ? "#F59E0B" : "#EF4444", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff", fontFamily: fonts.bodyBold, fontSize: 18 }}>{tool.privacy.privacy_score}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textPrimary }}>{tool.privacy.eu_hosted ? "🇪🇺 Hébergé en Europe" : "🌍 Hébergé hors Europe"}</Text>
                    <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textPrimary, marginTop: 2 }}>{tool.privacy.trains_on_data === "no" ? "✅ Tes données ne sont PAS utilisées pour entraîner" : tool.privacy.trains_on_data === "opt-out" ? "⚠️ Désactivable dans les paramètres" : "❌ Données utilisées pour entraîner par défaut"}</Text>
                    <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textPrimary, marginTop: 2 }}>{tool.privacy.rgpd ? "✅ Conforme RGPD" : "❌ RGPD non garanti"}</Text>
                  </View>
                </View>
                {tool.privacy.note ? <Text style={{ fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: colors.textSecondary, fontStyle: "italic" }}>{tool.privacy.note}</Text> : null}
              </View>
            ) : null}
            <Text style={styles.section}>Points forts</Text>
            <View style={styles.featureRow}>
              {tool.features.map((f) => (
                <View key={f} style={styles.featureChip}>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.section}>Cas d'usage</Text>
            {tool.useCases.map((u) => (
              <Text key={u} style={styles.useCase}>· {u}</Text>
            ))}
          </CompactSection>

          <View style={styles.ratingBlock}>
            <Text style={styles.ratingLabel}>NOTE COMMUNAUTAIRE</Text>
            <Text style={styles.ratingAvg}>
              {summary && summary.count > 0 ? `${summary.average}/100` : "Pas encore de note"}
            </Text>
            {summary && summary.count > 0 ? (
              <Text style={styles.ratingCount}>{summary.count} évaluation(s)</Text>
            ) : null}

            <Text style={[styles.ratingLabel, { marginTop: spacing.lg }]}>TA NOTE</Text>
            <Animated.View style={[styles.ratingRow, animatedScore]}>
              <TouchableOpacity onPress={() => bump(-10)} style={styles.modBtn} testID="rating-minus">
                <Minus size={20} color={colors.textPrimary} strokeWidth={2.5} />
              </TouchableOpacity>
              <ScoreRing score={userScore} size={96} />
              <TouchableOpacity onPress={() => bump(10)} style={styles.modBtn} testID="rating-plus">
                <Plus size={20} color={colors.textPrimary} strokeWidth={2.5} />
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              onPress={submitRating}
              style={[styles.submitBtn, submitted && { backgroundColor: colors.success }]}
              disabled={submitting || submitted}
              testID="rating-submit"
            >
              <Text style={styles.submitText}>
                {submitted ? "Merci pour ta note !" : submitting ? "Envoi..." : "Envoyer la note"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.reportTitle}>Tu vois une erreur ?</Text>
            <Text style={styles.reportText}>Aide IA Match à rester fiable : signale un prix, un logo ou une recommandation qui ne colle pas.</Text>
            <View style={styles.reportRow}>
              <TouchableOpacity style={styles.reportBtn} onPress={() => Alert.alert("Merci", "Signalement logo enregistré pour la bêta.")}><Text style={styles.reportBtnText}>Logo faux</Text></TouchableOpacity>
              <TouchableOpacity style={styles.reportBtn} onPress={() => Alert.alert("Merci", "Signalement prix enregistré pour la bêta.")}><Text style={styles.reportBtnText}>Prix faux</Text></TouchableOpacity>
              <TouchableOpacity style={styles.reportBtn} onPress={() => Alert.alert("Merci", "Suggestion enregistrée pour la bêta.")}><Text style={styles.reportBtnText}>Suggérer</Text></TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={toggleCompare}
            style={[styles.compareBtn, inCompare && styles.compareBtnActive]}
            testID="tool-toggle-compare"
          >
            <GitCompare size={18} color={inCompare ? "#fff" : colors.textPrimary} strokeWidth={2.5} />
            <Text style={[styles.compareText, inCompare && { color: "#fff" }]}>
              {inCompare ? "Dans le comparatif" : "Ajouter au comparatif"}
            </Text>
          </TouchableOpacity>

          {tool.domain ? (
            <TouchableOpacity
            onPress={openOfficial}
              style={[styles.visitBtn, { borderColor: theme.borderSubtle }]}
              testID="tool-visit-website"
            >
              <ExternalLink size={16} color={theme.textPrimary} strokeWidth={2} />
              <Text style={[styles.visitText, { color: theme.textPrimary }]}>
                Visiter {tool.domain}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      {icon}
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}


function CompactSection({ title, subtitle, open, onToggle, children }: { title: string; subtitle: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <View style={styles.compactSection}>
      <TouchableOpacity onPress={onToggle} style={styles.compactSectionHeader} activeOpacity={0.85}>
        <View style={{ flex: 1 }}>
          <Text style={styles.compactSectionTitle}>{title}</Text>
          <Text style={styles.compactSectionSubtitle}>{subtitle}</Text>
        </View>
        <ChevronDown size={18} color={colors.coral} strokeWidth={2.5} style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }} />
      </TouchableOpacity>
      {open ? <View style={styles.compactSectionBody}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerImg: {
    height: 220,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogoWrap: { position: "relative" },
  openBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(18,21,28,0.35)" },
  backBtn: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkBtn: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: spacing.lg, marginTop: -spacing.lg, backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  vendor: { fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 2, color: colors.pink },
  name: {
    fontFamily: fonts.serif,
    fontSize: 36,
    color: colors.textPrimary,
    letterSpacing: -1,
    marginTop: 4,
  },
  tagline: { fontFamily: fonts.body, fontSize: 16, color: colors.textSecondary, marginTop: 4, lineHeight: 22 },
  statsBlock: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  statBox: {
    flexBasis: "47%",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadow.soft,
  },
  statLabel: { fontFamily: fonts.bodySemi, fontSize: 11, color: colors.textSecondary, marginTop: 4, letterSpacing: 1 },
  statValue: { fontFamily: fonts.bodyBold, fontSize: 20, color: colors.textPrimary, marginTop: 2 },
  quickSummaryCard: { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  quickSummaryTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.textPrimary, marginBottom: 6 },
  featureRowCompact: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.sm },
  compactSection: { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, marginTop: spacing.sm, overflow: "hidden" },
  compactSectionHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md },
  compactSectionTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.textPrimary },
  compactSectionSubtitle: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: colors.textSecondary, marginTop: 2 },
  compactSectionBody: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  section: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  desc: { fontFamily: fonts.body, fontSize: 15, color: colors.textPrimary, lineHeight: 24 },
  trustCard: { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  trustTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.textPrimary, marginBottom: 8 },
  trustLine: { fontFamily: fonts.body, fontSize: 13, color: colors.textPrimary, lineHeight: 20, marginTop: 2 },
  decisionCard: { backgroundColor: colors.coralSoft, borderColor: colors.coral, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md, marginBottom: spacing.md },
  decisionTitle: { fontFamily: fonts.serif, fontSize: 19, color: colors.textPrimary, marginBottom: 6 },
  decisionTitleSmall: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.coral, marginTop: spacing.sm, marginBottom: 3, letterSpacing: 0.4 },
  decisionText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.textPrimary },
  decisionBullet: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, color: colors.textPrimary, marginTop: 2 },
  scoreInfoCard: { backgroundColor: colors.coralSoft, borderRadius: radius.lg, padding: spacing.md, marginTop: -spacing.sm, marginBottom: spacing.md },
  scoreInfoTitle: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.textPrimary, marginBottom: 4 },
  scoreInfoText: { fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  copyPromptBtn: { backgroundColor: colors.coral, paddingVertical: 11, borderRadius: radius.pill, alignItems: "center", marginBottom: 4 },
  copyPromptText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 13 },
  pricingCard: { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  pricingTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.textPrimary, marginBottom: 6 },
  pricingNote: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, color: colors.textSecondary, marginBottom: spacing.sm },
  planRow: { borderTopWidth: 1, borderTopColor: colors.borderSubtle, paddingTop: spacing.sm, marginTop: spacing.sm },
  planName: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.textPrimary },
  planMeta: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.textPrimary, marginTop: 3 },
  planModels: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.coral, marginTop: 2 },
  planLimit: { fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  planPlus: { fontFamily: fonts.body, fontSize: 12, color: colors.coral, marginTop: 2 },
  pricingFoot: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16, color: colors.textSecondary, marginTop: spacing.sm, fontStyle: "italic" },
  featureRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  featureChip: {
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  featureText: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.pink },
  useCase: { fontFamily: fonts.body, fontSize: 14, color: colors.textPrimary, marginTop: 4 },
  ratingBlock: {
    marginTop: spacing.xl,
    backgroundColor: colors.darkCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.dark,
  },
  ratingLabel: { fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 2, color: colors.pink },
  ratingAvg: { fontFamily: fonts.serif, fontSize: 32, color: colors.textInverse, marginTop: 4 },
  ratingCount: { fontFamily: fonts.body, fontSize: 13, color: "rgba(253,251,247,0.6)" },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: "#fff",
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  modBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtn: {
    backgroundColor: colors.coral,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: "center",
    marginTop: spacing.md,
  },
  submitText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 15 },
  reportCard: { backgroundColor: colors.surface, borderColor: colors.borderSubtle, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  reportTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.textPrimary },
  reportText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, color: colors.textSecondary, marginTop: 4 },
  reportRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.sm },
  reportBtn: { borderWidth: 1, borderColor: colors.coral, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8 },
  reportBtnText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.coral },
  compareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginTop: spacing.lg,
  },
  compareBtnActive: { backgroundColor: colors.pink, borderColor: colors.pink },
  compareText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.textPrimary },
  visitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  visitText: { fontFamily: fonts.bodySemi, fontSize: 14 },
});
