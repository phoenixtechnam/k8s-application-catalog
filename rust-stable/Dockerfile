FROM rust:1.85-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl pkg-config libssl-dev \
  && rm -rf /var/lib/apt/lists/* \
  && useradd -u 1000 -ms /bin/bash webuser \
  && mkdir -p /app && chown -R webuser:webuser /app

WORKDIR /app

USER webuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -fsS http://localhost:8080/health || exit 1

CMD ["./app"]
