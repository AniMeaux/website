import { PrismaClient } from "./prisma-client.server";

export * from "./generated/client";
export * from "./promise.server";

// Override `PrismaClient` with our extended version.
// Explicit re-export is required to resolve the ambiguity ts(2308).
export { PrismaClient };
