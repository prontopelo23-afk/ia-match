#!/usr/bin/env python3
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "frontend" / "dist"

class SPAHandler(SimpleHTTPRequestHandler):
    asset_prefixes = ("/_expo/", "/assets/", "/favicon", "/manifest", "/robots")

    def _rewrite_route(self):
        # Expo Router exports top-level screens as /route.html while nested
        # folders (ex: /academy/lesson) can also exist. Prefer the screen HTML
        # over SimpleHTTPRequestHandler's directory listing for clean app URLs.
        if self.path.startswith(self.asset_prefixes):
            return
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        translated = Path(self.translate_path(path))
        if translated.is_dir():
            html_path = ROOT / f"{path.strip('/')}.html"
            if html_path.exists():
                self.path = f"/{path.strip('/')}.html"
            else:
                self.path = "/index.html"
        elif not translated.exists():
            html_path = ROOT / f"{path.strip('/')}.html"
            if html_path.exists():
                self.path = f"/{path.strip('/')}.html"
            else:
                self.path = "/index.html"

    def do_GET(self):
        self._rewrite_route()
        return super().do_GET()

    def do_HEAD(self):
        self._rewrite_route()
        return super().do_HEAD()

if __name__ == "__main__":
    handler = partial(SPAHandler, directory=str(ROOT))
    ThreadingHTTPServer(("0.0.0.0", 8081), handler).serve_forever()
