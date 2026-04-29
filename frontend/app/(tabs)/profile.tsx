import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { History, Trash2, Sparkles, Wand2, Sun, Moon, Crown, Bookmark, RefreshCw, ArrowRight, LogIn, LogOut, FileText, Cookie, User as UserIcon } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme, usePremium } from "../../src/theme-context";
import {
  history,
  HistoryItem,
  api,
  Tool,
  NewsItem,
  bookmarkTools,
  bookmarkNews,
  onboardingStore,
} from "../../src/api";
import { auth, AuthUser, consent } from "../../src/auth";
import LogoTile from "../../src/components/LogoTile";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, mode, toggle } = useTheme();
  const { isPremium, setPremium } = usePremium();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [savedTools, setSavedTools] = useState<Tool[]>([]);
  const [savedNews, setSavedNews] = useState<NewsItem[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);

  const loadAuth = useCallback(async () => {
    setUser(await auth.getUser());
  }, []);

  const loadBookmarks = useCallback(async () => {
    const [toolSlugs, newsIds] = await Promise.all([bookmarkTools.list(), bookmarkNews.list()]);
    if (toolSlugs.length > 0) {
      const tools = await Promise.all(toolSlugs.map((s) => api.getTool(s).catch(() => null)));
      setSavedTools(tools.filter((t): t is Tool => !!t));
    } else {
      setSavedTools([]);
    }
    if (newsIds.length > 0) {
      const all = await api.listNews().catch(() => [] as NewsItem[]);
      setSavedNews(all.filter((n) => newsIds.includes(n.id)));
    } else {
      setSavedNews([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      history.list().then(setItems);
      loadBookmarks();
      loadAuth();
    }, [loadBookmarks, loadAuth])
  );

  const handleLogout = () => {
    Alert.alert("Se déconnecter ?", "", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          await auth.logout();
          setUser(null);
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer définitivement mon compte ?",
      "Toutes tes données (favoris, historique, paramètres) seront effacées sans possibilité de récupération. Cette action est conforme au RGPD (droit à l'effacement).",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await auth.deleteAccount();
              setUser(null);
              Alert.alert("Compte supprimé", "Tes données ont été effacées.");
            } catch (e: any) {
              Alert.alert("Erreur", e?.message || "Impossible de supprimer pour l'instant.");
            }
          },
        },
      ]
    );
  };

  const resetCookieConsent = async () => {
    await consent.clear();
    Alert.alert("Préférences cookies", "Tes préférences ont été réinitialisées. La bannière apparaîtra au prochain démarrage.");
  };

  const clear = () => {
    Alert.alert("Effacer l'historique ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      { text: "Effacer", style: "destructive", onPress: async () => { await history.clear(); setItems([]); } },
    ]);
  };

  const replayOnboarding = async () => {
    await onboardingStore.reset();
    router.replace("/onboarding");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Mon profil</Text>

        {/* Auth card */}
        <View style={[styles.authCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
          {user ? (
            <>
              <View style={styles.authRow}>
                <View style={[styles.avatar, { backgroundColor: colors.coral }]}>
                  <Text style={styles.avatarText}>
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.authName, { color: colors.textPrimary }]} numberOfLines={1}>{user.name || "Utilisateur"}</Text>
                  <Text style={[styles.authEmail, { color: colors.textSecondary }]} numberOfLines={1}>{user.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleLogout}
                style={[styles.authBtn, { borderColor: colors.borderSubtle }]}
                testID="profile-logout"
              >
                <LogOut size={14} color={colors.textPrimary} strokeWidth={2.5} />
                <Text style={[styles.authBtnText, { color: colors.textPrimary }]}>Se déconnecter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteAccount}
                style={[styles.authBtn, { borderColor: colors.error, marginTop: 8 }]}
                testID="profile-delete-account"
              >
                <Trash2 size={14} color={colors.error} strokeWidth={2.5} />
                <Text style={[styles.authBtnText, { color: colors.error }]}>Supprimer mon compte (RGPD)</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.authRow}>
                <View style={[styles.avatar, { backgroundColor: colors.coralSoft }]}>
                  <UserIcon size={22} color={colors.coral} strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.authName, { color: colors.textPrimary }]}>Crée ton compte</Text>
                  <Text style={[styles.authEmail, { color: colors.textSecondary }]} numberOfLines={2}>
                    Sauvegarde tes favoris, ton historique Builder et synchronise ton plan.
                  </Text>
                </View>
              </View>
              <View style={styles.authBtnRow}>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/auth", params: { mode: "register" } })}
                  style={[styles.authBtnPrimary, { backgroundColor: colors.coral }]}
                  testID="profile-signup"
                >
                  <Text style={styles.authBtnPrimaryText}>Créer un compte</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/auth", params: { mode: "login" } })}
                  style={[styles.authBtn, { borderColor: colors.borderSubtle }]}
                  testID="profile-login"
                >
                  <LogIn size={14} color={colors.textPrimary} strokeWidth={2.5} />
                  <Text style={[styles.authBtnText, { color: colors.textPrimary }]}>Connexion</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

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

        {/* Settings */}
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
          <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />
          <TouchableOpacity onPress={replayOnboarding} style={styles.settingRow} testID="profile-replay-onboarding">
            <View style={styles.settingLeft}>
              <RefreshCw size={18} color={colors.textPrimary} strokeWidth={2} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Refaire l'onboarding</Text>
            </View>
            <ArrowRight size={16} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />
          <TouchableOpacity onPress={resetCookieConsent} style={styles.settingRow} testID="profile-reset-cookies">
            <View style={styles.settingLeft}>
              <Cookie size={18} color={colors.textPrimary} strokeWidth={2} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Préférences cookies</Text>
            </View>
            <ArrowRight size={16} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Legal links */}
        <View style={[styles.legalCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
          <Text style={[styles.legalTitle, { color: colors.textSecondary }]}>INFORMATIONS LÉGALES</Text>
          {[
            { type: "mentions", label: "Mentions légales" },
            { type: "cgu", label: "CGU" },
            { type: "cgv", label: "CGV" },
            { type: "privacy", label: "Politique de confidentialité (RGPD)" },
          ].map((l, i, arr) => (
            <React.Fragment key={l.type}>
              <TouchableOpacity
                onPress={() => router.push(`/legal/${l.type}`)}
                style={styles.legalRow}
                testID={`legal-link-${l.type}`}
              >
                <View style={styles.settingLeft}>
                  <FileText size={16} color={colors.textPrimary} strokeWidth={2} />
                  <Text style={[styles.settingText, { color: colors.textPrimary }]}>{l.label}</Text>
                </View>
                <ArrowRight size={14} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
              {i < arr.length - 1 ? <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} /> : null}
            </React.Fragment>
          ))}
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

        {/* Saved tools */}
        <View style={styles.sectionHead}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Bookmark size={18} color={colors.textPrimary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>IA favoris</Text>
          </View>
          <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>{savedTools.length}</Text>
        </View>
        {savedTools.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>Aucune IA en favoris pour l'instant. Touche le marque-page sur une IA dans le Catalogue.</Text>
        ) : (
          savedTools.map((t) => (
            <TouchableOpacity
              key={t.slug}
              onPress={() => router.push(`/tool/${t.slug}`)}
              style={[styles.bmRow, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
              testID={`bookmark-tool-${t.slug}`}
            >
              <LogoTile uri={t.image} name={t.name} bg={t.color} size={42} rounded={10} domain={t.domain} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.bmTitle, { color: colors.textPrimary }]} numberOfLines={1}>{t.name}</Text>
                <Text style={[styles.bmMeta, { color: colors.textSecondary }]} numberOfLines={1}>{t.tagline}</Text>
              </View>
              <ArrowRight size={16} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          ))
        )}

        {/* Saved news */}
        <View style={styles.sectionHead}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Bookmark size={18} color={colors.textPrimary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Articles sauvegardés</Text>
          </View>
          <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>{savedNews.length}</Text>
        </View>
        {savedNews.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>Aucun article sauvegardé. Touche le marque-page sur un article dans Actue.</Text>
        ) : (
          savedNews.map((n) => (
            <TouchableOpacity
              key={n.id}
              onPress={() => router.push(`/news/${n.id}`)}
              style={[styles.bmNewsRow, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
              testID={`bookmark-news-${n.id}`}
            >
              <Text style={[styles.bmCat, { color: colors.coral }]}>{n.category}</Text>
              <Text style={[styles.bmNewsTitle, { color: colors.textPrimary }]} numberOfLines={2}>{n.title}</Text>
              <Text style={[styles.bmMeta, { color: colors.textSecondary }]} numberOfLines={1}>{n.readMinutes} min · {n.tag}</Text>
            </TouchableOpacity>
          ))
        )}

        {/* History */}
        <View style={styles.sectionHead}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <History size={18} color={colors.textPrimary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Historique des matchs</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontFamily: fonts.serif, fontSize: 32, marginBottom: spacing.lg, letterSpacing: -0.5 },
  authCard: { borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, marginBottom: spacing.md },
  authRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 20 },
  authName: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 24 },
  authEmail: { fontFamily: fonts.body, fontSize: 12, marginTop: 2, lineHeight: 16 },
  authBtnRow: { flexDirection: "row", gap: 8 },
  authBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 11, borderRadius: radius.pill, borderWidth: 1,
  },
  authBtnText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  authBtnPrimary: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 12, borderRadius: radius.pill,
  },
  authBtnPrimaryText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 13 },
  legalCard: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: spacing.lg },
  legalTitle: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: spacing.sm },
  legalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
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
  divider: { height: 1, marginVertical: 6 },
  heroBlock: { borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  heroTitle: { fontFamily: fonts.serif, fontSize: 22, marginTop: spacing.sm },
  heroSub: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 4, marginBottom: spacing.md },
  cta: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: spacing.md, paddingVertical: 12, borderRadius: radius.pill, alignSelf: "flex-start",
  },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.bodyBold, fontSize: 16 },
  sectionCount: { fontFamily: fonts.bodyBold, fontSize: 13 },
  empty: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginBottom: spacing.sm },
  histItem: { borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1 },
  histNeed: { fontFamily: fonts.bodySemi, fontSize: 15 },
  histMeta: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  bmRow: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    padding: spacing.sm, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1,
  },
  bmTitle: { fontFamily: fonts.bodyBold, fontSize: 14 },
  bmMeta: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  bmNewsRow: { padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1 },
  bmCat: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: 4 },
  bmNewsTitle: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 21, marginBottom: 4 },
});
