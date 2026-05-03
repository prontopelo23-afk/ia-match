import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { Sparkles, Copy, Check, RotateCcw, Play, Clock, Trash2, ChevronDown, ChevronUp, Wand2, Shuffle } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme, usePremium } from "../../src/theme-context";
import { api, builderHistory, BuilderHistoryItem, BuilderPreset, ModelRankings } from "../../src/api";
import PremiumGate from "../../src/components/PremiumGate";
import { ScoreGauge, WorkflowMap } from "../../src/components/VisualExplainers";

type Field = { key: string; label: string; placeholder: string; help: string; multiline?: boolean };
const FIELDS: Field[] = [
  { key: "role", label: "1. Qui doit répondre ?", placeholder: "Ex : un prof patient, un expert marketing, un développeur senior…", help: "Donne un rôle à l’IA pour orienter son style." },
  { key: "objective", label: "2. Je veux obtenir quoi ?", placeholder: "Ex : un post LinkedIn, un résumé, un plan, du code, une image…", help: "C’est la demande principale. Une phrase simple suffit." },
  { key: "audience", label: "3. Pour qui ?", placeholder: "Ex : débutants, clients, enfants, recruteurs, moi-même…", help: "L’IA adapte les mots au public." },
  { key: "context", label: "4. Contexte utile", placeholder: "Ex : mon produit aide les novices à choisir une IA. Je veux un ton clair.", help: "Ajoute les infos que l’IA ne peut pas deviner.", multiline: true },
  { key: "constraints", label: "5. Règles à respecter", placeholder: "Ex : ton simple, pas de jargon, max 200 mots, en français.", help: "Les limites évitent les réponses trop longues ou floues.", multiline: true },
  { key: "format", label: "6. Format de sortie", placeholder: "Ex : titre + 3 étapes + exemple + checklist.", help: "Dis exactement comment tu veux lire la réponse." },
  { key: "criteria", label: "7. Réussite = quoi ?", placeholder: "Ex : je dois pouvoir copier-coller directement sans modifier.", help: "Explique ce qui ferait une bonne réponse." },
];

const TARGET_MODELS = [
  { key: "chatgpt", label: "ChatGPT", tip: "Direct, structuré, avec exemples." },
  { key: "claude", label: "Claude", tip: "Contexte long, nuance, consignes détaillées." },
  { key: "gemini", label: "Gemini", tip: "Multimodal, Google, documents longs." },
  { key: "mistral", label: "Mistral", tip: "Court, efficace, très clair." },
  { key: "perplexity", label: "Perplexity", tip: "Recherche avec sources et vérification." },
];

const EXAMPLES: { title: string; values: Record<string, string> }[] = [
  { title: "Écrire un post", values: { role: "Tu es un rédacteur clair et naturel.", objective: "Écris un post LinkedIn court sur mon idée.", audience: "Des entrepreneurs débutants.", context: "Je veux expliquer une idée sans jargon.", constraints: "Ton simple, concret, pas de phrases marketing exagérées.", format: "Hook + 3 points + conclusion + question finale.", criteria: "On comprend en 10 secondes et ça donne envie de répondre." } },
  { title: "Comprendre un sujet", values: { role: "Tu es un professeur très pédagogue.", objective: "Explique-moi ce sujet simplement.", audience: "Je suis débutant complet.", context: "Je veux comprendre sans vocabulaire technique.", constraints: "Utilise des analogies et évite le jargon.", format: "Explication simple + exemple + erreurs fréquentes + mini résumé.", criteria: "Je dois pouvoir le réexpliquer à quelqu’un." } },
  { title: "Créer une image", values: { role: "Tu es directeur artistique.", objective: "Crée un prompt image détaillé.", audience: "Moi, pour générer une image IA.", context: "Je veux un rendu premium, lisible, cohérent.", constraints: "Décris sujet, style, lumière, cadrage, ambiance. Pas de texte illisible.", format: "Prompt final + negative prompt + variantes.", criteria: "Le prompt est prêt à coller dans un générateur d’image." } },
];

const RANDOM_IDEAS: { title: string; modelKey: string; values: Record<string, string> }[] = [
  { title: "Idée business en 10 minutes", modelKey: "chatgpt", values: { role: "Tu es un coach business pragmatique et honnête.", objective: "Trouve 5 idées de micro-business liées à mes compétences.", audience: "Une personne débutante qui veut tester vite sans gros budget.", context: "Je veux des idées simples, réalistes, avec une première action aujourd’hui.", constraints: "Pas de promesses irréalistes. Budget maximum 100 euros. Priorise ce qui peut être testé en 48h.", format: "Tableau : idée, client cible, promesse, première action, risque principal.", criteria: "Je dois pouvoir choisir une idée et lancer un test immédiatement." } },
  { title: "Email pro difficile", modelKey: "claude", values: { role: "Tu es un assistant de communication diplomate.", objective: "Rédige un email professionnel pour annoncer un désaccord sans créer de conflit.", audience: "Un client ou collègue pressé.", context: "Je veux rester ferme, poli et clair.", constraints: "Ton humain, pas agressif, phrases courtes, en français.", format: "Objet + email final + version plus courte.", criteria: "Le message protège la relation tout en posant une limite nette." } },
  { title: "Plan de révision", modelKey: "gemini", values: { role: "Tu es un professeur organisé et encourageant.", objective: "Crée un plan de révision sur 7 jours pour comprendre un sujet difficile.", audience: "Un débutant qui procrastine facilement.", context: "Je veux avancer sans me noyer dans trop d’informations.", constraints: "Sessions de 25 minutes maximum, exercices simples, rappel des erreurs fréquentes.", format: "Jour par jour : objectif, mini-cours, exercice, auto-vérification.", criteria: "Le plan doit être réaliste et motivant." } },
  { title: "Prompt image premium", modelKey: "mistral", values: { role: "Tu es directeur artistique spécialisé en images IA.", objective: "Transforme mon idée vague en prompt image premium.", audience: "Un créateur qui utilise Midjourney, DALL·E ou Leonardo.", context: "Je veux une image lisible, élégante et cohérente pour les réseaux sociaux.", constraints: "Décris sujet, style, lumière, cadrage, couleurs, détails importants. Évite le texte dans l’image.", format: "Prompt principal + negative prompt + 3 variantes de style.", criteria: "Je peux copier-coller le prompt et obtenir une image propre." } },
  { title: "Recherche sourcée", modelKey: "perplexity", values: { role: "Tu es un analyste qui vérifie ses sources.", objective: "Prépare une recherche courte avec sources sur un sujet récent.", audience: "Un lecteur non expert qui veut comprendre vite.", context: "Je veux distinguer les faits, les incertitudes et les opinions.", constraints: "Cite les sources, date les informations, signale ce qui est incertain.", format: "Résumé en 5 points + sources + questions à vérifier.", criteria: "Je dois pouvoir prendre une décision sans me faire piéger par une info floue." } },
];

export default function BuilderScreen() {
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const [values, setValues] = useState<Record<string, string>>({});
  const [targetModel, setTargetModel] = useState(TARGET_MODELS[0]);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hist, setHist] = useState<BuilderHistoryItem[]>([]);
  const [presets, setPresets] = useState<BuilderPreset[]>([]);
  const [modelRankings, setModelRankings] = useState<ModelRankings>({});
  const [qualityRulesCount, setQualityRulesCount] = useState(0);
  const [builderPackStats, setBuilderPackStats] = useState({ modelGuides: 0, examples: 0, safetyNotes: 0 });
  const [expandedHist, setExpandedHist] = useState<string | null>(null);
  const [showGuides, setShowGuides] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useFocusEffect(
    useCallback(() => {
      builderHistory.list().then(setHist);
      api.listBuilderPresets().then((items) => setPresets(items.slice(0, 12))).catch(() => {});
      api.getBuilderConfig().then((cfg) => {
        setQualityRulesCount(cfg.quality_rules?.length ?? 0);
        setBuilderPackStats({
          modelGuides: cfg.model_prompt_guides?.length ?? 0,
          examples: cfg.bad_to_good_examples?.length ?? 0,
          safetyNotes: cfg.safety_usage_notes?.length ?? 0,
        });
      }).catch(() => {});
      api.getModelRankings().then(setModelRankings).catch(() => {});
    }, [])
  );

  const prompt = useMemo(() => {
    const role = (values.role || "un assistant IA expert, clair et concret").trim().replace(/^tu es\s+/i, "").replace(/\.$/, "");
    const objective = (values.objective || "réaliser la tâche demandée").trim();
    const audience = (values.audience || "un utilisateur francophone").trim();
    const context = (values.context || "Aucun contexte supplémentaire fourni.").trim();
    const constraints = (values.constraints || "Réponds en français simple, sans jargon inutile, avec des étapes actionnables.").trim();
    const format = (values.format || "Réponse structurée avec titres courts, étapes, exemple et checklist finale.").trim();
    const criteria = (values.criteria || "Le résultat doit être directement copiable et utilisable.").trim();

    if (!Object.values(values).some((v) => v.trim())) return "";

    return [
      `Tu es ${role}.`,
      "",
      `Objectif : ${objective}`,
      `Public cible : ${audience}`,
      "",
      `Contexte :\n${context}`,
      "",
      `Contraintes à respecter :\n${constraints}`,
      "",
      `Format attendu :\n${format}`,
      "",
      `Critères de réussite :\n${criteria}`,
      "",
      `Optimise ta réponse pour ${targetModel.label}. ${targetModel.tip}`,
      "Si une information manque, pose maximum 3 questions avant de répondre. Sinon, produis directement le livrable final.",
    ].join("\n");
  }, [values, targetModel]);

  const filled = Object.values(values).filter((v) => v.trim()).length;
  const estimatedQuality = Math.min(100, Math.round((filled / FIELDS.length) * 70 + (values.criteria?.trim() ? 10 : 0) + (values.format?.trim() ? 10 : 0) + (qualityRulesCount ? 10 : 0)));
  const topModelHints = (modelRankings.models_general ?? []).slice(0, 4);

  const applyPreset = (preset: BuilderPreset) => {
    const steps = preset.steps?.map((s) => s.purpose).filter(Boolean).join("\n") || preset.blocks?.join(", ") || "";
    setValues({
      role: "Tu es un assistant IA expert, pédagogue et concret.",
      objective: preset.output_goal || preset.outputGoal || preset.title,
      audience: preset.audience || "tout public",
      context: steps || `Workflow IA Match : ${preset.title}`,
      constraints: preset.quality_gate || preset.quality_rules?.join("; ") || "Réponse claire, actionnable, sans jargon inutile.",
      format: "Plan étape par étape + livrable final prêt à copier + checklist de vérification.",
      criteria: "Le résultat doit être directement utilisable et respecter les règles qualité IA Match.",
    });
    setOutput(null);
    setError(null);
  };

  if (!isPremium) {
    return (
      <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.bg }]} edges={["top"]}>
        <PremiumGate
          feature="Builder"
          description="Compose ton prompt parfait avec un canvas guidé en 7 blocs et lance-le directement sur Claude Haiku 4.5 pour obtenir un vrai résultat."
          benefits={[
            "Constructeur de prompt en 7 blocs structurés",
            "Prompt adapté à ChatGPT, Claude, Gemini, Mistral ou Perplexity",
            "Historique persistant des prompts générés",
            "Accès à l'Academy et au Comparateur",
          ]}
        />
      </SafeAreaView>
    );
  }

  const copy = async (text: string) => {
    if (!text) return;
    try { await Clipboard.setStringAsync(text); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const reset = () => { setValues({}); setOutput(null); setError(null); };
  const randomizePrompt = () => {
    const idea = RANDOM_IDEAS[Math.floor(Math.random() * RANDOM_IDEAS.length)] ?? RANDOM_IDEAS[0];
    setValues(idea.values);
    setTargetModel(TARGET_MODELS.find((m) => m.key === idea.modelKey) ?? TARGET_MODELS[0]);
    setOutput(null);
    setError(null);
    setCopied(false);
  };
  const makeLocalOutput = (sourcePrompt: string) => {
    const objective = (values.objective || "ta demande").replace(/\.$/, "");
    return [
      `Voici une première réponse générée par IA Match pour : ${objective}.`,
      "",
      "1. Clarifie le résultat attendu en une phrase.",
      "2. Donne le contexte utile, même s’il te paraît évident.",
      "3. Demande un format précis pour pouvoir copier-coller la réponse.",
      "",
      "Prompt prêt à tester :",
      sourcePrompt,
    ].join("\n");
  };
  const run = async () => {
    if (!prompt) return;
    setRunning(true); setError(null); setOutput(null);
    try {
      const r = await api.builderRun(prompt);
      const generated = r.output?.trim() ? r.output.trim() : makeLocalOutput(prompt);
      setOutput(generated);
      const item: BuilderHistoryItem = {
        id: `b-${Date.now()}`,
        prompt,
        output: generated,
        model: r.model || "IA Match Demo",
        createdAt: Date.now(),
      };
      await builderHistory.push(item);
      const updated = await builderHistory.list();
      setHist(updated);
    } catch (e: any) {
      const generated = makeLocalOutput(prompt);
      setOutput(generated);
      setError("Le modèle en ligne n’a pas répondu : j’ai généré une version locale de secours ci-dessous.");
      const item: BuilderHistoryItem = {
        id: `b-${Date.now()}`,
        prompt,
        output: generated,
        model: "IA Match local",
        createdAt: Date.now(),
      };
      await builderHistory.push(item);
      setHist(await builderHistory.list());
    } finally { setRunning(false); }
  };

  const removeHist = (id: string) => {
    Alert.alert("Supprimer ce prompt ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
        await builderHistory.remove(id);
        setHist(await builderHistory.list());
      } },
    ]);
  };

  const clearHist = () => {
    Alert.alert("Effacer tout l'historique ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      { text: "Effacer", style: "destructive", onPress: async () => {
        await builderHistory.clear();
        setHist([]);
      } },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.crumb, { color: colors.textSecondary }]}>Workspace · Builder</Text>
          <Text style={[styles.eyebrow, { color: colors.coral }]}>PROMPT BUILDER · 7 BLOCS</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Fabrique une bonne demande, <Text style={[styles.titleAccent, { color: colors.coral }]}>sans savoir prompter</Text>.
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Le Builder te guide comme un jeu : choisis un exemple, remplis les cases, copie le prompt ou lance-le. Pas besoin de connaître les termes techniques.
          </Text>

          <TouchableOpacity
            onPress={randomizePrompt}
            style={[styles.randomBtn, { backgroundColor: colors.coral, shadowColor: colors.coral }]}
            testID="builder-random"
          >
            <Shuffle size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.randomText}>Générer une idée aléatoire</Text>
          </TouchableOpacity>
          <Text style={[styles.randomHint, { color: colors.textSecondary }]}>Un appui remplit les 7 blocs avec un cas concret, puis tu peux copier ou tester le prompt.</Text>

          <ToggleCard title="Guides et repères" subtitle="Logique simple, anatomie du prompt et score qualité" open={showGuides} onPress={() => setShowGuides((v) => !v)} />
          {showGuides ? (
            <>
              <View style={[styles.lessonCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }] }>
                <Wand2 size={18} color={colors.coral} strokeWidth={2.5} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.lessonTitle, { color: colors.textPrimary }]}>La logique simple</Text>
                  <Text style={[styles.lessonText, { color: colors.textSecondary }]}>Un bon prompt répond à 4 questions : qui parle, quoi faire, avec quel contexte, sous quelle forme.</Text>
                </View>
              </View>
              <WorkflowMap title="Anatomie d’un prompt solide" steps={["Rôle", "Objectif", "Contexte", "Contraintes", "Format", "Critère de réussite"]} />
              <ScoreGauge label="Qualité estimée" value={estimatedQuality} helper="Plus tu remplis de blocs, plus l’IA reçoit un brief exploitable et vérifiable." />
            </>
          ) : null}

          <Text style={[styles.miniTitle, { color: colors.textPrimary }]}>1. Pour quel assistant tu veux optimiser ?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exampleRow}>
            {TARGET_MODELS.map((m) => (
              <TouchableOpacity key={m.key} onPress={() => setTargetModel(m)} style={[styles.exampleChip, { backgroundColor: targetModel.key === m.key ? colors.coral : colors.coralSoft, borderColor: colors.coral }] }>
                <Text style={[styles.exampleText, { color: targetModel.key === m.key ? "#fff" : colors.coral }]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={[styles.modelTip, { color: colors.textSecondary }]}>{targetModel.tip}</Text>

          {topModelHints.length > 0 && showGuides ? (
            <View style={[styles.modelHintBox, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}> 
              <Text style={[styles.lessonTitle, { color: colors.textPrimary }]}>Repères modèles IA Match</Text>
              <Text style={[styles.lessonText, { color: colors.textSecondary }]}>Pour les prompts exigeants, ces modèles ressortent du pack benchmarks enrichi.</Text>
              <View style={styles.modelHintRow}>
                {topModelHints.map((m: any) => (
                  <Text key={m.id ?? m.name} style={[styles.modelHintPill, { color: colors.coral, backgroundColor: colors.coralSoft }]}>#{m.rank} {m.name}</Text>
                ))}
              </View>
            </View>
          ) : null}

          <Text style={[styles.miniTitle, { color: colors.textPrimary }]}>2. Ou pars d’un exemple</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exampleRow}>
            {EXAMPLES.map((ex) => (
              <TouchableOpacity key={ex.title} onPress={() => { setValues(ex.values); setOutput(null); setError(null); }} style={[styles.exampleChip, { backgroundColor: colors.coralSoft, borderColor: colors.coral }]}>
                <Text style={[styles.exampleText, { color: colors.coral }]}>{ex.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {presets.length > 0 ? (
            <>
              <Text style={[styles.miniTitle, { color: colors.textPrimary }]}>3. Ou choisis un workflow premium IA Match</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exampleRow}>
                {presets.map((preset) => (
                  <TouchableOpacity key={preset.id} onPress={() => applyPreset(preset)} style={[styles.presetChip, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} testID={`builder-preset-${preset.id}`}>
                    <Text style={[styles.presetTitle, { color: colors.textPrimary }]} numberOfLines={2}>{preset.title}</Text>
                    <Text style={[styles.presetMeta, { color: colors.textSecondary }]}>{preset.premium_level === "premium" || preset.premium ? "Premium" : "Guidé"}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : null}

          {showGuides ? (
              <View style={[styles.qualityBox, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }] }>
              <Text style={[styles.qualityLabel, { color: colors.textSecondary }]}>Score qualité estimé</Text>
              <Text style={[styles.qualityScore, { color: colors.coral }]}>{estimatedQuality}/100</Text>
              <Text style={[styles.qualityHint, { color: colors.textSecondary }]}>Basé sur les 7 blocs et les règles du pack Prompt Builder.</Text>
              <Text style={[styles.qualityHint, { color: colors.textSecondary }]}>Données chargées : {qualityRulesCount} règles · {builderPackStats.modelGuides} guides modèles · {builderPackStats.examples} exemples · {builderPackStats.safetyNotes} notes sécurité.</Text>
            </View>
) : null}

          <View style={[styles.progressBar, { backgroundColor: colors.borderSubtle }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.coral, width: `${(filled / FIELDS.length) * 100}%` }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {filled} / {FIELDS.length} blocs renseignés
          </Text>

          {FIELDS.map((f) => (
            <View key={f.key} style={styles.fieldBlock}>
              <Text style={[styles.fieldLabel, { color: colors.coral }]}>{f.label}</Text>
              <Text style={[styles.fieldHelp, { color: colors.textSecondary }]}>{f.help}</Text>
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
              <Text style={styles.runText}>{running ? "Exécution..." : "Tester le prompt"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => copy(prompt)}
              disabled={!prompt}
              style={[
                styles.iconActionBtn,
                { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
                !prompt && { opacity: 0.4 },
              ]}
              testID="builder-copy"
            >
              {copied ? <Check size={16} color={colors.success} strokeWidth={2.5} /> : <Copy size={16} color={colors.textPrimary} strokeWidth={2} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={reset}
              style={[styles.iconActionBtn, { borderColor: colors.borderSubtle }]}
              testID="builder-reset"
            >
              <RotateCcw size={16} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={[styles.outputBlock, { backgroundColor: colors.surface, borderColor: colors.coral }]}> 
              <Text style={[styles.outputLabel, { color: colors.coral }]}>APERÇU LOCAL · PAS BLOQUANT</Text>
              <Text style={[styles.outputText, { color: colors.textPrimary }]}>{error}</Text>
            </View>
          ) : null}

          {output ? (
            <View
              style={[styles.outputBlock, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
              testID="builder-output"
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm }}>
                <Text style={[styles.outputLabel, { color: colors.coral, marginBottom: 0 }]}>RÉPONSE · APERÇU</Text>
                <TouchableOpacity onPress={() => copy(output)} style={{ padding: 4 }}>
                  <Copy size={14} color={colors.textSecondary} strokeWidth={2} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.outputText, { color: colors.textPrimary }]}>{output}</Text>
            </View>
          ) : null}

          {/* History */}
          <TouchableOpacity onPress={() => setShowHistory((v) => !v)} style={styles.histHead}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Clock size={14} color={colors.textPrimary} strokeWidth={2.5} />
              <Text style={[styles.histTitle, { color: colors.textPrimary }]}>Historique des prompts</Text>
              <Text style={[styles.histCount, { color: colors.textSecondary }]}>· {hist.length}</Text>
            </View>
            {showHistory ? <ChevronUp size={16} color={colors.textSecondary} /> : <ChevronDown size={16} color={colors.textSecondary} />}
          </TouchableOpacity>
          {showHistory ? (
            <>
              {hist.length > 0 ? (
                <TouchableOpacity onPress={clearHist} testID="builder-clear-history" style={[styles.clearHistoryBtn, { borderColor: colors.borderSubtle }]}>
                  <Trash2 size={14} color={colors.error} strokeWidth={2} />
                  <Text style={[styles.histBtnText, { color: colors.error }]}>Effacer tout</Text>
                </TouchableOpacity>
              ) : null}
              {hist.length === 0 ? (
                <Text style={[styles.empty, { color: colors.textSecondary }]}>Tes prompts générés apparaîtront ici.</Text>
              ) : (
                hist.map((h) => {
                  const expanded = expandedHist === h.id;
                  return (
                    <View
                      key={h.id}
                      style={[styles.histCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
                      testID={`builder-hist-${h.id}`}
                    >
                      <TouchableOpacity
                        onPress={() => setExpandedHist(expanded ? null : h.id)}
                        style={styles.histHeadRow}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.histDate, { color: colors.textSecondary }]}> 
                            {new Date(h.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                          </Text>
                          <Text style={[styles.histPreview, { color: colors.textPrimary }]} numberOfLines={expanded ? undefined : 2}>
                            {h.prompt}
                          </Text>
                        </View>
                        {expanded ? <ChevronUp size={16} color={colors.textSecondary} /> : <ChevronDown size={16} color={colors.textSecondary} />}
                      </TouchableOpacity>
                      {expanded ? (
                        <View>
                          <View style={[styles.histDivider, { backgroundColor: colors.borderSubtle }]} />
                          <Text style={[styles.histLabel, { color: colors.coral }]}>RÉPONSE</Text>
                          <Text style={[styles.histOutput, { color: colors.textPrimary }]}>{h.output}</Text>
                          <View style={styles.histActions}>
                            <TouchableOpacity onPress={() => copy(h.prompt)} style={[styles.histBtn, { borderColor: colors.borderSubtle }]}>
                              <Copy size={12} color={colors.textPrimary} strokeWidth={2} />
                              <Text style={[styles.histBtnText, { color: colors.textPrimary }]}>Copier prompt</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => copy(h.output)} style={[styles.histBtn, { borderColor: colors.borderSubtle }]}>
                              <Copy size={12} color={colors.textPrimary} strokeWidth={2} />
                              <Text style={[styles.histBtnText, { color: colors.textPrimary }]}>Copier réponse</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeHist(h.id)} style={[styles.histBtn, { borderColor: colors.borderSubtle }]}>
                              <Trash2 size={12} color={colors.error} strokeWidth={2} />
                              <Text style={[styles.histBtnText, { color: colors.error }]}>Supprimer</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  );
                })
              )}
            </>
          ) : (
            <Text style={[styles.empty, { color: colors.textSecondary }]}>Replié pour garder le Builder compact. Appuie pour afficher les prompts générés.</Text>
          )}

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ToggleCard({ title, subtitle, open, onPress }: { title: string; subtitle: string; open: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.toggleCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} activeOpacity={0.85}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.toggleSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      {open ? <ChevronUp size={16} color={colors.textSecondary} /> : <ChevronDown size={16} color={colors.textSecondary} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  crumb: { fontFamily: fonts.body, fontSize: 12, marginBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, letterSpacing: -1 },
  titleAccent: { fontStyle: "italic" },
  subtitle: { fontFamily: fonts.body, fontSize: 14, marginTop: spacing.sm, lineHeight: 20 },
  randomBtn: {
    marginTop: spacing.md,
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  randomText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  randomHint: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 6 },
  toggleCard: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  toggleTitle: { fontFamily: fonts.bodyBold, fontSize: 14 },
  toggleSubtitle: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 2 },
  progressBar: { height: 4, borderRadius: 2, overflow: "hidden", marginTop: spacing.lg },
  progressFill: { height: "100%" },
  progressText: { fontFamily: fonts.bodyMd, fontSize: 11, marginTop: 6, marginBottom: spacing.lg },
  lessonCard: { flexDirection: "row", gap: spacing.sm, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  lessonTitle: { fontFamily: fonts.bodyBold, fontSize: 14, marginBottom: 3 },
  lessonText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18 },
  miniTitle: { fontFamily: fonts.bodyBold, fontSize: 14, marginTop: spacing.md },
  modelTip: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: -6, marginBottom: spacing.sm },
  modelHintBox: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  modelHintRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: spacing.sm },
  modelHintPill: { overflow: "hidden", borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontFamily: fonts.bodyBold, fontSize: 11 },
  exampleRow: { gap: 8, paddingVertical: spacing.md },
  exampleChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 10 },
  exampleText: { fontFamily: fonts.bodyBold, fontSize: 13 },
  presetChip: { width: 190, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  presetTitle: { fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 18, minHeight: 36 },
  presetMeta: { fontFamily: fonts.bodyMd, fontSize: 11, marginTop: 6 },
  qualityBox: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm },
  qualityLabel: { fontFamily: fonts.bodyMd, fontSize: 11 },
  qualityScore: { fontFamily: fonts.bodyBold, fontSize: 24, marginTop: 2 },
  qualityHint: { fontFamily: fonts.body, fontSize: 11, lineHeight: 15, marginTop: 2 },
  fieldBlock: { marginBottom: spacing.md },
  fieldLabel: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 0.3, marginBottom: 3 },
  fieldHelp: { fontFamily: fonts.body, fontSize: 11, lineHeight: 15, marginBottom: 6 },
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
  iconActionBtn: {
    width: 50, height: 50, alignItems: "center", justifyContent: "center", borderRadius: radius.pill, borderWidth: 1,
  },
  outputBlock: { borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md, borderWidth: 1 },
  outputLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: spacing.sm },
  outputText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22 },
  histHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.xl, marginBottom: spacing.sm },
  clearHistoryBtn: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 7, marginBottom: spacing.sm },
  histTitle: { fontFamily: fonts.bodyBold, fontSize: 14 },
  histCount: { fontFamily: fonts.body, fontSize: 12 },
  empty: { fontFamily: fonts.body, fontSize: 13 },
  histCard: { padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1 },
  histHeadRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  histDate: { fontFamily: fonts.body, fontSize: 11, marginBottom: 4 },
  histPreview: { fontFamily: fonts.bodyMd, fontSize: 13, lineHeight: 18 },
  histDivider: { height: 1, marginVertical: spacing.sm },
  histLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: 4 },
  histOutput: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  histActions: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: spacing.sm },
  histBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: radius.pill, borderWidth: 1 },
  histBtnText: { fontFamily: fonts.bodySemi, fontSize: 11 },
});
