import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { ArrowLeft, Search, BookOpen, HelpCircle, Target, Users, Sparkles, ChevronRight, Shield, Copy, Check } from "lucide-react-native";
import { fonts, radius, spacing } from "../src/theme";
import { useTheme } from "../src/theme-context";
import { api } from "../src/api";

type Tab = "glossary" | "faq" | "use-cases" | "personas" | "quiz" | "first-prompt";

export default function LearnHub() {
  const router = useRouter();
  const { colors } = useTheme();
  const [tab, setTab] = useState<Tab>("first-prompt");

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "first-prompt", label: "1. Premier prompt", icon: Sparkles },
    { id: "quiz", label: "2. Quiz niveau", icon: Sparkles },
    { id: "use-cases", label: "3. Cas concrets", icon: Target },
    { id: "personas", label: "4. Ton profil", icon: Users },
    { id: "glossary", label: "5. Glossaire", icon: BookOpen },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.borderSubtle }]} testID="learn-back">
          <ArrowLeft size={18} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[styles.brand, { color: colors.textSecondary }]}>APPRENDRE L'IA</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.pathHero, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}> 
        <Text style={[styles.pathKicker, { color: colors.coral }]}>PARCOURS DÉBUTANT · 10 MIN</Text>
        <Text style={[styles.pathTitle, { color: colors.textPrimary }]}>Apprendre l’IA sans jargon, en testant.</Text>
        <Text style={[styles.pathText, { color: colors.textSecondary }]}>D’abord tu crées un vrai prompt, puis tu découvres ton niveau, ensuite tu choisis les bons outils pour un cas concret. Le glossaire sert quand un mot bloque — pas comme point de départ.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {TABS.map((t) => {
          const I = t.icon;
          const active = tab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              onPress={() => setTab(t.id)}
              style={[
                styles.tab,
                { backgroundColor: active ? colors.coral : colors.surface, borderColor: active ? colors.coral : colors.borderSubtle },
              ]}
              testID={`learn-tab-${t.id}`}
            >
              <I size={14} color={active ? "#fff" : colors.textPrimary} strokeWidth={2.5} />
              <Text style={[styles.tabText, { color: active ? "#fff" : colors.textPrimary }]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {tab === "glossary" ? <Glossary /> : null}
      {tab === "faq" ? <FAQ /> : null}
      {tab === "use-cases" ? <UseCases /> : null}
      {tab === "personas" ? <Personas /> : null}
      {tab === "quiz" ? <QuizPanel /> : null}
      {tab === "first-prompt" ? <FirstPrompt /> : null}
    </SafeAreaView>
  );
}

function Glossary() {
  const { colors } = useTheme();
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => { api.listGlossary().then(setItems).catch(() => {}); }, []);
  const filtered = q.trim() ? items.filter((x) => (x.term + " " + x.short).toLowerCase().includes(q.toLowerCase())) : items;
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>30 mots de l'IA expliqués simplement</Text>
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
        <Search size={16} color={colors.textSecondary} strokeWidth={2} />
        <TextInput value={q} onChangeText={setQ} placeholder="Rechercher un terme…" placeholderTextColor={colors.textSecondary} style={[styles.searchInput, { color: colors.textPrimary }]} />
      </View>
      {filtered.map((g) => (
        <View key={g.term} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} testID={`glossary-${g.term}`}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{g.emoji} {g.term}</Text>
          <Text style={[styles.cardShort, { color: colors.textPrimary }]}>{g.short}</Text>
          <Text style={[styles.cardLong, { color: colors.textSecondary }]}>{g.long}</Text>
          {g.example ? (
            <View style={[styles.exampleBox, { backgroundColor: colors.bg, borderColor: colors.coral }]}>
              <Text style={[styles.exampleLabel, { color: colors.coral }]}>EXEMPLE</Text>
              <Text style={[styles.exampleText, { color: colors.textPrimary }]}>{g.example}</Text>
            </View>
          ) : null}
        </View>
      ))}
      {filtered.length === 0 ? <Text style={[styles.empty, { color: colors.textSecondary }]}>Aucun résultat</Text> : null}
    </ScrollView>
  );
}

function FAQ() {
  const { colors } = useTheme();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState<number | null>(0);
  useEffect(() => { api.listFaq().then(setItems).catch(() => {}); }, []);
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>15 questions que tout le monde se pose</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Réponses honnêtes, sans langue de bois.</Text>
      {items.map((f, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setOpen(open === i ? null : i)}
          style={[styles.faqCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
          testID={`faq-${i}`}
        >
          <Text style={[styles.faqQ, { color: colors.textPrimary }]}>{f.q}</Text>
          {open === i ? <Text style={[styles.faqA, { color: colors.textSecondary }]}>{f.a}</Text> : null}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function UseCases() {
  const router = useRouter();
  const { colors } = useTheme();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api.listUseCases().then(setItems).catch(() => {}); }, []);
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Tu veux faire quoi exactement ?</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Clique sur ton besoin : IA Match te donne les 3 meilleures IA pour ce cas précis, avec une raison claire.</Text>
      {items.map((uc) => (
        <View key={uc.id} style={[styles.ucCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} testID={`uc-${uc.id}`}>
          <Text style={[styles.ucTitle, { color: colors.textPrimary }]}>{uc.icon} {uc.title}</Text>
          <Text style={[styles.ucSummary, { color: colors.textSecondary }]}>{uc.summary}</Text>
          <View style={styles.ucTools}>
            {uc.tools_resolved.map((t: any) => (
              <TouchableOpacity
                key={t.slug}
                onPress={() => router.push(`/tool/${t.slug}`)}
                style={[styles.ucToolPill, { backgroundColor: t.color || colors.coral }]}
              >
                <Text style={styles.ucToolText}>{t.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.tipBox, { borderColor: colors.coral }]}>
            <Text style={[styles.tipLabel, { color: colors.coral }]}>💡 ASTUCE</Text>
            <Text style={[styles.tipText, { color: colors.textPrimary }]}>{uc.tip}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function Personas() {
  const router = useRouter();
  const { colors } = useTheme();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api.listPersonas().then(setItems).catch(() => {}); }, []);
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Trouve les IA faites pour toi</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sélection curatée selon ton profil.</Text>
      {items.map((p) => (
        <View key={p.id} style={[styles.ucCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} testID={`persona-${p.id}`}>
          <Text style={[styles.ucTitle, { color: colors.textPrimary }]}>{p.emoji} {p.label}</Text>
          <Text style={[styles.ucSummary, { color: colors.textSecondary }]}>{p.summary}</Text>
          <View style={styles.ucTools}>
            {p.tools_resolved.map((t: any) => (
              <TouchableOpacity
                key={t.slug}
                onPress={() => router.push(`/tool/${t.slug}`)}
                style={[styles.ucToolPill, { backgroundColor: t.color || colors.coral }]}
              >
                <Text style={styles.ucToolText}>{t.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {p.tips.map((tip: string, i: number) => (
            <Text key={i} style={[styles.persoTip, { color: colors.textSecondary }]}>• {tip}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

function QuizPanel() {
  const { colors } = useTheme();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { api.listQuiz().then(setQuestions).catch(() => {}); }, []);
  const submit = async () => {
    setLoading(true);
    try {
      const r = await api.scoreQuiz(answers);
      setResult(r);
    } catch {}
    setLoading(false);
  };
  if (result) {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Ton niveau : <Text style={{ color: result.color }}>{result.emoji} {result.level}</Text></Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{result.description}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle, marginTop: spacing.md }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Score : {result.total} / {result.max}</Text>
          <View style={[{ height: 8, borderRadius: 4, backgroundColor: colors.borderSubtle, marginTop: 8, overflow: "hidden" }]}>
            <View style={{ height: "100%", width: `${(result.total / result.max) * 100}%`, backgroundColor: result.color }} />
          </View>
        </View>
        <TouchableOpacity onPress={() => { setResult(null); setAnswers([]); }} style={[styles.cta, { backgroundColor: colors.coral, marginTop: spacing.lg }]}>
          <Text style={styles.ctaText}>Refaire le quiz</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Quel est ton niveau IA ?</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>8 questions • 3 minutes • Réponses honnêtes svp.</Text>
      {questions.map((q, qi) => (
        <View key={q.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} testID={`quiz-${q.id}`}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{qi + 1}. {q.question}</Text>
          {q.options.map((opt: any, oi: number) => {
            const sel = answers[qi] === oi;
            return (
              <TouchableOpacity
                key={oi}
                onPress={() => {
                  const next = [...answers];
                  next[qi] = oi;
                  setAnswers(next);
                }}
                style={[styles.qOpt, { borderColor: sel ? colors.coral : colors.borderSubtle, backgroundColor: sel ? colors.coralSoft : "transparent" }]}
              >
                <Text style={[styles.qOptText, { color: sel ? colors.coral : colors.textPrimary }]}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      <TouchableOpacity
        onPress={submit}
        disabled={answers.length < questions.length || loading}
        style={[styles.cta, { backgroundColor: colors.coral }, (answers.length < questions.length || loading) && { opacity: 0.4 }]}
        testID="quiz-submit"
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Voir mon niveau</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

function FirstPrompt() {
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState("");
  const [role, setRole] = useState("");
  const [format, setFormat] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const finalPrompt = `${role ? "Tu es " + role + ".\n" : ""}${need}${format ? "\n\nFormat attendu : " + format : ""}`;
  const copyPrompt = async () => {
    if (!finalPrompt.trim()) return;
    try { await Clipboard.setStringAsync(finalPrompt); } catch {}
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1500);
  };

  const STEPS = [
    {
      title: "Étape 1 — Ton besoin en 1 phrase",
      hint: "Dis simplement ce que tu veux. Pas besoin d'être expert en IA — réponds comme à un humain.",
      placeholder: "Ex : Aide-moi à écrire un email professionnel pour relancer un client.",
      value: need,
      set: setNeed,
    },
    {
      title: "Étape 2 — Donne-lui un rôle (facultatif mais magique)",
      hint: "Précise « tu es expert en X » : la qualité monte instantanément.",
      placeholder: "Ex : un expert en commerce B2B avec 15 ans d'expérience",
      value: role,
      set: setRole,
    },
    {
      title: "Étape 3 — Le format de la réponse",
      hint: "Précise la longueur, le style, le format. L'IA suit ton brief comme un assistant.",
      placeholder: "Ex : Email court, ton aimable mais ferme, max 80 mots, signature « Cordialement, Sarah »",
      value: format,
      set: setFormat,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Text style={[styles.title, { color: colors.textPrimary }]}>Mon tout premier prompt</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        On t'accompagne main dans la main. À la fin, tu auras un prompt prêt à coller dans ChatGPT, Mistral, Claude, Gemini ou n'importe quelle IA.
      </Text>

      {STEPS.map((s, i) => (
        <View
          key={i}
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: i === step ? colors.coral : colors.borderSubtle, borderWidth: i === step ? 2 : 1 },
          ]}
          testID={`first-step-${i}`}
        >
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{s.title}</Text>
          <Text style={[styles.cardLong, { color: colors.textSecondary, marginTop: 4 }]}>{s.hint}</Text>
          <TextInput
            value={s.value}
            onChangeText={s.set}
            onFocus={() => setStep(i)}
            placeholder={s.placeholder}
            placeholderTextColor={colors.textSecondary}
            multiline
            style={[styles.fieldInput, { color: colors.textPrimary, borderColor: colors.borderSubtle, backgroundColor: colors.bg }]}
          />
        </View>
      ))}

      <View style={[styles.previewCard, { backgroundColor: colors.coralSoft, borderColor: colors.coral }]}>
        <Text style={[styles.previewLabel, { color: colors.coral }]}>✨ TON PROMPT FINAL</Text>
        <Text style={[styles.previewText, { color: colors.textPrimary }]}>
          {finalPrompt || "Remplis les étapes ci-dessus pour voir ton prompt apparaître ici…"}
        </Text>
        <TouchableOpacity
          onPress={copyPrompt}
          disabled={!finalPrompt.trim()}
          style={[styles.copyPromptBtn, { backgroundColor: colors.coral }, !finalPrompt.trim() && { opacity: 0.45 }]}
          testID="first-prompt-copy"
        >
          {copiedPrompt ? <Check size={15} color="#fff" strokeWidth={2.5} /> : <Copy size={15} color="#fff" strokeWidth={2.5} />}
          <Text style={styles.copyPromptText}>{copiedPrompt ? "Prompt copié" : "Copier le prompt"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.providerBlock}>
        <Text style={[styles.providerTitle, { color: colors.textPrimary }]}>Où tester ton prompt ?</Text>
        <Text style={[styles.providerSub, { color: colors.textSecondary }]}>Commence par un assistant généraliste connu. Les boutons ouvrent les sites officiels.</Text>
        <View style={styles.providerGrid}>
          <TouchableOpacity onPress={() => Linking.openURL("https://chatgpt.com")} style={[styles.providerBtn, { backgroundColor: "#10A37F" }]}>
            <Text style={styles.providerName}>ChatGPT</Text>
            <Text style={styles.providerMeta}>GPT · simple pour débuter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://chat.mistral.ai")} style={[styles.providerBtn, { backgroundColor: "#FA520F" }]}>
            <Text style={styles.providerName}>Mistral</Text>
            <Text style={styles.providerMeta}>Le Chat · acteur européen 🇪🇺</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://claude.ai")} style={[styles.providerBtn, { backgroundColor: "#CC785C" }]}>
            <Text style={styles.providerName}>Claude</Text>
            <Text style={styles.providerMeta}>Très bon pour écrire</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://gemini.google.com")} style={[styles.providerBtn, { backgroundColor: "#4285F4" }]}>
            <Text style={styles.providerName}>Gemini</Text>
            <Text style={styles.providerMeta}>Google · multimodal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  brand: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 4 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  tabs: { paddingHorizontal: spacing.lg, gap: 8, paddingBottom: spacing.sm },
  pathHero: { marginHorizontal: spacing.lg, marginBottom: spacing.sm, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1 },
  pathKicker: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: 6 },
  pathTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 29, letterSpacing: -0.4 },
  pathText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, marginTop: 6 },
  tab: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  tabText: { fontFamily: fonts.bodySemi, fontSize: 12 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 32, letterSpacing: -0.5, marginBottom: spacing.sm },
  subtitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: radius.md, borderWidth: 1, marginBottom: spacing.md },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 14, outlineWidth: 0 } as any,
  card: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: spacing.sm },
  cardTitle: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 22 },
  cardShort: { fontFamily: fonts.bodySemi, fontSize: 14, marginTop: 6 },
  cardLong: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 4 },
  exampleBox: { padding: 10, borderRadius: radius.md, marginTop: 8, borderLeftWidth: 3 },
  exampleLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: 2 },
  exampleText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, fontStyle: "italic" },
  empty: { textAlign: "center", marginTop: spacing.xl, fontFamily: fonts.body, fontSize: 13 },
  faqCard: { padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1 },
  faqQ: { fontFamily: fonts.bodyBold, fontSize: 14, lineHeight: 19 },
  faqA: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, marginTop: 8 },
  ucCard: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: spacing.md },
  ucTitle: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 24 },
  ucSummary: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, marginTop: 4 },
  ucTools: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: spacing.sm },
  ucToolPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  ucToolText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 11 },
  tipBox: { padding: 10, borderRadius: radius.md, marginTop: spacing.sm, borderLeftWidth: 3 },
  tipLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: 2 },
  tipText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
  persoTip: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 4 },
  qOpt: { padding: 12, borderRadius: radius.md, borderWidth: 1.5, marginTop: 6 },
  qOptText: { fontFamily: fonts.bodyMd, fontSize: 13 },
  cta: { padding: 14, borderRadius: radius.pill, alignItems: "center", marginTop: spacing.md },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  fieldInput: { padding: 12, borderRadius: radius.md, borderWidth: 1, marginTop: spacing.sm, fontFamily: fonts.body, fontSize: 13, minHeight: 60, textAlignVertical: "top", outlineWidth: 0 } as any,
  previewCard: { padding: spacing.md, borderRadius: radius.lg, borderWidth: 1.5, marginVertical: spacing.md },
  previewLabel: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 },
  previewText: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  copyPromptBtn: { marginTop: spacing.sm, borderRadius: radius.pill, paddingVertical: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  copyPromptText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 13 },
  providerBlock: { marginTop: spacing.sm },
  providerTitle: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 24, marginBottom: 4 },
  providerSub: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginBottom: spacing.sm },
  providerGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  providerBtn: { width: "48%", minWidth: 142, borderRadius: radius.lg, padding: spacing.md },
  providerName: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 15 },
  providerMeta: { color: "rgba(255,255,255,0.84)", fontFamily: fonts.body, fontSize: 11, lineHeight: 15, marginTop: 4 },
});
