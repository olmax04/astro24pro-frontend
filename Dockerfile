# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.

FROM node:23-slim AS base

# Install dependencies only when needed
FROM base AS deps
# В Debian (slim) уже есть glibc, поэтому libc6-compat не нужен.
# Если вам понадобятся системные пакеты (например, для ssl), используйте apt-get:
# RUN apt-get update && apt-get install -y openssl
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# --- ИСПРАВЛЕНИЕ: Для Debian (slim) используем стандартные groupadd / useradd ---
# (Те команды, что были в самом начале, до Alpine)
RUN groupadd -r -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nextjs

# Remove this line if you do not have this folder
#COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]