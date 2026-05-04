import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { History, Trash2, Sparkles, Wand2, Sun, Moon, Crown, Bookmark, RefreshCw, ArrowRight, LogIn, LogOut, FileText, Cookie, User as UserIcon, Globe2, Check, ChevronDown, Mail } from "lucide-react-native";
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
  NEWSLETTER_PREFERENCES,
  newsletterPreferences,
} from "../../src/api";
import { auth, AuthUser, consent } from "../../src/auth";
import LogoTile from "../../src/components/LogoTile";
import { useI18n } from "../../src/i18n";
import { openNewsletterSignup } from "../../src/utils/contactLinks";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, mode, toggle } = useTheme();
  const { t, language, setLanguage, languages } = useI18n();
  const { isPremium, setPremium } = usePremium();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [savedTools, setSavedTools] = useState<Tool[]>([]);
  const [savedNews, setSavedNews] = useState<NewsItem[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [newsletterPrefs, setNewsletterPrefs] = useState<string[]>([]);

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
      newsletterPreferences.list().then(setNewsletterPrefs);
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

  const copyHistoryPrompt = async (prompt?: string) => {
    if (!prompt) return;
    try {
      await Clipboard.setStringAsync(prompt);
      Alert.alert("Prompt copié", "Tu peux le coller dans l’IA recommandée.");
    } catch {}
  };

  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleNewsletterPref = async (id: string) => {
    const next = await newsletterPreferences.toggle(id);
    setNewsletterPrefs(next);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t("profile.title")}</Text>

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
        <ProfileSection title="Réglages" subtitle={`Langue : ${languages.find((l) => l.code === language)?.nativeName || language} · thème · cookies · légal`} open={!!openSections.settings} onToggle={() => toggleSection("settings")}>
        <View style={[styles.languageCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}> 
          <View style={styles.languageHeader}>
            <View style={styles.settingLeft}>
              <Globe2 size={18} color={colors.textPrimary} strokeWidth={2.2} />
              <View>
                <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t("profile.language")}</Text>
                <Text style={[styles.languageHelp, { color: colors.textSecondary }]}>{t("profile.languageAuto")}</Text>
              </View>
            </View>
          </View>
          <View style={styles.languageGrid}>
            {languages.map((item) => {
              const active = language === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  onPress={() => setLanguage(item.code)}
                  style={[styles.languagePill, { borderColor: active ? colors.coral : colors.borderSubtle, backgroundColor: active ? colors.coralSoft : colors.bg }]}
                  testID={`language-${item.code}`}
                >
                  <View style={styles.languagePillTop}>
                    <Text style={[styles.languageName, { color: active ? colors.coral : colors.textPrimary }]}>{item.nativeName}</Text>
                    {active ? <Check size={13} color={colors.coral} strokeWidth={3} /> : null}
                  </View>
                  <Text style={[styles.languageMarket, { color: colors.textSecondary }]} numberOfLines={2}>{t("profile.languageMarket")} : {item.market}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
          <TouchableOpacity onPress={toggle} style={styles.settingRow} testID="profile-toggle-theme">
            <View style={styles.settingLeft}>
              {mode === "light" ? (
                <Sun size={18} color={colors.textPrimary} strokeWidth={2} />
              ) : (
                <Moon size={18} color={colors.textPrimary} strokeWidth={2} />
              )}
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t("profile.theme")}</Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.coral }]}>
              {mode === "light" ? t("profile.day") : t("profile.night")}
            </Text>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />
          <TouchableOpacity onPress={replayOnboarding} style={styles.settingRow} testID="profile-replay-onboarding">
            <View style={styles.settingLeft}>
              <RefreshCw size={18} color={colors.textPrimary} strokeWidth={2} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t("profile.replayOnboarding")}</Text>
            </View>
            <ArrowRight size={16} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />
          <TouchableOpacity onPress={resetCookieConsent} style={styles.settingRow} testID="profile-reset-cookies">
            <View style={styles.settingLeft}>
              <Cookie size={18} color={colors.textPrimary} strokeWidth={2} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>{t("profile.cookiePrefs")}</Text>
            </View>
            <ArrowRight size={16} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        </ProfileSection>


        <ProfileSection title="Préférences de veille IA" subtitle={`${newsletterPrefs.length || 0} thème(s) cochés · digest personnalisable`} open={!!openSections.newsletter} onToggle={() => toggleSection("newsletter")}>
          <View style={[styles.watchCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}> 
            <View style={styles.watchHeader}>
              <View style={[styles.watchIcon, { backgroundColor: colors.coralSoft }]}><Mail size={18} color={colors.coral} strokeWidth={2.5} /></View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.watchTitle, { color: colors.textPrimary }]}>Choisis ce que tu veux recevoir</Text>
                <Text style={[styles.watchSub, { color: colors.textSecondary }]}>La newsletter devient utile : moins de bruit, plus d’actions concrètes selon tes intérêts.</Text>
              </View>
            </View>
            <View style={styles.prefGrid}>
              {NEWSLETTER_PREFERENCES.map((pref) => {
                const active = newsletterPrefs.includes(pref.id);
                return (
                  <TouchableOpacity key={pref.id} onPress={() => toggleNewsletterPref(pref.id)} style={[styles.prefPill, { backgroundColor: active ? colors.coralSoft : colors.bg, borderColor: active ? colors.coral : colors.borderSubtle }]} activeOpacity={0.84}>
                    <View style={[styles.prefCheck, { backgroundColor: active ? colors.coral : "transparent", borderColor: active ? colors.coral : colors.borderSubtle }]}>
                      {active ? <Check size={12} color="#fff" strokeWidth={3} /> : null}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.prefLabel, { color: active ? colors.coral : colors.textPrimary }]}>{pref.label}</Text>
                      <Text style={[styles.prefHelp, { color: colors.textSecondary }]}>{pref.helper}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity onPress={() => openNewsletterSignup(`Préférences : ${newsletterPrefs.join(", ") || "digest général"}`)} style={[styles.watchCta, { backgroundColor: colors.coral }]}>
              <Text style={styles.watchCtaText}>Recevoir un digest adapté</Text>
            </TouchableOpacity>
          </View>
        </ProfileSection>

        <ProfileSection title="Infos légales" subtitle="Mentions, CGU, CGV, confidentialité" open={!!openSections.legal} onToggle={() => toggleSection("legal")}>
        {/* Legal links */}
        <View style={[styles.legalCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
          <Text style={[styles.legalTitle, { color: colors.textSecondary }]}>{t("profile.legalInfo")}</Text>
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
        </ProfileSection>

        {/* CTA new match */}
        <View style={[styles.heroBlock, { backgroundColor: colors.coralSoft }]}>
          <Sparkles size={20} color={colors.coral} strokeWidth={2.5} />
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>{t("profile.newMatchTitle")}</Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
            {t("profile.newMatchSub")}
          </Text>
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: colors.coral }]}
            onPress={() => router.push("/match")}
            testID="profile-new-match"
          >
            <Wand2 size={16} color="#fff" strokeWidth={2.5} />
            <Text style={styles.ctaText}>{t("profile.newMatchCta")}</Text>
          </TouchableOpacity>
        </View>

        <ProfileSection title="Favoris" subtitle={`${savedTools.length} IA · ${savedNews.length} articles`} open={!!openSections.favorites} onToggle={() => toggleSection("favorites")} compact>
        {/* Saved tools */}
        <View style={styles.sectionHead}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Bookmark size={18} color={colors.textPrimary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t("profile.savedTools")}</Text>
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
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t("profile.savedNews")}</Text>
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

        </ProfileSection>

        <ProfileSection title="Historique Match" subtitle={items.length ? `${items.length} match(s) enregistré(s)` : "Aucun match enregistré"} open={!!openSections.history} onToggle={() => toggleSection("history")} compact>
        {/* History */}
        <View style={styles.sectionHead}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <History size={18} color={colors.textPrimary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t("profile.history")}</Text>
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
              {it.bestToolName ? (
                <Text style={[styles.histBest, { color: colors.coral }]}>Meilleur choix : {it.bestToolName}{it.matchScore ? ` · ${it.matchScore}/100` : ""}</Text>
              ) : null}
              <Text style={[styles.histMeta, { color: colors.textSecondary }]}>
                {new Date(it.createdAt).toLocaleDateString("fr-FR")} · Priorité : {it.priority}
              </Text>
              <View style={styles.histActions}>
                {it.bestToolSlug ? (
                  <TouchableOpacity onPress={() => router.push(`/tool/${it.bestToolSlug}`)} style={[styles.histBtn, { borderColor: colors.borderSubtle }]}>
                    <Text style={[styles.histBtnText, { color: colors.textPrimary }]}>Voir l’outil</Text>
                  </TouchableOpacity>
                ) : null}
                {it.readyPrompt ? (
                  <TouchableOpacity onPress={() => copyHistoryPrompt(it.readyPrompt)} style={[styles.histBtnPrimary, { backgroundColor: colors.coral }]}>
                    <Text style={styles.histBtnPrimaryText}>Copier le prompt</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))
        )}
        </ProfileSection>
      </ScrollView>
    </SafeAreaView>
  );
}


function ProfileSection({ title, subtitle, open, onToggle, children, compact = false }: { title: string; subtitle: string; open: boolean; onToggle: () => void; children: React.ReactNode; compact?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.profileSectionCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }, compact && styles.profileSectionCardCompact]}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.85} style={styles.profileSectionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.profileSectionTitle, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.profileSectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
        <ChevronDown size={18} color={colors.coral} strokeWidth={2.5} style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }} />
      </TouchableOpacity>
      {open ? <View style={styles.profileSectionBody}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontFamily: fonts.serif, fontSize: 28, marginBottom: spacing.md, letterSpacing: -0.5 },
  profileSectionCard: { borderRadius: radius.lg, borderWidth: 1, marginBottom: spacing.md, overflow: "hidden" },
  profileSectionCardCompact: { marginBottom: spacing.sm },
  profileSectionHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md },
  profileSectionTitle: { fontFamily: fonts.bodyBold, fontSize: 15 },
  profileSectionSubtitle: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 2 },
  profileSectionBody: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
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
  legalCard: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: 0 },
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
  settingsCard: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: spacing.sm },
  languageCard: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, marginBottom: spacing.sm },
  languageHeader: { marginBottom: spacing.sm },
  languageHelp: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16, marginTop: 2 },
  languageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  languagePill: { width: "48%", borderWidth: 1, borderRadius: radius.md, padding: 10, minHeight: 82 },
  languagePillTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 6 },
  languageName: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 12 },
  languageMarket: { fontFamily: fonts.body, fontSize: 10, lineHeight: 14, marginTop: 5 },
  settingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  settingText: { fontFamily: fonts.bodySemi, fontSize: 14 },
  settingValue: { fontFamily: fonts.bodyBold, fontSize: 13 },
  divider: { height: 1, marginVertical: 6 },
  watchCard: { borderRadius: radius.lg, padding: spacing.md, borderWidth: 1 },
  watchHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: spacing.sm },
  watchIcon: { width: 40, height: 40, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  watchTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 25 },
  watchSub: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 3 },
  prefGrid: { gap: 8 },
  prefPill: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderWidth: 1, borderRadius: radius.md, padding: 10 },
  prefCheck: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center", marginTop: 1 },
  prefLabel: { fontFamily: fonts.bodyBold, fontSize: 13 },
  prefHelp: { fontFamily: fonts.body, fontSize: 11, lineHeight: 15, marginTop: 2 },
  watchCta: { alignItems: "center", borderRadius: radius.pill, paddingVertical: 12, marginTop: spacing.md },
  watchCtaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 13 },
  heroBlock: { borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  heroTitle: { fontFamily: fonts.serif, fontSize: 22, marginTop: spacing.sm },
  heroSub: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 4, marginBottom: spacing.md },
  cta: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: spacing.md, paddingVertical: 12, borderRadius: radius.pill, alignSelf: "flex-start",
  },
  ctaText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 14 },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.md, marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.bodyBold, fontSize: 16 },
  sectionCount: { fontFamily: fonts.bodyBold, fontSize: 13 },
  empty: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginBottom: spacing.sm },
  histItem: { borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1 },
  histNeed: { fontFamily: fonts.bodySemi, fontSize: 15, lineHeight: 20 },
  histBest: { fontFamily: fonts.bodyBold, fontSize: 12, marginTop: 8 },
  histMeta: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  histActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.sm },
  histBtn: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8 },
  histBtnText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  histBtnPrimary: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8 },
  histBtnPrimaryText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 12 },
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
