import React from "react";
import { Tabs } from "expo-router";
import { LayoutGrid, Newspaper, GraduationCap, Wand2, User } from "lucide-react-native";
import { Platform } from "react-native";
import { colors, fonts } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.borderSubtle,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontFamily: fonts.bodySemi, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Catalogue",
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: "tab-catalogue",
        }}
      />
      <Tabs.Screen
        name="actue"
        options={{
          title: "Actue",
          tabBarIcon: ({ color, size }) => <Newspaper color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: "tab-actue",
        }}
      />
      <Tabs.Screen
        name="academy"
        options={{
          title: "Academy",
          tabBarIcon: ({ color, size }) => <GraduationCap color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: "tab-academy",
        }}
      />
      <Tabs.Screen
        name="builder"
        options={{
          title: "Builder",
          tabBarIcon: ({ color, size }) => <Wand2 color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: "tab-builder",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: "tab-profile",
        }}
      />
      {/* Hidden routes still navigable but not in the tab bar */}
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="compare" options={{ href: null }} />
      <Tabs.Screen name="benchmarks" options={{ href: null }} />
    </Tabs>
  );
}
