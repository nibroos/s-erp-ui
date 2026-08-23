# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────────────────────
# s-erp-ui — Nuxt 3 with ssr: false, so the build output is a static SPA.
# Serving it from nginx rather than a Node process: smaller image, smaller
# attack surface, and no runtime that needs patching for CVEs it never uses.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: dependencies ────────────────────────────────────────────────────
# Separate from the build so a source-only change reuses the install layer.
FROM oven/bun:1.3.14-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb ./
# --frozen-lockfile: the lockfile is authoritative. If it does not satisfy
# package.json, fail here rather than silently resolving something else.
RUN bun install --frozen-lockfile

# ── Stage 2: build ───────────────────────────────────────────────────────────
FROM oven/bun:1.3.14-alpine AS build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time public config. These are compiled into the bundle and are visible
# to every user — never put a secret here.
ARG API_URL
ARG AUTH_URL
ARG IMG_BASE_URL
ARG TITLE
# CI build identifier, shown next to the version on the login page. Not secret:
# it is a pipeline build number, and being able to read it off a screenshot is
# the entire point. The app version itself comes from package.json, which is
# already in the build context — it needs no ARG.
ARG APP_BUILD
ENV API_URL=${API_URL} \
    AUTH_URL=${AUTH_URL} \
    IMG_BASE_URL=${IMG_BASE_URL} \
    TITLE=${TITLE} \
    APP_BUILD=${APP_BUILD}
# `nuxt generate`, not `nuxt build`. With ssr: false, `build` emits only
# _nuxt/ assets and leaves the HTML shell to the nitro server at runtime, so
# nginx would have no index.html to serve (verified: 403 on /). `generate`
# prerenders the SPA shell, which is what a static origin needs.
RUN bun run generate

# ── Stage 3: runtime ─────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

RUN apk add --no-cache curl \
 && rm -rf /var/cache/apk/* /usr/share/nginx/html/*

COPY --from=build /app/.output/public /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Run as an unprivileged user. nginx:alpine ships the `nginx` user; the stock
# config wants /var/run and the cache dirs writable by it.
RUN touch /var/run/nginx.pid \
 && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /usr/share/nginx/html
USER nginx

EXPOSE 8080

# Gates the deploy: `compose up --wait` will not report success until this
# passes, and deploy.sh rolls back if it never does.
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
  CMD curl -fsS http://localhost:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
