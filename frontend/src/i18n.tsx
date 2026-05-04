import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { I18nManager, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TranslationDict = Record<string, string>;

export type AppLanguage = "fr" | "en" | "es" | "pt-BR" | "de" | "it" | "ja" | "ko" | "zh" | "ar" | "hi";

export const STRATEGIC_LANGUAGES: { code: AppLanguage; nativeName: string; market: string; apiCode: string }[] = [
  { code: "fr", nativeName: "Français", market: "France, Belgique, Suisse, Canada francophone", apiCode: "fr" },
  { code: "en", nativeName: "English", market: "US, UK, Canada, Australia, global B2B", apiCode: "en" },
  { code: "es", nativeName: "Español", market: "Espagne, Mexique, Colombie, Amérique latine", apiCode: "es" },
  { code: "pt-BR", nativeName: "Português (Brasil)", market: "Brésil, PME et créateurs très actifs", apiCode: "pt-BR" },
  { code: "de", nativeName: "Deutsch", market: "Allemagne, Autriche, Suisse alémanique", apiCode: "de" },
  { code: "it", nativeName: "Italiano", market: "Italie, marché européen grand public", apiCode: "it" },
  { code: "ja", nativeName: "日本語", market: "Japon, forte adoption IA productivité", apiCode: "ja" },
  { code: "ko", nativeName: "한국어", market: "Corée du Sud, mobile-first et productivité", apiCode: "ko" },
  { code: "zh", nativeName: "中文", market: "Chine, Taïwan, Singapour, diaspora", apiCode: "zh" },
  { code: "ar", nativeName: "العربية", market: "Golfe, MENA, formation et business", apiCode: "ar" },
  { code: "hi", nativeName: "हिन्दी", market: "Inde, acquisition massive et low-cost", apiCode: "hi" },
];

const KEY = "ia_match_language_v1";
const RTL_LANGUAGES = new Set<AppLanguage>(["ar"]);

function normalizeLocale(raw?: string | null): AppLanguage {
  const value = (raw || "").toLowerCase().replace("_", "-");
  if (value.startsWith("pt")) return "pt-BR";
  if (value.startsWith("fr")) return "fr";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("de")) return "de";
  if (value.startsWith("it")) return "it";
  if (value.startsWith("ja")) return "ja";
  if (value.startsWith("ko")) return "ko";
  if (value.startsWith("zh")) return "zh";
  if (value.startsWith("ar")) return "ar";
  if (value.startsWith("hi")) return "hi";
  return "fr";
}

function getDeviceLocale(): string | null {
  try {
    if (Platform.OS === "web" && typeof navigator !== "undefined") return navigator.language;
    return Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return null;
  }
}

const base: TranslationDict = {
  "nav.home": "Accueil",
  "nav.match": "Match",
  "nav.catalog": "Catalogue",
  "nav.academy": "Academy",
  "nav.prompt": "Prompt",
  "nav.profile": "Profil",
  "common.continue": "Continuer",
  "common.skip": "Passer",
  "common.cancel": "Annuler",
  "common.delete": "Supprimer",
  "common.clear": "Effacer",
  "common.seeAll": "Tout voir",
  "common.fullTop": "Top complet",
  "common.all": "Tout",
  "common.reduce": "Réduire",
  "tool.freeAvailable": "Gratuit dispo",
  "tool.index": "indice",
  "home.quickCatalogTitle": "Catalogue",
  "home.quickAcademyTitle": "Academy",
  "home.quickRankingsTitle": "Classements",
  "home.quickPromptTitle": "Prompt",
  "home.quickNewsletterTitle": "Newsletter",
  "home.quickBusinessTitle": "Business",
  "catalog.eyebrow": "CATALOGUE IA MATCH",
  "catalog.title": "Trouve par usage, pas par jargon.",
  "catalog.subtitle": "Filtre les grandes familles, regarde le top 3, puis ouvre la fiche avec prix, limites, prompt conseillé et lien officiel.",
  "catalog.top3": "Top 3 recommandé",
  "catalog.fullList": "Liste complète",
  "catalog.useText": "écrire, résumer, reformuler, apprendre",
  "catalog.useImage": "créer des visuels, photos, logos, concepts",
  "catalog.useCode": "coder, déboguer, créer une app ou un script",
  "catalog.useVideo": "générer clips, pubs, animations et avatars",
  "catalog.useAudio": "voix-off, transcription, musique, podcasts",
  "catalog.useProductivity": "gagner du temps sur documents, slides, notes",
  "catalog.useResearch": "chercher, sourcer, analyser des documents",
  "catalog.useAgent": "automatiser une tâche ou un workflow",
  "catalog.useData": "analyser tableaux, KPIs et fichiers de données",
  "catalog.useDefault": "trouver le bon outil selon ton usage",
  "home.tagline": "TROUVER · COMPARER · TESTER",
  "home.heroLabel": "ACCUEIL · IA MATCH",
  "home.heroTitle": "Trouve l'IA\nidéale sans scroller partout.",
  "home.heroSub": "Le guide public pour choisir une IA sans jargon : Match, fiches avec indice éditorial IA Match, newsletter et offres entreprises/formations.",
  "home.ctaMatch": "Lancer le Match",
  "home.quickCatalog": "Tous les outils par usage.",
  "home.quickAcademy": "Parcours, leçons, templates, quiz.",
  "home.quickRankings": "Top général + familles JSON.",
  "home.quickPrompt": "Créer une consigne prête à copier.",
  "home.quickNewsletter": "Le digest public qui donne envie de revenir.",
  "home.quickBusiness": "PME, formations, diagnostic IA.",
  "home.subscribeLabel": "POURQUOI S’ABONNER ?",
  "home.subscribeTitle": "Le gratuit t’aide à découvrir. Premium t’aide à décider sans perdre d’argent.",
  "home.subscribeText": "Chaque recommandation doit expliquer : pourquoi cet outil, pour qui, quand l’éviter, prix/limites du gratuit, sources, confiance et dernière mise à jour.",
  "home.newsletterCta": "Voir la newsletter publique",
  "home.exploreFamilies": "Explorer par famille",
  "home.radar": "RADAR IA MATCH",
  "home.topStart": "Top 3 pour commencer",
  "profile.title": "Mon profil",
  "profile.language": "Langue",
  "profile.languageAuto": "Automatique au premier lancement, modifiable ici.",
  "profile.languageMarket": "Marché prioritaire",
  "profile.theme": "Thème",
  "profile.day": "Jour",
  "profile.night": "Nuit",
  "profile.replayOnboarding": "Refaire l'onboarding",
  "profile.cookiePrefs": "Préférences cookies",
  "profile.legalInfo": "INFORMATIONS LÉGALES",
  "profile.newMatchTitle": "Lance un nouveau match",
  "profile.newMatchSub": "Décris ton besoin, on te trouve la meilleure IA en 3 questions.",
  "profile.newMatchCta": "Nouveau Match",
  "profile.savedTools": "IA favoris",
  "profile.savedNews": "Articles sauvegardés",
  "profile.history": "Historique des matchs",
  "onboarding.welcomeLabel": "BIENVENUE · 1 / 3",
  "onboarding.needTitle": "Tu veux faire quoi avec l’IA ?",
  "onboarding.needSub": "Choisis ton besoin principal. IA Match va te recommander des outils compréhensibles, pas une liste infinie.",
  "onboarding.levelLabel": "NIVEAU · 2 / 3",
  "onboarding.levelTitle": "Ton niveau aujourd’hui ?",
  "onboarding.levelSub": "On évite les outils trop complexes si tu veux juste commencer.",
  "onboarding.budgetLabel": "BUDGET · 3 / 3",
  "onboarding.budgetTitle": "Ton budget ?",
  "onboarding.budgetSub": "On adapte les recommandations selon ton pays, ton budget et les plans gratuits disponibles.",
  "onboarding.resultsLabel": "TON MATCH EST PRÊT",
  "onboarding.resultsTitle": "Commence avec ces IA",
  "onboarding.finish": "Entrer dans IA Match",
  "choice.write": "Écrire",
  "choice.writeHint": "emails, articles, posts, CV",
  "choice.image": "Créer une image",
  "choice.imageShort": "Image",
  "choice.imageHint": "visuels, illustrations, design",
  "choice.video": "Faire une vidéo",
  "choice.videoShort": "Vidéo",
  "choice.videoHint": "clips, montage, animation",
  "choice.code": "Coder",
  "choice.codeHint": "scripts, debug, apps",
  "choice.app": "Créer une app",
  "choice.appHint": "prototype, MVP, interface",
  "choice.automate": "Automatiser",
  "choice.automateHint": "workflows, tâches répétitives",
  "choice.learn": "Apprendre",
  "choice.learnHint": "cours, explications, quiz",
  "choice.marketing": "Marketing",
  "choice.marketingHint": "ads, landing pages, contenus",
  "choice.voice": "Créer une voix",
  "choice.voiceShort": "Voix",
  "choice.voiceHint": "voix-off, doublage, audio",
  "choice.analyze": "Analyser un document",
  "choice.analyzeShort": "Analyser",
  "choice.analyzeHint": "PDF, synthèse, extraction",
  "level.beginner": "Débutant",
  "level.beginnerHint": "Je veux quelque chose de simple, guidé et rassurant",
  "level.intermediate": "Intermédiaire",
  "level.intermediateHint": "Je veux un bon équilibre entre puissance et simplicité",
  "level.pro": "Pro",
  "level.proHint": "Je veux l'outil le plus solide, même s'il demande plus d'effort",
  "budget.free": "Gratuit uniquement",
  "budget.freeHint": "Ne me propose que des outils avec un vrai plan gratuit",
  "budget.low": "Moins de 10 €/mois",
  "budget.lowHint": "Je peux payer un peu si ça vaut le coup",
  "budget.best": "Peu importe si c'est le meilleur",
  "budget.bestHint": "Priorité à la meilleure recommandation",
  "match.freeCounter": "Match gratuit : {remaining} / {limit} restants",
  "match.premiumCounter": "Premium : Match illimité",
  "match.stepNeed": "MATCH · 1 / 3",
  "match.needTitle": "Tu veux faire quoi ?",
  "match.needSub": "Choisis un besoin ou écris-le naturellement. Le Match doit répondre en moins de 10 secondes.",
  "match.placeholder": "ex. créer une vidéo TikTok pour vendre mon service",
  "match.stepLevel": "NIVEAU · 2 / 3",
  "match.levelTitle": "Ton niveau ?",
  "match.levelSub": "Ça évite de recommander un outil trop complexe ou trop limité.",
  "match.stepBudget": "BUDGET & PRIORITÉ · 3 / 3",
  "match.budgetTitle": "Ton budget et ta priorité ?",
  "match.budgetSub": "Le budget fixe la contrainte. La priorité dit ce qu’on optimise : prix, vitesse, qualité ou équilibre.",
  "match.priorityBalanced": "Équilibré",
  "match.priorityBalancedHint": "Bon compromis qualité, prix et simplicité",
  "match.priorityAccuracy": "Meilleur résultat",
  "match.priorityAccuracyHint": "Je privilégie la qualité, même si c'est payant",
  "match.prioritySpeed": "Rapidité",
  "match.prioritySpeedHint": "Je veux obtenir vite une réponse exploitable",
  "match.priorityPrice": "Prix",
  "match.priorityPriceHint": "Je veux réduire le coût au maximum",
  "match.readyLanguageHint": "Réponds dans la langue de l’utilisateur.",
  "premium.title": "Débloque IA Match Premium",
  "premium.desc": "Passe du simple catalogue à un vrai copilote de décision : Match illimité, sources, Academy complète, Builder avancé et comparatifs détaillés.",
  "premium.activate": "Activer Premium",
  "cookies.title": "Confidentialité & cookies",
  "cookies.body": "IA Match utilise uniquement le stockage local pour tes préférences, favoris, historique et réglages. Tu gardes le contrôle.",
  "cookies.accept": "Accepter",
  "cookies.refuse": "Refuser",
};

const translations: Partial<Record<AppLanguage, TranslationDict>> = {
  en: {
    "nav.home": "Home", "nav.catalog": "Catalog", "nav.academy": "Academy", "nav.prompt": "Prompt", "nav.profile": "Profile", "common.continue": "Continue", "common.skip": "Skip", "common.cancel": "Cancel", "common.delete": "Delete", "common.clear": "Clear", "common.seeAll": "See all", "common.fullTop": "Full ranking", "common.all": "All", "common.reduce": "Collapse", "tool.freeAvailable": "Free plan", "tool.index": "index",
    "home.tagline": "FIND · COMPARE · TEST", "home.heroLabel": "HOME · IA MATCH", "home.heroTitle": "Find the right\nAI without endless scrolling.", "home.heroSub": "A public guide to choose AI tools without jargon: Match, editorial IA Match scorecards, newsletter and business/training offers.", "home.ctaMatch": "Start Match", "home.quickCatalogTitle": "Catalog", "home.quickAcademyTitle": "Academy", "home.quickRankingsTitle": "Rankings", "home.quickPromptTitle": "Prompt", "home.quickNewsletterTitle": "Newsletter", "home.quickBusinessTitle": "Business", "home.quickCatalog": "All tools by use case.", "home.quickAcademy": "Paths, lessons, templates, quizzes.", "home.quickRankings": "General top + JSON families.", "home.quickPrompt": "Create a copy-ready prompt.", "home.quickNewsletter": "A public digest that makes people come back.", "home.quickBusiness": "SMBs, training, AI diagnosis.", "home.subscribeLabel": "WHY SUBSCRIBE?", "home.subscribeTitle": "Free helps you discover. Premium helps you decide without wasting money.", "home.subscribeText": "Every recommendation must explain: why this tool, for whom, when to avoid it, free limits/pricing, sources, trust and last update.", "home.newsletterCta": "View public newsletter", "home.exploreFamilies": "Explore by family", "home.radar": "IA MATCH RADAR", "home.topStart": "Top 3 to start",
    "catalog.eyebrow": "IA MATCH CATALOG", "catalog.title": "Find by use case, not jargon.", "catalog.subtitle": "Filter the main families, check the top 3, then open the detail page with price, limits, recommended prompt and official link.", "catalog.top3": "Recommended top 3", "catalog.fullList": "Full list", "catalog.useText": "writing, summarizing, rewriting, learning", "catalog.useImage": "creating visuals, photos, logos, concepts", "catalog.useCode": "coding, debugging, creating an app or script", "catalog.useVideo": "generating clips, ads, animations and avatars", "catalog.useAudio": "voice-over, transcription, music, podcasts", "catalog.useProductivity": "saving time on documents, slides and notes", "catalog.useResearch": "searching, sourcing, analyzing documents", "catalog.useAgent": "automating a task or workflow", "catalog.useData": "analyzing tables, KPIs and data files", "catalog.useDefault": "finding the right tool for your use case",
    "profile.title": "My profile", "profile.language": "Language", "profile.languageAuto": "Auto-detected on first launch, editable here.", "profile.languageMarket": "Priority market", "profile.theme": "Theme", "profile.day": "Day", "profile.night": "Night", "profile.replayOnboarding": "Replay onboarding", "profile.cookiePrefs": "Cookie preferences", "profile.legalInfo": "LEGAL INFORMATION", "profile.newMatchTitle": "Start a new match", "profile.newMatchSub": "Describe your need, we find the best AI in 3 questions.", "profile.newMatchCta": "New Match", "profile.savedTools": "Saved AIs", "profile.savedNews": "Saved articles", "profile.history": "Match history",
    "onboarding.welcomeLabel": "WELCOME · 1 / 3", "onboarding.needTitle": "What do you want to do with AI?", "onboarding.needSub": "Choose your main need. IA Match recommends understandable tools, not an endless list.", "onboarding.levelLabel": "LEVEL · 2 / 3", "onboarding.levelTitle": "Your current level?", "onboarding.levelSub": "We avoid tools that are too complex when you just want to start.", "onboarding.budgetLabel": "BUDGET · 3 / 3", "onboarding.budgetTitle": "Your budget?", "onboarding.budgetSub": "Recommendations adapt to your country, budget and available free plans.", "onboarding.resultsLabel": "YOUR MATCH IS READY", "onboarding.resultsTitle": "Start with these AIs", "onboarding.finish": "Enter IA Match",
    "match.freeCounter": "Free Match: {remaining} / {limit} left", "match.premiumCounter": "Premium: unlimited Match", "match.stepNeed": "MATCH · 1 / 3", "match.needTitle": "What do you want to do?", "match.needSub": "Pick a need or write it naturally. Match should answer in under 10 seconds.", "match.placeholder": "e.g. create a TikTok video to sell my service", "match.stepLevel": "LEVEL · 2 / 3", "match.levelTitle": "Your level?", "match.levelSub": "This avoids tools that are too complex or too limited.", "match.stepBudget": "BUDGET & PRIORITY · 3 / 3", "match.budgetTitle": "Your budget and priority?", "match.budgetSub": "Budget sets the constraint. Priority tells what to optimize: price, speed, quality or balance.", "match.readyLanguageHint": "Answer in the user's language.",
    "premium.title": "Unlock IA Match Premium", "premium.desc": "Move from a simple catalog to a real decision copilot: unlimited Match, sources, full Academy, advanced Builder and detailed comparisons.", "premium.activate": "Activate Premium", "cookies.title": "Privacy & cookies", "cookies.body": "IA Match only uses local storage for preferences, favorites, history and demo settings. You stay in control.", "cookies.accept": "Accept", "cookies.refuse": "Refuse"
  },
  es: { "nav.home": "Inicio", "nav.catalog": "Catálogo", "nav.profile": "Perfil", "common.continue": "Continuar", "common.skip": "Saltar", "common.seeAll": "Ver todo", "home.tagline": "ENCONTRAR · COMPARAR · PROBAR", "home.heroTitle": "Encuentra la IA\nideal sin buscar por todas partes.", "home.heroSub": "Guía pública para elegir herramientas de IA sin jerga: Match, fichas con índice editorial, newsletter y ofertas para empresas/formación.", "home.ctaMatch": "Iniciar Match", "home.exploreFamilies": "Explorar por familia", "home.topStart": "Top 3 para empezar", "profile.title": "Mi perfil", "profile.language": "Idioma", "profile.languageAuto": "Detectado automáticamente al primer inicio, editable aquí.", "profile.languageMarket": "Mercado prioritario", "profile.theme": "Tema", "profile.day": "Día", "profile.night": "Noche", "profile.newMatchTitle": "Lanza un nuevo match", "profile.newMatchSub": "Describe tu necesidad y encontramos la mejor IA en 3 preguntas.", "profile.newMatchCta": "Nuevo Match", "onboarding.needTitle": "¿Qué quieres hacer con IA?", "onboarding.levelTitle": "¿Tu nivel actual?", "onboarding.budgetTitle": "¿Tu presupuesto?", "match.needTitle": "¿Qué quieres hacer?", "match.placeholder": "ej. crear un video de TikTok para vender mi servicio", "premium.title": "Desbloquea IA Match Premium", "premium.activate": "Activar Premium" },
  "pt-BR": { "nav.home": "Início", "nav.catalog": "Catálogo", "nav.profile": "Perfil", "common.continue": "Continuar", "common.skip": "Pular", "common.seeAll": "Ver tudo", "home.tagline": "ENCONTRAR · COMPARAR · TESTAR", "home.heroTitle": "Encontre a IA\nideal sem rolar sem fim.", "home.heroSub": "Guia público para escolher ferramentas de IA sem jargão: Match, fichas editoriais, newsletter e ofertas para empresas/treinamentos.", "home.ctaMatch": "Iniciar Match", "home.exploreFamilies": "Explorar por família", "home.topStart": "Top 3 para começar", "profile.title": "Meu perfil", "profile.language": "Idioma", "profile.languageAuto": "Detectado automaticamente no primeiro acesso, editável aqui.", "profile.languageMarket": "Mercado prioritário", "profile.theme": "Tema", "profile.day": "Dia", "profile.night": "Noite", "profile.newMatchTitle": "Comece um novo match", "profile.newMatchSub": "Descreva sua necessidade e encontramos a melhor IA em 3 perguntas.", "profile.newMatchCta": "Novo Match", "onboarding.needTitle": "O que você quer fazer com IA?", "onboarding.levelTitle": "Qual é seu nível?", "onboarding.budgetTitle": "Qual é seu orçamento?", "match.needTitle": "O que você quer fazer?", "match.placeholder": "ex. criar um vídeo TikTok para vender meu serviço", "premium.title": "Desbloqueie IA Match Premium", "premium.activate": "Ativar Premium" },
  de: { "nav.home": "Start", "nav.catalog": "Katalog", "nav.profile": "Profil", "common.continue": "Weiter", "common.skip": "Überspringen", "common.seeAll": "Alle ansehen", "home.tagline": "FINDEN · VERGLEICHEN · TESTEN", "home.heroTitle": "Finde die passende\nKI ohne endloses Scrollen.", "home.heroSub": "Öffentlicher Guide zur Auswahl von KI-Tools ohne Fachjargon: Match, redaktionelle Scores, Newsletter und Business-/Training-Angebote.", "home.ctaMatch": "Match starten", "home.exploreFamilies": "Nach Familie entdecken", "home.topStart": "Top 3 zum Start", "profile.title": "Mein Profil", "profile.language": "Sprache", "profile.languageAuto": "Beim ersten Start automatisch erkannt, hier änderbar.", "profile.languageMarket": "Prioritätsmarkt", "profile.theme": "Design", "profile.day": "Tag", "profile.night": "Nacht", "profile.newMatchTitle": "Neuen Match starten", "profile.newMatchSub": "Beschreibe deinen Bedarf, wir finden in 3 Fragen die beste KI.", "profile.newMatchCta": "Neuer Match", "onboarding.needTitle": "Was möchtest du mit KI tun?", "onboarding.levelTitle": "Dein aktuelles Level?", "onboarding.budgetTitle": "Dein Budget?", "match.needTitle": "Was möchtest du tun?", "match.placeholder": "z. B. ein TikTok-Video erstellen, um meinen Service zu verkaufen", "premium.title": "IA Match Premium freischalten", "premium.activate": "Premium aktivieren" },
  it: { "nav.home": "Home", "nav.catalog": "Catalogo", "nav.profile": "Profilo", "common.continue": "Continua", "common.skip": "Salta", "common.seeAll": "Vedi tutto", "home.tagline": "TROVA · CONFRONTA · PROVA", "home.heroTitle": "Trova l’IA\ngiusta senza scorrere ovunque.", "home.heroSub": "Guida pubblica per scegliere strumenti IA senza gergo: Match, schede editoriali, newsletter e offerte business/formazione.", "home.ctaMatch": "Avvia Match", "home.exploreFamilies": "Esplora per famiglia", "home.topStart": "Top 3 per iniziare", "profile.title": "Il mio profilo", "profile.language": "Lingua", "profile.languageAuto": "Rilevata automaticamente al primo avvio, modificabile qui.", "profile.languageMarket": "Mercato prioritario", "profile.theme": "Tema", "profile.day": "Giorno", "profile.night": "Notte", "profile.newMatchTitle": "Avvia un nuovo match", "profile.newMatchSub": "Descrivi il bisogno, troviamo la migliore IA in 3 domande.", "profile.newMatchCta": "Nuovo Match", "onboarding.needTitle": "Cosa vuoi fare con l’IA?", "onboarding.levelTitle": "Il tuo livello?", "onboarding.budgetTitle": "Il tuo budget?", "match.needTitle": "Cosa vuoi fare?", "match.placeholder": "es. creare un video TikTok per vendere il mio servizio", "premium.title": "Sblocca IA Match Premium", "premium.activate": "Attiva Premium" },
  ja: { "nav.home": "ホーム", "nav.catalog": "カタログ", "nav.academy": "学習", "nav.prompt": "プロンプト", "nav.profile": "プロフィール", "common.continue": "続ける", "common.skip": "スキップ", "common.seeAll": "すべて見る", "home.tagline": "探す · 比較 · 試す", "home.heroTitle": "最適なAIを\n迷わず見つける。", "home.heroSub": "専門用語なしでAIツールを選ぶための公開ガイド。Match、編集スコア、ニュースレター、法人/研修向け提案。", "home.ctaMatch": "Matchを開始", "home.exploreFamilies": "カテゴリで探す", "home.topStart": "最初のおすすめ3選", "profile.title": "プロフィール", "profile.language": "言語", "profile.languageAuto": "初回起動時に自動検出。ここで変更できます。", "profile.languageMarket": "重点市場", "profile.theme": "テーマ", "profile.day": "ライト", "profile.night": "ダーク", "profile.newMatchTitle": "新しいMatchを開始", "profile.newMatchSub": "目的を入力すると、3つの質問で最適なAIを提案します。", "profile.newMatchCta": "新規Match", "onboarding.needTitle": "AIで何をしたいですか？", "onboarding.levelTitle": "現在のレベルは？", "onboarding.budgetTitle": "予算は？", "match.needTitle": "何をしたいですか？", "match.placeholder": "例：サービス販売用のTikTok動画を作る", "premium.title": "IA Match Premiumを解放", "premium.activate": "Premiumを有効化" },
  ko: { "nav.home": "홈", "nav.catalog": "카탈로그", "nav.academy": "아카데미", "nav.prompt": "프롬프트", "nav.profile": "프로필", "common.continue": "계속", "common.skip": "건너뛰기", "common.seeAll": "전체 보기", "home.tagline": "찾기 · 비교 · 테스트", "home.heroTitle": "끝없는 검색 없이\n맞는 AI를 찾으세요.", "home.heroSub": "전문 용어 없이 AI 도구를 고르는 공개 가이드: Match, 편집 점수, 뉴스레터, 기업/교육 제안.", "home.ctaMatch": "Match 시작", "home.exploreFamilies": "분야별 탐색", "home.topStart": "시작 추천 Top 3", "profile.title": "내 프로필", "profile.language": "언어", "profile.languageAuto": "첫 실행 시 자동 감지되며 여기서 변경할 수 있습니다.", "profile.languageMarket": "우선 시장", "profile.theme": "테마", "profile.day": "라이트", "profile.night": "다크", "profile.newMatchTitle": "새 Match 시작", "profile.newMatchSub": "필요한 것을 설명하면 3개의 질문으로 최적의 AI를 찾습니다.", "profile.newMatchCta": "새 Match", "onboarding.needTitle": "AI로 무엇을 하고 싶나요?", "onboarding.levelTitle": "현재 수준은?", "onboarding.budgetTitle": "예산은?", "match.needTitle": "무엇을 하고 싶나요?", "match.placeholder": "예: 내 서비스를 판매할 TikTok 영상 만들기", "premium.title": "IA Match Premium 잠금 해제", "premium.activate": "Premium 활성화" },
  zh: { "nav.home": "首页", "nav.catalog": "目录", "nav.academy": "学院", "nav.prompt": "提示词", "nav.profile": "我的", "common.continue": "继续", "common.skip": "跳过", "common.seeAll": "查看全部", "home.tagline": "发现 · 对比 · 测试", "home.heroTitle": "不用到处翻，\n找到合适的 AI。", "home.heroSub": "无术语的 AI 工具选择指南：Match、编辑评分、新闻简报以及企业/培训方案。", "home.ctaMatch": "开始 Match", "home.exploreFamilies": "按类别探索", "home.topStart": "入门 Top 3", "profile.title": "我的资料", "profile.language": "语言", "profile.languageAuto": "首次启动自动检测，也可在这里修改。", "profile.languageMarket": "重点市场", "profile.theme": "主题", "profile.day": "日间", "profile.night": "夜间", "profile.newMatchTitle": "开始新的 Match", "profile.newMatchSub": "描述你的需求，3 个问题帮你找到最合适的 AI。", "profile.newMatchCta": "新的 Match", "onboarding.needTitle": "你想用 AI 做什么？", "onboarding.levelTitle": "你现在的水平？", "onboarding.budgetTitle": "你的预算？", "match.needTitle": "你想做什么？", "match.placeholder": "例如：制作一个推广服务的 TikTok 视频", "premium.title": "解锁 IA Match Premium", "premium.activate": "开启 Premium" },
  ar: { "nav.home": "الرئيسية", "nav.catalog": "الدليل", "nav.academy": "الأكاديمية", "nav.prompt": "برومبت", "nav.profile": "الملف", "common.continue": "متابعة", "common.skip": "تخطي", "common.seeAll": "عرض الكل", "home.tagline": "اكتشف · قارن · جرّب", "home.heroTitle": "اعثر على أداة الذكاء\nالاصطناعي المناسبة بسرعة.", "home.heroSub": "دليل عام لاختيار أدوات الذكاء الاصطناعي بلا تعقيد: Match، بطاقات تقييم تحريرية، نشرة وعروض للشركات والتدريب.", "home.ctaMatch": "ابدأ Match", "home.exploreFamilies": "استكشف حسب الفئة", "home.topStart": "أفضل 3 للبداية", "profile.title": "ملفي", "profile.language": "اللغة", "profile.languageAuto": "يتم اكتشافها تلقائياً عند أول تشغيل ويمكن تعديلها هنا.", "profile.languageMarket": "السوق ذو الأولوية", "profile.theme": "المظهر", "profile.day": "نهاري", "profile.night": "ليلي", "profile.newMatchTitle": "ابدأ Match جديد", "profile.newMatchSub": "صف احتياجك ونجد أفضل أداة في 3 أسئلة.", "profile.newMatchCta": "Match جديد", "onboarding.needTitle": "ماذا تريد أن تفعل بالذكاء الاصطناعي؟", "onboarding.levelTitle": "ما مستواك الحالي؟", "onboarding.budgetTitle": "ما ميزانيتك؟", "match.needTitle": "ماذا تريد أن تفعل؟", "match.placeholder": "مثال: إنشاء فيديو TikTok لبيع خدمتي", "premium.title": "افتح IA Match Premium", "premium.activate": "تفعيل Premium" },
  hi: { "nav.home": "होम", "nav.catalog": "कैटलॉग", "nav.academy": "अकादमी", "nav.prompt": "प्रॉम्प्ट", "nav.profile": "प्रोफ़ाइल", "common.continue": "जारी रखें", "common.skip": "छोड़ें", "common.seeAll": "सब देखें", "home.tagline": "ढूँढें · तुलना करें · टेस्ट करें", "home.heroTitle": "बिना अंतहीन खोज के\nसही AI पाएँ।", "home.heroSub": "बिना जटिल भाषा के AI टूल चुनने की सार्वजनिक गाइड: Match, संपादकीय स्कोर, न्यूज़लेटर और बिज़नेस/ट्रेनिंग ऑफ़र।", "home.ctaMatch": "Match शुरू करें", "home.exploreFamilies": "श्रेणी से खोजें", "home.topStart": "शुरुआत के Top 3", "profile.title": "मेरी प्रोफ़ाइल", "profile.language": "भाषा", "profile.languageAuto": "पहली बार अपने-आप पहचानी जाती है, यहाँ बदली जा सकती है।", "profile.languageMarket": "प्राथमिक बाज़ार", "profile.theme": "थीम", "profile.day": "दिन", "profile.night": "रात", "profile.newMatchTitle": "नया Match शुरू करें", "profile.newMatchSub": "अपनी ज़रूरत बताइए, हम 3 सवालों में सही AI ढूँढेंगे।", "profile.newMatchCta": "नया Match", "onboarding.needTitle": "आप AI से क्या करना चाहते हैं?", "onboarding.levelTitle": "आपका मौजूदा स्तर?", "onboarding.budgetTitle": "आपका बजट?", "match.needTitle": "आप क्या करना चाहते हैं?", "match.placeholder": "जैसे: मेरी सेवा बेचने के लिए TikTok वीडियो बनाना", "premium.title": "IA Match Premium अनलॉक करें", "premium.activate": "Premium सक्रिय करें" }
};

type I18nContextValue = {
  language: AppLanguage;
  apiLanguage: string;
  isRTL: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (key: string, vars?: Record<string, string | number>) => string;
  languages: typeof STRATEGIC_LANGUAGES;
};

const I18nContext = createContext<I18nContextValue>({
  language: "fr",
  apiLanguage: "fr",
  isRTL: false,
  setLanguage: async () => {},
  t: (key) => base[key] ?? key,
  languages: STRATEGIC_LANGUAGES,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("fr");

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((stored) => {
      // Pas de changement silencieux selon la langue du téléphone : l'app reste
      // en français tant que l'utilisateur n'a pas choisi une autre langue.
      const lang = STRATEGIC_LANGUAGES.some((l) => l.code === stored) ? (stored as AppLanguage) : "fr";
      setLanguageState(lang);
    }).catch(() => {});
  }, []);

  const setLanguage = useCallback(async (next: AppLanguage) => {
    setLanguageState(next);
    await AsyncStorage.setItem(KEY, next).catch(() => {});
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const lang = STRATEGIC_LANGUAGES.find((item) => item.code === language) ?? STRATEGIC_LANGUAGES[0];
    const t = (key: string, vars: Record<string, string | number> = {}) => {
      const raw = translations[language]?.[key] ?? base[key] ?? key;
      return Object.entries(vars).reduce((text, [name, val]) => text.replace(new RegExp(`\\{${name}\\}`, "g"), String(val)), raw);
    };
    return {
      language,
      apiLanguage: lang.apiCode,
      isRTL: RTL_LANGUAGES.has(language) || I18nManager.isRTL,
      setLanguage,
      t,
      languages: STRATEGIC_LANGUAGES,
    };
  }, [language, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
