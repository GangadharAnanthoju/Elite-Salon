# ── Elite Saloon AI Agent — Dockerfile ───────────────────────────────────────
FROM python:3.12-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copy dependency files first (better Docker layer caching)
COPY pyproject.toml uv.lock ./

# Install dependencies without dev tools, into system Python
RUN uv sync --frozen --no-dev --no-editable

# Copy the rest of the app
COPY src/ ./src/
COPY data/ ./data/

# Set Python path so src/ imports work
ENV PYTHONPATH=/app/src

# Expose port
EXPOSE 8000

# Start FastAPI with uvicorn
CMD ["uv", "run", "uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]
