"""
Elite Saloon — Core Agent Logic
Separated from API layer so it can be reused anywhere.
"""

import json
import os
from pathlib import Path
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

# ── Azure OpenAI client ───────────────────────────────────────────────────────
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("OPENAI_API_VERSION", "2024-12-01-preview"),
)

DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1")
FAQ_PATH   = Path(__file__).parent.parent / "data" / "faq.json"


def load_faq() -> str:
    with open(FAQ_PATH, "r") as f:
        faqs = json.load(f)
    lines = []
    for item in faqs:
        lines.append(f"Q: {item['question']}")
        lines.append(f"A: {item['answer']}")
        lines.append("")
    return "\n".join(lines)


# Build system prompt once at startup
SYSTEM_PROMPT = """You are the AI assistant for Elite Saloon — a premium barbershop in New York City.
Answer customer questions helpfully and professionally using the FAQ below.
If the answer is not in the FAQ, politely suggest they call (212) 555-0100.
Keep answers concise and friendly. Never make up prices or services not listed.

--- FAQ ---
{faq}
--- END FAQ ---
""".format(faq=load_faq())


def ask(message: str, history: list = []) -> str:
    """
    message : the latest user message
    history : list of prior {role, content} turns for conversation memory
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += history[-8:]   # keep last 8 turns for context window
    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model=DEPLOYMENT,
        messages=messages,
        temperature=0.4,
        max_tokens=300,
    )
    return response.choices[0].message.content
