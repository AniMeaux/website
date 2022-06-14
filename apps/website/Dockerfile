# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /workspace

ADD package.json yarn.lock ./
ADD shared/package.json shared/
ADD api/package.json api/
ADD apps/website/package.json apps/website/
RUN yarn --frozen-lockfile --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /workspace

COPY --from=deps /workspace/node_modules /workspace/node_modules
COPY --from=deps /workspace/shared/node_modules /workspace/shared/node_modules
COPY --from=deps /workspace/api/node_modules /workspace/api/node_modules
COPY --from=deps /workspace/apps/website/node_modules /workspace/apps/website/node_modules
ADD package.json yarn.lock ./
ADD shared/package.json shared/
ADD api/package.json api/
ADD apps/website/package.json apps/website/
RUN yarn --frozen-lockfile

# Build
FROM base as build

WORKDIR /workspace

COPY --from=deps /workspace/node_modules /workspace/node_modules
COPY --from=deps /workspace/shared/node_modules /workspace/shared/node_modules
COPY --from=deps /workspace/api/node_modules /workspace/api/node_modules
COPY --from=deps /workspace/apps/website/node_modules /workspace/apps/website/node_modules

ADD api/package.json api/
ADD api/prisma api/
RUN yarn --cwd api build:prisma

ADD shared shared
RUN yarn --cwd shared build

ADD apps/website apps/website
RUN yarn --cwd apps/website build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /workspace

COPY --from=production-deps /workspace/node_modules /workspace/node_modules
COPY --from=production-deps /workspace/shared/node_modules /workspace/shared/node_modules
COPY --from=production-deps /workspace/apps/website/node_modules /workspace/apps/website/node_modules
COPY --from=build /workspace/node_modules/.prisma /workspace/node_modules/.prisma

COPY --from=build /workspace/shared/build /workspace/shared/build
COPY --from=build /workspace/apps/website/build /workspace/apps/website/build
ADD . .

WORKDIR /workspace/apps/website
CMD ["yarn", "start"]
