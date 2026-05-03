#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

cd "$ROOT"
/usr/bin/python3 "$ROOT/scripts/update_local_network_env.py"

cd "$ROOT/backend"
if [ ! -x "$ROOT/backend/.venv/bin/python" ]; then
  /usr/bin/python3 -m venv "$ROOT/backend/.venv"
fi
grep -v '^emergentintegrations==' requirements.txt > /tmp/ia-match-backend-requirements.txt
"$ROOT/backend/.venv/bin/python" -m pip install -r /tmp/ia-match-backend-requirements.txt >/dev/null
exec "$ROOT/backend/.venv/bin/python" -m uvicorn server:app --host 0.0.0.0 --port 8000
