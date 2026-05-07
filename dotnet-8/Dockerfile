FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine

RUN apk add --no-cache curl \
  && adduser -D -u 1000 webuser \
  && mkdir -p /app && chown -R webuser:webuser /app

WORKDIR /app

USER webuser

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://localhost:8080/health || exit 1

# Idle fallback when no compiled assembly is present. See nodejs/Dockerfile
# for the rationale.
ENTRYPOINT ["sh", "-c"]
CMD ["if [ -f /app/app.dll ]; then exec dotnet /app/app.dll; else echo '[runtime] No /app/app.dll — idle. Publish your .NET app to /app/app.dll and restart.'; exec sleep infinity; fi"]
