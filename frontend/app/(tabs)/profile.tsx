import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { History, Trash2, Sparkles, Wand2, Sun, Moon, Crown, ExternalLink } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme, usePremium } from "../../src/theme-context";
import { history, HistoryItem, api, Resource } from "../../src/api";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, mode, toggle } = useTheme();
  const { isPremium, setPremium } = usePremium();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  useFocusEffect(
    useCallback(() => {
      history.list().then(setItems);
    }, [])
  );
  useEffect(() => {
    api.listResources().then(setResources).catch(() => {});
  }, []);

  const clear = () => {
    Alert.alert("Effacer l'historique ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      { text: "Effacer", style: "destructive", onPress: async () => { await history.clear(); setItems([]); } },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Mon profil</Text>

        {/* Plan card */}
        <View style={[styles.planCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
          <View style={styles.planRow}>
            <View>
              <Text style={[styles.planLabel, { color: colors.coral }]}>{isPremium ? "PLAN ACTUEL" : "PLAN GRATUIT"}</Text>
              <Text style={[styles.planName, { color: colors.textPrimary }]}>
                {isPremium ? "Premium" : "Découverte"}
              </Text>
              <Text style={[styles.planDesc, { color: colors.textSecondary }]}>
                {isPremium
                  ? "Tu as accès à toutes les sections : Catalogue, Actue, Academy, Builder, Comparateur, Benchmarks."
                  : "Tu as accès à : Catalogue, Actue, Profil. Premium débloque Academy, Builder, Comparateur et Benchmarks."}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setPremium(!isPremium)}
            style={[styles.planBtn, { backgroundColor: isPremium ? colors.surface : colors.coral, borderColor: colors.coral }]}
            testID="profile-toggle-premium"
          >
            <Crown size={14} color={isPremium ? colors.coral : "#fff"} strokeWidth={2.5} />
            <Text style={[styles.planBtnText, { color: isPremium ? colors.coral : "#fff" }]}>
              {isPremium ? "Désactiver Premium" : "Activer Premium (démo)"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings card */}
        <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
          <TouchableOpacity onPress={toggle} style={styles.settingRow} testID="profile-toggle-theme">
            <View style={styles.settingLeft}>
              {mode === "light" ? (
                <Sun size={18} color={colors.textPrimary} strokeWidth={2} />
              ) : (
                <Moon size={18} color={colors.textPrimary} strokeWidth={2} />
              )}
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Thème</Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.coral }]}>
              {mode === "light" ? "Jour" : "Nuit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* CTA new match */}
        <View style={[styles.heroBlock, { backgroundColor: colors.coralSoft }]}>
          <Sparkles size={20} color={colors.coral} strokeWidth={2.5} />
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Lance un nouveau match</Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
            Décris ton besoin, on te trouve la meilleure IA en 3 questions.
          </Text>
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: colors.coral }]}
            onPress={() => router.push("/match")}
            testID="profile-new-match"
          >
            <Wand2 size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.ctaText}>Nouveau Match</Text>
          </TouchableOpacity>
        </View>

        {/* History */}
        <View style={styles.sectionHead}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <History size={18} color={colors.textPrimary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Historique</Text>
          </View>
          {items.length > 0 ? (
            <TouchableOpacity onPress={clear} testID="history-clear">
              <Trash2 size={18} color={colors.error} strokeWidth={2} />
            </TouchableOpacity>
          ) : null}
        </View>
        {items.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>Aucun match enregistré pour le moment.</Text>
        ) : (
          items.map((it, i) => (
            <View
              key={i}
              style={[styles.histItem, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
              testID={`history-item-${i}`}
            >
              <Text style={[styles.histNeed, { color: colors.textPrimary }]}>{it.need}</Text>
              <Text style={[styles.histMeta, { color: colors.textSecondary }]}>
                {new Date(it.createdAt).toLocaleDateString("fr-FR")} · Priorité : {it.priority}
              </Text>
            </View>
          ))
        )}

        {/* Useful links */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
          Liens utiles
        </Text>
        <Text style={[styles.empty, { color: colors.textSecondary, marginTop: 0, marginBottom: spacing.md, textAlign: "left" }]}>
          Ressources triées sur le volet pour aller plus loin sur l'IA générative.
        </Text>
        {resources.map((r) => (
          <TouchableOpacity
            key={r.id}
            onPress={() => Linking.openURL(r.url).catch(() => {})}
            style={[styles.resourceRow, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
            testID={`resource-${r.id}`}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.resCat, { color: colors.coral }]}>{r.category}</Text>
              <Text style={[styles.resTitle, { color: colors.textPrimary }]}>{r.title}</Text>
              <Text style={[styles.resAuthor, { color: colors.textSecondary }]}>par {r.author}</Text>
              <Text style={[styles.resSummary, { color: colors.textSecondary }]} numberOfLines={2}>
                {r.summary}
              </Text>
            </View>
            <ExternalLink size={16} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontFamily: fonts.serif, fontSize: 32, marginBottom: spacing.lg, letterSpacing: -0.5 },
  planCard: { borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, marginBottom: spacing.md },
  planRow: { marginBottom: spacing.md },
  planLabel: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 2 },
  planName: { fontFamily: fonts.serif, fontSize: 26, marginTop: 4 },
  planDesc: { fontFamily: fonts.body, fontSize: 13, lineHeight: 20, marginTop: 6 },
  planBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 12, borderRadius: radius.pill, borderWidth: 1.5,
  },
  planBtnText: { fontFamily: fonts.bodyBold, fontSize: 13 },
  settingsCard: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: spacing.lg },
  settingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  settingText: { fontFamily: fonts.bodySemi, fontSize: 14 },
  settingValue: { fontFamily: fonts.bodyBold, fontSize: 13 },
  heroBlock: { borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  heroTitle: { fontFamily: fonts.serif, fontSize: 22, marginTop: spacing.sm },
  heroSub: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 4, marginBottom: spacing.md },
  cta: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: spacing.md, paddingVertical: 12, borderRadius: radius.pill, alignSelf: "flex-start",
  },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.bodyBold, fontSize: 16 },
  empty: { fontFamily: fonts.body, textAlign: "center", marginTop: spacing.lg },
  histItem: { borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1 },
  histNeed: { fontFamily: fonts.bodySemi, fontSize: 15 },
  histMeta: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  resourceRow: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1,
  },
  resCat: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5 },
  resTitle: { fontFamily: fonts.serif, fontSize: 17, marginTop: 2 },
  resAuthor: { fontFamily: fonts.body, fontSize: 11, marginTop: 1 },
  resSummary: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16, marginTop: 4 },
});
