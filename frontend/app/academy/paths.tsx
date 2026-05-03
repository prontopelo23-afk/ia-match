import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, Route } from "lucide-react-native";
import { fonts, radius, spacing } from "../../src/theme";
import { useTheme } from "../../src/theme-context";
import { api, AcademyPath } from "../../src/api";

export default function AcademyPathsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [paths, setPaths] = useState<AcademyPath[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.listAcademyPaths().then((p) => setPaths(p.sort((a,b)=>(a.order??99)-(b.order??99)))).finally(() => setLoading(false)); }, []);
  return <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}><ScrollView contentContainerStyle={styles.scroll}>
    <TouchableOpacity onPress={() => router.back()} style={styles.back}><ChevronLeft size={18} color={colors.textPrimary}/><Text style={[styles.backText,{color:colors.textPrimary}]}>Academy</Text></TouchableOpacity>
    <Text style={[styles.eyebrow,{color:colors.coral}]}>TOUS LES PARCOURS</Text><Text style={[styles.title,{color:colors.textPrimary}]}>Choisis ton chemin.</Text>
    {loading ? <ActivityIndicator color={colors.coral}/> : paths.map((path) => <TouchableOpacity key={path.id} onPress={() => router.push(`/academy/path/${path.id}`)} style={[styles.card,{backgroundColor:colors.surface,borderColor:colors.borderSubtle}]}>
      <Route size={18} color={colors.coral}/><View style={{flex:1}}><Text style={[styles.cardTitle,{color:colors.textPrimary}]}>{path.title}</Text><Text style={[styles.meta,{color:colors.textSecondary}]}>{path.course_ids?.length ?? 8} leçons · {path.level ?? "progressif"}</Text>{path.promise ? <Text style={[styles.desc,{color:colors.textSecondary}]} numberOfLines={2}>{path.promise}</Text>:null}</View><ChevronRight size={18} color={colors.coral}/>
    </TouchableOpacity>)}<View style={{height:80}}/></ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1},scroll:{padding:spacing.lg},back:{flexDirection:"row",alignItems:"center",gap:6,marginBottom:spacing.md},backText:{fontFamily:fonts.bodyBold,fontSize:13},eyebrow:{fontFamily:fonts.bodyBold,fontSize:10,letterSpacing:2},title:{fontFamily:fonts.serif,fontSize:36,lineHeight:42,marginVertical:spacing.md},card:{flexDirection:"row",gap:spacing.sm,borderWidth:1,borderRadius:radius.lg,padding:spacing.md,marginBottom:spacing.sm,alignItems:"center"},cardTitle:{fontFamily:fonts.serif,fontSize:21,lineHeight:25},meta:{fontFamily:fonts.bodyBold,fontSize:11,textTransform:"uppercase",marginTop:4},desc:{fontFamily:fonts.body,fontSize:12,lineHeight:17,marginTop:5}});
