"""LLM provider for IA Match.

Uses OpenRouter through the OpenAI-compatible API.
The API key must stay in backend/.env as OPENROUTER_API_KEY.
"""
import os
from typing import Optional

from openai import AsyncOpenAI


DEFAULT_MODEL = "openrouter/free"
FREE_FALLBACK_MODELS = [
    "openrouter/free",
    "google/gemma-4-31b-it:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "minimax/minimax-m2.5:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "openai/gpt-oss-120b:free",
    "z-ai/glm-4.5-air:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-3-27b-it:free",
]
DEFAULT_SYSTEM = (
    "Tu es IA Match, un assistant français expert en outils IA et prompt engineering. "
    "Réponds en français, sois concret, utile, structuré et évite le blabla. "
    "Quand tu génères un prompt, donne une version directement copiable."
)


def get_openrouter_client() -> AsyncOpenAI:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY not configured")
    return AsyncOpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        default_headers={
            "HTTP-Referer": os.environ.get("OPENROUTER_SITE_URL", "http://localhost:8081"),
            "X-Title": os.environ.get("OPENROUTER_APP_NAME", "IA Match"),
        },
    )


async def complete_with_openrouter(
    prompt: str,
    *,
    system: Optional[str] = None,
    model: Optional[str] = None,
    temperature: float = 0.7,
) -> dict:
    client = get_openrouter_client()
    env_model = os.environ.get("OPENROUTER_MODEL")
    candidates = [model] if model else []
    if env_model:
        candidates.append(env_model)
    candidates.extend(FREE_FALLBACK_MODELS)

    # Preserve order while removing duplicates/empty values.
    seen = set()
    ordered_models = []
    for candidate in candidates:
        if candidate and candidate not in seen:
            ordered_models.append(candidate)
            seen.add(candidate)

    last_error: Optional[Exception] = None
    for selected_model in ordered_models:
        try:
            response = await client.chat.completions.create(
                model=selected_model,
                messages=[
                    {"role": "system", "content": system or DEFAULT_SYSTEM},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
            )
            text = response.choices[0].message.content or ""
            return {"output": text, "model": selected_model}
        except Exception as e:
            last_error = e
            message = str(e).lower()
            # Try next free model on temporary upstream quota/rate-limit/provider failures.
            if any(token in message for token in ["429", "rate", "quota", "temporarily", "provider returned"]):
                continue
            raise

    raise RuntimeError(f"All OpenRouter models failed: {last_error}")
