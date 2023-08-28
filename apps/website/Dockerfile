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
ADD ./libs/core/package.json ./libs/core/
ADD ./apps/website/package.json ./apps/website/
RUN yarn --frozen-lockfile --production=false

# Setup production node_modules
FROM base as production-deps
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/website/node_modules ./apps/website/node_modules
ADD ./package.json ./yarn.lock ./
ADD ./libs/core/package.json ./libs/core/
ADD ./apps/website/package.json ./apps/website/
RUN yarn --frozen-lockfile

# Build
FROM base as build
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/website/node_modules ./apps/website/node_modules

ADD ./package.json ./tsconfig.base.json ./
ADD ./prisma ./prisma
RUN yarn generate:prisma

ADD ./libs/core ./libs/core
ADD ./apps/website ./apps/website
RUN yarn --cwd ./apps/website build

# Finally, build the production image with minimal footprint
FROM base
COPY --from=production-deps /workspace/node_modules ./node_modules
COPY --from=production-deps /workspace/apps/website/node_modules ./apps/website/node_modules
COPY --from=build /workspace/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /workspace/apps/website/build ./apps/website/build
COPY --from=build /workspace/apps/website/public/build ./apps/website/public/build
ADD ./prisma ./prisma
ADD ./apps/website ./apps/website

CMD ["yarn", "--cwd", "apps/website", "start"]
