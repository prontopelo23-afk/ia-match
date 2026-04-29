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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { Sparkles, Copy, Check, RotateCcw } from "lucide-react-native";
import { colors, fonts, radius, spacing } from "../../src/theme";

type Field = { key: string; label: string; placeholder: string; multiline?: boolean };

const FIELDS: Field[] = [
  { key: "role", label: "RÔLE", placeholder: "Tu es un copywriter senior B2B." },
  { key: "objective", label: "OBJECTIF", placeholder: "Rédiger une landing page de 250 mots." },
  { key: "audience", label: "AUDIENCE", placeholder: "Entrepreneurs non techniques." },
  { key: "context", label: "CONTEXTE", placeholder: "Mon produit IA Match aide à choisir l'IA idéale.", multiline: true },
  { key: "constraints", label: "CONTRAINTES", placeholder: "Ton sobre, 0 superlatif, max 250 mots.", multiline: true },
  { key: "format", label: "FORMAT", placeholder: "1 hero + 3 puces + CTA." },
  { key: "criteria", label: "CRITÈRES DE QUALITÉ", placeholder: "Donne envie d'essayer, mesurable." },
];

export default function BuilderScreen() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => {
    const lines: string[] = [];
    for (const f of FIELDS) {
      const v = (values[f.key] || "").trim();
      if (v) lines.push(`${f.label}: ${v}`);
    }
    return lines.join("\n");
  }, [values]);

  const copy = async () => {
    if (!prompt) return;
    try {
      await Clipboard.setStringAsync(prompt);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => setValues({});
  const filled = Object.values(values).filter((v) => v.trim()).length;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.crumb}>Workspace · Builder</Text>
          <Text style={styles.eyebrow}>PROMPT BUILDER · 7 BLOCS</Text>
          <Text style={styles.title}>
            Construis un <Text style={styles.titleAccent}>prompt</Text> qui livre.
          </Text>
          <Text style={styles.subtitle}>
            Remplis les blocs essentiels. Le prompt s'assemble en direct.
          </Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(filled / FIELDS.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {filled} / {FIELDS.length} blocs renseignés
          </Text>

          {FIELDS.map((f) => (
            <View key={f.key} style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <TextInput
                value={values[f.key] || ""}
                onChangeText={(v) => setValues((s) => ({ ...s, [f.key]: v }))}
                placeholder={f.placeholder}
                placeholderTextColor="rgba(253,251,247,0.3)"
                multiline={f.multiline}
                style={[styles.input, f.multiline && { minHeight: 70, textAlignVertical: "top" }]}
                testID={`builder-field-${f.key}`}
              />
            </View>
          ))}

          {/* Live preview */}
          <View style={styles.previewBlock}>
            <View style={styles.previewHeader}>
              <Sparkles size={14} color={colors.coral} strokeWidth={2.5} />
              <Text style={styles.previewLabel}>PROMPT GÉNÉRÉ</Text>
            </View>
            <Text style={styles.previewText} testID="builder-preview">
              {prompt || "Remplis au moins un bloc pour voir ton prompt apparaître."}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={copy}
              disabled={!prompt}
              style={[styles.copyBtn, !prompt && { opacity: 0.4 }]}
              testID="builder-copy"
            >
              {copied ? (
                <Check size={16} color="#fff" strokeWidth={2.5} />
              ) : (
                <Copy size={16} color="#fff" strokeWidth={2.5} />
              )}
              <Text style={styles.copyText}>{copied ? "Copié !" : "Copier le prompt"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={reset} style={styles.resetBtn} testID="builder-reset">
              <RotateCcw size={16} color="rgba(253,251,247,0.7)" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.darkCard },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  crumb: { fontFamily: fonts.body, fontSize: 12, color: "rgba(253,251,247,0.5)", marginBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, color: colors.coral, marginBottom: spacing.sm },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    lineHeight: 42,
    color: colors.textInverse,
    letterSpacing: -1,
  },
  titleAccent: { color: colors.coral, fontStyle: "italic" },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: "rgba(253,251,247,0.7)", marginTop: spacing.sm },

  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: spacing.lg,
  },
  progressFill: { height: "100%", backgroundColor: colors.coral },
  progressText: {
    fontFamily: fonts.bodyMd,
    fontSize: 11,
    color: "rgba(253,251,247,0.5)",
    marginTop: 6,
    marginBottom: spacing.lg,
  },

  fieldBlock: { marginBottom: spacing.md },
  fieldLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.coral,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0A0D14",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textInverse,
    fontFamily: fonts.body,
    fontSize: 14,
    outlineWidth: 0,
  } as any,

  previewBlock: {
    backgroundColor: "#0A0D14",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,90,69,0.2)",
  },
  previewHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.sm },
  previewLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, color: colors.coral },
  previewText: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textInverse,
    minHeight: 50,
  },

  actionRow: { flexDirection: "row", gap: 8, marginTop: spacing.md },
  copyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.coral,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  copyText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  resetBtn: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});
