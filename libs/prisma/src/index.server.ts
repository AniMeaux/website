import { PrismaClient } from "#i/prisma-client.server.js";

export * from "#i/generated/client.js";
export * from "#i/promise.server.js";

// Override `PrismaClient` with our extended version.
// Explicit re-export is required to resolve the ambiguity ts(2308).
export { PrismaClient };
