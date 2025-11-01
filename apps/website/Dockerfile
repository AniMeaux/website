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
COPY libs/prisma/package.json libs/prisma/
COPY libs/search-params-io/package.json libs/search-params-io/
COPY apps/website/package.json apps/website/

# App production build.
FROM base AS build

COPY --from=pnpm-store ${PNPM_HOME}/store ${PNPM_HOME}/store
COPY --from=pnpm-store /workspace ./
COPY --from=packages-json /workspace ./

RUN pnpm install --frozen-lockfile --offline

COPY tsconfig.base.json ./
COPY libs/core libs/core
COPY libs/prisma libs/prisma
COPY libs/search-params-io libs/search-params-io
COPY apps/website apps/website

# Generate code of app's dependencies.
RUN pnpm --filter website^... generate

RUN pnpm --filter website build

# Production image with minimal footprint.
FROM base AS app

ENV NODE_ENV="production"

COPY --from=pnpm-store ${PNPM_HOME}/store ${PNPM_HOME}/store
COPY --from=pnpm-store /workspace ./
COPY --from=packages-json /workspace ./

RUN pnpm install --prod --frozen-lockfile --offline

COPY --from=build /workspace/apps/website/build apps/website/build
COPY --from=build /workspace/apps/website/public apps/website/public
COPY libs/prisma/migrations libs/prisma/migrations
COPY libs/prisma/schema.prisma libs/prisma/schema.prisma

CMD ["pnpm", "--filter", "website", "start"]
