# Déploiement IA Match 100% gratuit

Ce mode sert à publier une bêta publique sans carte bancaire, sans MongoDB Atlas et sans serveur payant.

## Option recommandée gratuite : Vercel Static Demo

Cette option publie uniquement le frontend Expo Web. L'app utilise les données embarquées dans `frontend/src/fallbackData.ts` et les fallbacks locaux de `frontend/src/api.ts`.

### Ce qui fonctionne

- Catalogue d'outils IA.
- Match/recommandations de démonstration.
- Benchmarks éditoriaux embarqués.
- Fiches outils.
- Actu/Academy/Builder avec données locales quand l'API n'est pas disponible.
- App publique accessible même quand le Mac est éteint.

### Limites assumées du mode gratuit

- Pas de vraie base MongoDB distante.
- Pas de sauvegarde serveur des notes/ratings.
- Pas d'authentification serveur.
- Pas de génération LLM serveur en production.
- Les données sont celles embarquées au moment du build.

Pour une bêta commerciale complète, utiliser ensuite `BETA_DEPLOY.md` avec Render + MongoDB Atlas.

## Déploiement Vercel gratuit

1. Créer/pousser le repo sur GitHub.
2. Aller sur https://vercel.com/new.
3. Importer le repo GitHub.
4. Garder le fichier `vercel.json` à la racine : il configure tout.
5. Plan : Hobby / Free.
6. Ne pas renseigner `EXPO_PUBLIC_BACKEND_URL` pour le mode statique gratuit.
7. Déployer.

La configuration incluse :

- `installCommand`: `cd frontend && npm ci`
- `buildCommand`: `cd frontend && EXPO_PUBLIC_BACKEND_URL= EXPO_USE_FAST_RESOLVER=0 npx expo export --platform web --clear`
- `outputDirectory`: `frontend/dist`
- SPA fallback vers `index.html` pour les routes Expo Router.

## Test local du mode gratuit

Depuis la racine du projet :

```bash
cd frontend
EXPO_PUBLIC_BACKEND_URL= EXPO_USE_FAST_RESOLVER=0 npx expo export --platform web --clear
python3 ../scripts/serve_frontend_spa.py
```

Puis ouvrir :

```text
http://localhost:8081
```

## Passage ultérieur au mode complet gratuit/low-cost

Si tu veux ajouter un backend public sans payer :

- MongoDB Atlas M0 : gratuit.
- Render/Railway/Fly/etc. : vérifier le free tier du moment, car les conditions changent.
- Quand une vraie API existe, définir `EXPO_PUBLIC_BACKEND_URL=https://ton-api...` dans Vercel et redéployer.
