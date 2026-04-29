import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowRight, X, Zap, Target, DollarSign, Sparkles } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../src/theme";
import { api, MatchResult, history } from "../src/api";
import ToolCard from "../src/components/ToolCard";

type Priority = "balanced" | "speed" | "accuracy" | "price";

const SUGGESTIONS = [
  "Faire un CV percutant",
  "Résumer un long PDF",
  "Coder une application web",
  "Créer un visuel Instagram",
  "Transcrire une réunion",
  "Traduire un email pro",
];

export default function MatchWizard() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [need, setNeed] = useState("");
  const [priority, setPriority] = useState<Priority>("balanced");
  const [freeOnly, setFreeOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);

  const submit = async () => {
    if (!need.trim()) return;
    setLoading(true);
    try {
      const res = await api.match(need.trim(), priority, freeOnly, "fr");
      setResults(res);
      await history.push({ need: need.trim(), priority, createdAt: Date.now() });
      setStep(2);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const priorities: { key: Priority; label: string; icon: React.ReactNode }[] = [
    { key: "balanced", label: "Équilibré", icon: <Sparkles size={18} color={colors.textPrimary} /> },
    { key: "speed", label: "Rapidité", icon: <Zap size={18} color={colors.textPrimary} /> },
    { key: "accuracy", label: "Précision", icon: <Target size={18} color={colors.textPrimary} /> },
    { key: "price", label: "Économique", icon: <DollarSign size={18} color={colors.textPrimary} /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>IA MATCH</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} testID="match-close">
          <X size={20} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {step === 0 && (
            <View>
              <Text style={styles.stepLabel}>ÉTAPE 1 / 3</Text>
              <Text style={styles.stepTitle}>
                Quel est{"\n"}<Text style={{ fontStyle: "italic", color: colors.pink }}>ton besoin</Text> ?
              </Text>
              <Text style={styles.stepSub}>Décris-le naturellement. On s'occupe du reste.</Text>

              <TextInput
                value={need}
                onChangeText={setNeed}
                placeholder="ex. Rédiger un CV percutant"
                placeholderTextColor={colors.textSecondary}
                style={styles.bigInput}
                multiline
                testID="match-need-input"
              />

              <Text style={styles.suggestionsLabel}>Inspiration</Text>
              <View style={styles.suggestRow}>
                {SUGGESTIONS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={styles.suggestChip}
                    onPress={() => setNeed(s)}
                    testID={`suggest-${s.slice(0, 10)}`}
                  >
                    <Text style={styles.suggestText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.cta, !need.trim() && styles.ctaDisabled]}
                disabled={!need.trim()}
                onPress={() => setStep(1)}
                testID="match-step-next-1"
              >
                <Text style={styles.ctaText}>Continuer</Text>
                <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={styles.stepLabel}>ÉTAPE 2 / 3</Text>
              <Text style={styles.stepTitle}>
                Ta{" "}
                <Text style={{ fontStyle: "italic", color: colors.pink }}>priorité</Text> ?
              </Text>
              <Text style={styles.stepSub}>Pour ajuster les recommandations.</Text>

              <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
                {priorities.map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    onPress={() => setPriority(p.key)}
                    style={[styles.priorityRow, priority === p.key && styles.priorityRowActive]}
                    testID={`priority-${p.key}`}
                  >
                    {p.icon}
                    <Text style={[styles.priorityText, priority === p.key && { color: colors.pink }]}>
                      {p.label}
                    </Text>
                    <View style={[styles.radio, priority === p.key && styles.radioActive]} />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => setFreeOnly((v) => !v)}
                style={[styles.freeRow, freeOnly && styles.freeRowActive]}
                testID="match-free-only"
              >
                <Text style={[styles.freeRowText, freeOnly && { color: colors.pink }]}>
                  Uniquement les IA gratuites
                </Text>
                <View style={[styles.radio, freeOnly && styles.radioActive]} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.cta} onPress={submit} testID="match-submit">
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.ctaText}>Trouver mon IA</Text>
                    <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.stepLabel}>RÉSULTATS</Text>
              <Text style={styles.stepTitle}>
                Tes{" "}
                <Text style={{ fontStyle: "italic", color: colors.pink }}>matchs</Text>
              </Text>
              <Text style={styles.stepSub}>"{need}"</Text>

              <View style={{ marginTop: spacing.lg }}>
                {results.length === 0 ? (
                  <Text style={styles.empty}>Aucun match. Reformule ton besoin.</Text>
                ) : (
                  results.map((r) => (
                    <View key={r.tool.slug}>
                      <ToolCard tool={r.tool} matchScore={r.matchScore} testID={`match-result-${r.tool.slug}`} />
                      <View style={styles.reasonsBox}>
                        {r.reasons.slice(0, 2).map((reason, i) => (
                          <Text key={i} style={styles.reasonText}>· {reason}</Text>
                        ))}
                      </View>
                    </View>
                  ))
                )}
              </View>

              <TouchableOpacity style={styles.ctaSecondary} onPress={() => setStep(0)} testID="match-restart">
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  brand: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 4, color: colors.textPrimary },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.md },
  stepLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.pink,
    marginBottom: 8,
  },
  stepTitle: {
    fontFamily: fonts.serif,
    fontSize: 40,
    color: colors.textPrimary,
    lineHeight: 44,
    letterSpacing: -1,
  },
  stepSub: { fontFamily: fonts.body, fontSize: 16, color: colors.textSecondary, marginTop: 8 },
  bigInput: {
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    minHeight: 120,
    textAlignVertical: "top",
    marginTop: spacing.lg,
    ...shadow.soft,
  },
  suggestionsLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  suggestRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  suggestText: { fontFamily: fonts.bodyMd, fontSize: 13, color: colors.textPrimary },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.coral,
    paddingVertical: 18,
    borderRadius: radius.pill,
    marginTop: spacing.xl,
  },
  ctaDisabled: { backgroundColor: "rgba(255, 90, 69, 0.4)" },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 16 },
  ctaSecondary: {
    paddingVertical: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  ctaSecondaryText: { fontFamily: fonts.bodySemi, color: colors.textPrimary, fontSize: 15 },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  priorityRowActive: { borderColor: colors.pink, backgroundColor: colors.pinkSoft },
  priorityText: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 16, color: colors.textPrimary },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderSubtle,
  },
  radioActive: { borderColor: colors.pink, backgroundColor: colors.pink },
  freeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  freeRowActive: { borderColor: colors.pink, backgroundColor: colors.pinkSoft },
  freeRowText: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 15, color: colors.textPrimary },
  reasonsBox: {
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.pinkSoft,
    borderRadius: radius.md,
  },
  reasonText: { fontFamily: fonts.bodyMd, fontSize: 12, color: colors.pink, lineHeight: 18 },
  empty: { fontFamily: fonts.body, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xl },
});
