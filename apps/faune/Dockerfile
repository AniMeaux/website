# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /workspace

ADD package.json yarn.lock ./
ADD shared/package.json shared/
ADD apps/faune/package.json apps/faune/
RUN yarn --frozen-lockfile --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /workspace

COPY --from=deps /workspace/node_modules /workspace/node_modules
COPY --from=deps /workspace/shared/node_modules /workspace/shared/node_modules
COPY --from=deps /workspace/apps/faune/node_modules /workspace/apps/faune/node_modules
ADD package.json yarn.lock ./
ADD shared/package.json shared/
ADD apps/faune/package.json apps/faune/
RUN yarn --frozen-lockfile

# Build shared
FROM base as shared-build

WORKDIR /workspace

COPY --from=deps /workspace/node_modules /workspace/node_modules
COPY --from=deps /workspace/shared/node_modules /workspace/shared/node_modules

ADD shared shared
RUN yarn --cwd shared build

# Build Faune
FROM shared-build as faune-build

WORKDIR /workspace

COPY --from=deps /workspace/apps/faune/node_modules /workspace/apps/faune/node_modules

ADD apps/faune apps/faune
RUN yarn --cwd apps/faune build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /workspace

COPY --from=production-deps /workspace/node_modules /workspace/node_modules
COPY --from=production-deps /workspace/shared/node_modules /workspace/shared/node_modules
COPY --from=production-deps /workspace/apps/faune/node_modules /workspace/apps/faune/node_modules

COPY --from=faune-build /workspace/shared/build /workspace/shared/build
COPY --from=faune-build /workspace/apps/faune/build /workspace/apps/faune/build
COPY --from=faune-build /workspace/apps/faune/public /workspace/apps/faune/public
ADD . .

WORKDIR /workspace/apps/faune
CMD ["yarn", "start"]
