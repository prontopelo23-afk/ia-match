import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowUpRight } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, NewsItem } from "../../src/api";

export default function ActueScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listNews().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const featured = items[0];
  const rest = items.slice(1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.crumb, { color: colors.textSecondary }]}>Workspace · Actue</Text>
        <Text style={[styles.eyebrow, { color: colors.coral }]}>ACTUE · ÉDITION AVRIL 2026</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Ce qui bouge dans <Text style={[styles.titleAccent, { color: colors.coral }]}>l'écosystème</Text>.
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.xl }} />
        ) : !featured ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>Aucune actualité pour le moment.</Text>
        ) : (
          <>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/news/${featured.id}`)}
              style={[styles.featuredCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
              testID="news-featured"
            >
              <View style={styles.tagRow}>
                <Text style={[styles.tagPill, { color: colors.coral }]}>{featured.category}</Text>
                <Text style={[styles.dotSep, { color: colors.textSecondary }]}>·</Text>
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formatDate(featured.publishedAt)}</Text>
                <Text style={[styles.dotSep, { color: colors.textSecondary }]}>·</Text>
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{featured.readMinutes} min</Text>
              </View>
              <Text style={[styles.featuredTitle, { color: colors.textPrimary }]}>{featured.title}</Text>
              <Text style={[styles.featuredSummary, { color: colors.textSecondary }]}>{featured.summary}</Text>
              <View style={styles.readLink}>
                <Text style={[styles.readLinkText, { color: colors.coral }]}>Lire l'article</Text>
                <ArrowUpRight size={16} color={colors.coral} strokeWidth={2.5} />
              </View>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

            {rest.map((n) => (
              <TouchableOpacity
                key={n.id}
                onPress={() => router.push(`/news/${n.id}`)}
                style={[styles.row, { borderBottomColor: colors.borderSubtle }]}
                testID={`news-row-${n.id}`}
                activeOpacity={0.7}
              >
                <Text style={[styles.rowCategory, { color: colors.coral }]}>{n.category}</Text>
                <View style={styles.rowMain}>
                  <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{n.title}</Text>
                  <Text style={[styles.rowSummary, { color: colors.textSecondary }]} numberOfLines={2}>
                    {n.summary}
                  </Text>
                </View>
                <View style={styles.rowMeta}>
                  <ArrowUpRight size={14} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={[styles.rowDate, { color: colors.textSecondary }]}>{formatDate(n.publishedAt)}</Text>
                  <Text style={[styles.rowMin, { color: colors.textSecondary }]}>{n.readMinutes} min</Text>
                </View>
              </TouchableOpacity>
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
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  crumb: { fontFamily: fonts.body, fontSize: 12, marginBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 38, lineHeight: 44, letterSpacing: -1, marginBottom: spacing.lg },
  titleAccent: { fontStyle: "italic" },
  featuredCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.sm },
  tagPill: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  dotSep: {},
  metaText: { fontFamily: fonts.body, fontSize: 11 },
  featuredTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  featuredSummary: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  readLink: { flexDirection: "row", alignItems: "center", gap: 6 },
  readLinkText: { fontFamily: fonts.bodySemi, fontSize: 14 },
  divider: { height: 1, marginVertical: spacing.md },
  row: { flexDirection: "row", paddingVertical: spacing.md, borderBottomWidth: 1, gap: spacing.sm },
  rowCategory: { width: 70, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, paddingTop: 4 },
  rowMain: { flex: 1 },
  rowTitle: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 22, marginBottom: 4 },
  rowSummary: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  rowMeta: { alignItems: "flex-end", gap: 2 },
  rowDate: { fontFamily: fonts.body, fontSize: 11 },
  rowMin: { fontFamily: fonts.body, fontSize: 11 },
  empty: { fontFamily: fonts.body, textAlign: "center", marginTop: spacing.xl },
});
