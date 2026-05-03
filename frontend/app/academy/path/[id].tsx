import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react-native";
import { fonts, radius, spacing } from "../../../src/theme";
import { useTheme } from "../../../src/theme-context";
import { api, AcademyPath, Lesson } from "../../../src/api";

export default function AcademyPathDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [path, setPath] = useState<AcademyPath | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.all([api.listAcademyPaths(), api.listLessons()]).then(([paths, all]) => { const p=paths.find(x=>x.id===id) ?? null; setPath(p); const allowed=new Set(p?.course_ids ?? []); setLessons((allowed.size? all.filter(l=>allowed.has(l.id)):all.filter((l:any)=>l.path_id===id)).sort((a,b)=>a.order-b.order)); }).finally(()=>setLoading(false)); }, [id]);
  const minutes=lessons.reduce((s,l)=>s+(l.minutes||0),0);
  return <SafeAreaView style={[styles.container,{backgroundColor:colors.bg}]} edges={["top"]}><ScrollView contentContainerStyle={styles.scroll}>
    <TouchableOpacity onPress={()=>router.back()} style={styles.back}><ChevronLeft size={18} color={colors.textPrimary}/><Text style={[styles.backText,{color:colors.textPrimary}]}>Parcours</Text></TouchableOpacity>
    {loading ? <ActivityIndicator color={colors.coral}/> : <>
      <Text style={[styles.eyebrow,{color:colors.coral}]}>PARCOURS · {lessons.length} LEÇONS · {minutes} MIN</Text>
      <Text style={[styles.title,{color:colors.textPrimary}]}>{path?.title ?? "Parcours Academy"}</Text>
      {path?.promise ? <Text style={[styles.subtitle,{color:colors.textSecondary}]}>{path.promise}</Text>:null}
      {path?.skills_taught?.length ? <View style={styles.skillRow}>{path.skills_taught.slice(0,6).map(s=><Text key={s} style={[styles.skill,{color:colors.coral,borderColor:colors.coral}]}>{s}</Text>)}</View>:null}
      {lessons.map((lesson,i)=><TouchableOpacity key={lesson.id} onPress={()=>router.push(`/academy/lesson/${lesson.id}`)} style={[styles.lesson,{backgroundColor:colors.surface,borderColor:colors.borderSubtle}]}>
        <Text style={[styles.num,{color:colors.coral}]}>{String(i+1).padStart(2,"0")}</Text><View style={{flex:1}}><Text style={[styles.lessonTitle,{color:colors.textPrimary}]}>{lesson.title}</Text><View style={styles.metaRow}><Clock size={12} color={colors.textSecondary}/><Text style={[styles.meta,{color:colors.textSecondary}]}>{lesson.minutes} min · {lesson.level}</Text></View></View><ChevronRight size={17} color={colors.coral}/>
      </TouchableOpacity>)}
    </>}<View style={{height:80}}/></ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1},scroll:{padding:spacing.lg},back:{flexDirection:"row",alignItems:"center",gap:6,marginBottom:spacing.md},backText:{fontFamily:fonts.bodyBold,fontSize:13},eyebrow:{fontFamily:fonts.bodyBold,fontSize:10,letterSpacing:2},title:{fontFamily:fonts.serif,fontSize:34,lineHeight:40,marginTop:spacing.sm},subtitle:{fontFamily:fonts.body,fontSize:14,lineHeight:20,marginTop:spacing.sm,marginBottom:spacing.md},skillRow:{flexDirection:"row",flexWrap:"wrap",gap:7,marginBottom:spacing.md},skill:{overflow:"hidden",borderWidth:1,borderRadius:radius.pill,paddingHorizontal:9,paddingVertical:5,fontFamily:fonts.bodyBold,fontSize:10},lesson:{flexDirection:"row",alignItems:"center",gap:spacing.sm,borderWidth:1,borderRadius:radius.lg,padding:spacing.md,marginBottom:spacing.sm},num:{fontFamily:fonts.serif,fontSize:22,width:34},lessonTitle:{fontFamily:fonts.serif,fontSize:20,lineHeight:24},metaRow:{flexDirection:"row",alignItems:"center",gap:4,marginTop:4},meta:{fontFamily:fonts.bodySemi,fontSize:11}});
