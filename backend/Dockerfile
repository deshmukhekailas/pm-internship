# ==========================================
# Production Dockerfile for Backend Service
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl python3 make g++

# Install package dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy TypeScript source and configurations
COPY tsconfig.json ./
COPY src ./src/

# Build argument allowing either PostgreSQL (default) or MongoDB Atlas schema
ARG PRISMA_SCHEMA=prisma/schema.prisma

# Generate Prisma Client & compile TypeScript
RUN npx prisma generate --schema=${PRISMA_SCHEMA}
RUN npm run build

# ==========================================
# Production Runtime Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create uploads directory
RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "dist/server.js"]
