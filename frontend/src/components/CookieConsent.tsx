import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Cookie, X, Check } from "lucide-react-native";
import { fonts, radius, spacing } from "../theme";
import { useTheme } from "../theme-context";
import { consent, ConsentValue } from "../auth";

/**
 * GDPR-compliant cookie / tracking consent banner.
 * Shown on first launch, persisted in AsyncStorage.
 * - Necessary: always true
 * - Analytics + Marketing: explicit opt-in
 */
export default function CookieConsent() {
  const { colors } = useTheme();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    consent.get().then((c) => {
      if (!c) setVisible(true);
    });
  }, []);

  if (!visible) return null;

  const save = async (v: ConsentValue) => {
    await consent.set(v);
    setVisible(false);
  };

  const acceptAll = () =>
    save({ necessary: true, analytics: true, marketing: true, acceptedAt: Date.now() });

  const refuseAll = () =>
    save({ necessary: true, analytics: false, marketing: false, acceptedAt: Date.now() });

  const saveCustom = () =>
    save({ necessary: true, analytics, marketing, acceptedAt: Date.now() });

  return (
    <View style={[styles.wrap, { pointerEvents: "box-none" } as any]}>
      <Pressable style={styles.backdrop} onPress={() => {}} />
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            borderColor: colors.borderSubtle,
          },
        ]}
        testID="cookie-consent"
      >
        <View style={styles.head}>
          <View style={[styles.iconCircle, { backgroundColor: colors.coralSoft }]}>
            <Cookie size={18} color={colors.coral} strokeWidth={2.5} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Tes préférences cookies</Text>
        </View>

        <Text style={[styles.body, { color: colors.textSecondary }]}>
          IA Match utilise des cookies <Text style={{ fontFamily: fonts.bodyBold, color: colors.textPrimary }}>strictement nécessaires</Text> pour fonctionner.
          Pour la mesure d'audience et le marketing, ton consentement explicite est requis (RGPD).
          Tu peux modifier ce choix à tout moment depuis ton profil.{" "}
          <Text style={{ color: colors.coral }} onPress={() => router.push("/legal/privacy")}>
            Politique de confidentialité
          </Text>
          .
        </Text>

        {showDetails ? (
          <View style={{ gap: 10, marginTop: spacing.sm }}>
            <CookieRow
              label="Nécessaires"
              hint="Authentification, sécurité, préférences. Toujours actifs."
              value={true}
              disabled
              onChange={() => {}}
            />
            <CookieRow
              label="Mesure d'audience"
              hint="Statistiques d'usage anonymisées pour améliorer l'app."
              value={analytics}
              onChange={setAnalytics}
            />
            <CookieRow
              label="Marketing"
              hint="Personnalisation des suggestions et campagnes."
              value={marketing}
              onChange={setMarketing}
            />
          </View>
        ) : null}

        <View style={styles.actions}>
          {!showDetails ? (
            <>
              <TouchableOpacity
                onPress={refuseAll}
                style={[styles.btnGhost, { borderColor: colors.borderSubtle }]}
                testID="cookie-refuse"
              >
                <Text style={[styles.btnGhostText, { color: colors.textPrimary }]}>Tout refuser</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDetails(true)}
                style={[styles.btnGhost, { borderColor: colors.borderSubtle }]}
                testID="cookie-customize"
              >
                <Text style={[styles.btnGhostText, { color: colors.textPrimary }]}>Personnaliser</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={acceptAll} style={[styles.btnPrimary, { backgroundColor: colors.coral }]} testID="cookie-accept">
                <Text style={styles.btnPrimaryText}>Tout accepter</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setShowDetails(false)}
                style={[styles.btnGhost, { borderColor: colors.borderSubtle }]}
                testID="cookie-back"
              >
                <Text style={[styles.btnGhostText, { color: colors.textPrimary }]}>Retour</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveCustom} style={[styles.btnPrimary, { backgroundColor: colors.coral }]} testID="cookie-save">
                <Text style={styles.btnPrimaryText}>Enregistrer mes choix</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

function CookieRow({
  label,
  hint,
  value,
  disabled,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => !disabled && onChange(!value)}
      style={[styles.cookieRow, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }, disabled && { opacity: 0.7 }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.rowHint, { color: colors.textSecondary }]}>{hint}</Text>
      </View>
      <View
        style={[
          styles.toggleTrack,
          { backgroundColor: value ? colors.coral : colors.borderSubtle },
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            { transform: [{ translateX: value ? 18 : 0 }] },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 1000,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
  } as any,
  sheet: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    boxShadow: "0px 16px 40px rgba(0, 0, 0, 0.25)",
  } as any,
  head: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: spacing.sm },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontFamily: fonts.serif, fontSize: 22, letterSpacing: -0.5 },
  body: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.md },
  btnGhost: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  btnGhostText: { fontFamily: fonts.bodySemi, fontSize: 12 },
  btnPrimary: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.pill,
    flexGrow: 1,
    alignItems: "center",
  },
  btnPrimaryText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 13 },
  cookieRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  rowLabel: { fontFamily: fonts.bodyBold, fontSize: 13 },
  rowHint: { fontFamily: fonts.body, fontSize: 11, lineHeight: 15, marginTop: 2 },
  toggleTrack: {
    width: 40,
    height: 22,
    borderRadius: 11,
    padding: 2,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
  },
});
