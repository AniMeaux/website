# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /workspace

ADD package.json yarn.lock ./
ADD shared/package.json shared/
ADD apps/website/package.json apps/website/
RUN yarn --frozen-lockfile --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /workspace

COPY --from=deps /workspace/node_modules /workspace/node_modules
COPY --from=deps /workspace/shared/node_modules /workspace/shared/node_modules
COPY --from=deps /workspace/apps/website/node_modules /workspace/apps/website/node_modules
ADD package.json yarn.lock ./
ADD shared/package.json shared/
ADD apps/website/package.json apps/website/
RUN yarn --frozen-lockfile

# Build shared
FROM base as shared-build

WORKDIR /workspace

COPY --from=deps /workspace/node_modules /workspace/node_modules
COPY --from=deps /workspace/shared/node_modules /workspace/shared/node_modules

ADD shared shared
RUN yarn --cwd shared build

# Build Website
FROM shared-build as website-build

WORKDIR /workspace

COPY --from=deps /workspace/apps/website/node_modules /workspace/apps/website/node_modules

ADD apps/website apps/website
RUN yarn --cwd apps/website build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /workspace

COPY --from=production-deps /workspace/node_modules /workspace/node_modules
COPY --from=production-deps /workspace/shared/node_modules /workspace/shared/node_modules
COPY --from=production-deps /workspace/apps/website/node_modules /workspace/apps/website/node_modules

COPY --from=website-build /workspace/shared/build /workspace/shared/build
COPY --from=website-build /workspace/apps/website/build /workspace/apps/website/build
ADD . .

WORKDIR /workspace/apps/website
CMD ["yarn", "start"]
