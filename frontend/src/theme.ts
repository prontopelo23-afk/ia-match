// Design tokens used across the app
export const colors = {
  bg: "#FDFBF7",
  bgSoft: "#FFF8F0",
  surface: "#FFFFFF",
  darkCard: "#12151C",
  textPrimary: "#111217",
  textSecondary: "#5E636E",
  textInverse: "#FDFBF7",
  pink: "#F43F7A",
  coral: "#FF5A45",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  borderSubtle: "rgba(17, 18, 23, 0.06)",
  borderDark: "rgba(255, 255, 255, 0.1)",
  pinkSoft: "rgba(244, 63, 122, 0.1)",
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 9999,
};

export const fonts = {
  serif: "PlayfairDisplay_700Bold",
  serifMd: "PlayfairDisplay_600SemiBold",
  body: "Inter_400Regular",
  bodyMd: "Inter_500Medium",
  bodyBold: "Inter_700Bold",
  bodySemi: "Inter_600SemiBold",
};

export const shadow = {
  soft: {
    shadowColor: "#111217",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  medium: {
    shadowColor: "#111217",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  dark: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 12,
  },
};
