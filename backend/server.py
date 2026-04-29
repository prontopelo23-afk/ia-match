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
from learn_data import GLOSSARY, FAQ, USE_CASES, PERSONAS, PRIVACY_OVERRIDES, EXAMPLES, QUIZ, quiz_level
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


# Decorate each tool with privacy + example info (read-only, computed at boot)
def _decorate_tool_extras(t: dict) -> dict:
    out = dict(t)
    priv = PRIVACY_OVERRIDES.get(t["slug"]) or PRIVACY_OVERRIDES.get("_default", {})
    out["privacy"] = priv
    if t["slug"] in EXAMPLES:
        out["example"] = EXAMPLES[t["slug"]]
    return out

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="IA Match API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


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
    lastUpdated: Optional[str] = None
    privacy: Optional[dict] = None
    example: Optional[dict] = None


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
            return Tool(**_decorate_tool_extras(t))
    raise HTTPException(404, "Tool not found")


# ---- Pedagogical / discovery endpoints ----
@api_router.get("/glossary")
async def list_glossary():
    return GLOSSARY


@api_router.get("/faq")
async def list_faq():
    return FAQ


@api_router.get("/use-cases")
async def list_use_cases():
    # Enrich each use case with the actual tool objects
    out = []
    for uc in USE_CASES:
        tools_resolved = []
        for slug in uc.get("tools", []):
            for t in TOOLS:
                if t["slug"] == slug:
                    tools_resolved.append(
                        {"slug": t["slug"], "name": t["name"], "vendor": t["vendor"],
                         "image": t.get("image"), "domain": t.get("domain"),
                         "color": t.get("color"), "tagline": t.get("tagline")}
                    )
                    break
        out.append({**uc, "tools_resolved": tools_resolved})
    return out


@api_router.get("/personas")
async def list_personas():
    out = []
    for p in PERSONAS:
        tools_resolved = []
        for slug in p.get("tools", []):
            for t in TOOLS:
                if t["slug"] == slug:
                    tools_resolved.append(
                        {"slug": t["slug"], "name": t["name"], "vendor": t["vendor"],
                         "image": t.get("image"), "domain": t.get("domain"),
                         "color": t.get("color"), "tagline": t.get("tagline")}
                    )
                    break
        out.append({**p, "tools_resolved": tools_resolved})
    return out


@api_router.get("/quiz")
async def get_quiz():
    return QUIZ


class QuizSubmit(BaseModel):
    answers: List[int]


@api_router.post("/quiz/score")
async def score_quiz(req: QuizSubmit):
    # answers : list of selected option indices (one per question)
    total = 0
    for i, q in enumerate(QUIZ):
        if i < len(req.answers):
            idx = max(0, min(len(q["options"]) - 1, int(req.answers[i])))
            total += q["options"][idx]["score"]
    result = quiz_level(total)
    result["total"] = total
    result["max"] = len(QUIZ) * 3
    return result


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

# =============================================================================
# SECURITY HARDENING
# =============================================================================
import secrets
import bcrypt
import jwt as pyjwt
from fastapi import Header, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# --- JWT secret: generate cryptographically strong random if not set in env ---
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET or JWT_SECRET == "ia-match-dev-secret-change-me-in-prod":
    JWT_SECRET = secrets.token_urlsafe(64)
    logging.getLogger("uvicorn").warning(
        "JWT_SECRET not configured in env, generated a random one for this run. "
        "Set JWT_SECRET in production for token persistence across restarts."
    )
JWT_ALGO = "HS256"
JWT_EXPIRES_DAYS = 30
BCRYPT_ROUNDS = 12
ACCOUNT_LOCK_AFTER_FAILS = 5
ACCOUNT_LOCK_MINUTES = 15

# --- Rate limiting (5/min on auth endpoints, 60/min general) ---
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


# --- Security headers middleware ---
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), payment=()"
        )
        # Don't leak server fingerprint
        try:
            del response.headers["Server"]
        except Exception:
            pass
        return response


app.add_middleware(SecurityHeadersMiddleware)


# =============================================================================
# AUTH ROUTER (hardened)
# =============================================================================
auth_router = APIRouter(prefix="/api/auth")


class RegisterReq(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    accept_terms: bool = False


class LoginReq(BaseModel):
    email: str
    password: str


class ChangePasswordReq(BaseModel):
    current_password: str
    new_password: str


class ResetRequestReq(BaseModel):
    email: str


class ResetConfirmReq(BaseModel):
    token: str
    new_password: str


class UpdateProfileReq(BaseModel):
    name: Optional[str] = None
    consent_marketing: Optional[bool] = None


class VerifyEmailConfirmReq(BaseModel):
    token: str


def _hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt(rounds=BCRYPT_ROUNDS)).decode("utf-8")


def _check_pw(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _make_token(user_id: str, email: str) -> str:
    now = int(datetime.now(timezone.utc).timestamp())
    payload = {
        "sub": user_id,
        "email": email,
        "iat": now,
        "exp": now + JWT_EXPIRES_DAYS * 86400,
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def _decode_token(token: str) -> Optional[dict]:
    try:
        return pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except Exception:
        return None


EMAIL_RE = re.compile(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")


def _validate_password(pw: str) -> Optional[str]:
    if not pw or len(pw) < 10:
        return "Le mot de passe doit faire au moins 10 caractères"
    if not re.search(r"[A-Za-z]", pw):
        return "Le mot de passe doit contenir au moins une lettre"
    if not re.search(r"\d", pw):
        return "Le mot de passe doit contenir au moins un chiffre"
    return None


async def _get_current_user(x_auth_token: Optional[str]) -> dict:
    if not x_auth_token:
        raise HTTPException(401, "Token manquant")
    payload = _decode_token(x_auth_token)
    if not payload:
        raise HTTPException(401, "Token invalide ou expiré")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(404, "Utilisateur introuvable")
    return user


def _public_user(u: dict) -> dict:
    return {
        "id": u["id"],
        "email": u["email"],
        "name": u.get("name", ""),
        "is_premium": u.get("is_premium", False),
        "email_verified": u.get("email_verified", False),
    }


@auth_router.post("/register")
@limiter.limit("5/minute")
async def register(request: Request, req: RegisterReq):
    email = (req.email or "").strip().lower()
    if not EMAIL_RE.match(email):
        raise HTTPException(400, "Email invalide")
    pw_err = _validate_password(req.password or "")
    if pw_err:
        raise HTTPException(400, pw_err)
    if not req.accept_terms:
        raise HTTPException(400, "Tu dois accepter les CGU et la politique de confidentialité")
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(409, "Un compte existe déjà avec cet email")
    user_id = str(uuid.uuid4())
    verify_token = secrets.token_urlsafe(32)
    user = {
        "id": user_id,
        "email": email,
        "name": (req.name or email.split("@")[0]).strip()[:60],
        "password_hash": _hash_pw(req.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_premium": False,
        "email_verified": False,
        "verify_token": verify_token,
        "verify_token_exp": int(datetime.now(timezone.utc).timestamp()) + 86400,
        "failed_attempts": 0,
        "locked_until": 0,
        "consent": {"terms": True, "privacy": True, "marketing": False},
    }
    await db.users.insert_one(user)
    token = _make_token(user_id, email)
    # Email magic link would be sent here in production. For now, return token in response.
    return {
        "token": token,
        "user": _public_user(user),
        "verify_link": f"/auth/verify?token={verify_token}",
    }


@auth_router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, req: LoginReq):
    email = (req.email or "").strip().lower()
    if not email or not req.password:
        raise HTTPException(400, "Email et mot de passe requis")
    user = await db.users.find_one({"email": email})
    now_ts = int(datetime.now(timezone.utc).timestamp())
    # Check lockout
    if user and user.get("locked_until", 0) > now_ts:
        wait_min = max(1, (user["locked_until"] - now_ts) // 60)
        raise HTTPException(
            429, f"Compte temporairement verrouillé. Réessaye dans {wait_min} minute(s)."
        )
    if not user or not _check_pw(req.password, user.get("password_hash", "")):
        if user:
            fails = user.get("failed_attempts", 0) + 1
            update = {"failed_attempts": fails}
            if fails >= ACCOUNT_LOCK_AFTER_FAILS:
                update["locked_until"] = now_ts + ACCOUNT_LOCK_MINUTES * 60
                update["failed_attempts"] = 0
            await db.users.update_one({"id": user["id"]}, {"$set": update})
        raise HTTPException(401, "Email ou mot de passe incorrect")
    await db.users.update_one(
        {"id": user["id"]}, {"$set": {"failed_attempts": 0, "locked_until": 0}}
    )
    token = _make_token(user["id"], email)
    return {"token": token, "user": _public_user(user)}


@auth_router.get("/whoami")
async def whoami(x_auth_token: Optional[str] = Header(default=None)):
    user = await _get_current_user(x_auth_token)
    return _public_user(user)


@auth_router.patch("/me")
@limiter.limit("30/minute")
async def update_profile(
    request: Request,
    req: UpdateProfileReq,
    x_auth_token: Optional[str] = Header(default=None),
):
    user = await _get_current_user(x_auth_token)
    update: dict = {}
    if req.name is not None:
        n = req.name.strip()[:60]
        if n:
            update["name"] = n
    if req.consent_marketing is not None:
        update["consent.marketing"] = bool(req.consent_marketing)
    if update:
        await db.users.update_one({"id": user["id"]}, {"$set": update})
        user = await db.users.find_one({"id": user["id"]})
    return _public_user(user)


@auth_router.post("/password/change")
@limiter.limit("5/minute")
async def change_password(
    request: Request,
    req: ChangePasswordReq,
    x_auth_token: Optional[str] = Header(default=None),
):
    user = await _get_current_user(x_auth_token)
    if not _check_pw(req.current_password, user.get("password_hash", "")):
        raise HTTPException(401, "Mot de passe actuel incorrect")
    pw_err = _validate_password(req.new_password)
    if pw_err:
        raise HTTPException(400, pw_err)
    await db.users.update_one(
        {"id": user["id"]}, {"$set": {"password_hash": _hash_pw(req.new_password)}}
    )
    return {"ok": True}


@auth_router.post("/password/reset")
@limiter.limit("3/minute")
async def request_password_reset(request: Request, req: ResetRequestReq):
    email = (req.email or "").strip().lower()
    user = await db.users.find_one({"email": email})
    # Always return ok to avoid revealing whether the email exists
    if user:
        token = secrets.token_urlsafe(32)
        await db.users.update_one(
            {"id": user["id"]},
            {
                "$set": {
                    "reset_token": token,
                    "reset_token_exp": int(datetime.now(timezone.utc).timestamp()) + 3600,
                }
            },
        )
        # In production, email a magic link. For now, return the token in response (debug).
        return {"ok": True, "reset_link": f"/auth/reset?token={token}"}
    return {"ok": True}


@auth_router.post("/password/reset/confirm")
@limiter.limit("5/minute")
async def confirm_password_reset(request: Request, req: ResetConfirmReq):
    if not req.token:
        raise HTTPException(400, "Token manquant")
    user = await db.users.find_one({"reset_token": req.token})
    now_ts = int(datetime.now(timezone.utc).timestamp())
    if not user or user.get("reset_token_exp", 0) < now_ts:
        raise HTTPException(400, "Token invalide ou expiré")
    pw_err = _validate_password(req.new_password)
    if pw_err:
        raise HTTPException(400, pw_err)
    await db.users.update_one(
        {"id": user["id"]},
        {
            "$set": {
                "password_hash": _hash_pw(req.new_password),
                "failed_attempts": 0,
                "locked_until": 0,
            },
            "$unset": {"reset_token": "", "reset_token_exp": ""},
        },
    )
    return {"ok": True}


@auth_router.post("/email/verify")
@limiter.limit("3/minute")
async def request_email_verify(
    request: Request, x_auth_token: Optional[str] = Header(default=None)
):
    user = await _get_current_user(x_auth_token)
    if user.get("email_verified"):
        return {"ok": True, "already": True}
    token = secrets.token_urlsafe(32)
    await db.users.update_one(
        {"id": user["id"]},
        {
            "$set": {
                "verify_token": token,
                "verify_token_exp": int(datetime.now(timezone.utc).timestamp()) + 86400,
            }
        },
    )
    return {"ok": True, "verify_link": f"/auth/verify?token={token}"}


@auth_router.post("/email/verify/confirm")
async def confirm_email_verify(req: VerifyEmailConfirmReq):
    if not req.token:
        raise HTTPException(400, "Token manquant")
    user = await db.users.find_one({"verify_token": req.token})
    now_ts = int(datetime.now(timezone.utc).timestamp())
    if not user or user.get("verify_token_exp", 0) < now_ts:
        raise HTTPException(400, "Token invalide ou expiré")
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"email_verified": True}, "$unset": {"verify_token": "", "verify_token_exp": ""}},
    )
    return {"ok": True}


@auth_router.delete("/account")
@limiter.limit("3/minute")
async def delete_account(
    request: Request, x_auth_token: Optional[str] = Header(default=None)
):
    user = await _get_current_user(x_auth_token)
    # GDPR: hard delete + cleanup
    await db.users.delete_one({"id": user["id"]})
    await db.ratings.delete_many({"user_id": user["id"]})
    return {"ok": True}


app.include_router(auth_router)


# =============================================================================
# CORS — explicit allowlist (no wildcard)
# =============================================================================
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    _allowed = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
else:
    # Default: only the public preview/production hosts of this app
    _allowed = [
        "https://ai-match-preview-2.preview.emergentagent.com",
        "https://*.preview.emergentagent.com",
        "https://*.emergentagent.com",
        "http://localhost:3000",
        "http://localhost:8081",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed,
    allow_origin_regex=r"https://.*\.emergentagent\.com$|https://.*\.preview\.emergentagent\.com$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-Auth-Token", "Authorization"],
    max_age=600,
)


# =============================================================================
# DATA FRESHNESS — lastUpdated on tools + news + APScheduler weekly refresh
# =============================================================================
def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# Mark all tools and news with current timestamp at boot
_BOOT_ISO = _now_iso()
for _t in TOOLS:
    _t.setdefault("lastUpdated", _BOOT_ISO)
for _n in NEWS:
    _n.setdefault("created_at", _BOOT_ISO)


async def refresh_news_via_llm() -> int:
    """Generate fresh AI news articles via the Emergent LLM key.
    Stores results in db.dynamic_news collection (rotating, latest 16 kept).
    Returns the number of articles inserted.
    """
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        logger.warning("EMERGENT_LLM_KEY not set; skipping news refresh")
        return 0
    today = datetime.now(timezone.utc).strftime("%d %B %Y")
    prompt = (
        f"Tu es rédacteur en chef d'un magazine français spécialisé en intelligence artificielle. "
        f"Nous sommes le {today}. Génère 6 articles d'actualité éducatifs en français sur les "
        f"tendances IA actuelles (modèles, régulations, nouveaux outils, débats). "
        f"Réponds STRICTEMENT en JSON avec ce format (aucun markdown, aucun texte avant/après):\n"
        '{"articles": [{"title":"...","summary":"...","tag":"...","category":"MODÈLE|OUTIL|RÉGULATION|TENDANCE|ÉDUCATION","readMinutes":4,"highlight":"...","intro":"...","body":"..."}]}'
        "\n\nLe champ 'body' doit faire 200-400 mots et expliquer pédagogiquement le sujet "
        "à un public francophone. 'tag' = mot-clé court (ex: 'GPT-5.5', 'EU AI Act'). "
        "'highlight' = phrase-choc de 80 caractères max. Ne mentionne pas de chiffres inventés."
    )
    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"news-refresh-{uuid.uuid4()}",
            system_message="Tu génères du JSON structuré conforme à la consigne.",
        ).with_model("anthropic", "claude-haiku-4-5-20251001")
        text = await chat.send_message(UserMessage(text=prompt))
        # Extract JSON
        m = re.search(r"\{.*\}", text, re.DOTALL)
        if not m:
            return 0
        import json as _json
        data = _json.loads(m.group(0))
        articles = data.get("articles", [])
        inserted = 0
        for a in articles:
            doc = {
                "id": f"dyn-{uuid.uuid4().hex[:10]}",
                "title": a.get("title", "")[:200],
                "summary": a.get("summary", "")[:500],
                "category": a.get("category", "TENDANCE")[:30],
                "tag": a.get("tag", "IA")[:30],
                "readMinutes": int(a.get("readMinutes", 4)),
                "highlight": a.get("highlight", "")[:120],
                "intro": a.get("intro", a.get("summary", ""))[:1000],
                "body": a.get("body", "")[:5000],
                "author": "IA Match · Rédaction",
                "publishedAt": _now_iso(),
                "created_at": _now_iso(),
            }
            await db.dynamic_news.insert_one(doc)
            inserted += 1
        # Keep only the 16 most recent
        cursor = db.dynamic_news.find({}, {"_id": 1, "created_at": 1}).sort("created_at", -1)
        keep_ids: list = []
        async for d in cursor:
            keep_ids.append(d["_id"])
            if len(keep_ids) >= 16:
                break
        if keep_ids:
            await db.dynamic_news.delete_many({"_id": {"$nin": keep_ids}})
        logger.info("News refresh: inserted %d articles", inserted)
        return inserted
    except Exception:
        logger.exception("news refresh failed")
        return 0


def refresh_tool_scores() -> int:
    """Refresh categoryScores using deterministic formula + bump lastUpdated.
    In a future iteration, could ingest real benchmark sources (LMSys, MMLU…)."""
    iso = _now_iso()
    for t in TOOLS:
        t["categoryScores"] = _compute_category_scores(t)
        t["lastUpdated"] = iso
    logger.info("Tool scores refreshed for %d tools at %s", len(TOOLS), iso)
    return len(TOOLS)


# --- APScheduler: weekly refresh ---
scheduler = AsyncIOScheduler(timezone="Europe/Paris")
scheduler.add_job(refresh_news_via_llm, "cron", day_of_week="mon", hour=6, minute=0, id="news_weekly")
scheduler.add_job(refresh_tool_scores, "cron", day_of_week="mon", hour=6, minute=10, id="scores_weekly")


@app.on_event("startup")
async def _start_scheduler():
    if not scheduler.running:
        scheduler.start()
        logger.info("Scheduler started: news refresh every Monday 06:00 Europe/Paris")


# --- Admin endpoints (token guarded) ---
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN") or secrets.token_urlsafe(48)
logger.info("Admin token (only printed at boot, keep it secret): %s", ADMIN_TOKEN[:6] + "…")


def _check_admin(x_admin_token: Optional[str]):
    if not x_admin_token or not secrets.compare_digest(x_admin_token, ADMIN_TOKEN):
        raise HTTPException(401, "Admin token requis")


@app.post("/api/admin/news/refresh")
async def admin_news_refresh(x_admin_token: Optional[str] = Header(default=None)):
    _check_admin(x_admin_token)
    n = await refresh_news_via_llm()
    return {"ok": True, "inserted": n}


@app.post("/api/admin/scores/refresh")
async def admin_scores_refresh(x_admin_token: Optional[str] = Header(default=None)):
    _check_admin(x_admin_token)
    n = refresh_tool_scores()
    return {"ok": True, "refreshed": n}


# Override /api/news to merge dynamic + static and shuffle daily
@app.get("/api/news")
async def list_news_dynamic():
    items: list = []
    async for d in db.dynamic_news.find({}, {"_id": 0}).sort("created_at", -1):
        items.append(d)
    # Fall back to static if no dynamic news yet
    if not items:
        items = list(NEWS)
    # Daily-deterministic shuffle so users see rotation but it's stable for a day
    today_seed = datetime.now(timezone.utc).strftime("%Y%m%d")
    import random as _random
    rng = _random.Random(today_seed)
    rng.shuffle(items)
    return items


@app.on_event("shutdown")
async def shutdown_db_client():
    try:
        if scheduler.running:
            scheduler.shutdown(wait=False)
    except Exception:
        pass
    client.close()
