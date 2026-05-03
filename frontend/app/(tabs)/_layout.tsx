import React from "react";
import { Tabs } from "expo-router";
import { BookOpen, Grid2X2, User, WandSparkles, Sparkles, Layers3 } from "lucide-react-native";
import { useTheme } from "../../src/theme-context";
import { useI18n } from "../../src/i18n";
import { fonts } from "../../src/theme";

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSubtle,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 7,
          paddingBottom: 10,
          elevation: 12,
          shadowColor: "#111217",
          shadowOpacity: 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -6 },
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodySemi,
          fontSize: 10,
          marginTop: 1,
        },
        tabBarIconStyle: { marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("nav.home"),
          tabBarIcon: ({ color, size }) => <Grid2X2 color={color} size={size + 1} strokeWidth={2.4} />,
          tabBarButtonTestID: "tab-accueil",
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          title: t("nav.match"),
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size + 1} strokeWidth={2.4} />,
          tabBarButtonTestID: "tab-match",
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t("nav.catalog"),
          tabBarIcon: ({ color, size }) => <Layers3 color={color} size={size + 1} strokeWidth={2.4} />,
          tabBarButtonTestID: "tab-catalogue",
        }}
      />
      <Tabs.Screen
        name="academy"
        options={{
          title: t("nav.academy"),
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size + 1} strokeWidth={2.4} />,
          tabBarButtonTestID: "tab-academy",
        }}
      />
      <Tabs.Screen
        name="builder"
        options={{
          title: t("nav.prompt"),
          tabBarIcon: ({ color, size }) => <WandSparkles color={color} size={size + 1} strokeWidth={2.4} />,
          tabBarButtonTestID: "tab-builder",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("nav.profile"),
          tabBarIcon: ({ color, size }) => <User color={color} size={size + 1} strokeWidth={2.4} />,
          tabBarButtonTestID: "tab-profil",
        }}
      />

      <Tabs.Screen name="actue" options={{ href: null }} />
      <Tabs.Screen name="benchmarks" options={{ href: null }} />
      <Tabs.Screen name="compare" options={{ href: null }} />
    </Tabs>
  );
}
