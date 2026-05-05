#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCK_DIR="${TMPDIR:-/tmp}/ia-match-vercel-prod-deploy.lock"
LOG_DIR="$ROOT_DIR/.hermes/logs"
LOG_FILE="$LOG_DIR/vercel-prod-deploy.log"
PUBLIC_URL="https://ia-match-beta.vercel.app"

mkdir -p "$LOG_DIR"

cleanup() {
  rm -rf "$LOCK_DIR"
}
trap cleanup EXIT

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  echo "Déploiement déjà en cours: $LOCK_DIR" >&2
  exit 75
fi

cd "$ROOT_DIR"

# Vercel/Expo doivent rester non-interactifs pour éviter les blocages TTY
# et les erreurs du type: tcsetattr: Inappropriate ioctl for device.
export CI=1
export VERCEL_TELEMETRY_DISABLED=1
export EXPO_NO_TELEMETRY=1
export EXPO_NO_PROGRESS=1
export NPM_CONFIG_FUND=false
export NPM_CONFIG_AUDIT=false
export EXPO_PUBLIC_BACKEND_URL=
export EXPO_USE_FAST_RESOLVER=0

if pgrep -f "vercel deploy --prod" >/dev/null 2>&1; then
  # pgrep peut détecter la commande courante; on filtre les vrais processus existants.
  existing="$(ps -axo pid=,ppid=,stat=,command= | awk '/vercel deploy --prod/ && $0 !~ /awk/ && $0 !~ /deploy_vercel_prod_clean/ {print}')"
  if [ -n "$existing" ]; then
    echo "Un autre déploiement Vercel prod tourne déjà:" >&2
    echo "$existing" >&2
    exit 75
  fi
fi

: > "$LOG_FILE"
echo "IA Match — déploiement Vercel prod propre" | tee -a "$LOG_FILE"
echo "Projet: $ROOT_DIR" | tee -a "$LOG_FILE"

# Pré-validation rapide: évite d'uploader une build qui va échouer.
(
  cd frontend
  npm run lint
  npm run typecheck
  npx expo export --platform web
) >>"$LOG_FILE" 2>&1

echo "Validation locale OK" | tee -a "$LOG_FILE"

# Commande volontairement foreground/sans background Hermes: pas de notification de process tué.
# Toute la sortie détaillée reste dans le log; le terminal utilisateur reste propre.
deploy_output="$(vercel deploy --prod --yes 2>&1)"
printf '%s\n' "$deploy_output" >>"$LOG_FILE"

prod_url="$(printf '%s\n' "$deploy_output" | grep -Eo 'https://[^ ]+\.vercel\.app' | tail -n 1 || true)"
if [ -z "$prod_url" ]; then
  echo "Impossible d'extraire l'URL Vercel depuis la sortie. Voir: $LOG_FILE" >&2
  exit 1
fi

echo "URL technique: $prod_url" | tee -a "$LOG_FILE"

inspect_output="$(vercel inspect "$PUBLIC_URL" --timeout 60s 2>&1)"
printf '%s\n' "$inspect_output" >>"$LOG_FILE"
if ! printf '%s\n' "$inspect_output" | grep -q 'status[[:space:]]*● Ready'; then
  echo "Vercel n'est pas en état Ready. Voir: $LOG_FILE" >&2
  exit 1
fi

http_code="$(curl -L -sS -o /dev/null -w '%{http_code}' --max-time 30 "$PUBLIC_URL")"
if [ "$http_code" != "200" ]; then
  echo "Contrôle HTTP public échoué: $PUBLIC_URL -> $http_code. Voir: $LOG_FILE" >&2
  exit 1
fi

echo "OK — Vercel Ready et $PUBLIC_URL répond en HTTP 200" | tee -a "$LOG_FILE"
echo "Log complet: $LOG_FILE" | tee -a "$LOG_FILE"
