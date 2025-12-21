# ================================
# Stage 1: Dependencies
# ================================
FROM node:22-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy API package
COPY apps/api/package.json ./apps/api/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --filter=@snapit/api

# ================================
# Stage 2: Builder
# ================================
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy API source
COPY apps/api ./apps/api

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile --filter=@snapit/api

# Build the application
WORKDIR /app/apps/api
RUN pnpm run build

# ================================
# Stage 3: Production
# ================================
FROM node:22-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copy production dependencies from deps stage
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nestjs:nodejs /app/apps/api/node_modules ./apps/api/node_modules

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist

# Copy drizzle migrations and config
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/drizzle ./apps/api/drizzle
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/drizzle.config.ts ./apps/api/

# Copy package.json for metadata (optional but useful for debugging)
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./apps/api/

# Set working directory to API
WORKDIR /app/apps/api

# Switch to non-root user
USER nestjs

# Environment variables (override in compose/k8s)
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
# Health check - adjusted for realistic startup time
HEALTHCHECK --interval=10s --timeout=5s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Use dumb-init to handle signals properly
CMD ["dumb-init", "node", "dist/main.js"]