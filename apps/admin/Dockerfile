ARG APPLICATION_VERSION

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
ADD ./libs/algolia-client/package.json ./libs/algolia-client/
ADD ./libs/core/package.json ./libs/core/
ADD ./libs/form-data/package.json ./libs/form-data/
ADD ./libs/google-client/package.json ./libs/google-client/
ADD ./libs/password/package.json ./libs/password/
ADD ./libs/react-primitives/package.json ./libs/react-primitives/
ADD ./libs/search-params-io/package.json ./libs/search-params-io/
ADD ./libs/tailwind-animation/package.json ./libs/tailwind-animation/
ADD ./libs/zod-utils/package.json ./libs/zod-utils/
ADD ./apps/admin/package.json ./apps/admin/
RUN yarn --frozen-lockfile --production=false

# Setup production node_modules
FROM base as production-deps
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/admin/node_modules ./apps/admin/node_modules
ADD ./package.json ./yarn.lock ./
ADD ./libs/algolia-client/package.json ./libs/algolia-client/
ADD ./libs/core/package.json ./libs/core/
ADD ./libs/form-data/package.json ./libs/form-data/
ADD ./libs/google-client/package.json ./libs/google-client/
ADD ./libs/password/package.json ./libs/password/
ADD ./libs/react-primitives/package.json ./libs/react-primitives/
ADD ./libs/search-params-io/package.json ./libs/search-params-io/
ADD ./libs/tailwind-animation/package.json ./libs/tailwind-animation/
ADD ./libs/zod-utils/package.json ./libs/zod-utils/
ADD ./apps/admin/package.json ./apps/admin/
RUN yarn --frozen-lockfile

# Build
FROM base as build
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/admin/node_modules ./apps/admin/node_modules

ADD ./package.json ./tsconfig.base.json ./
ADD ./prisma ./prisma
RUN yarn generate:prisma

ADD ./libs/algolia-client ./libs/algolia-client
ADD ./libs/core ./libs/core
ADD ./libs/form-data ./libs/form-data
ADD ./libs/google-client ./libs/google-client
ADD ./libs/password ./libs/password
ADD ./libs/react-primitives ./libs/react-primitives
ADD ./libs/search-params-io ./libs/search-params-io
ADD ./libs/tailwind-animation ./libs/tailwind-animation
ADD ./libs/zod-utils ./libs/zod-utils
ADD ./apps/admin ./apps/admin
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN \
  yarn --cwd ./apps/admin build

# Finally, build the production image with minimal footprint
FROM base
COPY --from=production-deps /workspace/node_modules ./node_modules
COPY --from=production-deps /workspace/apps/admin/node_modules ./apps/admin/node_modules
COPY --from=build /workspace/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /workspace/apps/admin/build ./apps/admin/build
ADD ./prisma ./prisma
ADD ./apps/admin ./apps/admin

CMD ["yarn", "--cwd", "apps/admin", "start"]
