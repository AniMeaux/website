import { PrismaClient } from "./prisma-client.server.js";

export * from "./generated/client.js";
export * from "./promise.server.js";

// Override `PrismaClient` with our extended version.
// Explicit re-export is required to resolve the ambiguity ts(2308).
export { PrismaClient };
