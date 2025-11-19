FROM python:3.11-slim AS builder
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# -------------------------------
# FINAL IMAGE
# -------------------------------
FROM python:3.11-slim
WORKDIR /app

# Copy *entire /usr/local* so binaries like uvicorn are included
COPY --from=builder /usr/local /usr/local

# Copy app code
COPY --from=builder /app /app

# Create non-root user
RUN useradd -m streamflix
USER streamflix

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

# Use python -m uvicorn (always works, guaranteed in PATH)
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
