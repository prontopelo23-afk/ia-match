import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Bot, CheckCircle2, GitBranch, Layers3, ShieldAlert, Sparkles, Zap } from "lucide-react-native";
import { colors, fonts, radius, shadow, spacing } from "../theme";
import { useTheme } from "../theme-context";

export function WorkflowMap({ title = "De l’idée au résultat", steps }: { title?: string; steps: string[] }) {
  const { colors: theme } = useTheme();
  return (
    <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]}> 
      <View style={styles.titleRow}><GitBranch size={17} color={theme.coral} strokeWidth={2.5} /><Text style={[styles.panelTitle, { color: theme.textPrimary }]}>{title}</Text></View>
      <View style={styles.pipeline}>
        {steps.map((step, index) => (
          <React.Fragment key={`${step}-${index}`}>
            <View style={[styles.node, { backgroundColor: index === 0 ? theme.coral : theme.coralSoft, borderColor: theme.coral }]}> 
              <Text style={[styles.nodeNum, { color: index === 0 ? "#fff" : theme.coral }]}>0{index + 1}</Text>
              <Text style={[styles.nodeText, { color: index === 0 ? "#fff" : theme.textPrimary }]}>{step}</Text>
            </View>
            {index < steps.length - 1 ? <Text style={[styles.arrow, { color: theme.coral }]}>↓</Text> : null}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

export function ScoreGauge({ label, value, helper }: { label: string; value: number; helper?: string }) {
  const { colors: theme } = useTheme();
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.gaugeCard, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]}> 
      <View style={styles.gaugeTop}><Text style={[styles.gaugeLabel, { color: theme.textPrimary }]}>{label}</Text><Text style={[styles.gaugeScore, { color: theme.coral }]}>{pct}</Text></View>
      <View style={[styles.track, { backgroundColor: theme.coralSoft }]}><View style={[styles.fill, { width: `${pct}%`, backgroundColor: theme.coral }]} /></View>
      {helper ? <Text style={[styles.helper, { color: theme.textSecondary }]}>{helper}</Text> : null}
    </View>
  );
}

export function ConceptCard({ icon = "spark", title, text, bullets = [] }: { icon?: "spark" | "bot" | "layers" | "shield" | "zap" | "check"; title: string; text: string; bullets?: string[] }) {
  const { colors: theme } = useTheme();
  const Icon = icon === "bot" ? Bot : icon === "layers" ? Layers3 : icon === "shield" ? ShieldAlert : icon === "zap" ? Zap : icon === "check" ? CheckCircle2 : Sparkles;
  return (
    <View style={[styles.concept, { backgroundColor: theme.surface, borderColor: theme.borderSubtle }]}> 
      <View style={[styles.iconBubble, { backgroundColor: theme.coralSoft }]}><Icon size={19} color={theme.coral} strokeWidth={2.5} /></View>
      <Text style={[styles.conceptTitle, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.conceptText, { color: theme.textSecondary }]}>{text}</Text>
      {bullets.map((b) => <Text key={b} style={[styles.bullet, { color: theme.textPrimary }]}>• {b}</Text>)}
    </View>
  );
}

export function ToolBattleStrip({ items }: { items: { name: string; role: string; score: number }[] }) {
  return (
    <View style={[styles.battle, { backgroundColor: colors.darkCard }]}> 
      <Text style={styles.battleTitle}>Comparer vite</Text>
      {items.map((item, index) => (
        <View key={item.name} style={styles.battleRow}>
          <Text style={styles.battleRank}>#{index + 1}</Text>
          <View style={{ flex: 1 }}><Text style={styles.battleName}>{item.name}</Text><Text style={styles.battleRole}>{item.role}</Text></View>
          <Text style={styles.battleScore}>{item.score}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.md, marginTop: spacing.md, ...shadow.soft },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: spacing.sm },
  panelTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 25 },
  pipeline: { gap: 4 },
  node: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.sm },
  nodeNum: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.2, marginBottom: 3 },
  nodeText: { fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 18 },
  arrow: { fontFamily: fonts.bodyBold, fontSize: 18, textAlign: "center", marginVertical: -1 },
  gaugeCard: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm },
  gaugeTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  gaugeLabel: { fontFamily: fonts.bodyBold, fontSize: 13 },
  gaugeScore: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 31 },
  track: { height: 10, borderRadius: 5, overflow: "hidden", marginTop: 8 },
  fill: { height: "100%", borderRadius: 5 },
  helper: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16, marginTop: 7 },
  concept: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm },
  iconBubble: { width: 40, height: 40, borderRadius: 15, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  conceptTitle: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 24 },
  conceptText: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginTop: 4 },
  bullet: { fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 18, marginTop: 5 },
  battle: { borderRadius: radius.xl, padding: spacing.md, marginTop: spacing.md, ...shadow.dark },
  battleTitle: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 26, color: colors.textInverse, marginBottom: spacing.sm },
  battleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)", paddingVertical: 10 },
  battleRank: { width: 34, height: 34, borderRadius: 17, overflow: "hidden", textAlign: "center", lineHeight: 34, backgroundColor: colors.coral, color: "#fff", fontFamily: fonts.bodyBold, fontSize: 12 },
  battleName: { color: colors.textInverse, fontFamily: fonts.bodyBold, fontSize: 13 },
  battleRole: { color: "rgba(253,251,247,0.65)", fontFamily: fonts.body, fontSize: 11, marginTop: 2 },
  battleScore: { color: colors.coral, fontFamily: fonts.serif, fontSize: 24 },
});
