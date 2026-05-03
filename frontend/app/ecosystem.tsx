import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ArrowUpRight, Bot, GitBranch, Layers3, Newspaper, PlayCircle, ShieldCheck, Sparkles } from "lucide-react-native";
import { fonts, radius, spacing } from "../src/theme";
import { useTheme } from "../src/theme-context";
import { api, Resource } from "../src/api";
import { ECOSYSTEM_GUIDES, ECOSYSTEM_ITEMS, EcosystemItem } from "../src/data/ecosystem";
import { ConceptCard, ScoreGauge, ToolBattleStrip, WorkflowMap } from "../src/components/VisualExplainers";

const FILTERS = ["Tout", "workflow", "agent", "outil", "modèle", "ressource"];

export default function EcosystemScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [filter, setFilter] = useState("Tout");
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    api.listResources().then((items) => setResources(items.slice(0, 12))).catch(() => {});
  }, []);

  const items = useMemo(() => filter === "Tout" ? ECOSYSTEM_ITEMS : ECOSYSTEM_ITEMS.filter((i) => i.kind === filter), [filter]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)} style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
          <Text style={[styles.eyebrow, { color: colors.coral }]}>ÉCOSYSTÈME IA · OUTILS + WORKFLOWS</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Construis ton stack IA, pas juste une liste d’outils.</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Modèles, agents, automatisations, créateurs et ressources : IA Match relie les briques réelles pour créer des workflows utiles.</Text>
          <View style={styles.heroActions}>
            <TouchableOpacity onPress={() => router.push("/(tabs)/builder")} style={[styles.primaryBtn, { backgroundColor: colors.coral }]}>
              <Sparkles size={16} color="#fff" strokeWidth={2.5} />
              <Text style={styles.primaryText}>Créer un workflow prompt</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/match")} style={[styles.secondaryBtn, { borderColor: colors.borderSubtle }]}>
              <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>Lancer un Match</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={[styles.ruleBox, { backgroundColor: colors.coralSoft, borderColor: colors.coral }] }>
          <ShieldCheck size={18} color={colors.coral} strokeWidth={2.5} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.ruleTitle, { color: colors.textPrimary }]}>Règle anti-hallucination</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>Les cartes ci-dessous s’appuient sur des outils réels. Les promesses restent prudentes : prix, limites et connecteurs peuvent changer.</Text>
          </View>
        </View>

        <WorkflowMap title="Carte mentale d’un stack IA utile" steps={["Choisir le meilleur modèle", "Ajouter l’outil métier", "Brancher un agent si répétitif", "Mesurer qualité, coût et risque"]} />
        <View style={styles.conceptGrid}>
          <ConceptCard icon="layers" title="Modèle ≠ produit" text="Un modèle raisonne ou génère. Un produit ajoute interface, fichiers, partage, sécurité et historique." bullets={["ChatGPT Image 2.0 = création pro polyvalente", "Topaz = amélioration photo, pas générateur principal"]} />
          <ConceptCard icon="bot" title="Agent = suite d’actions" text="Un agent combine plusieurs étapes : chercher, cliquer, écrire, vérifier, relancer. Utile si la tâche revient souvent." bullets={["Bon pour workflow", "À surveiller sur données sensibles"]} />
        </View>
        <ToolBattleStrip items={[{ name: "ChatGPT Image 2.0", role: "création image pro polyvalente", score: 99 }, { name: "Midjourney", role: "direction artistique / style", score: 96 }, { name: "Flux", role: "photoréalisme et pipeline avancé", score: 92 }]} />
        <ScoreGauge label="Lisibilité IA Match" value={94} helper="Chaque hub explique le meilleur usage, le risque, le budget et le moment où il vaut mieux choisir un autre outil." />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterChip, { backgroundColor: filter === f ? colors.coral : colors.surface, borderColor: filter === f ? colors.coral : colors.borderSubtle }]}>
              <Text style={[styles.filterText, { color: filter === f ? "#fff" : colors.textPrimary }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.guideGrid}>
          {ECOSYSTEM_GUIDES.map((g, i) => (
            <Animated.View entering={FadeInDown.delay(i * 60).duration(420)} key={g} style={[styles.guideCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
              <Text style={[styles.guideNum, { color: colors.coral }]}>0{i + 1}</Text>
              <Text style={[styles.guideText, { color: colors.textPrimary }]}>{g}</Text>
            </Animated.View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Workflows et stacks recommandés</Text>
        {items.map((item, i) => <EcosystemCard key={item.id} item={item} index={i} />)}

        {resources.length ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Créateurs, blogs et ressources vérifiées</Text>
            <Text style={[styles.sectionIntro, { color: colors.textSecondary }]}>Sélection issue de la base IA Match existante : chaînes, blogs, podcasts et ressources pour apprendre sans dépendre d’une seule source.</Text>
            {resources.map((r, i) => (
              <Animated.View entering={FadeInDown.delay(i * 40).duration(380)} key={r.id} style={[styles.resourceCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.resourceCat, { color: colors.coral }]}>{r.category}</Text>
                  <Text style={[styles.resourceTitle, { color: colors.textPrimary }]}>{r.title}</Text>
                  <Text style={[styles.resourceText, { color: colors.textSecondary }]}>{r.summary}</Text>
                </View>
                <TouchableOpacity onPress={() => Linking.openURL(r.url).catch(() => {})} style={styles.openIcon}>
                  <ArrowUpRight size={16} color={colors.coral} strokeWidth={2.5} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </>
        ) : null}

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function EcosystemCard({ item, index }: { item: EcosystemItem; index: number }) {
  const { colors } = useTheme();
  const icon = item.kind === "agent" ? <Bot size={18} color={colors.coral} /> : item.kind === "workflow" ? <GitBranch size={18} color={colors.coral} /> : item.kind === "ressource" ? <Newspaper size={18} color={colors.coral} /> : item.kind === "modèle" ? <Layers3 size={18} color={colors.coral} /> : <PlayCircle size={18} color={colors.coral} />;
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).duration(420)} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
      <View style={styles.cardHead}>
        <View style={[styles.kindIcon, { backgroundColor: colors.coralSoft }]}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.kind, { color: colors.coral }]}>{item.kind.toUpperCase()}</Text>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{item.title}</Text>
        </View>
      </View>
      <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{item.subtitle}</Text>
      <Text style={[styles.cardDesc, { color: colors.textPrimary }]}>{item.description}</Text>
      <View style={styles.stackRow}>{item.stack?.map((s) => <Text key={s} style={[styles.stackPill, { backgroundColor: colors.coralSoft, color: colors.coral }]}>{s}</Text>)}</View>
      {item.steps?.map((s, i) => <Text key={s} style={[styles.step, { color: colors.textSecondary }]}>{i + 1}. {s}</Text>)}
      <Text style={[styles.verified, { color: colors.textSecondary }]}>ⓘ {item.verified}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  hero: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.lg },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.8, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 35, lineHeight: 40, letterSpacing: -1 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  heroActions: { gap: 8, marginTop: spacing.md },
  primaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: radius.pill, paddingVertical: 14 },
  primaryText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  secondaryBtn: { borderWidth: 1, borderRadius: radius.pill, paddingVertical: 13, alignItems: "center" },
  secondaryText: { fontFamily: fonts.bodyBold, fontSize: 14 },
  ruleBox: { flexDirection: "row", gap: spacing.sm, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md },
  ruleTitle: { fontFamily: fonts.bodyBold, fontSize: 14 },
  ruleText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 3 },
  conceptGrid: { gap: 0, marginTop: spacing.sm },
  filterRow: { gap: 8, paddingVertical: spacing.md },
  filterChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  filterText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  guideGrid: { gap: 8 },
  guideCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
  guideNum: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  guideText: { fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 18, marginTop: 3 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30, marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionIntro: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginBottom: spacing.sm },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  cardHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  kindIcon: { width: 40, height: 40, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  kind: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  cardTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 25 },
  cardSub: { fontFamily: fonts.bodySemi, fontSize: 12, marginTop: spacing.sm },
  cardDesc: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, marginTop: 6 },
  stackRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: spacing.sm },
  stackPill: { overflow: "hidden", borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontFamily: fonts.bodyBold, fontSize: 10 },
  step: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginTop: 4 },
  verified: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16, marginTop: spacing.sm, fontStyle: "italic" },
  resourceCard: { flexDirection: "row", gap: spacing.sm, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  resourceCat: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.4 },
  resourceTitle: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 22, marginTop: 2 },
  resourceText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 4 },
  openIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
});
