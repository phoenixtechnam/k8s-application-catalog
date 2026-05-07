FROM node:22-alpine

RUN apk add --no-cache curl \
  && mkdir -p /app && chown node:node /app

WORKDIR /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://localhost:3000/health || exit 1

# Idle fallback: keep the container alive when no app code is staged yet.
# The platform deploys this image as a runtime — clients drop their
# server.js into /app and restart the deployment to pick it up. Without
# this fallback the container CrashLoopBackOff'd before the user could
# upload any code.
CMD ["sh", "-c", "if [ -f /app/server.js ]; then exec node /app/server.js; else echo '[runtime] No /app/server.js — idle. Mount your app and restart the deployment.'; exec sleep infinity; fi"]
