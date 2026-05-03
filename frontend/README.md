# IA Match — Frontend Expo

Application Expo Router / React Native de recommandation d’outils IA.

## Démarrage

```bash
npm install
npm start -- --lan --clear
```

Pour Expo Go sur téléphone, `frontend/.env` doit pointer vers le backend LAN :

```bash
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.32:8000
EXPO_USE_FAST_RESOLVER=1
METRO_CACHE_ROOT=.metro-cache
```

## Bêta publique web

Pour Render/Vercel/Cloudflare Pages, le frontend doit être exporté en statique avec l’URL HTTPS du backend :

```bash
EXPO_PUBLIC_BACKEND_URL=https://ia-match-api.onrender.com
EXPO_USE_FAST_RESOLVER=0
METRO_CACHE_ROOT=.metro-cache
npm install
npx expo export --platform web --clear
```

Le dossier publié est `dist`.

## Validation

```bash
npm run lint
node node_modules/typescript/lib/tsc.js --noEmit
```

## Écrans importants

- `app/onboarding.tsx` : onboarding personnalisé
- `app/match.tsx` : wizard IA Match et résultat actionnable
- `app/(tabs)/index.tsx` : accueil
- `app/(tabs)/benchmarks.tsx` : benchmarks / scores
- `app/(tabs)/builder.tsx` : constructeur de stack IA
- `app/(tabs)/profile.tsx` : profil, historique, favoris
- `app/tool/[slug].tsx` : détail outil
