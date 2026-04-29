import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark";

type Palette = {
  bg: string;
  bgSoft: string;
  surface: string;
  surfaceElev: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  pink: string;
  coral: string;
  success: string;
  warning: string;
  error: string;
  borderSubtle: string;
  pinkSoft: string;
  coralSoft: string;
};

const LIGHT: Palette = {
  bg: "#FDFBF7",
  bgSoft: "#FFF8F0",
  surface: "#FFFFFF",
  surfaceElev: "#FFFFFF",
  card: "#FFFFFF",
  textPrimary: "#111217",
  textSecondary: "#5E636E",
  textInverse: "#FDFBF7",
  pink: "#F43F7A",
  coral: "#FF5A45",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  borderSubtle: "rgba(17, 18, 23, 0.08)",
  pinkSoft: "rgba(244, 63, 122, 0.1)",
  coralSoft: "rgba(255, 90, 69, 0.1)",
};

const DARK: Palette = {
  bg: "#0E1118",
  bgSoft: "#12151C",
  surface: "#161A22",
  surfaceElev: "#1C212B",
  card: "#161A22",
  textPrimary: "#FDFBF7",
  textSecondary: "rgba(253, 251, 247, 0.65)",
  textInverse: "#111217",
  pink: "#F43F7A",
  coral: "#FF7A5F",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  borderSubtle: "rgba(255, 255, 255, 0.08)",
  pinkSoft: "rgba(244, 63, 122, 0.18)",
  coralSoft: "rgba(255, 90, 69, 0.18)",
};

type Ctx = {
  mode: ThemeMode;
  colors: Palette;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
};

const ThemeCtx = createContext<Ctx>({ mode: "light", colors: LIGHT, toggle: () => {}, setMode: () => {} });
const KEY = "ia_match_theme_v1";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === "light" || v === "dark") setModeState(v);
    });
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(KEY, m).catch(() => {});
  }, []);

  const toggle = useCallback(() => setMode(mode === "light" ? "dark" : "light"), [mode, setMode]);

  return (
    <ThemeCtx.Provider value={{ mode, colors: mode === "light" ? LIGHT : DARK, toggle, setMode }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);


// ----- PREMIUM -----
type PremiumCtx = {
  isPremium: boolean;
  setPremium: (v: boolean) => void;
  toggle: () => void;
};

const PremiumContext = createContext<PremiumCtx>({ isPremium: false, setPremium: () => {}, toggle: () => {} });
const PKEY = "ia_match_premium_v1";

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setState] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(PKEY).then((v) => {
      if (v === "1") setState(true);
    });
  }, []);
  const setPremium = useCallback((v: boolean) => {
    setState(v);
    AsyncStorage.setItem(PKEY, v ? "1" : "0").catch(() => {});
  }, []);
  const toggle = useCallback(() => setPremium(!isPremium), [isPremium, setPremium]);
  return <PremiumContext.Provider value={{ isPremium, setPremium, toggle }}>{children}</PremiumContext.Provider>;
}

export const usePremium = () => useContext(PremiumContext);
