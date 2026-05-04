FROM golang:1.22-alpine

RUN apk add --no-cache git ca-certificates curl \
  && adduser -D -u 1000 webuser \
  && mkdir -p /app && chown -R webuser:webuser /app

WORKDIR /app

USER webuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://localhost:8080/health || exit 1

CMD ["./server"]
