# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Stage 3: Production runtime
FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 app

# App build output
COPY --from=builder --chown=app:nodejs /app/.output ./.output

# Migration and script files
COPY --from=builder --chown=app:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=app:nodejs /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder --chown=app:nodejs /app/scripts ./scripts
COPY --from=builder --chown=app:nodejs /app/package.json ./package.json
COPY --from=builder --chown=app:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install deps for migrations and scripts (then transfer ownership to runtime user)
RUN pnpm add drizzle-kit drizzle-orm mysql2 dotenv better-auth tsx && \
    pnpm store prune && \
    chown -R app:nodejs /app

USER app

EXPOSE 3000

# Use direct node_modules/.bin path to avoid pnpm runtime deps-check writing temp files
CMD ["sh", "-c", "./node_modules/.bin/drizzle-kit migrate && node .output/server/index.mjs"]
