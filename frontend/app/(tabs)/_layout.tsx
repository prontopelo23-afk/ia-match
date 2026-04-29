import React from "react";
import { Tabs } from "expo-router";
import { Home, Search, GitCompare, BarChart3, User } from "lucide-react-native";
import { Platform, View } from "react-native";
import { colors, fonts } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.pink,
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
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: "tab-home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Recherche",
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: "tab-search",
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: "Comparer",
          tabBarIcon: ({ color, size }) => <GitCompare color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: "tab-compare",
        }}
      />
      <Tabs.Screen
        name="benchmarks"
        options={{
          title: "Benchmarks",
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: "tab-benchmarks",
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
    </Tabs>
  );
}
