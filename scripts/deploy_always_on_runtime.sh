#!/usr/bin/env bash
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)"
DST="/Users/karmaswoop/ia-match-always-on"

mkdir -p "$DST"
rsync -a --delete \
  --exclude '.git/' \
  --exclude 'frontend/node_modules/' \
  --exclude 'frontend/.metro-cache/' \
  --exclude 'frontend/.expo/' \
  --exclude 'frontend/dist/' \
  --exclude 'backend/.venv/' \
  --exclude '**/__pycache__/' \
  --exclude '**/.pytest_cache/' \
  --exclude '*.zip' \
  "$SRC/" "$DST/"

chmod +x "$DST/scripts/"*.sh "$DST/scripts/"*.py
cd "$DST/frontend"
npm install
cd "$DST/backend"
python3 -m venv .venv
grep -v '^emergentintegrations==' requirements.txt > /tmp/ia-match-backend-requirements.txt
./.venv/bin/python -m pip install -r /tmp/ia-match-backend-requirements.txt
cd "$DST"
python3 scripts/update_local_network_env.py

if command -v launchctl >/dev/null 2>&1; then
  UID_CURRENT="$(id -u)"
  launchctl kickstart -k "gui/${UID_CURRENT}/com.iamatch.backend" 2>/dev/null || true
  launchctl kickstart -k "gui/${UID_CURRENT}/com.iamatch.frontend" 2>/dev/null || true
fi

echo "Runtime IA Match prêt: $DST"
