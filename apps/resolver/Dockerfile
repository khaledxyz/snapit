# ================================
# Stage 1: Dependencies
# ================================
FROM node:22-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy resolver package
COPY apps/resolver/package.json ./apps/resolver/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --filter=@snapit/resolver

# ================================
# Stage 2: Builder
# ================================
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy resolver source
COPY apps/resolver ./apps/resolver

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile --filter=@snapit/resolver

# Build the application
WORKDIR /app/apps/resolver
RUN pnpm run build

# ================================
# Stage 3: Production
# ================================
FROM node:22-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S resolver -u 1001

WORKDIR /app

# Copy production dependencies from deps stage
COPY --from=deps --chown=resolver:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=resolver:nodejs /app/apps/resolver/node_modules ./apps/resolver/node_modules

# Copy built application from builder stage
COPY --from=builder --chown=resolver:nodejs /app/apps/resolver/dist ./apps/resolver/dist

# Copy package.json for metadata
COPY --from=builder --chown=resolver:nodejs /app/apps/resolver/package.json ./apps/resolver/

# Set working directory to resolver
WORKDIR /app/apps/resolver

# Switch to non-root user
USER resolver

# Environment variables (override in compose/k8s)
ENV NODE_ENV=production
ENV PORT=5001

# Expose port
EXPOSE 5001

# Health check - adjusted for realistic startup time
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Use dumb-init to handle signals properly
CMD ["dumb-init", "node", "dist/index.js"]