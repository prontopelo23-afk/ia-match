import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
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
import CookieConsent from "../src/components/CookieConsent";

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
    return <BetaAccessGate onUnlocked={() => setBetaAllowed(true)} />;
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


function BetaAccessGate({ onUnlocked }: { onUnlocked: () => void }) {
  const { colors, mode } = useTheme();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true);
    const ok = await betaAccessStore.submit(code);
    setLoading(false);
    if (ok) onUnlocked();
    else setError("Code incorrect. Vérifie le code bêta transmis par IA Match.");
  };
  return (
    <View style={[betaStyles.wrap, { backgroundColor: colors.bg }]}>
      <StatusBar style={mode === "light" ? "dark" : "light"} />
      <View style={[betaStyles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
        <Text style={[betaStyles.kicker, { color: colors.coral }]}>BÊTA PRIVÉE</Text>
        <Text style={[betaStyles.title, { color: colors.textPrimary }]}>IA Match est en test.</Text>
        <Text style={[betaStyles.text, { color: colors.textSecondary }]}>Entre le code d’accès reçu pour ouvrir la bêta. Ça évite que tout le monde tombe dessus avant la version publique.</Text>
        <TextInput
          value={code}
          onChangeText={(v) => { setCode(v); setError(""); }}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="Code d’accès"
          placeholderTextColor={colors.textSecondary}
          style={[betaStyles.input, { color: colors.textPrimary, borderColor: error ? colors.error : colors.borderSubtle, backgroundColor: colors.bg }]}
          onSubmitEditing={submit}
          testID="beta-access-code"
        />
        {error ? <Text style={[betaStyles.error, { color: colors.error }]}>{error}</Text> : null}
        <TouchableOpacity disabled={!code.trim() || loading} onPress={submit} style={[betaStyles.button, { backgroundColor: colors.coral }, (!code.trim() || loading) && { opacity: 0.45 }]} testID="beta-access-submit">
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={betaStyles.buttonText}>Entrer dans la bêta</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const betaStyles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  card: { width: "100%", maxWidth: 460, borderWidth: 1, borderRadius: 28, padding: 24 },
  kicker: { fontFamily: "Inter_700Bold", fontSize: 12, letterSpacing: 2, marginBottom: 10 },
  title: { fontFamily: "PlayfairDisplay_700Bold", fontSize: 36, lineHeight: 40, marginBottom: 10 },
  text: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22, marginBottom: 18 },
  input: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, fontFamily: "Inter_600SemiBold", fontSize: 16, letterSpacing: 1.2, outlineWidth: 0 } as any,
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
            <StackContent />
          </PremiumProvider>
        </ThemeProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
