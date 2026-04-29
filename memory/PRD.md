# IA Match — Product Requirements Document

## Overview
"IA Match" is a Steve Jobs-style premium mobile app (Expo + React Native) that helps users find the best AI tool for their specific needs and learn how to prompt them.

## Stack
- Frontend: Expo Router (React Native, web preview, SSR), Lucide icons, Playfair Display (serif) + Inter (sans), react-native-reanimated, react-native-svg, AsyncStorage, expo-clipboard.
- Backend: FastAPI with `/api/*` prefix, MongoDB for ratings storage. 48 AIs curated catalog with real Clearbit logos.

## Pages / Screens (5 main tabs + nested routes)
- `(tabs)/index` (Catalogue) — brand top-bar, hero, search, category/sort/free filters, full results list. Header icons → /benchmarks and /compare.
- `(tabs)/actue` (Actue) — dark editorial news feed: featured article with figure highlight + 6 article rows.
- `(tabs)/academy` (Academy) — 2 sub-tabs: Fondamentaux (5 lessons with framework, steps, before/after) + Templates (8 copyable prompt templates).
- `(tabs)/builder` (Builder) — Prompt Builder 7-block form (Rôle, Objectif, Audience, Contexte, Contraintes, Format, Critères) with live preview + copy.
- `(tabs)/profile` (Profil) — local match history + new match CTA.
- `(tabs)/compare` & `(tabs)/benchmarks` — hidden from tab bar, opened from Catalogue header icons.
- `match` (modal) — 3-step matching wizard.
- `tool/[slug]` — full detail with stats, features, ratings (+10/-10), compare toggle.

## Backend API (FastAPI, prefix `/api`)
- `GET /tools` — filters: category, search, free_only, min_score, sort. Returns 48 tools.
- `GET /tools/{slug}`, `GET /categories` (7 categories).
- `GET /benchmarks?sort=`, `POST /match`, `POST /ratings`, `GET /ratings/{slug}`, `GET /ratings`.
- `GET /news` (7 articles), `GET /news/{id}`.
- `GET /lessons` (5 lessons), `GET /lessons/{id}`.
- `GET /templates` (8 templates), `GET /templates/{id}`, filterable by `level`.

## Design
- Light theme: Bg `#FDFBF7`, dark editorial sections `#12151C`, accents coral `#FF5A45` (primary) & pink `#F43F7A`.
- 24/32 px radius, soft shadows, Playfair italic accents in titles.
- Bottom tab bar with 5 tabs (lucide icons).
- Real brand logos via Clearbit (`https://logo.clearbit.com/{domain}`).

## Local data (AsyncStorage)
- `ia_match_history_v1` — last 30 matches.
- `ia_match_compare_v1` — selected slugs for comparator (max 2).

## Auth
- None for MVP (history & compare local; ratings anonymous).

## V2 ideas
- Stripe Premium plan (PDF reports, real-time API comparator).
- LLM-powered smart matching (Emergent LLM key).
- Article detail view + bookmarks.
- Multi-language interface.
