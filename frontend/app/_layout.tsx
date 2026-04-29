import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
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

function StackContent() {
  const { colors, mode } = useTheme();
  return (
    <>
      <StatusBar style={mode === "light" ? "dark" : "light"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="match" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
        <Stack.Screen name="tool/[slug]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="news/[id]" options={{ animation: "slide_from_right" }} />
      </Stack>
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
