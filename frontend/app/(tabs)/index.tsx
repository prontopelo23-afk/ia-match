import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles, ArrowRight, Wand2 } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../../src/theme";
import { api, Category, Tool } from "../../src/api";
import ToolCard from "../../src/components/ToolCard";

export default function HomeScreen() {
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listTools({ sort: "score" }), api.listCategories()])
      .then(([t, c]) => {
        setTools(t.slice(0, 6));
        setCats(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brandSmall}>IA MATCH</Text>
        </View>

        <View style={styles.hero} testID="hero-section">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1739785891796-7fd9028e1930?w=1200&q=80",
            }}
            style={styles.heroBg}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Sparkles size={14} color={colors.pink} strokeWidth={2.5} />
              <Text style={styles.heroBadgeText}>Trouve ton IA idéale</Text>
            </View>
            <Text style={styles.heroTitle}>
              L'IA{"\n"}qui te{" "}
              <Text style={styles.heroTitleAccent}>correspond</Text>.
            </Text>
            <Text style={styles.heroSub}>
              Réponds à 3 questions et découvre la meilleure IA pour ton besoin précis.
            </Text>
            <TouchableOpacity
              style={styles.ctaPrimary}
              onPress={() => router.push("/match")}
              testID="cta-start-match"
            >
              <Wand2 size={18} color="#fff" strokeWidth={2.5} />
              <Text style={styles.ctaPrimaryText}>Lancer le Match</Text>
              <ArrowRight size={18} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>EXPLORER</Text>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.lg }}>
            <View style={styles.catRow}>
              {cats.map((c) => (
                <TouchableOpacity
                  key={c.slug}
                  style={styles.catChip}
                  onPress={() => router.push(`/search?category=${c.slug}`)}
                  testID={`cat-${c.slug}`}
                >
                  <Text style={styles.catText}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TOP IA</Text>
          <Text style={styles.sectionTitle}>Les plus performantes</Text>
          {loading ? (
            <ActivityIndicator color={colors.pink} style={{ marginTop: spacing.lg }} />
          ) : (
            tools.map((t) => <ToolCard key={t.slug} tool={t} />)
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  header: { paddingVertical: spacing.sm },
  brandSmall: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 4,
    color: colors.textPrimary,
  },
  hero: {
    backgroundColor: colors.darkCard,
    borderRadius: radius.xl,
    overflow: "hidden",
    marginTop: spacing.sm,
    ...shadow.dark,
    minHeight: 360,
  },
  heroBg: { ...StyleSheet.absoluteFillObject, opacity: 0.35 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 21, 28, 0.55)",
  },
  heroContent: { padding: spacing.lg, paddingVertical: spacing.xl },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(244, 63, 122, 0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  heroBadgeText: { color: colors.pink, fontFamily: fonts.bodySemi, fontSize: 12 },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 44,
    lineHeight: 50,
    color: colors.textInverse,
    letterSpacing: -1,
  },
  heroTitleAccent: { color: colors.pink, fontStyle: "italic" },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(253, 251, 247, 0.75)",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  ctaPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.coral,
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  ctaPrimaryText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 16 },
  section: { marginTop: spacing.xl },
  sectionLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.pink,
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  catRow: { flexDirection: "row", paddingHorizontal: spacing.lg, gap: spacing.sm },
  catChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  catText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.textPrimary },
});
