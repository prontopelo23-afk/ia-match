import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, NewsItem } from "../../src/api";

export default function NewsDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [item, setItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    if (id) api.getNews(id).then(setItem).catch(() => setItem(null));
  }, [id]);

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
        <ActivityIndicator color={colors.coral} style={{ marginTop: spacing.xxl }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
          testID="news-back"
        >
          <ChevronLeft size={20} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.metaRow}>
          <Text style={[styles.cat, { color: colors.coral }]}>{item.category}</Text>
          <Text style={[styles.dot, { color: colors.textSecondary }]}>·</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>{formatDate(item.publishedAt)}</Text>
          <Text style={[styles.dot, { color: colors.textSecondary }]}>·</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>{item.readMinutes} min de lecture</Text>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
        {item.author ? (
          <Text style={[styles.author, { color: colors.textSecondary }]}>Par {item.author}</Text>
        ) : null}

        {item.intro ? (
          <Text style={[styles.intro, { color: colors.textPrimary }]}>{item.intro}</Text>
        ) : null}

        {(item.body || "").split("\n\n").map((para, i) => {
          const trimmed = para.trim();
          if (trimmed.startsWith("## ")) {
            return (
              <Text key={i} style={[styles.h2, { color: colors.textPrimary }]}>
                {trimmed.replace(/^##\s+/, "")}
              </Text>
            );
          }
          if (trimmed.startsWith("### ")) {
            return (
              <Text key={i} style={[styles.h3, { color: colors.textPrimary }]}>
                {trimmed.replace(/^###\s+/, "")}
              </Text>
            );
          }
          if (trimmed.startsWith("- ")) {
            const bullets = trimmed.split("\n").map((l) => l.replace(/^-\s+/, ""));
            return (
              <View key={i} style={{ marginVertical: spacing.sm }}>
                {bullets.map((b, j) => (
                  <View key={j} style={styles.bulletRow}>
                    <Text style={[styles.bulletDot, { color: colors.coral }]}>·</Text>
                    <Text style={[styles.bulletText, { color: colors.textPrimary }]}>{renderInline(b, colors)}</Text>
                  </View>
                ))}
              </View>
            );
          }
          if (/^\d+\.\s/.test(trimmed)) {
            const nums = trimmed.split("\n");
            return (
              <View key={i} style={{ marginVertical: spacing.sm }}>
                {nums.map((b, j) => (
                  <Text key={j} style={[styles.numberedLine, { color: colors.textPrimary }]}>
                    {renderInline(b, colors)}
                  </Text>
                ))}
              </View>
            );
          }
          return (
            <Text key={i} style={[styles.para, { color: colors.textPrimary }]}>
              {renderInline(trimmed, colors)}
            </Text>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function renderInline(text: string, colors: any): React.ReactNode {
  // Bold via **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <Text key={i} style={{ fontFamily: fonts.bodyBold }}>
          {p.slice(2, -2)}
        </Text>
      );
    }
    return p;
  });
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.sm },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.sm, flexWrap: "wrap" },
  cat: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.5 },
  dot: {},
  meta: { fontFamily: fonts.body, fontSize: 12 },
  title: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, letterSpacing: -1, marginBottom: spacing.sm },
  author: { fontFamily: fonts.body, fontSize: 13, marginBottom: spacing.lg },
  intro: { fontFamily: fonts.body, fontSize: 17, lineHeight: 26, marginBottom: spacing.lg, fontStyle: "italic" },
  h2: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30, marginTop: spacing.lg, marginBottom: spacing.sm, letterSpacing: -0.5 },
  h3: { fontFamily: fonts.bodyBold, fontSize: 17, marginTop: spacing.md, marginBottom: 6 },
  para: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, marginBottom: spacing.sm },
  bulletRow: { flexDirection: "row", gap: 8, marginVertical: 3 },
  bulletDot: { fontSize: 18, fontFamily: fonts.bodyBold, lineHeight: 22 },
  bulletText: { flex: 1, fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  numberedLine: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, marginVertical: 3 },
});
