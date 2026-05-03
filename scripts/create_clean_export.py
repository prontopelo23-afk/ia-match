#!/usr/bin/env python3
"""Create a portable IA Match source archive without secrets or dependencies."""
from __future__ import annotations

from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import os
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT.parent / "exports"
OUT = OUT_DIR / "ia-match-clean-no-secrets.zip"

EXCLUDE_DIRS = {
    ".git",
    "node_modules",
    ".venv",
    "venv",
    "__pycache__",
    ".expo",
    ".metro-cache",
    ".pytest_cache",
    "dist",
    "build",
}
EXCLUDE_SUFFIXES = (".zip", ".tar", ".tar.gz", ".tgz")
EXCLUDE_FILES = {".DS_Store"}
SECRET_PATTERNS = (
    "sk" + "-or-",
    "OPENROUTER_API_KEY=" + "sk",
    "EMERGENT_LLM_KEY=" + "sk",
    "ANTHROPIC_API_KEY=" + "sk-",
    "OPENAI_API_KEY=" + "sk-",
)
TEXT_SUFFIXES = {
    ".py",
    ".ts",
    ".tsx",
    ".js",
    ".json",
    ".md",
    ".txt",
    ".yaml",
    ".yml",
    ".example",
}


def is_env_secret(path: Path) -> bool:
    name = path.name
    if name.endswith(".env.example") or name == ".env.example":
        return False
    return name == ".env" or name.endswith(".env") or "/.env" in path.as_posix()


def should_skip(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    if any(part in EXCLUDE_DIRS for part in rel.parts):
        return True
    if path.name in EXCLUDE_FILES:
        return True
    if is_env_secret(rel):
        return True
    if any(path.name.endswith(suffix) for suffix in EXCLUDE_SUFFIXES):
        return True
    return False


def looks_text(path: Path) -> bool:
    return path.suffix in TEXT_SUFFIXES or path.name.endswith(".env.example")


def secret_hits_in_file(path: Path) -> list[str]:
    if not looks_text(path):
        return []
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return []
    return [pattern for pattern in SECRET_PATTERNS if pattern in text]


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if OUT.exists():
        OUT.unlink()

    included: list[str] = []
    secret_hits: list[tuple[str, list[str]]] = []
    with ZipFile(OUT, "w", ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(ROOT):
            root_path = Path(root)
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for filename in files:
                file_path = root_path / filename
                if should_skip(file_path):
                    continue
                arcname = file_path.relative_to(ROOT).as_posix()
                hits = secret_hits_in_file(file_path)
                if hits:
                    secret_hits.append((arcname, hits))
                    continue
                zf.write(file_path, arcname)
                included.append(arcname)

    if secret_hits:
        OUT.unlink(missing_ok=True)
        print("ERREUR: motifs de secrets détectés avant export:", file=sys.stderr)
        for arcname, hits in secret_hits:
            print(f"- {arcname}: {', '.join(hits)}", file=sys.stderr)
        return 1

    with ZipFile(OUT) as zf:
        leaked = [n for n in zf.namelist() if is_env_secret(Path(n))]
        post_secret_hits: list[tuple[str, list[str]]] = []
        for name in zf.namelist():
            if not looks_text(Path(name)):
                continue
            text = zf.read(name).decode("utf-8", "ignore")
            hits = [pattern for pattern in SECRET_PATTERNS if pattern in text]
            if hits:
                post_secret_hits.append((name, hits))
    if leaked or post_secret_hits:
        OUT.unlink(missing_ok=True)
        if leaked:
            print("ERREUR: secrets détectés dans l’archive:", leaked, file=sys.stderr)
        if post_secret_hits:
            print("ERREUR: motifs de secrets détectés dans l’archive:", file=sys.stderr)
            for arcname, hits in post_secret_hits:
                print(f"- {arcname}: {', '.join(hits)}", file=sys.stderr)
        return 1

    print(f"Archive créée: {OUT}")
    print(f"Fichiers inclus: {len(included)}")
    print(f"Taille: {OUT.stat().st_size / 1024 / 1024:.2f} MB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
