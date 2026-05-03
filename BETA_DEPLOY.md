# IA Match — guide de déploiement bêta publique

Objectif : obtenir un lien public testable par n’importe qui, même quand le Mac local est éteint.

## Option recommandée : Render + MongoDB Atlas

Cette option garde le projet simple :

- Backend FastAPI : Render Web Service
- Frontend Expo Web statique : Render Static Site
- Base : MongoDB Atlas gratuit / M0

Le fichier `render.yaml` à la racine prépare les deux services.

## 1. Préparer MongoDB Atlas

1. Créer un cluster MongoDB Atlas.
2. Créer un utilisateur DB dédié.
3. Autoriser l’accès réseau pour Render.
   - Pour une bêta rapide : `0.0.0.0/0`.
   - Pour plus strict : utiliser les IP sortantes Render si disponibles selon le plan.
4. Copier l’URI de connexion au format :

```text
mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/ia_match?retryWrites=true&w=majority
```

Cette valeur devient `MONGO_URL` côté backend Render.

## 2. Déployer avec Render Blueprint

1. Mettre le projet sur GitHub, sans `.env`, `node_modules`, `.venv`, caches ni archives.
2. Dans Render : **New +** → **Blueprint**.
3. Sélectionner le repo IA Match.
4. Render lit `render.yaml` et propose :
   - `ia-match-api`
   - `ia-match-web`
5. Renseigner les variables marquées `sync: false` :
   - `MONGO_URL` : obligatoire.
   - `OPENROUTER_API_KEY` : optionnel pour les fonctions LLM réelles.
   - `EMERGENT_LLM_KEY` : optionnel / legacy actu.

## 3. Vérifier les URLs Render

Le blueprint utilise par défaut :

```text
Frontend : https://ia-match-web.onrender.com
Backend  : https://ia-match-api.onrender.com
```

Si Render attribue une URL différente :

1. Dans `ia-match-web`, modifier `EXPO_PUBLIC_BACKEND_URL` avec l’URL réelle de l’API.
2. Dans `ia-match-api`, modifier :
   - `ALLOWED_ORIGINS`
   - `CORS_ORIGINS`
   - `OPENROUTER_SITE_URL`
3. Relancer le build frontend.

## 4. Smoke tests après déploiement

Remplacer les URLs si Render a donné d’autres noms.

```bash
python3 - <<'PY'
import json, urllib.request
api='https://ia-match-api.onrender.com'
web='https://ia-match-web.onrender.com'

for url in [api + '/api/', api + '/api/tools', web + '/']:
    with urllib.request.urlopen(url, timeout=30) as r:
        print(url, r.status, r.getheader('content-type'))

payload={
    'need':'Je veux trouver une IA gratuite pour résumer un PDF et préparer un email clair',
    'priority':'price',
    'free_only':True,
    'language':'fr',
}
req=urllib.request.Request(
    api + '/api/match',
    data=json.dumps(payload).encode(),
    headers={'Content-Type':'application/json'},
    method='POST',
)
with urllib.request.urlopen(req, timeout=30) as r:
    data=json.load(r)
print('match_count=', len(data), 'top=', data[0]['tool']['name'] if data else 'none')
PY
```

## 5. Notes importantes pour la bêta

- Le premier chargement sur plan gratuit Render peut être lent si le service dort.
- Le Premium est encore MVP/local côté frontend : ne pas vendre comme sécurité production.
- Pour encaisser réellement : ajouter Stripe/RevenueCat + validation serveur.
- Les scores doivent rester présentés comme **indices éditoriaux IA Match**, pas comme benchmarks scientifiques.
- Les prix/quotas des outils IA changent vite : garder la mention de fraîcheur et d’incertitude.

## 6. Alternative si tu préfères Vercel + Render

Tu peux aussi :

- garder `ia-match-api` sur Render ;
- déployer `frontend/` sur Vercel ;
- configurer dans Vercel :

```text
EXPO_PUBLIC_BACKEND_URL=https://URL-DE-TON-API-RENDER
EXPO_USE_FAST_RESOLVER=0
METRO_CACHE_ROOT=.metro-cache
```

Build Vercel :

```bash
npm install && npx expo export --platform web --clear
```

Output directory :

```text
dist
```

Puis ajouter l’URL Vercel dans `ALLOWED_ORIGINS` côté backend Render.
