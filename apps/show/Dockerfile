# Base stage for all subsequent stages.
FROM node:22.11-bullseye-slim AS base

# Needed for Prisma generation and runtime.
RUN apt-get update && apt-get install -y openssl

# The store dir will be `$PNPM_HOME/store`.
# See https://pnpm.io/settings#storedir
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# There's an ongoing issue with corepack.
# See https://github.com/nodejs/corepack/issues/612#issuecomment-2630469508
RUN npm i -g corepack@latest

WORKDIR /workspace

# Populate pnpm store with all dependencies (prod and dev).
# See https://pnpm.io/cli/fetch#usage-scenario
FROM base AS pnpm-store

COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch

# Remove the virtual store so we can copy the entire `/workspace` directory.
RUN rm -rf node_modules

# App and its dependencies' `package.json` files.
FROM base AS packages-json

COPY package.json ./
COPY libs/core/package.json libs/core/
COPY libs/file-storage/package.json libs/file-storage/
COPY libs/files-io/package.json libs/files-io/
COPY libs/prisma/package.json libs/prisma/
COPY libs/react-primitives/package.json libs/react-primitives/
COPY libs/search-params-io/package.json libs/search-params-io/
COPY libs/zod-utils/package.json libs/zod-utils/
COPY apps/show/package.json apps/show/

# App production build.
FROM base AS build

COPY --from=pnpm-store ${PNPM_HOME}/store ${PNPM_HOME}/store
COPY --from=pnpm-store /workspace ./
COPY --from=packages-json /workspace ./

RUN pnpm install --frozen-lockfile --offline

COPY tsconfig.base.json tsconfig.libs.json ./
COPY libs/core libs/core
COPY libs/file-storage libs/file-storage
COPY libs/files-io libs/files-io
COPY libs/prisma libs/prisma
COPY libs/react-primitives libs/react-primitives
COPY libs/search-params-io libs/search-params-io
COPY libs/zod-utils libs/zod-utils
COPY apps/show apps/show

# Build libs and app.
RUN pnpm --filter show... build

# Remove everything in the workspace except `apps` and `libs`.
RUN find . -mindepth 1 -maxdepth 1 \
    ! -name apps ! -name libs \
    -exec rm -rf {} +

# Remove everything in `./apps/show` except `build`, `public` and `server.js`.
RUN find ./apps/show -mindepth 1 -maxdepth 1 \
    ! -name build ! -name public ! -name server.js \
    -exec rm -rf {} +

# Remove everything in `./libs/*` except `build`.
RUN find ./libs -mindepth 2 -maxdepth 2 \
    ! -name build \
    -exec rm -rf {} +

# Production image with minimal footprint.
FROM base AS app

ENV NODE_ENV="production"

COPY --from=pnpm-store ${PNPM_HOME}/store ${PNPM_HOME}/store
COPY --from=pnpm-store /workspace ./
COPY --from=packages-json /workspace ./

RUN pnpm install --prod --frozen-lockfile --offline

COPY --from=build /workspace ./
COPY libs/prisma/migrations libs/prisma/migrations
COPY libs/prisma/schema.prisma libs/prisma/schema.prisma

CMD ["pnpm", "--filter", "show", "start"]
