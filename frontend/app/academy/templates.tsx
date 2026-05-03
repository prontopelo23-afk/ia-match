import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Check, Copy, FolderOpen } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, Template } from "../../src/api";

type TemplateWithMeta = Template & { category?: string; premium?: boolean; quality_checks?: string[] };

const LEVELS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];
const FAMILY_LABELS: Record<string, string> = {
  business: "Business",
  marketing: "Marketing",
  sales: "Vente",
  design: "Design",
  image: "Image",
  video: "Vidéo",
  code: "Code",
  research: "Recherche",
  documents: "Documents",
  productivity: "Productivité",
  education: "Éducation",
  seo: "SEO",
  support: "Support",
  legal_safe: "Juridique safe",
  finance_safe: "Finance safe",
};

function familyOf(t: TemplateWithMeta) {
  return t.category || "autres";
}
function familyLabel(slug: string) {
  return FAMILY_LABELS[slug] || slug.replace(/[_-]/g, " ").replace(/^./, (c) => c.toUpperCase());
}

export default function AcademyTemplates() {
  const router = useRouter();
  const { colors } = useTheme();
  const [items, setItems] = useState<TemplateWithMeta[]>([]);
  const [level, setLevel] = useState("ALL");
  const [family, setFamily] = useState("ALL");
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listTemplates()
      .then((data) => setItems(data as TemplateWithMeta[]))
      .finally(() => setLoading(false));
  }, []);

  const families = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((t) => counts.set(familyOf(t), (counts.get(familyOf(t)) || 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  const filtered = useMemo(() => {
    return items
      .filter((t) => level === "ALL" || t.level === level)
      .filter((t) => family === "ALL" || familyOf(t) === family)
      .sort((a, b) => `${familyOf(a)}-${a.level}-${a.title}`.localeCompare(`${familyOf(b)}-${b.level}-${b.title}`));
  }, [items, level, family]);

  const copy = async (t: TemplateWithMeta) => {
    const body = (t.body || "").trim();
    if (!body) return;
    await Clipboard.setStringAsync(body);
    setCopied(t.id);
    setTimeout(() => setCopied(null), 1300);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <ChevronLeft size={18} color={colors.textPrimary} />
          <Text style={[styles.backText, { color: colors.textPrimary }]}>Academy</Text>
        </TouchableOpacity>

        <Text style={[styles.eyebrow, { color: colors.coral }]}>TEMPLATES · {items.length}</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Prompts rangés par famille.</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Choisis d’abord une famille, puis un niveau. Ça évite la grande liste fouillis et garde tous les templates disponibles.</Text>

        <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>Familles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.familyRow}>
          <FamilyChip label={`Toutes · ${items.length}`} active={family === "ALL"} onPress={() => setFamily("ALL")} />
          {families.map(([slug, count]) => (
            <FamilyChip key={slug} label={`${familyLabel(slug)} · ${count}`} active={family === slug} onPress={() => setFamily(slug)} />
          ))}
        </ScrollView>

        <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>Niveau</Text>
        <View style={styles.filters}>
          {LEVELS.map((l) => (
            <TouchableOpacity key={l} onPress={() => setLevel(l)} style={[styles.chip, { borderColor: level === l ? colors.coral : colors.borderSubtle, backgroundColor: level === l ? colors.coralSoft : colors.surface }]}>
              <Text style={[styles.chipText, { color: level === l ? colors.coral : colors.textSecondary }]}>{l === "ALL" ? "Tous" : l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
          <FolderOpen size={16} color={colors.coral} strokeWidth={2.5} />
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>{filtered.length} template(s) dans cette sélection · corps vides masqués à la copie</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.coral} />
        ) : filtered.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>Aucun template dans cette famille/niveau.</Text>
        ) : (
          filtered.map((t) => {
            const hasBody = Boolean((t.body || "").trim());
            return (
              <View key={t.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
                <View style={styles.cardHead}>
                  <View style={styles.pills}>
                    <Text style={[styles.level, { color: colors.coral }]}>{t.level}</Text>
                    <Text style={[styles.familyPill, { color: colors.textSecondary, borderColor: colors.borderSubtle }]}>{familyLabel(familyOf(t))}</Text>
                  </View>
                  <TouchableOpacity disabled={!hasBody} onPress={() => copy(t)} style={!hasBody ? { opacity: 0.35 } : undefined}>
                    {copied === t.id ? <Check size={18} color={colors.success} /> : <Copy size={18} color={colors.textSecondary} />}
                  </TouchableOpacity>
                </View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{t.title}</Text>
                <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={4}>{hasBody ? t.body : "Template en cours de préparation."}</Text>
                {t.variables?.length ? <View style={styles.vars}>{t.variables.slice(0, 5).map((v) => <Text key={v} style={[styles.var, { color: colors.textSecondary }]}>{`{${v}}`}</Text>)}</View> : null}
              </View>
            );
          })
        )}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FamilyChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return <TouchableOpacity onPress={onPress} style={[styles.familyChip, { backgroundColor: active ? colors.coral : colors.surface, borderColor: active ? colors.coral : colors.borderSubtle }]}><Text style={[styles.familyChipText, { color: active ? "#fff" : colors.textPrimary }]}>{label}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg },
  back: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.md },
  backText: { fontFamily: fonts.bodyBold, fontSize: 13 },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2 },
  title: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 40, marginVertical: spacing.sm },
  subtitle: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  filterTitle: { fontFamily: fonts.bodyBold, fontSize: 13, marginTop: spacing.sm, marginBottom: 8 },
  familyRow: { gap: 8, paddingBottom: spacing.md },
  familyChip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 13, paddingVertical: 9 },
  familyChipText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.md },
  chip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8 },
  chipText: { fontFamily: fonts.bodySemi, fontSize: 12 },
  summary: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  summaryText: { flex: 1, fontFamily: fonts.body, fontSize: 12, lineHeight: 17 },
  empty: { fontFamily: fonts.body, fontSize: 13, textAlign: "center", marginTop: spacing.lg },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.sm },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 },
  level: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  familyPill: { overflow: "hidden", borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3, fontFamily: fonts.bodyBold, fontSize: 10 },
  cardTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 25, marginTop: 8 },
  body: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: spacing.sm },
  vars: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: spacing.sm },
  var: { fontFamily: fonts.body, fontSize: 11 },
});
