FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app
COPY . ./

# Install global dependencies
RUN npm install -g @nestjs/cli
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

FROM base AS build
# Install all dependencies including devDependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod

# Remove unnecessary files
RUN rm -rf ./src

EXPOSE 5000
CMD [ "pnpm", "start:prod" ]
