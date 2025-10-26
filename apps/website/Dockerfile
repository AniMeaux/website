# base node image
FROM node:22.11-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /workspace

# Install all node_modules, including dev dependencies
FROM base as deps
ADD ./package.json ./yarn.lock ./
ADD ./libs/core/package.json ./libs/core/
ADD ./libs/prisma/package.json ./libs/prisma/
ADD ./libs/search-params-io/package.json ./libs/search-params-io/
ADD ./apps/website/package.json ./apps/website/
RUN yarn --frozen-lockfile --production=false

# Setup production node_modules
FROM base as production-deps
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/libs/prisma/node_modules ./libs/prisma/node_modules
COPY --from=deps /workspace/apps/website/node_modules ./apps/website/node_modules
ADD ./package.json ./yarn.lock ./
ADD ./libs/core/package.json ./libs/core/
ADD ./libs/prisma/package.json ./libs/prisma/
ADD ./libs/search-params-io/package.json ./libs/search-params-io/
ADD ./apps/website/package.json ./apps/website/
RUN yarn --frozen-lockfile

# Build
FROM base as build
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/libs/prisma/node_modules ./libs/prisma/node_modules
COPY --from=deps /workspace/apps/website/node_modules ./apps/website/node_modules

ADD ./tsconfig.base.json ./
ADD ./libs/prisma ./libs/prisma
RUN yarn --cwd ./libs/prisma generate

ADD ./libs/core ./libs/core
ADD ./libs/search-params-io ./libs/search-params-io
ADD ./apps/website ./apps/website
RUN yarn --cwd ./apps/website build

# Finally, build the production image with minimal footprint
FROM base
COPY --from=production-deps /workspace/node_modules ./node_modules
COPY --from=production-deps /workspace/libs/prisma/node_modules ./libs/prisma/node_modules
COPY --from=production-deps /workspace/apps/website/node_modules ./apps/website/node_modules
COPY --from=build /workspace/apps/website/build ./apps/website/build
ADD ./libs/prisma ./libs/prisma
ADD ./apps/website ./apps/website

CMD ["yarn", "--cwd", "apps/website", "start"]
