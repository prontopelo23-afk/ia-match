#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

cd "$ROOT"
/usr/bin/python3 "$ROOT/scripts/update_local_network_env.py"

cd "$ROOT/frontend"
# Rebuild static web app on service start so the bundle embeds the current backend LAN URL.
/usr/local/bin/npm run export -- --platform web --clear 2>/dev/null || /opt/homebrew/bin/npm run export -- --platform web --clear 2>/dev/null || /usr/local/bin/npx expo export --platform web --clear || /opt/homebrew/bin/npx expo export --platform web --clear

exec /usr/bin/python3 "$ROOT/scripts/serve_frontend_spa.py"
