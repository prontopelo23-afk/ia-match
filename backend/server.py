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
from seed_data_extra import EXTRA_TOOLS
from editorial_data import NEWS, LESSONS, TEMPLATES, RESOURCES
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Merge EXTRA_TOOLS into TOOLS (decorate with logo)
def _logo(domain: str) -> str:
    return f"https://logo.clearbit.com/{domain}"

_existing_slugs = {t["slug"] for t in TOOLS}
for _et in EXTRA_TOOLS:
    if _et["slug"] in _existing_slugs:
        continue
    _et["image"] = _logo(_et["domain"])
    TOOLS.append(_et)


# ---------- Per-category scores ----------
def _hash_int(s: str, mod: int) -> int:
    h = 0
    for ch in s:
        h = (h * 131 + ord(ch)) & 0xFFFFFFFF
    return h % mod


def _compute_category_scores(tool: dict) -> dict:
    """For each category the tool belongs to, compute a specialty score 0-99.

    - Primary category (first slug) is weighted toward base score + accuracy.
    - Secondary categories are penalized by 5 (~secondary specialty).
    - Tertiary+ categories are penalized by ~10.
    A small deterministic variance per (slug, category) ensures distinct scores.
    """
    cats = tool.get("categorySlugs", []) or []
    base = int(tool.get("score", 70))
    acc = int(tool.get("accuracyPct", 75))
    out: dict = {}
    for i, c in enumerate(cats):
        var = _hash_int(tool["slug"] + ":" + c, 5)
        if i == 0:
            v = int(base * 0.55 + acc * 0.45) + (var - 2)
            out[c] = max(60, min(99, v))
        elif i == 1:
            penalty = 4 + _hash_int(tool["slug"] + c + "s", 5)
            out[c] = max(55, min(94, base - penalty + (var - 2)))
        else:
            penalty = 9 + _hash_int(tool["slug"] + c + "t", 6)
            out[c] = max(45, min(90, base - penalty + (var - 2)))
    return out


for _t in TOOLS:
    _t["categoryScores"] = _compute_category_scores(_t)

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
    domain: Optional[str] = None
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
    categoryScores: dict = {}
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
        # When a category is selected, rank by per-category score so each
        # specialty has its own ranking. Otherwise use the global score.
        if category:
            items.sort(
                key=lambda t: (t.get("categoryScores", {}).get(category, t["score"]), t["score"]),
                reverse=True,
            )
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


@api_router.get("/resources")
async def list_resources(category: Optional[str] = None):
    items = list(RESOURCES)
    if category:
        items = [r for r in items if r["category"].lower() == category.lower()]
    return items


class BuilderRunRequest(BaseModel):
    prompt: str
    model: Optional[str] = "claude-haiku-4-5-20251001"


@api_router.post("/builder/run")
async def builder_run(req: BuilderRunRequest):
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(400, "prompt is required")
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(500, "LLM key not configured")
    session_id = f"builder-{uuid.uuid4()}"
    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=(
                "Tu es un assistant expert. Exécute fidèlement le brief fourni par l'utilisateur. "
                "Si le brief précise un format de sortie, respecte-le strictement. "
                "Sois concis, précis et concret. Réponds en français sauf instruction contraire."
            ),
        ).with_model("anthropic", req.model or "claude-haiku-4-5-20251001")
        message = UserMessage(text=req.prompt.strip())
        text = await chat.send_message(message)
        return {"output": text, "model": req.model, "session_id": session_id}
    except Exception as e:
        logger.exception("builder_run failed")
        raise HTTPException(500, f"LLM error: {e}")


app.include_router(api_router)

# ---------- Auth router ----------
import bcrypt
import jwt as pyjwt

JWT_SECRET = os.environ.get("JWT_SECRET", "ia-match-dev-secret-change-me-in-prod")
JWT_ALGO = "HS256"
JWT_EXPIRES_DAYS = 30

auth_router = APIRouter(prefix="/api/auth")


class RegisterReq(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    accept_terms: bool = False


class LoginReq(BaseModel):
    email: str
    password: str


def _hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt(rounds=10)).decode("utf-8")


def _check_pw(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _make_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "iat": int(datetime.now(timezone.utc).timestamp()),
        "exp": int(datetime.now(timezone.utc).timestamp()) + JWT_EXPIRES_DAYS * 86400,
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def _decode_token(token: str) -> Optional[dict]:
    try:
        return pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except Exception:
        return None


EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


@auth_router.post("/register")
async def register(req: RegisterReq):
    email = (req.email or "").strip().lower()
    if not EMAIL_RE.match(email):
        raise HTTPException(400, "Email invalide")
    if not req.password or len(req.password) < 8:
        raise HTTPException(400, "Mot de passe trop court (min 8 caractères)")
    if not req.accept_terms:
        raise HTTPException(400, "Tu dois accepter les CGU et la politique de confidentialité")
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(409, "Un compte existe déjà avec cet email")
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "email": email,
        "name": (req.name or email.split("@")[0]).strip(),
        "password_hash": _hash_pw(req.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_premium": False,
        "consent": {"terms": True, "privacy": True, "marketing": False},
    }
    await db.users.insert_one(user)
    token = _make_token(user_id, email)
    return {
        "token": token,
        "user": {"id": user_id, "email": email, "name": user["name"], "is_premium": False},
    }


@auth_router.post("/login")
async def login(req: LoginReq):
    email = (req.email or "").strip().lower()
    if not email or not req.password:
        raise HTTPException(400, "Email et mot de passe requis")
    user = await db.users.find_one({"email": email})
    if not user or not _check_pw(req.password, user.get("password_hash", "")):
        raise HTTPException(401, "Email ou mot de passe incorrect")
    token = _make_token(user["id"], email)
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", ""),
            "is_premium": user.get("is_premium", False),
        },
    }


@auth_router.get("/me")
async def me(authorization: Optional[str] = None):
    # Read header via dependency-style — Starlette passes headers via Header()
    raise HTTPException(501, "Use /me with X-Auth-Token header instead")


from fastapi import Header


@auth_router.get("/whoami")
async def whoami(x_auth_token: Optional[str] = Header(default=None)):
    if not x_auth_token:
        raise HTTPException(401, "Token manquant")
    payload = _decode_token(x_auth_token)
    if not payload:
        raise HTTPException(401, "Token invalide ou expiré")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(404, "Utilisateur introuvable")
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "is_premium": user.get("is_premium", False),
    }


app.include_router(auth_router)

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
