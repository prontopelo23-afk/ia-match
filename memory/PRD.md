# IA Match — PRD v4

## Overview
"IA Match" — app mobile premium qui aide à trouver la meilleure IA, à apprendre à prompter, à exécuter de vrais prompts (Claude Haiku 4.5), et à se cultiver sur l'écosystème.

## Stack
- Frontend: Expo Router SSR, Lucide, Playfair + Inter, Reanimated, SVG, AsyncStorage, Clipboard, Linking.
- Backend: FastAPI + MongoDB. Claude Haiku 4.5 via `emergentintegrations` + `EMERGENT_LLM_KEY`.

## Theme & Premium
- Light/Dark, persistant, toggle dans Profil. Toutes les sections partagent le même `bg`.
- Plan freemium : Catalogue + Actue + Profil (gratuit) ; Academy + Builder + Compare + Benchmarks (Premium 9,99€/mois — **MOCKED** activation AsyncStorage, pas de Stripe).

## Tabs (5)
- **Catalogue** : 48 IA. Logo IA Match dans le header. Recherche, filtres, tri.
- **Actue** : 10 articles pédagogiques émerveillants (GPT-5.5, GPT Image 2.0, US/CN/EU, Mistral, Highfield, évolution rapide IA, Sora vs Runway, Garder/Changer/Exclure, Agents, 5 erreurs). Détail markdown avec h2/bullets/bold/numbered.
- **Academy** (premium) : 10 fondamentaux pédagogiques + 15 templates (5 BEGINNER + 5 INTERMEDIATE + 5 ADVANCED) avec filtre par niveau.
- **Builder** (premium) : 7 blocs + exécution réelle Claude Haiku 4.5 + copie.
- **Profil** : plan, toggle thème, toggle premium, historique, 12 ressources externes (YouTubers, blogs, podcasts, newsletters, outils).

## Logos LLM (chaîne fallback dans `LogoTile`)
1. Google Favicons (`https://www.google.com/s2/favicons?domain=X&sz=128`) — primaire car le plus fiable.
2. Clearbit (`https://logo.clearbit.com/{domain}`) — secondaire.
3. Initiale sur fond coloré.

## Tool detail
- LogoTile cliquable → ouvre `https://${domain}` via Linking.
- Bouton "Visiter ${domain}".
- Notation +10/-10, compare toggle.

## Backend API
- `GET /tools`, `/tools/{slug}`, `/categories`, `/benchmarks`, `POST /match`, `POST /ratings`, `GET /ratings/{slug}`, `GET /ratings`.
- `GET /news` (10 articles), `GET /news/{id}`. `GET /lessons` (10), `GET /templates` (15, filtrable `?level=`). `GET /resources` (12).
- `POST /builder/run` : Claude Haiku 4.5.

## Local data
- `ia_match_history_v1`, `ia_match_compare_v1`, `ia_match_theme_v1`, `ia_match_premium_v1`.
