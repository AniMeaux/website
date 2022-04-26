# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /workspace

ADD package.json yarn.lock ./
ADD shared/package.json shared/
ADD api/package.json api/
RUN yarn --frozen-lockfile --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /workspace

COPY --from=deps /workspace/node_modules /workspace/node_modules
COPY --from=deps /workspace/shared/node_modules /workspace/shared/node_modules
COPY --from=deps /workspace/api/node_modules /workspace/api/node_modules
ADD package.json yarn.lock ./
ADD shared/package.json shared/
ADD api/package.json api/
RUN yarn --frozen-lockfile

# Build shared
FROM base as shared-build

WORKDIR /workspace

COPY --from=deps /workspace/node_modules /workspace/node_modules
COPY --from=deps /workspace/shared/node_modules /workspace/shared/node_modules

ADD shared shared
RUN yarn --cwd shared build

# Build API
FROM shared-build as api-build

WORKDIR /workspace

COPY --from=deps /workspace/api/node_modules /workspace/api/node_modules

ADD api api
RUN yarn --cwd api build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /workspace

COPY --from=production-deps /workspace/node_modules /workspace/node_modules
COPY --from=production-deps /workspace/shared/node_modules /workspace/shared/node_modules
COPY --from=production-deps /workspace/api/node_modules /workspace/api/node_modules

COPY --from=api-build /workspace/shared/build /workspace/shared/build
COPY --from=api-build /workspace/api/build /workspace/api/build
ADD . .

WORKDIR /workspace/api
CMD ["yarn", "start"]
