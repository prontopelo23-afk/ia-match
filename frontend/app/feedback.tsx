import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Bug, Lightbulb, MessageCircle, PlusCircle } from "lucide-react-native";
import { useTheme } from "../src/theme-context";
import { fonts, radius, spacing } from "../src/theme";
import { openContactEmail, openFeedbackEmail } from "../src/utils/contactLinks";

export default function FeedbackScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [note, setNote] = useState("");
  const actions = [
    { key: "avis" as const, icon: <MessageCircle size={20} color={colors.coral} />, title: "Donner mon avis", text: "Ce qui est clair, confus ou inutile dans la bêta." },
    { key: "erreur" as const, icon: <Bug size={20} color={colors.coral} />, title: "Corriger une recommandation", text: "Un outil mal classé, une actu faible, une réponse pas adaptée." },
    { key: "outil" as const, icon: <PlusCircle size={20} color={colors.coral} />, title: "Proposer un outil", text: "Claude Code, OpenClaw, Cline, assistants métier, outils français…" },
  ];
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={[styles.back, { borderColor: colors.borderSubtle }]} onPress={() => router.back()}>
          <ArrowLeft size={18} color={colors.textPrimary} />
          <Text style={[styles.backText, { color: colors.textPrimary }]}>Retour</Text>
        </TouchableOpacity>
        <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}> 
          <View style={[styles.icon, { backgroundColor: colors.coralSoft }]}><Lightbulb size={24} color={colors.coral} /></View>
          <Text style={[styles.eyebrow, { color: colors.coral }]}>RETOUR BÊTA</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Dis-moi ce qui manque avant que je rajoute des features.</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>IA Match doit devenir compréhensible, utile et monétisable. Ton retour sert à corriger le produit, pas à remplir un formulaire décoratif.</Text>
        </View>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Exemple : dans Academy je ne comprends pas quoi cliquer, dans Actu il manque Claude…"
          placeholderTextColor={colors.textSecondary}
          multiline
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.borderSubtle, color: colors.textPrimary }]}
        />
        {note.trim() ? (
          <TouchableOpacity onPress={() => openContactEmail("IA Match — retour bêta détaillé", note.trim())} style={[styles.primary, { backgroundColor: colors.coral }]} activeOpacity={0.85}>
            <Text style={styles.primaryText}>Envoyer ce retour</Text>
          </TouchableOpacity>
        ) : null}
        {actions.map((action) => (
          <TouchableOpacity key={action.key} onPress={() => openFeedbackEmail(action.key)} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]} activeOpacity={0.85}>
            <View style={[styles.cardIcon, { backgroundColor: colors.coralSoft }]}>{action.icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{action.title}</Text>
              <Text style={[styles.cardText, { color: colors.textSecondary }]}>{action.text}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  back: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 10, marginBottom: spacing.md },
  backText: { fontFamily: fonts.bodyBold, fontSize: 14 },
  hero: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.md },
  icon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.5, marginBottom: 8 },
  title: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 40, letterSpacing: -0.7 },
  subtitle: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23, marginTop: spacing.sm },
  input: { minHeight: 118, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginBottom: spacing.sm, textAlignVertical: "top" },
  primary: { borderRadius: radius.pill, paddingVertical: 13, alignItems: "center", marginBottom: spacing.md },
  primaryText: { color: "#fff", fontFamily: fonts.bodyBold, fontSize: 15 },
  card: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  cardIcon: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 26 },
  cardText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 3 },
});
