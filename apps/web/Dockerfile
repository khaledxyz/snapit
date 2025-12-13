# ================================
# Stage 1: Build Stage
# ================================
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy root package files for dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy root TypeScript and build configs
COPY tsconfig*.json ./

# Copy openapi.json from API (needed for SDK generation)
COPY apps/api/openapi.json ./apps/api/openapi.json

# Copy workspace packages
COPY packages/sdk ./packages/sdk
COPY apps/web ./apps/web

# Install dependencies (frozen lockfile for reproducible builds)
# Use shamefully-hoist to ensure binaries are accessible
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_API_PREFIX
ARG VITE_CLIENT_URL

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_PREFIX=${VITE_API_PREFIX}
ENV VITE_CLIENT_URL=${VITE_CLIENT_URL}

# Build the application
WORKDIR /app/apps/web
RUN pnpm run build

# ================================
# Stage 2: Production Stage
# ================================
FROM httpd:2.4-alpine

# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy built assets from builder stage
COPY --from=builder /app/apps/web/dist /usr/local/apache2/htdocs/

# Optional: Add custom httpd.conf here if needed
# Default httpd config works fine for serving static files

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Run httpd in foreground
CMD ["httpd-foreground"]