"""
Elite Saloon — Simple FAQ Agent
Step 1: Load FAQ → Build prompt → Call Azure OpenAI → Answer question
"""

import json
import os
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

# ── 1. Load environment variables from .env ──────────────────────────────────
load_dotenv()

ENDPOINT   = os.getenv("AZURE_OPENAI_ENDPOINT")
API_KEY    = os.getenv("AZURE_OPENAI_API_KEY")
DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1")
API_VER    = os.getenv("OPENAI_API_VERSION", "2024-12-01-preview")

# ── 2. Connect to Azure OpenAI ───────────────────────────────────────────────
client = AzureOpenAI(
    azure_endpoint=ENDPOINT,
    api_key=API_KEY,
    api_version=API_VER,
)

# ── 3. Load FAQ knowledge base ───────────────────────────────────────────────
FAQ_PATH = Path(__file__).parent.parent / "data" / "faq.json"

def load_faq() -> str:
    with open(FAQ_PATH, "r") as f:
        faqs = json.load(f)
    # Format as readable Q&A text for the prompt
    lines = []
    for item in faqs:
        lines.append(f"Q: {item['question']}")
        lines.append(f"A: {item['answer']}")
        lines.append("")
    return "\n".join(lines)

# ── 4. Build system prompt ───────────────────────────────────────────────────
def build_system_prompt(faq_text: str) -> str:
    return f"""You are the AI assistant for Elite Saloon — a premium barbershop in New York City.
Your job is to answer customer questions helpfully and professionally.

Use the FAQ knowledge base below to answer questions accurately.
If the answer is not in the FAQ, say so politely and suggest they call (212) 555-0100.
Keep answers concise and friendly. Never make up prices or services not listed.

--- FAQ KNOWLEDGE BASE ---
{faq_text}
--- END FAQ ---
"""

# ── 5. Ask the agent a question ──────────────────────────────────────────────
def ask(question: str) -> str:
    faq_text      = load_faq()
    system_prompt = build_system_prompt(faq_text)

    response = client.chat.completions.create(
        model=DEPLOYMENT,
        messages=[
            {"role": "system",  "content": system_prompt},
            {"role": "user",    "content": question},
        ],
        temperature=0.4,
        max_tokens=300,
    )

    return response.choices[0].message.content

# ── 6. Simple interactive loop ───────────────────────────────────────────────
if __name__ == "__main__":
    print("Elite Saloon AI Agent")
    print("Type your question or 'quit' to exit.\n")

    while True:
        question = input("You: ").strip()
        if question.lower() in ("quit", "exit", "q"):
            print("Goodbye!")
            break
        if not question:
            continue

        print("\nAgent:", ask(question), "\n")
