"""IA Match backend - FastAPI + MongoDB."""
from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
import unicodedata
import uuid
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field

from seed_data import TOOLS, CATEGORIES
from editorial_data import NEWS, LESSONS, TEMPLATES

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="IA Match API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class Tool(BaseModel):
    slug: str
    name: str
    vendor: str
    tagline: str
    description: str
    categorySlugs: List[str]
    speedMs: int
    accuracyPct: int
    costPerPrompt: float
    monthlyPrice: float
    freeTier: bool
    languages: List[str]
    features: List[str]
    useCases: List[str]
    keywords: List[str] = []
    score: int
    color: str
    image: str


class Category(BaseModel):
    slug: str
    name: str
    description: str


class MatchRequest(BaseModel):
    need: str
    priority: Optional[str] = "balanced"  # speed | accuracy | price | balanced
    free_only: Optional[bool] = False
    language: Optional[str] = "fr"


class MatchResult(BaseModel):
    tool: Tool
    matchScore: int
    reasons: List[str]


class RatingCreate(BaseModel):
    tool_slug: str
    score: int  # 0-100
    note: Optional[str] = None


class Rating(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tool_slug: str
    score: int
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ToolRatingSummary(BaseModel):
    tool_slug: str
    average: float
    count: int


# ---------- Helpers ----------
def _normalize(text: str) -> str:
    text = text.lower()
    text = "".join(
        c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn"
    )
    return text


def _rule_based_match(need: str, priority: str, free_only: bool, language: str) -> List[MatchResult]:
    """Score each tool based on keyword overlap, priority weighting and constraints."""
    need_norm = _normalize(need)
    tokens = set(re.findall(r"[a-z0-9]+", need_norm))
    results: List[MatchResult] = []

    for raw in TOOLS:
        if free_only and not raw.get("freeTier"):
            continue
        # Language is a soft preference (bonus), not a hard filter
        lang_match = bool(language and language in raw.get("languages", []))

        tool = Tool(**raw)
        kw_norm = [_normalize(k) for k in raw.get("keywords", [])]
        kw_hits = [k for k in kw_norm if k in need_norm or any(t in k or k in t for t in tokens)]
        uc_norm = [_normalize(u) for u in raw.get("useCases", [])]
        uc_hits = [u for u in uc_norm if any(t in u for t in tokens) or u in need_norm]
        cat_hits = [c for c in raw.get("categorySlugs", []) if c in need_norm]

        relevance = min(60, len(kw_hits) * 12 + len(uc_hits) * 8 + len(cat_hits) * 6)

        # Priority weighting (out of 40)
        if priority == "speed":
            speed_score = max(0, 40 - (raw["speedMs"] / 1000))  # ~40 for fast
            quality = speed_score
        elif priority == "accuracy":
            quality = (raw["accuracyPct"] / 100) * 40
        elif priority == "price":
            if raw["freeTier"]:
                quality = 40
            else:
                quality = max(0, 40 - raw["monthlyPrice"])
        else:  # balanced
            quality = (raw["score"] / 100) * 40

        match_score = int(min(100, relevance + quality))

        reasons: List[str] = []
        if kw_hits:
            reasons.append(f"Mots-clés : {', '.join(kw_hits[:3])}")
        if cat_hits:
            cat_names = [c["name"] for c in CATEGORIES if c["slug"] in cat_hits]
            reasons.append(f"Catégorie : {', '.join(cat_names)}")
        if priority == "speed" and raw["speedMs"] < 500:
            reasons.append("Réponse instantanée")
        if priority == "accuracy" and raw["accuracyPct"] >= 90:
            reasons.append(f"Précision {raw['accuracyPct']}%")
        if priority == "price" and raw["freeTier"]:
            reasons.append("Plan gratuit disponible")
        if not reasons:
            reasons.append(f"Score global {raw['score']}/100")

        results.append(MatchResult(tool=tool, matchScore=match_score, reasons=reasons))

    results.sort(key=lambda r: r.matchScore, reverse=True)
    return results


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "IA Match API", "version": "1.0"}


@api_router.get("/categories", response_model=List[Category])
async def list_categories():
    return [Category(**c) for c in CATEGORIES]


@api_router.get("/tools", response_model=List[Tool])
async def list_tools(
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_score: Optional[int] = None,
    free_only: Optional[bool] = False,
    sort: Optional[str] = "score",  # score | speed | accuracy | price
):
    items = list(TOOLS)
    if category:
        items = [t for t in items if category in t["categorySlugs"]]
    if free_only:
        items = [t for t in items if t.get("freeTier")]
    if min_score is not None:
        items = [t for t in items if t["score"] >= min_score]
    if search:
        s = _normalize(search)
        items = [
            t
            for t in items
            if s in _normalize(t["name"])
            or s in _normalize(t["description"])
            or s in _normalize(t["tagline"])
            or any(s in _normalize(k) for k in t.get("keywords", []))
        ]

    if sort == "speed":
        items.sort(key=lambda t: t["speedMs"])
    elif sort == "accuracy":
        items.sort(key=lambda t: t["accuracyPct"], reverse=True)
    elif sort == "price":
        items.sort(key=lambda t: (not t["freeTier"], t["monthlyPrice"]))
    else:
        items.sort(key=lambda t: t["score"], reverse=True)

    return [Tool(**t) for t in items]


@api_router.get("/tools/{slug}", response_model=Tool)
async def get_tool(slug: str):
    for t in TOOLS:
        if t["slug"] == slug:
            return Tool(**t)
    raise HTTPException(404, "Tool not found")


@api_router.get("/benchmarks")
async def benchmarks(sort: str = Query("score")):
    items = list(TOOLS)
    if sort == "speed":
        items.sort(key=lambda t: t["speedMs"])
    elif sort == "accuracy":
        items.sort(key=lambda t: t["accuracyPct"], reverse=True)
    elif sort == "price":
        items.sort(key=lambda t: (not t["freeTier"], t["monthlyPrice"]))
    else:
        items.sort(key=lambda t: t["score"], reverse=True)
    return {
        "rows": [
            {
                "slug": t["slug"],
                "name": t["name"],
                "vendor": t["vendor"],
                "color": t["color"],
                "speedMs": t["speedMs"],
                "accuracyPct": t["accuracyPct"],
                "monthlyPrice": t["monthlyPrice"],
                "freeTier": t["freeTier"],
                "score": t["score"],
                "languages": t["languages"],
            }
            for t in items
        ]
    }


@api_router.post("/match", response_model=List[MatchResult])
async def match(req: MatchRequest):
    if not req.need or not req.need.strip():
        raise HTTPException(400, "need is required")
    results = _rule_based_match(req.need, req.priority or "balanced", req.free_only or False, req.language or "fr")
    return results[:8]


@api_router.post("/ratings", response_model=Rating)
async def create_rating(req: RatingCreate):
    if not (0 <= req.score <= 100):
        raise HTTPException(400, "score must be 0-100")
    if not any(t["slug"] == req.tool_slug for t in TOOLS):
        raise HTTPException(404, "Tool not found")
    rating = Rating(tool_slug=req.tool_slug, score=req.score, note=req.note)
    await db.ratings.insert_one(rating.model_dump())
    return rating


@api_router.get("/ratings/{slug}", response_model=ToolRatingSummary)
async def get_ratings(slug: str):
    cursor = db.ratings.find({"tool_slug": slug}, {"_id": 0})
    items = await cursor.to_list(1000)
    count = len(items)
    avg = round(sum(r["score"] for r in items) / count, 1) if count else 0.0
    return ToolRatingSummary(tool_slug=slug, average=avg, count=count)


@api_router.get("/ratings", response_model=List[ToolRatingSummary])
async def all_ratings():
    pipeline = [
        {"$group": {"_id": "$tool_slug", "average": {"$avg": "$score"}, "count": {"$sum": 1}}}
    ]
    items = await db.ratings.aggregate(pipeline).to_list(1000)
    return [
        ToolRatingSummary(tool_slug=i["_id"], average=round(i["average"], 1), count=i["count"]) for i in items
    ]


@api_router.get("/news")
async def list_news(category: Optional[str] = None):
    items = list(NEWS)
    if category:
        items = [n for n in items if n["category"].lower() == category.lower()]
    return items


@api_router.get("/news/{news_id}")
async def get_news(news_id: str):
    for n in NEWS:
        if n["id"] == news_id:
            return n
    raise HTTPException(404, "Article not found")


@api_router.get("/lessons")
async def list_lessons():
    return sorted(LESSONS, key=lambda l: l["order"])


@api_router.get("/lessons/{lesson_id}")
async def get_lesson(lesson_id: str):
    for l in LESSONS:
        if l["id"] == lesson_id:
            return l
    raise HTTPException(404, "Lesson not found")


@api_router.get("/templates")
async def list_templates(level: Optional[str] = None):
    items = list(TEMPLATES)
    if level:
        items = [t for t in items if t["level"].lower() == level.lower()]
    return items


@api_router.get("/templates/{template_id}")
async def get_template(template_id: str):
    for t in TEMPLATES:
        if t["id"] == template_id:
            return t
    raise HTTPException(404, "Template not found")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
