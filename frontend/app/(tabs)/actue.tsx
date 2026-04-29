import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowUpRight } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../../src/theme";
import { api, NewsItem } from "../../src/api";

export default function ActueScreen() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.listNews().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const featured = items[0];
  const rest = items.slice(1);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.crumb}>Workspace · Actue</Text>
        <Text style={styles.eyebrow}>ACTUE · ÉDITION AVRIL 2026</Text>
        <Text style={styles.title}>
          Ce qui bouge dans <Text style={styles.titleAccent}>l'écosystème</Text>.
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.xl }} />
        ) : !featured ? (
          <Text style={styles.empty}>Aucune actualité pour le moment.</Text>
        ) : (
          <>
            <View style={styles.featuredRow} testID="news-featured">
              <View style={styles.featuredText}>
                <View style={styles.tagRow}>
                  <Text style={styles.tagPill}>{featured.category}</Text>
                  <Text style={styles.dotSep}>·</Text>
                  <Text style={styles.metaText}>{formatDate(featured.publishedAt)}</Text>
                  <Text style={styles.dotSep}>·</Text>
                  <Text style={styles.metaText}>{featured.readMinutes} min</Text>
                </View>
                <Text style={styles.featuredTitle}>{featured.title}</Text>
                <Text style={styles.featuredSummary}>{featured.summary}</Text>
                <View style={styles.readLink}>
                  <Text style={styles.readLinkText}>Lire l'analyse</Text>
                  <ArrowUpRight size={16} color={colors.textPrimary} strokeWidth={2.5} />
                </View>
              </View>
              {featured.highlight ? (
                <View style={styles.figure} testID="news-highlight">
                  <Text style={styles.figureNumber}>{featured.highlight}</Text>
                  <Text style={styles.figureLabel}>{featured.tag.toUpperCase()}</Text>
                  <Text style={styles.figureMeta}>FIG. 01 · NOUVELLE GUIDANCE</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.divider} />

            {rest.map((n) => (
              <View key={n.id} style={styles.row} testID={`news-row-${n.id}`}>
                <Text style={styles.rowCategory}>{n.category}</Text>
                <View style={styles.rowMain}>
                  <Text style={styles.rowTitle}>{n.title}</Text>
                  <Text style={styles.rowSummary}>{n.summary}</Text>
                </View>
                <View style={styles.rowMeta}>
                  <ArrowUpRight size={14} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={styles.rowDate}>{formatDate(n.publishedAt)}</Text>
                  <Text style={styles.rowMin}>{n.readMinutes} min</Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.darkCard },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  crumb: { fontFamily: fonts.body, fontSize: 12, color: "rgba(253,251,247,0.5)", marginBottom: spacing.md },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.coral,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 38,
    lineHeight: 44,
    color: colors.textInverse,
    letterSpacing: -1,
    marginBottom: spacing.lg,
  },
  titleAccent: { color: colors.coral, fontStyle: "italic" },
  featuredRow: { gap: spacing.md, marginBottom: spacing.lg },
  featuredText: {},
  tagRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.sm },
  tagPill: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.coral,
  },
  dotSep: { color: "rgba(253,251,247,0.3)" },
  metaText: { fontFamily: fonts.body, fontSize: 11, color: "rgba(253,251,247,0.6)" },
  featuredTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    color: colors.coral,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  featuredSummary: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(253,251,247,0.75)",
    marginBottom: spacing.md,
  },
  readLink: { flexDirection: "row", alignItems: "center", gap: 6 },
  readLinkText: { fontFamily: fonts.bodySemi, color: colors.textInverse, fontSize: 14 },
  figure: {
    backgroundColor: "#0A0D14",
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  figureNumber: {
    fontFamily: fonts.serif,
    fontSize: 96,
    color: colors.coral,
    lineHeight: 100,
    letterSpacing: -3,
  },
  figureLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 2,
    color: "rgba(253,251,247,0.5)",
    marginTop: spacing.sm,
  },
  figureMeta: {
    fontFamily: fonts.body,
    fontSize: 9,
    letterSpacing: 1,
    color: "rgba(253,251,247,0.3)",
    marginTop: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    gap: spacing.sm,
  },
  rowCategory: {
    width: 70,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: "rgba(253,251,247,0.5)",
    paddingTop: 4,
  },
  rowMain: { flex: 1 },
  rowTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    lineHeight: 22,
    color: colors.textInverse,
    marginBottom: 4,
  },
  rowSummary: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(253,251,247,0.6)",
  },
  rowMeta: { alignItems: "flex-end", gap: 2 },
  rowDate: { fontFamily: fonts.body, fontSize: 11, color: "rgba(253,251,247,0.5)" },
  rowMin: { fontFamily: fonts.body, fontSize: 11, color: "rgba(253,251,247,0.4)" },
  empty: {
    fontFamily: fonts.body,
    color: "rgba(253,251,247,0.5)",
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
