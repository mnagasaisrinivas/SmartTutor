# --- Test & Build Stage ---
FROM python:3.12-slim-bookworm AS builder

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install ALL dependencies (including dev for testing)
RUN uv sync --frozen --no-cache

# Copy application code
COPY . .

# Run tests and enforce 70% coverage requirement
RUN uv run pytest --cov=app --cov-fail-under=70


# --- Production Stage ---
FROM python:3.12-slim-bookworm

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install ONLY production dependencies
RUN uv sync --frozen --no-cache --no-dev

# Copy application code
COPY . .

# Ensure instance directory exists for SQLite
RUN mkdir -p instance

# Set environment variables
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Run the application (use $PORT for Railway compatibility)
CMD ["sh", "-c", "uv run uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
