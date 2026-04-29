import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
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
import { onboardingStore } from "../src/api";
import CookieConsent from "../src/components/CookieConsent";

function StackContent() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    onboardingStore.isDone().then((done) => {
      if (!done) {
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
      <ThemeProvider>
        <PremiumProvider>
          <StackContent />
        </PremiumProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
