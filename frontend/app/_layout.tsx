import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import {
  useFonts,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_600SemiBold,
} from "@expo-google-fonts/playfair-display";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, PremiumProvider, useTheme } from "../src/theme-context";
import { I18nProvider } from "../src/i18n";
import { betaAccessStore, onboardingStore } from "../src/api";
import { auth } from "../src/auth";
import CookieConsent from "../src/components/CookieConsent";
import { ToastProvider } from "../src/components/Toast";

const appLogo = require("../assets/brand/ia-match-logo.png");

function StackContent() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const [checked, setChecked] = useState(false);
  const [betaAllowed, setBetaAllowed] = useState(false);

  useEffect(() => {
    Promise.all([betaAccessStore.isAllowed(), onboardingStore.isDone()]).then(([allowed, done]) => {
      setBetaAllowed(allowed);
      if (allowed && !done) {
        // Avoid redirect loop if already on onboarding
        const inOnboarding = segments?.[0] === "onboarding";
        if (!inOnboarding) router.replace("/onboarding");
      }
      setChecked(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.coral} />
      </View>
    );
  }

  if (!betaAllowed) {
    return <BetaAccessGate onUnlocked={async () => {
      setBetaAllowed(true);
      const done = await onboardingStore.isDone();
      if (!done) router.replace("/onboarding");
    }} />;
  }

  return (
    <>
      <StatusBar style={mode === "light" ? "dark" : "light"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
        <Stack.Screen name="auth" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="learn" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="legal/[type]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="match" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
        <Stack.Screen name="tool/[slug]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="news/[id]" options={{ animation: "slide_from_right" }} />
      </Stack>
      <CookieConsent />
    </>
  );
}


function BetaAccessGate({ onUnlocked }: { onUnlocked: () => Promise<void> | void }) {
  const { colors, mode } = useTheme();
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = authMode === "register";
  const normalizedPassword = password.trim().toUpperCase().replace(/\s+/g, "");
  const passwordLooksLikeBetaCode = !isRegister && ["IAMATCHBETA", "IAMATCH-TEST", "BETA2026", "IAMATCHTEST"].includes(normalizedPassword);
  const accessCode = code.trim() || (passwordLooksLikeBetaCode ? password : "");
  const canSubmit = Boolean(email.trim() && password.trim() && accessCode.trim() && (!isRegister || accept));

  const submit = async () => {
    if (!canSubmit || loading) return;
    setError("");
    setLoading(true);
    try {
      const ok = await betaAccessStore.submit(accessCode);
      if (!ok) {
        setError("Code incorrect. Mets le code bêta dans le champ du bas, ou utilise IAMATCHBETA comme mot de passe en mode connexion.");
        return;
      }
      if (isRegister) {
        await auth.register(email.trim(), password, name.trim() || email.split("@")[0], true);
      } else {
        await auth.login(email.trim(), password);
      }
      await onUnlocked();
    } catch (e: any) {
      setError(e?.message || "Impossible de continuer pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[betaStyles.wrap, { backgroundColor: colors.bg }]} contentContainerStyle={betaStyles.scrollContent} keyboardShouldPersistTaps="handled">
      <StatusBar style={mode === "light" ? "dark" : "light"} />
      <View style={[betaStyles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
        <View style={betaStyles.logoRow}>
          <Image source={appLogo} style={betaStyles.logo} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text style={[betaStyles.brand, { color: colors.textPrimary }]}>IA MATCH</Text>
            <Text style={[betaStyles.kicker, { color: colors.coral }]}>ACCÈS BÊTA PRIVÉE</Text>
          </View>
        </View>

        <Text style={[betaStyles.title, { color: colors.textPrimary }]}>Ton compte IA Match.</Text>
        <Text style={[betaStyles.text, { color: colors.textSecondary }]}>
          Crée ton compte ou connecte-toi avant d’entrer dans l’app. Le code bêta sert uniquement à réserver l’accès aux testeurs invités.
        </Text>

        <View style={[betaStyles.modeSwitch, { backgroundColor: colors.bg, borderColor: colors.borderSubtle }]}>
          <TouchableOpacity
            onPress={() => { setAuthMode("register"); setError(""); }}
            style={[betaStyles.modeButton, isRegister && { backgroundColor: colors.coral }]}
          >
            <Text style={[betaStyles.modeText, { color: isRegister ? "#fff" : colors.textSecondary }]}>Créer un compte</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setAuthMode("login"); setError(""); }}
            style={[betaStyles.modeButton, !isRegister && { backgroundColor: colors.coral }]}
          >
            <Text style={[betaStyles.modeText, { color: !isRegister ? "#fff" : colors.textSecondary }]}>Se connecter</Text>
          </TouchableOpacity>
        </View>

        {isRegister ? (
          <>
            <Text style={[betaStyles.fieldLabel, { color: colors.textPrimary }]}>Prénom</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ton prénom"
              placeholderTextColor={colors.textSecondary}
              style={[betaStyles.input, { color: colors.textPrimary, borderColor: colors.borderSubtle, backgroundColor: colors.bg }]}
              autoCapitalize="words"
              testID="beta-auth-name"
            />
          </>
        ) : null}

        <Text style={[betaStyles.fieldLabel, { color: colors.textPrimary }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={(v) => { setEmail(v); setError(""); }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          placeholder="toi@email.com"
          placeholderTextColor={colors.textSecondary}
          style={[betaStyles.input, { color: colors.textPrimary, borderColor: colors.borderSubtle, backgroundColor: colors.bg }]}
          testID="beta-auth-email"
        />

        <Text style={[betaStyles.fieldLabel, { color: colors.textPrimary }]}>Mot de passe</Text>
        <TextInput
          value={password}
          onChangeText={(v) => { setPassword(v); setError(""); }}
          secureTextEntry
          autoCapitalize="none"
          autoComplete={isRegister ? "new-password" : "current-password"}
          placeholder={isRegister ? "Minimum 10 caractères" : "Ton mot de passe ou IAMATCHBETA"}
          placeholderTextColor={colors.textSecondary}
          style={[betaStyles.input, { color: colors.textPrimary, borderColor: colors.borderSubtle, backgroundColor: colors.bg }]}
          testID="beta-auth-password"
        />

        <Text style={[betaStyles.fieldLabel, { color: colors.textPrimary }]}>{isRegister ? "Code d’accès bêta" : "Code d’accès bêta (optionnel si IAMATCHBETA est dans le mot de passe)"}</Text>
        <TextInput
          value={code}
          onChangeText={(v) => { setCode(v); setError(""); }}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder={isRegister ? "Code reçu par IA Match" : "Laisse vide si ton mot de passe est IAMATCHBETA"}
          placeholderTextColor={colors.textSecondary}
          style={[betaStyles.input, { color: colors.textPrimary, borderColor: error ? colors.error : colors.borderSubtle, backgroundColor: colors.bg }]}
          onSubmitEditing={submit}
          testID="beta-access-code"
        />

        {isRegister ? (
          <TouchableOpacity onPress={() => setAccept((v) => !v)} style={betaStyles.consentRow} testID="beta-auth-consent">
            <View style={[betaStyles.checkbox, { borderColor: accept ? colors.coral : colors.borderSubtle, backgroundColor: accept ? colors.coral : "transparent" }]}>
              {accept ? <Text style={betaStyles.check}>✓</Text> : null}
            </View>
            <Text style={[betaStyles.consentText, { color: colors.textSecondary }]}>J’accepte les CGU et la Politique de confidentialité.</Text>
          </TouchableOpacity>
        ) : null}

        {error ? <Text style={[betaStyles.error, { color: colors.error }]}>{error}</Text> : null}

        <TouchableOpacity disabled={!canSubmit || loading} onPress={submit} style={[betaStyles.button, { backgroundColor: colors.coral }, (!canSubmit || loading) && { opacity: 0.45 }]} testID="beta-access-submit">
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={betaStyles.buttonText}>{isRegister ? "Créer mon compte et entrer" : "Se connecter et entrer"}</Text>}
        </TouchableOpacity>
        <Text style={[betaStyles.note, { color: colors.textSecondary }]}>En mode connexion bêta, tu peux laisser le code du bas vide si tu as mis IAMATCHBETA comme mot de passe.</Text>
      </View>
    </ScrollView>
  );
}

const betaStyles = StyleSheet.create({
  wrap: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  card: { width: "100%", maxWidth: 460, borderWidth: 1, borderRadius: 28, padding: 24 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 },
  logo: { width: 54, height: 54, borderRadius: 16 },
  brand: { fontFamily: "Inter_700Bold", fontSize: 13, letterSpacing: 4 },
  kicker: { fontFamily: "Inter_700Bold", fontSize: 11, letterSpacing: 2, marginTop: 3 },
  title: { fontFamily: "PlayfairDisplay_700Bold", fontSize: 34, lineHeight: 38, marginBottom: 10 },
  text: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22, marginBottom: 18 },
  modeSwitch: { flexDirection: "row", borderWidth: 1, borderRadius: 999, padding: 4, marginBottom: 18 },
  modeButton: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 999, paddingVertical: 10, paddingHorizontal: 10 },
  modeText: { fontFamily: "Inter_700Bold", fontSize: 12 },
  fieldLabel: { fontFamily: "Inter_700Bold", fontSize: 12, letterSpacing: 0.8, marginBottom: 8, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, fontFamily: "Inter_600SemiBold", fontSize: 15, outlineWidth: 0 } as any,
  consentRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginTop: 14 },
  checkbox: { width: 20, height: 20, borderRadius: 7, borderWidth: 1, alignItems: "center", justifyContent: "center", marginTop: 1 },
  check: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 13, lineHeight: 16 },
  consentText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 18 },
  error: { fontFamily: "Inter_600SemiBold", fontSize: 12, marginTop: 8 },
  button: { marginTop: 14, borderRadius: 999, paddingVertical: 15, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 15 },
  note: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 18, marginTop: 14 },
});

export default function RootLayout() {
  useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <ThemeProvider>
          <PremiumProvider>
            <ToastProvider>
              <StackContent />
            </ToastProvider>
          </PremiumProvider>
        </ThemeProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}


