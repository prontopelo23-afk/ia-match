# IA Match

IA Match est une application mobile Expo + API FastAPI qui aide un utilisateur francophone à trouver le bon outil d’IA selon son besoin, son niveau et son budget.

## Stack

- Frontend : Expo Router, React Native, TypeScript
- Backend : FastAPI, Python, MongoDB/Motor si `MONGO_URL` est configuré
- Données : catalogue enrichi d’outils IA, scores, exemples, RGPD/privacy, benchmarks

## Déploiement bêta publique

Pour obtenir un lien public testable même quand le Mac est éteint, utiliser le guide :

```bash
BETA_DEPLOY.md
```

Le projet contient aussi un blueprint Render prêt à adapter :

```bash
render.yaml
```

Il prépare :

- `ia-match-api` : backend FastAPI ;
- `ia-match-web` : frontend Expo exporté en site statique ;
- MongoDB Atlas à renseigner via `MONGO_URL`.

## Lancement local sur Mac + téléphone Expo Go

### 1. Backend

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000
```

Vérification :

```bash
curl http://localhost:8000/api/
curl http://localhost:8000/api/tools
```

### 2. Frontend

Dans `frontend/.env`, mettre l’IP locale du Mac :

```bash
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.32:8000
EXPO_USE_FAST_RESOLVER=1
METRO_CACHE_ROOT=.metro-cache
```

Puis :

```bash
cd frontend
npm install
npm start -- --lan --clear
```

Scanner le QR code avec Expo Go. Le frontend doit afficher :

```text
Metro waiting on exp://192.168.1.32:8081
```

Important : le Mac et le téléphone doivent être sur le même Wi‑Fi.

## Commandes de validation

```bash
# Frontend
cd frontend
npm run lint
node node_modules/typescript/lib/tsc.js --noEmit

# Backend
cd backend
.venv/bin/python -m pytest tests -q
```

## Fonctionnalités principales

- Wizard Match en 3 étapes : besoin, niveau, budget + priorité séparée (équilibre, prix, qualité, vitesse)
- Recommandations avec meilleur choix, alternative gratuite et option premium distincts quand le catalogue le permet
- Prompt prêt à copier pour lancer directement dans l’outil recommandé
- Historique enrichi : outil recommandé, score, bouton outil, copie du prompt
- Favoris, profil, mode clair/sombre, onboarding, academy, benchmarks, compare, builder
- Backend avec endpoints catalogue, recherche, matching, benchmarks et données enrichies

## Export propre

Créer une archive sans dépendances, caches ni secrets :

```bash
cd /Users/karmaswoop/Desktop/new/mon-app-complete
python3 scripts/create_clean_export.py
```

Le script vérifie automatiquement qu’aucun vrai `.env` n’est inclus. Les anciennes commandes `zip -r` manuelles sont à éviter car elles peuvent embarquer des clés API par erreur.

## Notes sécurité

- Ne pas commiter les fichiers `.env`.
- Si une archive a contenu `backend/.env`, révoquer les clés côté fournisseur puis générer de nouvelles clés. Voir `SECURITY.md`.
- Le premium est mocké localement via AsyncStorage pour le MVP. Avant production : statut premium côté backend + Stripe/RevenueCat + webhooks.
- Les scores par catégorie sont des indices éditoriaux IA Match sauf mention explicite de benchmark vérifié.
- Utiliser `http://IP_LOCALE:8000` uniquement pour les tests LAN locaux.
- En production, passer par HTTPS et configurer CORS avec le domaine final.
