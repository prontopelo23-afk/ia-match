import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Info } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme-context";
import { fonts, radius, shadow, spacing } from "../theme";

type ToastKind = "success" | "info";
type ToastInput = string | { title: string; message?: string; kind?: ToastKind };
type ToastContextValue = { showToast: (toast: ToastInput) => void };

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ title: string; message?: string; kind: ToastKind } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -12, duration: 180, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const showToast = useCallback((input: ToastInput) => {
    const next = typeof input === "string" ? { title: input, kind: "success" as ToastKind } : { kind: "success" as ToastKind, ...input };
    if (timer.current) clearTimeout(timer.current);
    setToast(next);
    opacity.setValue(0);
    translateY.setValue(-12);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
    timer.current = setTimeout(hide, 2600);
  }, [hide, opacity, translateY]);

  const Icon = toast?.kind === "info" ? Info : CheckCircle2;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <Animated.View pointerEvents="none" style={[styles.wrap, { top: insets.top + spacing.sm, opacity, transform: [{ translateY }] }]}>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }, shadow.medium]}>
            <View style={[styles.icon, { backgroundColor: colors.coralSoft }]}>
              <Icon size={18} color={colors.coral} strokeWidth={2.6} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{toast.title}</Text>
              {toast.message ? <Text style={[styles.message, { color: colors.textSecondary }]}>{toast.message}</Text> : null}
            </View>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: spacing.md, right: spacing.md, zIndex: 9999, alignItems: "center" },
  card: { width: "100%", maxWidth: 520, borderWidth: 1, borderRadius: radius.lg, padding: spacing.sm, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  icon: { width: 36, height: 36, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.bodyBold, fontSize: 14 },
  message: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginTop: 2 },
});
