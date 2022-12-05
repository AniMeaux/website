# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /workspace

# Install all node_modules, including dev dependencies
FROM base as deps
ADD ./package.json ./yarn.lock ./
ADD ./shared/package.json ./shared/
ADD ./api/package.json ./api/
ADD ./apps/faune-remix/package.json ./apps/faune-remix/
RUN yarn --frozen-lockfile --production=false

# Setup production node_modules
FROM base as production-deps
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/shared/node_modules ./shared/node_modules
COPY --from=deps /workspace/apps/faune-remix/node_modules ./apps/faune-remix/node_modules
ADD ./package.json ./yarn.lock ./
ADD ./shared/package.json ./shared/
ADD ./apps/faune-remix/package.json ./apps/faune-remix/
RUN yarn --frozen-lockfile

# Build
FROM base as build
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/shared/node_modules ./shared/node_modules
COPY --from=deps /workspace/api/node_modules ./api/node_modules
COPY --from=deps /workspace/apps/faune-remix/node_modules ./apps/faune-remix/node_modules

ADD ./api/package.json ./api/
ADD ./api/prisma ./api/prisma
RUN yarn --cwd ./api build:prisma

ADD ./shared ./shared
RUN yarn --cwd ./shared build

ADD ./apps/faune-remix ./apps/faune-remix
RUN yarn --cwd ./apps/faune-remix build

# Finally, build the production image with minimal footprint
FROM base
COPY --from=production-deps /workspace/node_modules ./node_modules
COPY --from=production-deps /workspace/shared/node_modules ./shared/node_modules
COPY --from=production-deps /workspace/apps/faune-remix/node_modules ./apps/faune-remix/node_modules
COPY --from=build /workspace/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /workspace/shared/build ./shared/build
COPY --from=build /workspace/apps/faune-remix/build ./apps/faune-remix/build
COPY --from=build /workspace/apps/faune-remix/public ./apps/faune-remix/public
ADD . .

WORKDIR /workspace/apps/faune-remix
CMD ["yarn", "start"]
