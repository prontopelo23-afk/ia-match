import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts, radius, spacing } from "../theme";
import { useTheme } from "../theme-context";

const CAT_LABELS: Record<string, string> = {
  texte: "Texte & Rédaction",
  image: "Création d'images",
  video: "Création de vidéos",
  audio: "Voix & Audio",
  code: "Code & Développement",
  recherche: "Recherche & Analyse",
  agent: "Agents autonomes",
  productivite: "Productivité",
  data: "Données & BI",
};

type Props = {
  scores: Record<string, number>;
  generalScore: number;
};

/**
 * Affiche les scores par spécialité sous forme de barres horizontales
 * + le score général séparé. Pédagogie : l'utilisateur voit clairement
 * que la note dépend de la catégorie.
 */
export default function CategoryScoreBars({ scores, generalScore }: Props) {
  const { colors } = useTheme();
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Performance par spécialité</Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Chaque score reflète la capacité du modèle dans cette catégorie précise. Le score général ({generalScore}/100) est une moyenne pondérée de toutes ses spécialités.
      </Text>

      <View style={styles.list}>
        {entries.map(([slug, value], i) => {
          const label = CAT_LABELS[slug] || slug;
          const width = `${Math.max(8, value)}%` as any;
          const isPrimary = i === 0;
          return (
            <View key={slug} style={styles.row}>
              <View style={styles.rowHead}>
                <Text style={[styles.cat, { color: isPrimary ? colors.coral : colors.textPrimary }]}>
                  {isPrimary ? "★ " : ""}{label}
                </Text>
                <Text style={[styles.score, { color: colors.textPrimary }]}>{value}<Text style={[styles.scoreSlash, { color: colors.textSecondary }]}>/100</Text></Text>
              </View>
              <View style={[styles.track, { backgroundColor: colors.borderSubtle }]}>
                <View
                  style={[
                    styles.fill,
                    { backgroundColor: isPrimary ? colors.coral : colors.textPrimary, width },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      <View style={[styles.legend, { borderTopColor: colors.borderSubtle }]}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.coral }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>★ Spécialité principale</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Score général · {generalScore}/100</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginVertical: spacing.md },
  title: { fontFamily: fonts.serif, fontSize: 20, marginBottom: 4 },
  hint: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginBottom: spacing.md },
  list: { gap: spacing.sm },
  row: { gap: 4 },
  rowHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  cat: { fontFamily: fonts.bodySemi, fontSize: 13 },
  score: { fontFamily: fonts.bodyBold, fontSize: 16 },
  scoreSlash: { fontFamily: fonts.body, fontSize: 11 },
  track: { height: 8, borderRadius: 4, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4 },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: fonts.body, fontSize: 11 },
});
