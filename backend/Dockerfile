# Production Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules and Prisma OpenSSL
RUN apk add --no-cache python3 make g++ openssl

# Copy package manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy application source
COPY . .

# Build application
RUN npm run build

# Ensure both dist/main.js and dist/src/main.js are available
RUN cp dist/src/main.js dist/main.js || true

# Prune dev dependencies, keeping production deps (including prisma CLI)
RUN npm prune --production

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL (required by Prisma engine) and dumb-init
RUN apk add --no-cache openssl dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy built application from builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

USER nestjs

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && dumb-init node dist/src/main.js"]