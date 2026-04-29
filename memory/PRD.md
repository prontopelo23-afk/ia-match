# IA Match — Product Requirements Document

## Overview
"IA Match" — app mobile premium (Expo + React Native) qui aide les utilisateurs à trouver la meilleure IA pour leurs besoins, à apprendre à prompter, à exécuter de vrais prompts via Claude Haiku 4.5, et à se tenir à jour sur l'écosystème.

## Stack
- Frontend: Expo Router (SSR), Lucide icons, Playfair + Inter, react-native-reanimated, react-native-svg, AsyncStorage, expo-clipboard, Linking.
- Backend: FastAPI + MongoDB (ratings). Claude Haiku 4.5 via `emergentintegrations` + `EMERGENT_LLM_KEY`.

## Theme & Premium
- Light/Dark theme via `ThemeProvider` (toggle dans Profil, persisté AsyncStorage `ia_match_theme_v1`). Tous les écrans partagent le même `bg`.
- Plan freemium :
  - **Découverte (gratuit)** : Catalogue, Actue, Profil.
  - **Premium (9,99€/mois — démo)** : Academy, Builder, Comparateur, Benchmarks. Toggle dans Profil ou paywall (PremiumGate). Persisté AsyncStorage `ia_match_premium_v1`.
  - **MOCKED**: pas de Stripe — activation simulée.

## Tabs (5)
- **Catalogue** : 48 IA, recherche, filtres, top, header icons → Compare/Benchmarks (premium).
- **Actue** : 7 articles pédagogiques complets (~700 mots), featured + 6 brèves. Détail navigable `/news/[id]` avec markdown rendering (h2, bullets, numbered, bold).
- **Academy** (premium) : 5 leçons + 8 templates copiables.
- **Builder** (premium) : 7 blocs + preview + **exécution réelle Claude Haiku 4.5** + copie.
- **Profil** : plan, toggle thème, toggle premium, historique, 12 ressources externes (YouTubers, blogs, podcasts, newsletters, outils), CTA new match.

## Tool detail
- Logo cliquable (clearbit + fallback initiales LogoTile) → ouvre `https://${domain}` via Linking.
- Bouton "Visiter ${domain}" en bas.
- Stats, features, use cases, notation +10/-10 communautaire avec submit, compare toggle.

## Backend API (FastAPI, prefix `/api`)
- `GET /tools`, `/tools/{slug}`, `/categories`, `/benchmarks`, `POST /match`, `POST /ratings`, `GET /ratings/{slug}`, `GET /ratings`.
- `GET /news` (7), `GET /news/{id}` (full body), `GET /lessons` (5), `GET /templates` (8), `GET /resources` (12).
- **`POST /builder/run`** : Claude Haiku 4.5 via Emergent LLM Key — single-shot.

## Local data
- `ia_match_history_v1`, `ia_match_compare_v1`, `ia_match_theme_v1`, `ia_match_premium_v1`.

## V2 ideas
- Vraie intégration Stripe pour Premium.
- Recommender engine LLM contextualisé.
- Bookmark articles + notifications éditoriales.
- Build & save mes prompts perso.
