#!/usr/bin/env python3
"""Generate a coherent IA Match Academy visual pack.

This intentionally avoids internal labels such as "LEÇON", "V4", "FINALE" or
"PARCOURS". Every poster uses the same IA Match Academy signature, typography,
layout and color system.
"""
from __future__ import annotations

import json
import re
import textwrap
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
FALLBACK = ROOT / "src" / "fallbackData.ts"
VISUALS_TS = ROOT / "src" / "academyVisuals.ts"
OUT_DIR = ROOT / "assets" / "academy" / "course-visuals"

W, H = 941, 1672
COLORS = {
    "ink": (24, 31, 45),
    "muted": (92, 101, 119),
    "soft": (247, 242, 237),
    "paper": (255, 252, 247),
    "line": (232, 222, 214),
    "coral": (255, 90, 69),
    "coral_dark": (225, 64, 50),
    "mint": (65, 187, 161),
    "blue": (66, 112, 245),
    "gold": (242, 181, 74),
    "lavender": (132, 103, 255),
}

FONT_CANDIDATES = [
    "/System/Library/Fonts/SFNS.ttf",
    "/System/Library/Fonts/SFCompact.ttf",
    "/Library/Fonts/Arial Unicode.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]
MONO_CANDIDATES = [
    "/System/Library/Fonts/SFNSMono.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]


def font(size: int, mono: bool = False) -> ImageFont.FreeTypeFont:
    for p in (MONO_CANDIDATES if mono else FONT_CANDIDATES):
        if Path(p).exists():
            return ImageFont.truetype(p, size=size)
    return ImageFont.load_default(size=size)

F_LOGO = font(38)
F_LOGO_SMALL = font(23)
F_KICKER = font(25)
F_TITLE = font(56)
F_SUBTITLE = font(30)
F_CARD_NUM = font(28)
F_CARD_TITLE = font(34)
F_CARD_BODY = font(27)
F_SMALL = font(24)
F_MICRO = font(21)
F_MONO = font(25, mono=True)


def extract_json_object(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    start = text.index("{")
    end = text.rfind("} as const;") + 1
    return json.loads(text[start:end])


def extract_visual_map() -> list[tuple[str, str]]:
    text = VISUALS_TS.read_text(encoding="utf-8")
    pairs = []
    for m in re.finditer(r'"([^"]+)":\s*require\("\.\./assets/academy/course-visuals/([^"]+\.jpg)"\)', text):
        pairs.append((m.group(1), m.group(2)))
    return pairs


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int, max_lines: int) -> list[str]:
    words = str(text).replace("\n", " ").split()
    lines: list[str] = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        if draw.textbbox((0, 0), test, font=fnt)[2] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
        if len(lines) >= max_lines:
            break
    if current and len(lines) < max_lines:
        lines.append(current)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
    # Ellipsize if original text was longer than what fits.
    joined = " ".join(lines)
    if len(joined) < len(str(text).strip()) - 8 and lines:
        while draw.textbbox((0, 0), lines[-1] + "…", font=fnt)[2] > max_width and len(lines[-1]) > 4:
            lines[-1] = lines[-1][:-1].rstrip()
        lines[-1] = lines[-1].rstrip(".,;:") + "…"
    return lines


def draw_round(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill, outline=None, width: int = 1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_text_lines(draw: ImageDraw.ImageDraw, xy: tuple[int, int], lines: Iterable[str], fnt, fill, leading: int) -> int:
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += leading
    return y


def safe_sentence(s: str, fallback: str) -> str:
    s = str(s or "").strip()
    if not s:
        return fallback
    # Remove quotes that look messy inside a small poster.
    s = s.replace("“", "").replace("”", "").replace('"', "")
    return s


def theme_for(course_id: str) -> tuple[tuple[int, int, int], tuple[int, int, int]]:
    groups = [COLORS["coral"], COLORS["blue"], COLORS["mint"], COLORS["gold"], COLORS["lavender"]]
    m = re.search(r"course_(\d+)_", course_id)
    idx = (int(m.group(1)) - 1) if m else 0
    primary = groups[idx % len(groups)]
    return primary, tuple(max(0, c - 35) for c in primary)


def lesson_micro_goal(title: str) -> str:
    t = title.rstrip(".")
    if len(t) <= 58:
        return t
    return t[:55].rstrip() + "…"


def draw_logo(draw: ImageDraw.ImageDraw, x: int, y: int, primary):
    # Simple stable mark: coral rounded square + white IA, then consistent wordmark.
    draw_round(draw, (x, y, x + 64, y + 64), 18, primary)
    draw.text((x + 17, y + 13), "IA", font=font(25), fill=(255, 255, 255))
    draw.text((x + 82, y + 7), "IA Match", font=F_LOGO, fill=COLORS["ink"])
    draw.text((x + 84, y + 47), "Academy", font=F_LOGO_SMALL, fill=COLORS["muted"])


def draw_card(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, num: str, title: str, body: str, accent):
    draw_round(draw, (x + 7, y + 9, x + w + 7, y + h + 9), 34, (227, 217, 207))
    draw_round(draw, (x, y, x + w, y + h), 34, (255, 255, 255), COLORS["line"], 2)
    draw_round(draw, (x + 30, y + 30, x + 84, y + 84), 18, accent)
    draw.text((x + 48, y + 43), num, font=F_CARD_NUM, fill=(255, 255, 255), anchor="mm")
    draw.text((x + 108, y + 28), title, font=F_CARD_TITLE, fill=COLORS["ink"])
    lines = wrap(draw, body, F_CARD_BODY, w - 138, 3)
    draw_text_lines(draw, (x + 108, y + 78), lines, F_CARD_BODY, COLORS["muted"], 36)


def generate(course: dict, filename: str):
    primary, dark = theme_for(course["id"])
    im = Image.new("RGB", (W, H), COLORS["soft"])
    draw = ImageDraw.Draw(im)

    # Premium but calm background.
    for i in range(H):
        ratio = i / H
        r = int(255 * (1 - ratio) + 246 * ratio)
        g = int(250 * (1 - ratio) + 242 * ratio)
        b = int(244 * (1 - ratio) + 238 * ratio)
        draw.line([(0, i), (W, i)], fill=(r, g, b))
    draw.ellipse((W - 310, -180, W + 190, 330), fill=tuple(min(255, c + 145) for c in primary))
    draw.ellipse((-210, H - 420, 310, H + 80), fill=(238, 231, 224))

    margin = 72
    draw_logo(draw, margin, 66, primary)

    # Course number as a small visual index, not an internal label.
    order = int(course.get("order") or 0)
    path_num = (order - 1) // 8 + 1
    step_num = ((order - 1) % 8) + 1
    chip = f"{path_num:02d}.{step_num:02d}"
    draw_round(draw, (W - margin - 126, 82, W - margin, 132), 25, (255, 255, 255), COLORS["line"], 2)
    draw.text((W - margin - 63, 107), chip, font=F_MONO, fill=COLORS["muted"], anchor="mm")

    title = course["title"]
    title_lines = wrap(draw, title, F_TITLE, W - margin * 2, 2)
    y = 230
    y = draw_text_lines(draw, (margin, y), title_lines, F_TITLE, COLORS["ink"], 68)
    y += 22
    subtitle = "Un repère visuel simple pour appliquer la bonne méthode, sans jargon."
    y = draw_text_lines(draw, (margin, y), wrap(draw, subtitle, F_SUBTITLE, W - margin * 2, 2), F_SUBTITLE, COLORS["muted"], 40)

    # Hero device / schema area.
    hero_y = 500
    draw_round(draw, (margin, hero_y, W - margin, hero_y + 276), 42, COLORS["paper"], COLORS["line"], 2)
    # Flow line and three nodes.
    xs = [margin + 126, margin + 398, margin + 670]
    labels = ["Besoin", "Méthode", "Contrôle"]
    for i in range(2):
        draw.line((xs[i] + 42, hero_y + 138, xs[i + 1] - 42, hero_y + 138), fill=primary, width=8)
        draw.polygon([(xs[i + 1] - 58, hero_y + 122), (xs[i + 1] - 36, hero_y + 138), (xs[i + 1] - 58, hero_y + 154)], fill=primary)
    for i, x in enumerate(xs):
        fill = primary if i == 1 else (255, 255, 255)
        outline = primary
        draw_round(draw, (x - 54, hero_y + 76, x + 54, hero_y + 184), 30, fill, outline, 4)
        sym = ["?", "→", "✓"][i]
        draw.text((x, hero_y + 130), sym, font=font(56), fill=(255, 255, 255) if i == 1 else primary, anchor="mm")
        draw.text((x, hero_y + 210), labels[i], font=F_SMALL, fill=COLORS["ink"], anchor="mm")
    micro = lesson_micro_goal(title)
    draw.text((W // 2, hero_y + 34), micro, font=F_SMALL, fill=COLORS["muted"], anchor="mm")

    before = safe_sentence(course.get("before"), "Un besoin flou donne une réponse difficile à utiliser.")
    after = safe_sentence(course.get("after"), "Je transforme mon besoin en consigne claire, testable et utile.")
    steps = course.get("steps") or []
    step = safe_sentence(steps[0] if steps else "Ajouter objectif, contexte et format.", "Ajouter objectif, contexte et format.")

    card_w = W - margin * 2
    draw_card(draw, margin, 840, card_w, 168, "1", "Clarifier", before, primary)
    draw_card(draw, margin, 1044, card_w, 168, "2", "Structurer", step, COLORS["blue"])
    draw_card(draw, margin, 1248, card_w, 168, "3", "Vérifier", after, COLORS["mint"])

    # Bottom rule: useful, not internal metadata.
    draw_round(draw, (margin, 1490, W - margin, 1574), 28, (255, 255, 255), COLORS["line"], 2)
    draw.text((margin + 32, 1517), "À retenir", font=F_SMALL, fill=primary)
    takeaway = "Une bonne réponse vient d’une boucle courte : demander, lire, vérifier, améliorer."
    draw.text((margin + 166, 1517), takeaway, font=F_MICRO, fill=COLORS["muted"])

    # Save clean optimized JPEG.
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / filename
    im.save(out, quality=88, optimize=True, progressive=True)


def main():
    data = extract_json_object(FALLBACK)
    lessons_by_id = {lesson["id"]: lesson for lesson in data["LESSONS"]}
    visual_map = extract_visual_map()
    missing = [course_id for course_id, _ in visual_map if course_id not in lessons_by_id]
    if missing:
        raise SystemExit(f"Missing lessons for visuals: {missing[:5]}")
    for course_id, filename in visual_map:
        generate(lessons_by_id[course_id], filename)
    print(f"generated={len(visual_map)} out_dir={OUT_DIR}")


if __name__ == "__main__":
    main()
