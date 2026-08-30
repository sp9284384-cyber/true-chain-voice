"""
ai_triage.py — thin inference layer only. Deliberately isolated from crypto/sanitize
so a failure here NEVER breaks anonymity or integrity guarantees (see architecture
note in Overview.docx: "privacy and integrity guarantees don't depend on the AI
working correctly").

If Ollama is unreachable or returns malformed output, classify_report() falls back
to a safe default rather than raising — a submission must never fail because the
AI step failed.
"""
import json
import logging
import httpx

from config import OLLAMA_HOST, OLLAMA_MODEL, AI_TRIAGE_ENABLED, VALID_CATEGORIES, VALID_URGENCY

logger = logging.getLogger("ai_triage")

FALLBACK_RESULT = {"category": "other", "urgency": "medium", "needs_review": True}

_PROMPT_TEMPLATE = """You are a triage classifier for an anonymous incident reporting system.
Classify the report below.

Categories: {categories}
Urgency levels: {urgency}

Report:
\"\"\"{content}\"\"\"

Respond with ONLY valid JSON in this exact shape, nothing else:
{{"category": "<one of the categories>", "urgency": "<one of the urgency levels>"}}
"""


def classify_report(content: str) -> dict:
    """
    Returns {"category": ..., "urgency": ..., "needs_review": bool}.
    needs_review=True signals the frontend/dashboard to flag it for a human
    look rather than trusting the AI output blindly.
    """
    if not AI_TRIAGE_ENABLED:
        return {**FALLBACK_RESULT, "needs_review": False}

    prompt = _PROMPT_TEMPLATE.format(
        categories=", ".join(VALID_CATEGORIES),
        urgency=", ".join(VALID_URGENCY),
        content=content[:2000],  # cap prompt size
    )

    try:
        resp = httpx.post(
            f"{OLLAMA_HOST}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False, "format": "json"},
            timeout=2.0,
        )
        resp.raise_for_status()
        raw = resp.json().get("response", "")
        parsed = json.loads(raw)

        category = parsed.get("category", "other")
        urgency = parsed.get("urgency", "medium")

        if category not in VALID_CATEGORIES:
            category = "other"
        if urgency not in VALID_URGENCY:
            urgency = "medium"

        return {"category": category, "urgency": urgency, "needs_review": False}

    except Exception as exc:
        logger.warning("AI triage failed, using fallback: %s", exc)
        return FALLBACK_RESULT


def generate_embedding(content: str) -> bytes | None:
    """
    Optional stretch goal: sentence-transformers embedding for clustering.
    Disabled during standard request pipeline to avoid PyTorch loading overhead.
    """
    return None
