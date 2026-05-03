#!/usr/bin/env python3
"""Keep local IA Match env files aligned with the current Mac LAN IP."""
from __future__ import annotations

from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
FRONTEND_ENV = ROOT / "frontend" / ".env"
BACKEND_ENV = ROOT / "backend" / ".env"


def get_ip() -> str:
    for iface in ("en0", "en1"):
        try:
            ip = subprocess.check_output(["ipconfig", "getifaddr", iface], text=True).strip()
        except subprocess.CalledProcessError:
            continue
        if ip:
            return ip
    return "127.0.0.1"


def upsert_line(text: str, key: str, value: str) -> str:
    pattern = re.compile(rf"^{re.escape(key)}=.*$", re.MULTILINE)
    line = f"{key}={value}"
    if pattern.search(text):
        return pattern.sub(line, text)
    if text and not text.endswith("\n"):
        text += "\n"
    return text + line + "\n"


def main() -> int:
    ip = get_ip()
    backend_url = f"http://{ip}:8000"
    frontend_url = f"http://{ip}:8081"
    origins = f"http://localhost:8081,http://127.0.0.1:8081,{frontend_url}"

    frontend = FRONTEND_ENV.read_text() if FRONTEND_ENV.exists() else ""
    frontend = upsert_line(frontend, "EXPO_PUBLIC_BACKEND_URL", backend_url)
    frontend = upsert_line(frontend, "EXPO_USE_FAST_RESOLVER", '"0"')
    frontend = upsert_line(frontend, "METRO_CACHE_ROOT", ".metro-cache")
    FRONTEND_ENV.write_text(frontend)

    backend = BACKEND_ENV.read_text() if BACKEND_ENV.exists() else "MONGO_URL=mongodb://localhost:27017\nDB_NAME=ia_match\n"
    backend = upsert_line(backend, "OPENROUTER_SITE_URL", frontend_url)
    backend = upsert_line(backend, "ALLOWED_ORIGINS", origins)
    backend = upsert_line(backend, "CORS_ORIGINS", origins)
    BACKEND_ENV.write_text(backend)

    print(f"IA Match LAN IP: {ip}")
    print(f"Backend URL: {backend_url}")
    print(f"Frontend URL: {frontend_url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
