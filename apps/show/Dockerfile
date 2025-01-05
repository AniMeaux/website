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
ADD ./libs/cloudinary/package.json ./libs/cloudinary/
ADD ./libs/core/package.json ./libs/core/
ADD ./libs/files-io/package.json ./libs/files-io/
ADD ./libs/google-client/package.json ./libs/google-client/
ADD ./libs/react-primitives/package.json ./libs/react-primitives/
ADD ./libs/resend/package.json ./libs/resend/
ADD ./libs/search-params-io/package.json ./libs/search-params-io/
ADD ./libs/zod-utils/package.json ./libs/zod-utils/
ADD ./apps/show/package.json ./apps/show/
RUN yarn --frozen-lockfile --production=false

# Setup production node_modules
FROM base as production-deps
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/show/node_modules ./apps/show/node_modules
ADD ./package.json ./yarn.lock ./
ADD ./libs/cloudinary/package.json ./libs/cloudinary/
ADD ./libs/core/package.json ./libs/core/
ADD ./libs/files-io/package.json ./libs/files-io/
ADD ./libs/google-client/package.json ./libs/google-client/
ADD ./libs/react-primitives/package.json ./libs/react-primitives/
ADD ./libs/resend/package.json ./libs/resend/
ADD ./libs/search-params-io/package.json ./libs/search-params-io/
ADD ./libs/zod-utils/package.json ./libs/zod-utils/
ADD ./apps/show/package.json ./apps/show/
RUN yarn --frozen-lockfile

# Build
FROM base as build
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/show/node_modules ./apps/show/node_modules

ADD ./package.json ./tsconfig.base.json ./
ADD ./prisma ./prisma
RUN yarn generate:prisma

ADD ./libs/cloudinary ./libs/cloudinary
ADD ./libs/core ./libs/core
ADD ./libs/files-io ./libs/files-io
ADD ./libs/google-client ./libs/google-client
ADD ./libs/react-primitives ./libs/react-primitives
ADD ./libs/resend ./libs/resend
ADD ./libs/search-params-io ./libs/search-params-io
ADD ./libs/zod-utils ./libs/zod-utils
ADD ./apps/show ./apps/show
RUN yarn --cwd ./apps/show build

# Finally, build the production image with minimal footprint
FROM base
COPY --from=production-deps /workspace/node_modules ./node_modules
COPY --from=production-deps /workspace/apps/show/node_modules ./apps/show/node_modules
COPY --from=build /workspace/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /workspace/apps/show/build ./apps/show/build
COPY --from=build /workspace/apps/show/server.js ./apps/show/
ADD ./prisma ./prisma
ADD ./apps/show ./apps/show

CMD ["yarn", "--cwd", "apps/show", "start"]
