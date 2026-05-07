"""
Elite Saloon — FastAPI Server
Exposes POST /api/chat for the website chat widget.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import logging

from salon_agent import ask

# ── App setup ─────────────────────────────────────────────────────────────────
app = FastAPI(title="Elite Saloon AI Agent", version="1.0.0")

# Allow the website to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://elite.sysintinc.com",
        "https://lively-moss-00a08240f.7.azurestaticapps.net",
        "http://localhost:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",  # VS Code Live Server
        "http://127.0.0.1:3000",
        "null",                   # file:// protocol (opening HTML directly)
    ],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# ── Request / Response models ─────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    history: list = []   # optional — list of {role, content} dicts

class ChatResponse(BaseModel):
    reply: str


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def health():
    """Health check — Azure Container Apps pings this."""
    return {"status": "ok", "service": "Elite Saloon AI Agent"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    """
    Receive a message from the chat widget, return AI reply.
    Body:  { "message": "...", "history": [{role, content}, ...] }
    """
    logging.info(f"Chat: {payload.message[:60]}")

    reply = ask(payload.message, payload.history)
    return ChatResponse(reply=reply)


# ── Run locally ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
