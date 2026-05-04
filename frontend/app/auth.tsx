import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Mail, Lock, User as UserIcon, Eye, EyeOff, Check } from "lucide-react-native";
import { fonts, radius, spacing } from "../src/theme";
import { useTheme } from "../src/theme-context";
import { auth } from "../src/auth";

const appLogo = require("../assets/brand/ia-match-logo.png");

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const initialMode = params.mode === "register" ? "register" : "login";
  const { colors } = useTheme();
  const [mode, setMode] = useState<"login" | "register">(initialMode as any);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") {
        if (!accept) throw new Error("Tu dois accepter les CGU et la Politique de confidentialité");
        await auth.register(email.trim(), password, name.trim() || email.split("@")[0], true);
      } else {
        await auth.login(email.trim(), password);
      }
      router.replace("/(tabs)/profile");
    } catch (e: any) {
      setError(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.borderSubtle }]} testID="auth-back">
            <ArrowLeft size={18} color={colors.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.brand, { color: colors.textPrimary }]}>IA MATCH</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.authLogoBlock}>
            <Image source={appLogo} style={styles.authLogo} resizeMode="contain" />
            <Text style={[styles.authBrand, { color: colors.textPrimary }]}>IA MATCH</Text>
          </View>
          <Text style={[styles.eyebrow, { color: colors.coral }]}>
            {mode === "login" ? "CONNEXION" : "CRÉER UN COMPTE"}
          </Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {mode === "login" ? (
              <>Bon <Text style={[styles.titleAccent, { color: colors.coral }]}>retour</Text>.</>
            ) : (
              <>Crée ton <Text style={[styles.titleAccent, { color: colors.coral }]}>compte</Text>.</>
            )}
          </Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            {mode === "login"
              ? "Reconnecte-toi pour retrouver tes favoris, ton historique Builder et ton profil."
              : "Sauvegarde tes favoris, ton historique Builder et synchronise ton plan."}
          </Text>

          <View style={styles.form}>
            {mode === "register" ? (
              <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
                <UserIcon size={16} color={colors.textSecondary} strokeWidth={2} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Prénom (optionnel)"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { color: colors.textPrimary }]}
                  autoCapitalize="words"
                  testID="auth-name"
                />
              </View>
            ) : null}

            <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
              <Mail size={16} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.textPrimary }]}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                testID="auth-email"
              />
            </View>

            <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
              <Lock size={16} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={mode === "register" ? "Mot de passe (min. 10 car., 1 lettre, 1 chiffre)" : "Mot de passe"}
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.textPrimary }]}
                secureTextEntry={!showPwd}
                autoCapitalize="none"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                testID="auth-password"
              />
              <TouchableOpacity onPress={() => setShowPwd((s) => !s)}>
                {showPwd ? (
                  <EyeOff size={16} color={colors.textSecondary} strokeWidth={2} />
                ) : (
                  <Eye size={16} color={colors.textSecondary} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>

            {mode === "register" ? (
              <TouchableOpacity
                onPress={() => setAccept(!accept)}
                style={styles.consentRow}
                testID="auth-consent"
              >
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: accept ? colors.coral : colors.borderSubtle, backgroundColor: accept ? colors.coral : "transparent" },
                  ]}
                >
                  {accept ? <Check size={12} color="#fff" strokeWidth={3} /> : null}
                </View>
                <Text style={[styles.consentText, { color: colors.textSecondary }]}>
                  J'accepte les{" "}
                  <Text
                    style={{ color: colors.coral, fontFamily: fonts.bodySemi }}
                    onPress={() => router.push("/legal/cgu")}
                  >
                    CGU
                  </Text>{" "}
                  et la{" "}
                  <Text
                    style={{ color: colors.coral, fontFamily: fonts.bodySemi }}
                    onPress={() => router.push("/legal/privacy")}
                  >
                    Politique de confidentialité
                  </Text>
                  .
                </Text>
              </TouchableOpacity>
            ) : null}

            {error ? (
              <Text style={[styles.error, { color: colors.error }]} testID="auth-error">
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={submit}
              disabled={loading || !email.trim() || !password.trim() || (mode === "register" && !accept)}
              style={[
                styles.submit,
                { backgroundColor: colors.coral },
                (loading || !email.trim() || !password.trim() || (mode === "register" && !accept)) && {
                  opacity: 0.4,
                },
              ]}
              testID="auth-submit"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>{mode === "login" ? "Se connecter" : "Créer mon compte"}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setError(null);
                setMode(mode === "login" ? "register" : "login");
              }}
              style={styles.switch}
              testID="auth-switch"
            >
              <Text style={[styles.switchText, { color: colors.textSecondary }]}>
                {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
                <Text style={{ color: colors.coral, fontFamily: fonts.bodyBold }}>
                  {mode === "login" ? "Inscris-toi" : "Connecte-toi"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.legal, { color: colors.textSecondary }]}>
            En continuant, tu acceptes nos{" "}
            <Text onPress={() => router.push("/legal/mentions")} style={{ color: colors.coral }}>
              Mentions légales
            </Text>
            ,{" "}
            <Text onPress={() => router.push("/legal/cgu")} style={{ color: colors.coral }}>
              CGU
            </Text>
            ,{" "}
            <Text onPress={() => router.push("/legal/cgv")} style={{ color: colors.coral }}>
              CGV
            </Text>{" "}
            et notre{" "}
            <Text onPress={() => router.push("/legal/privacy")} style={{ color: colors.coral }}>
              Politique de confidentialité
            </Text>
            .
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  brand: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 4 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  authLogoBlock: { alignItems: "center", marginBottom: spacing.lg },
  authLogo: { width: 72, height: 72, borderRadius: 20, marginBottom: 10 },
  authBrand: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 4 },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, marginBottom: spacing.sm },
  title: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 42, letterSpacing: -1 },
  titleAccent: { fontStyle: "italic" },
  sub: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, marginBottom: spacing.xl },
  form: { gap: spacing.sm },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 14, outlineWidth: 0 } as any,
  consentRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginTop: 4 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  consentText: { flex: 1, fontFamily: fonts.body, fontSize: 12, lineHeight: 18 },
  error: { fontFamily: fonts.bodySemi, fontSize: 13, marginTop: 4 },
  submit: { paddingVertical: 16, borderRadius: radius.pill, alignItems: "center", marginTop: spacing.md },
  submitText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 15 },
  switch: { alignItems: "center", marginTop: spacing.md },
  switchText: { fontFamily: fonts.body, fontSize: 13 },
  legal: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: spacing.xl },
});
