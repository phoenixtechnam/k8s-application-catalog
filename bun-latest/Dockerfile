FROM oven/bun:1.2

USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
  && rm -rf /var/lib/apt/lists/* \
  && useradd -u 1000 -ms /bin/bash webuser 2>/dev/null || true \
  && mkdir -p /app && chown -R webuser:webuser /app

WORKDIR /app
USER webuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -fsS http://localhost:3000/health || exit 1

# Idle fallback when no Bun app is present. See nodejs/Dockerfile.
CMD ["sh", "-c", "if [ -f /app/index.ts ] || [ -f /app/index.js ]; then exec bun run /app/index.ts 2>/dev/null || exec bun run /app/index.js; else echo '[runtime] No /app/index.{ts,js} — idle. Mount your Bun app and restart.'; exec sleep infinity; fi"]
