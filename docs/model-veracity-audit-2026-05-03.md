# Audit véracité modèles IA — 2026-05-03

Objectif : éviter que IA Match affiche une liste de LLM/modèles obsolète ou trop affirmative.

## Sources consultées

- OpenAI Developers — Models : `https://developers.openai.com/api/docs/models`
- OpenAI Developers — Reasoning guide : `https://developers.openai.com/api/docs/guides/reasoning`
- OpenRouter Models API : `https://openrouter.ai/api/v1/models`
- Anthropic Docs — Models overview : `https://docs.anthropic.com/en/docs/about-claude/models/overview`
- Google AI for Developers — Gemini API models : `https://ai.google.dev/gemini-api/docs/models`
- Mistral Docs — Models overview : `https://docs.mistral.ai/getting-started/models/models_overview/`
- xAI Docs — Models and pricing : `https://docs.x.ai/docs/models`
- DeepSeek API Docs — Pricing/models : `https://api-docs.deepseek.com/quick_start/pricing`
- Meta AI blog — Llama 4 : `https://ai.meta.com/blog/llama-4-multimodal-intelligence/`

## Verdicts utiles pour IA Match

- `GPT-5.5` : confirmé dans la documentation OpenAI Developers et dans OpenRouter (`openai/gpt-5.5`, `openai/gpt-5.5-pro`). À garder.
- `GPT Image 2` : confirmé dans la documentation OpenAI Developers. À garder pour image.
- `o3` : existe encore via OpenRouter (`openai/o3`, `openai/o3-pro`, `openai/o3-deep-research`). En revanche, ne pas le présenter comme modèle généraliste de tête : le traiter comme modèle de raisonnement spécialisé / API. Le libellé IA Match a été corrigé en ce sens.
- `o4-mini` : présent dans la documentation OpenAI reasoning. Peut être mentionné comme modèle reasoning spécialisé.
- `Claude Opus 4.7`, `Claude Sonnet 4.6`, `Claude Haiku 4.5` : confirmés dans la documentation Anthropic. À garder.
- `Gemini 3.1 Pro Preview`, `Gemini 3 Flash`, `Gemini 3.1 Flash-Lite`, `Nano Banana 2` : confirmés dans la documentation Google Gemini. Le benchmark général IA Match a été mis à jour depuis `Gemini 2.5 Pro` vers `Gemini 3.1 Pro Preview`.
- `Mistral Large 3` : confirmé dans la documentation Mistral. À garder.
- `Grok 4.3` : confirmé dans la documentation xAI et OpenRouter. À garder.
- `Llama 4 Scout/Maverick` : confirmé côté Meta. À garder.
- `DeepSeek R1` : encore utile comme famille reasoning connue ; `DeepSeek-V3.2` est plus actuel pour le libellé général. IA Match affiche maintenant `DeepSeek-V3.2 / R1` dans le classement général.

## Changements appliqués

- `backend/server.py`
  - Mise à jour des modèles représentatifs dans `/api/benchmarks` :
    - Claude → `Claude Sonnet 4.6`
    - Gemini → `Gemini 3.1 Pro Preview`
    - DeepSeek → `DeepSeek-V3.2 / R1`
    - Llama → `Llama 4 Scout/Maverick`
    - Mistral → `Mistral Large 3 / Le Chat`
    - Kimi → `Kimi K2 Thinking`
    - Grok → `Grok 4.3`
  - Ajout d’un `sourceNote` dans `/api/benchmarks` pour rappeler que les scores sont des indices éditoriaux IA Match, pas des mesures live.

- `backend/seed_data_extra.py`
  - `o3` n’est plus vendu comme “raisonneur frontière” généraliste.
  - Nouveau wording : raisonnement OpenAI encore disponible via API/agrégateurs, spécialisé maths/code/analyse complexe.
  - Score et coût éditorial ajustés pour éviter de le surpromouvoir.
  - `gemini-25` renommé côté donnée en `Gemini 3.1 Pro Preview` tout en gardant le slug pour compatibilité.

- `frontend/src/fallbackData.ts`
  - Régénéré depuis l’API locale pour que la bêta statique Vercel embarque les mêmes corrections.

## Règle produit à conserver

- Classement général : afficher une famille ou produit connu, avec un modèle représentatif récent.
- Catégories spécialisées : afficher les modèles précis si cela aide vraiment.
- Ne jamais écrire “meilleur du monde” ou “n°1 mondial” sans source forte et datée.
- Les champs `score`, `accuracyPct`, `speedMs` doivent être compris comme des indices éditoriaux ou estimations, sauf source mesurée explicite.
