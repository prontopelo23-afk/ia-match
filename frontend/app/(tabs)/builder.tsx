import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { Sparkles, Copy, Check, RotateCcw, Play } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme, usePremium } from "../../src/theme-context";
import { api } from "../../src/api";
import PremiumGate from "../../src/components/PremiumGate";

type Field = { key: string; label: string; placeholder: string; multiline?: boolean };
const FIELDS: Field[] = [
  { key: "role", label: "RÔLE", placeholder: "Tu es un copywriter senior B2B." },
  { key: "objective", label: "OBJECTIF", placeholder: "Rédiger une landing page de 250 mots." },
  { key: "audience", label: "AUDIENCE", placeholder: "Entrepreneurs non techniques." },
  { key: "context", label: "CONTEXTE", placeholder: "Mon produit IA Match aide à choisir l'IA idéale.", multiline: true },
  { key: "constraints", label: "CONTRAINTES", placeholder: "Ton sobre, 0 superlatif, max 250 mots.", multiline: true },
  { key: "format", label: "FORMAT", placeholder: "1 hero + 3 puces + CTA." },
  { key: "criteria", label: "CRITÈRES DE RÉUSSITE", placeholder: "Donne envie d'essayer en 5 secondes." },
];

export default function BuilderScreen() {
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prompt = useMemo(() => {
    const lines: string[] = [];
    for (const f of FIELDS) {
      const v = (values[f.key] || "").trim();
      if (v) lines.push(`${f.label}: ${v}`);
    }
    return lines.join("\n");
  }, [values]);

  const filled = Object.values(values).filter((v) => v.trim()).length;

  if (!isPremium) {
    return (
      <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.bg }]} edges={["top"]}>
        <PremiumGate
          feature="Builder"
          description="Compose ton prompt parfait avec un canvas guidé en 7 blocs et lance-le directement sur Claude Haiku 4.5 pour obtenir un vrai résultat."
          benefits={[
            "Constructeur de prompt en 7 blocs structurés",
            "Génération en direct via Claude Haiku 4.5",
            "Copier le prompt assemblé en un clic",
            "Accès à l'Academy et au Comparateur",
          ]}
        />
      </SafeAreaView>
    );
  }

  const copy = async () => {
    if (!prompt) return;
    try { await Clipboard.setStringAsync(prompt); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const reset = () => { setValues({}); setOutput(null); setError(null); };
  const run = async () => {
    if (!prompt) return;
    setRunning(true); setError(null); setOutput(null);
    try {
      const r = await api.builderRun(prompt);
      setOutput(r.output);
    } catch (e: any) {
      setError("Erreur lors de l'exécution. Réessaye dans un instant.");
    } finally { setRunning(false); }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.crumb, { color: colors.textSecondary }]}>Workspace · Builder</Text>
          <Text style={[styles.eyebrow, { color: colors.coral }]}>PROMPT BUILDER · 7 BLOCS</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Construis un <Text style={[styles.titleAccent, { color: colors.coral }]}>prompt</Text> qui livre.
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Remplis les blocs essentiels. Lance le prompt sur Claude Haiku 4.5 et obtiens un vrai résultat.
          </Text>

          <View style={[styles.progressBar, { backgroundColor: colors.borderSubtle }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.coral, width: `${(filled / FIELDS.length) * 100}%` }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {filled} / {FIELDS.length} blocs renseignés
          </Text>

          {FIELDS.map((f) => (
            <View key={f.key} style={styles.fieldBlock}>
              <Text style={[styles.fieldLabel, { color: colors.coral }]}>{f.label}</Text>
              <TextInput
                value={values[f.key] || ""}
                onChangeText={(v) => setValues((s) => ({ ...s, [f.key]: v }))}
                placeholder={f.placeholder}
                placeholderTextColor={colors.textSecondary}
                multiline={f.multiline}
                style={[
                  styles.input,
                  { backgroundColor: colors.surface, borderColor: colors.borderSubtle, color: colors.textPrimary },
                  f.multiline && { minHeight: 70, textAlignVertical: "top" },
                ]}
                testID={`builder-field-${f.key}`}
              />
            </View>
          ))}

          <View style={[styles.previewBlock, { backgroundColor: colors.surface, borderColor: colors.coral }]}>
            <View style={styles.previewHeader}>
              <Sparkles size={14} color={colors.coral} strokeWidth={2.5} />
              <Text style={[styles.previewLabel, { color: colors.coral }]}>PROMPT GÉNÉRÉ</Text>
            </View>
            <Text style={[styles.previewText, { color: colors.textPrimary }]} testID="builder-preview">
              {prompt || "Remplis au moins un bloc pour voir ton prompt apparaître."}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={run}
              disabled={!prompt || running}
              style={[styles.runBtn, { backgroundColor: colors.coral }, (!prompt || running) && { opacity: 0.4 }]}
              testID="builder-run"
            >
              {running ? <ActivityIndicator color="#fff" /> : <Play size={16} color="#fff" strokeWidth={2.5} />}
              <Text style={styles.runText}>{running ? "Exécution..." : "Lancer sur Claude"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={copy}
              disabled={!prompt}
              style={[
                styles.copyBtn,
                { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
                !prompt && { opacity: 0.4 },
              ]}
              testID="builder-copy"
            >
              {copied ? <Check size={16} color={colors.success} strokeWidth={2.5} /> : <Copy size={16} color={colors.textPrimary} strokeWidth={2} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={reset}
              style={[styles.resetBtn, { borderColor: colors.borderSubtle }]}
              testID="builder-reset"
            >
              <RotateCcw size={16} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={[styles.outputBlock, { backgroundColor: colors.surface, borderColor: colors.error }]}>
              <Text style={[styles.outputLabel, { color: colors.error }]}>ERREUR</Text>
              <Text style={[styles.outputText, { color: colors.textPrimary }]}>{error}</Text>
            </View>
          ) : null}

          {output ? (
            <View
              style={[styles.outputBlock, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
              testID="builder-output"
            >
              <Text style={[styles.outputLabel, { color: colors.coral }]}>RÉPONSE · CLAUDE HAIKU 4.5</Text>
              <Text style={[styles.outputText, { color: colors.textPrimary }]}>{output}</Text>
            </View>
          ) : null}

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  crumb: { fontFamily: fonts.body, fontSize: 12, marginBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, letterSpacing: -1 },
  titleAccent: { fontStyle: "italic" },
  subtitle: { fontFamily: fonts.body, fontSize: 14, marginTop: spacing.sm },
  progressBar: { height: 4, borderRadius: 2, overflow: "hidden", marginTop: spacing.lg },
  progressFill: { height: "100%" },
  progressText: { fontFamily: fonts.bodyMd, fontSize: 11, marginTop: 6, marginBottom: spacing.lg },
  fieldBlock: { marginBottom: spacing.md },
  fieldLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: 6 },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    outlineWidth: 0,
  } as any,
  previewBlock: { borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, borderWidth: 1.5 },
  previewHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.sm },
  previewLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  previewText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, minHeight: 50 },
  actionRow: { flexDirection: "row", gap: 8, marginTop: spacing.md, alignItems: "stretch" },
  runBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 14, borderRadius: radius.pill,
  },
  runText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  copyBtn: {
    width: 50, height: 50, alignItems: "center", justifyContent: "center", borderRadius: radius.pill, borderWidth: 1,
  },
  resetBtn: {
    width: 50, height: 50, alignItems: "center", justifyContent: "center", borderRadius: radius.pill, borderWidth: 1,
  },
  outputBlock: { borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md, borderWidth: 1 },
  outputLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: spacing.sm },
  outputText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22 },
});
