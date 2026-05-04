import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Check, Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { fonts, radius, spacing } from "../../../src/theme";
import { useTheme } from "../../../src/theme-context";
import { api, AcademyQuiz, Lesson } from "../../../src/api";
import { getAcademyLessonVisual } from "../../../src/academyVisuals";

export default function LessonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quizzes, setQuizzes] = useState<AcademyQuiz[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ Promise.all([api.listLessons(), api.listAcademyQuizzes(id)]).then(([lessons, qs])=>{setLesson(lessons.find(l=>l.id===id)??null); setQuizzes(qs);}).finally(()=>setLoading(false)); },[id]);
  const copyFramework=async()=>{ if(!lesson) return; await Clipboard.setStringAsync(`${lesson.framework}\n\n${lesson.steps.map((s,i)=>`${i+1}. ${s}`).join("\n")}`); setCopied(true); setTimeout(()=>setCopied(false),1300); };
  const lessonVisual = getAcademyLessonVisual(lesson?.id);
  return <SafeAreaView style={[styles.container,{backgroundColor:colors.bg}]} edges={["top"]}><ScrollView contentContainerStyle={styles.scroll}>
    <TouchableOpacity onPress={()=>router.back()} style={styles.back}><ChevronLeft size={18} color={colors.textPrimary}/><Text style={[styles.backText,{color:colors.textPrimary}]}>Retour</Text></TouchableOpacity>
    {loading ? <ActivityIndicator color={colors.coral}/> : lesson ? <>
      <Text style={[styles.eyebrow,{color:colors.coral}]}>LEÇON · {lesson.level} · {lesson.minutes} MIN</Text><Text style={[styles.title,{color:colors.textPrimary}]}>{lesson.title}</Text>
      {lessonVisual ? <View style={[styles.visualCard,{backgroundColor:colors.surface,borderColor:colors.borderSubtle}]}><Image source={lessonVisual} style={styles.lessonVisual} resizeMode="contain"/><Text style={[styles.visualCaption,{color:colors.textSecondary}]}>Schéma associé à cette leçon</Text></View> : null}
      <Text style={[styles.intro,{color:colors.textPrimary}]}>{lesson.intro}</Text><Text style={[styles.body,{color:colors.textSecondary}]}>{lesson.body}</Text>
      <View style={[styles.box,{backgroundColor:colors.surface,borderColor:colors.borderSubtle}]}><View style={styles.boxHead}><Text style={[styles.label,{color:colors.coral}]}>FRAMEWORK</Text><TouchableOpacity onPress={copyFramework}>{copied?<Check size={18} color={colors.success}/>:<Copy size={18} color={colors.textSecondary}/>}</TouchableOpacity></View><Text style={[styles.framework,{color:colors.coral}]}>{lesson.framework}</Text>{lesson.steps.map((s,i)=><View key={i} style={styles.step}><Text style={[styles.stepNum,{color:colors.textSecondary}]}>0{i+1}</Text><Text style={[styles.stepText,{color:colors.textPrimary}]}>{s}</Text></View>)}</View>
      <View style={styles.beforeAfter}><Mini label="AVANT" text={lesson.before}/><Mini label="APRÈS" text={lesson.after}/></View>
      {quizzes.length ? <View style={[styles.box,{backgroundColor:colors.surface,borderColor:colors.borderSubtle}]}><Text style={[styles.label,{color:colors.coral}]}>QUIZ</Text>{quizzes.map(q=>{const selected=answers[q.id]; const done=selected!==undefined; return <View key={q.id} style={styles.quiz}><Text style={[styles.quizQ,{color:colors.textPrimary}]}>{q.question}</Text>{q.answers?.map((a,i)=>{const correct=Boolean(a.correct||a.is_correct); const sel=selected===i; return <TouchableOpacity key={a.id??i} onPress={()=>setAnswers(prev=>({...prev,[q.id]:i}))} style={[styles.answer,{borderColor:sel?colors.coral:colors.borderSubtle,backgroundColor:done&&correct?"rgba(40,167,69,0.10)":colors.bg}]}><Text style={[styles.answerText,{color:done&&correct?colors.success:colors.textPrimary}]}>{done?(correct?"✓ ":sel?"× ":"• "):"○ "}{a.text??a.label}</Text></TouchableOpacity>})}{done&&q.explanation?<Text style={[styles.explain,{color:colors.textSecondary}]}>{q.explanation}</Text>:null}</View>})}</View>:null}
    </> : <Text style={[styles.body,{color:colors.textSecondary}]}>Leçon introuvable.</Text>}<View style={{height:80}}/></ScrollView></SafeAreaView>;
}
function Mini({label,text}:{label:string;text:string}){const{colors}=useTheme();return <View style={[styles.mini,{backgroundColor:colors.surface,borderColor:colors.borderSubtle}]}><Text style={[styles.label,{color:colors.coral}]}>{label}</Text><Text style={[styles.miniText,{color:colors.textPrimary}]}>{text}</Text></View>}
const styles=StyleSheet.create({container:{flex:1},scroll:{padding:spacing.lg},back:{flexDirection:"row",alignItems:"center",gap:6,marginBottom:spacing.md},backText:{fontFamily:fonts.bodyBold,fontSize:13},eyebrow:{fontFamily:fonts.bodyBold,fontSize:10,letterSpacing:2},title:{fontFamily:fonts.serif,fontSize:34,lineHeight:40,marginVertical:spacing.sm},visualCard:{borderWidth:1,borderRadius:radius.lg,padding:spacing.sm,marginBottom:spacing.md,overflow:"hidden",alignItems:"center"},lessonVisual:{width:"100%",maxWidth:360,height:420,borderRadius:radius.md,backgroundColor:"rgba(255,90,69,0.04)"},visualCaption:{fontFamily:fonts.bodySemi,fontSize:11,lineHeight:16,marginTop:8,textAlign:"center"},intro:{fontFamily:fonts.body,fontSize:15,lineHeight:22},body:{fontFamily:fonts.body,fontSize:14,lineHeight:21,marginTop:spacing.sm},box:{borderWidth:1,borderRadius:radius.lg,padding:spacing.md,marginTop:spacing.md},boxHead:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},label:{fontFamily:fonts.bodyBold,fontSize:10,letterSpacing:1.5},framework:{fontFamily:fonts.bodyBold,fontSize:12,letterSpacing:1,marginTop:4,marginBottom:spacing.sm},step:{flexDirection:"row",gap:10,paddingVertical:6},stepNum:{fontFamily:fonts.body,fontSize:12,width:22},stepText:{fontFamily:fonts.body,fontSize:13,lineHeight:18,flex:1},beforeAfter:{flexDirection:"row",gap:8,marginTop:spacing.md},mini:{flex:1,padding:spacing.md,borderRadius:radius.md,borderWidth:1},miniText:{fontFamily:fonts.body,fontSize:12,lineHeight:18,marginTop:6},quiz:{marginTop:spacing.md},quizQ:{fontFamily:fonts.bodyBold,fontSize:13,lineHeight:18},answer:{borderWidth:1,borderRadius:radius.md,paddingHorizontal:10,paddingVertical:8,marginTop:6},answerText:{fontFamily:fonts.bodySemi,fontSize:12,lineHeight:18},explain:{fontFamily:fonts.body,fontSize:11,lineHeight:16,marginTop:8,fontStyle:"italic"}});
