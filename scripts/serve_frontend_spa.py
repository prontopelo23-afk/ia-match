#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1] / "frontend" / "dist"
os.chdir(ROOT)

class SPAHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        translated = Path(self.translate_path(self.path))
        asset_prefixes = ("/_expo/", "/assets/", "/favicon", "/manifest", "/robots")
        if not translated.exists() and not self.path.startswith(asset_prefixes):
            self.path = "/index.html"
        return super().do_GET()

    def do_HEAD(self):
        translated = Path(self.translate_path(self.path))
        asset_prefixes = ("/_expo/", "/assets/", "/favicon", "/manifest", "/robots")
        if not translated.exists() and not self.path.startswith(asset_prefixes):
            self.path = "/index.html"
        return super().do_HEAD()

ThreadingHTTPServer(("0.0.0.0", 8081), SPAHandler).serve_forever()
