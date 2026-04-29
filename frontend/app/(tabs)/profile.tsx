import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { History, Trash2, Sparkles, Wand2 } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../../src/theme";
import { history, HistoryItem } from "../../src/api";

export default function ProfileScreen() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      history.list().then(setItems);
    }, [])
  );

  const clear = () => {
    Alert.alert("Effacer l'historique ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Effacer",
        style: "destructive",
        onPress: async () => {
          await history.clear();
          setItems([]);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <Text style={styles.title}>Mon profil</Text>

        <View style={styles.heroBlock}>
          <Sparkles size={20} color={colors.pink} strokeWidth={2.5} />
          <Text style={styles.heroTitle}>Bienvenue sur IA Match</Text>
          <Text style={styles.heroSub}>
            Trouve la meilleure IA pour chaque besoin, compare et note en toute confiance.
          </Text>
          <TouchableOpacity style={styles.cta} onPress={() => router.push("/match")} testID="profile-new-match">
            <Wand2 size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.ctaText}>Nouveau Match</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHead}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <History size={18} color={colors.textPrimary} strokeWidth={2} />
            <Text style={styles.sectionTitle}>Historique</Text>
          </View>
          {items.length > 0 ? (
            <TouchableOpacity onPress={clear} testID="history-clear">
              <Trash2 size={18} color={colors.error} strokeWidth={2} />
            </TouchableOpacity>
          ) : null}
        </View>

        {items.length === 0 ? (
          <Text style={styles.empty}>Aucun match enregistré pour le moment.</Text>
        ) : (
          items.map((it, i) => (
            <View key={i} style={styles.histItem} testID={`history-item-${i}`}>
              <Text style={styles.histNeed}>{it.need}</Text>
              <Text style={styles.histMeta}>
                {new Date(it.createdAt).toLocaleDateString("fr-FR")} · Priorité : {it.priority}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    letterSpacing: -0.5,
  },
  heroBlock: {
    backgroundColor: colors.darkCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.dark,
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.textInverse,
    marginTop: spacing.sm,
  },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: "rgba(253,251,247,0.7)",
    lineHeight: 20,
    marginTop: 6,
    marginBottom: spacing.md,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.coral,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.textPrimary },
  empty: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  histItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  histNeed: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.textPrimary },
  histMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
