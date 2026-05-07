# Elite Saloon AI Agent — Learning Journal

Building a real AI agent step by step. Each section explains **what** we're doing and **why**.

---

## The Big Picture

```
Browser (chat widget)
        ↓  POST /api/chat
   Azure Function  ←── we'll build this later
        ↓
   agent.py  ←── we're building this now
        ↓
   Azure OpenAI (gpt-4.1)
        ↓
   FAQ data + system prompt
        ↓
   Smart answer back to user
```

---

## Why These Technology Choices?

| Choice | Why |
|---|---|
| **uv** | Fastest Python package manager — replaces pip + venv in one tool |
| **Azure OpenAI** | Enterprise-grade, same API as OpenAI, works in Azure tenant |
| **OpenAI Python SDK** | Industry standard, MCP-compatible later, clean API |
| **FAQ JSON file** | Simple knowledge base — no database needed for a salon |
| **MCP (later)** | Model Context Protocol — lets the agent call tools (booking, calendar) |

---

## Step 1 — Set Up Python Environment with uv

### What is uv?
`uv` is a blazing-fast Python package manager built in Rust.  
It replaces `pip`, `venv`, `pip-tools` all in one command.

### Commands to run
```bash
# Navigate to the agent folder
cd c:\Data_AI\projects\Elite-Salon\agent

# Initialise a new uv Python project
uv init

# Add dependencies
uv add openai python-dotenv

# This creates:
#   .venv/          ← virtual environment (auto-managed)
#   pyproject.toml  ← project config (like package.json)
#   uv.lock         ← exact dependency versions locked
```

### What each package does
- **openai** — Azure OpenAI + OpenAI SDK (same package, different config)
- **python-dotenv** — loads your `.env` file into environment variables

---

## Step 2 — Environment Variables (.env)

Create `agent/.env` and add your keys:
```
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4.1
OPENAI_API_VERSION=2024-12-01-preview
```

> ⚠️ `.env` is in `.gitignore` — your keys will NEVER be pushed to GitHub.

---

## Step 3 — FAQ Knowledge Base

The agent's knowledge lives in `data/faq.json`.  
It's a simple list of questions and answers about Elite Saloon.

**Why JSON?**  
- Easy to edit without touching code
- Can be extended to more complex formats later
- The agent reads it and uses it as context for every answer

---

## Step 4 — The Agent (agent.py)

### How it works
```
1. Load .env (API keys)
2. Load faq.json (knowledge base)
3. Build system prompt = salon personality + FAQ content
4. Accept user question
5. Send to Azure OpenAI (gpt-4.1)
6. Print the answer
```

### The key concept: System Prompt
The system prompt is what makes a general AI behave like a salon assistant.  
It tells the model:
- Who it is (Elite Saloon assistant)
- What it knows (FAQs)
- How to behave (professional, helpful, concise)

---

## Step 5 — Run It

```bash
cd c:\Data_AI\projects\Elite-Salon\agent
uv run python src/agent.py
```

---

## What's Next (Roadmap)

| Stage | What | Why |
|---|---|---|
| ✅ Done | Static website | User-facing frontend |
| ✅ Done | Azure Static Web Apps | Hosting |
| 🔄 Now | Simple FAQ agent | Learn the fundamentals |
| ⏭ Next | Add conversation memory | Multi-turn chat |
| ⏭ Next | Wrap as Azure Function | Connect to chat widget |
| ⏭ Next | Add booking tool (MCP) | Agent can actually book appointments |
| ⏭ Next | Azure AI Foundry | Production-grade deployment |
