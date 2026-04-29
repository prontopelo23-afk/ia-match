# IA Match — Product Requirements Document

## Overview
"IA Match" is a Steve Jobs-style premium mobile app (Expo + React Native) that helps users find the best AI tool for their specific needs.

## Stack
- Frontend: Expo Router (React Native, web preview), Lucide icons, Playfair Display (serif) + Inter (sans), react-native-reanimated, react-native-svg, AsyncStorage.
- Backend: FastAPI with `/api/*` prefix, MongoDB for ratings storage. 20 AI tools curated as seed.

## Pages / Screens
- `(tabs)/index` — Home: dark hero, CTA "Lancer le Match", categories carousel, top AIs.
- `(tabs)/search` — search input, category chips, sort (score/speed/accuracy/price), free-only filter, ToolCard list with compare toggle.
- `(tabs)/compare` — two side-by-side slots (chosen via search "compare" toggle), full feature comparison table with winner highlighting.
- `(tabs)/benchmarks` — sortable table (Score, Vitesse, Précision, Prix) with score progress bars.
- `(tabs)/profile` — local history (AsyncStorage) of past matches; clear button.
- `match` (modal) — 3-step wizard: need (with suggestion chips), priority (balanced/speed/accuracy/price + free-only), results.
- `tool/[slug]` — full detail with stats grid, features, use cases, community rating summary, +10/-10 rating with 0–100 ScoreRing animation, submit, compare toggle.

## Backend API (FastAPI, prefix `/api`)
- `GET /tools` — filters: category, search, free_only, min_score, sort.
- `GET /tools/{slug}`.
- `GET /categories`.
- `GET /benchmarks?sort=`.
- `POST /match` — rule-based matching engine (keyword overlap + use-case + category + priority weighting). Returns top 8.
- `POST /ratings` — body `{tool_slug, score 0-100, note?}`.
- `GET /ratings/{slug}` — `{average, count}`.
- `GET /ratings` — aggregated summary all tools.

## Design
- Bg `#FDFBF7`, dark card `#12151C`, accents pink `#F43F7A` & coral `#FF5A45`.
- 24/32 px radius, soft shadows, large serif H1 with italic accent.
- Bottom tab bar with 5 tabs.

## Local data
- `ia_match_history_v1` — last 30 matches (need + priority + ts).
- `ia_match_compare_v1` — selected slugs for comparator (max 2).

## Auth
- None for MVP (history & compare local; ratings anonymous).

## V2 ideas
- Stripe Premium plan (PDF reports, real-time API comparator).
- LLM-based smart matching (Emergent LLM key).
- Multi-language interface.
