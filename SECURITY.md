# IA Match — sécurité secrets

## Incident corrigé

Une archive précédente a inclus `backend/.env` avec de vraies clés API. Cette archive a été supprimée localement et remplacée par une archive propre qui n’inclut que les fichiers `.env.example`.

## Actions à faire côté comptes fournisseurs

Les clés qui ont été exposées doivent être considérées comme compromises si l’archive a quitté la machine :

1. Révoquer l’ancienne clé OpenRouter.
2. Révoquer l’ancienne clé Emergent si elle était active.
3. Créer de nouvelles clés.
4. Les coller uniquement dans `backend/.env` local, jamais dans une archive.

## Règles d’export

Utiliser uniquement :

```bash
python3 scripts/create_clean_export.py
```

Le script refuse d’inclure :

- `.env`
- `*.env` sauf `*.env.example`
- `node_modules`
- `.venv`
- caches Expo/Metro/Pytest/Python
- archives déjà générées
- `.git`

## Freemium actuel

Le premium actuel est volontairement local/mocké via AsyncStorage pour le MVP. Avant production payante, remplacer ce flow par un statut premium validé côté backend avec Stripe/RevenueCat + webhooks.
