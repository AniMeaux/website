import { PrismaClient } from "@animeaux/prisma/server";

export class ServicePrisma extends PrismaClient {
  constructor() {
    super();
    this.$connect();
  }
}

export namespace ServicePrisma {
  // Prisma only expose error codes as string.
  // See https://github.com/prisma/prisma/issues/5040
  export const ErrorCodes = {
    // https://www.prisma.io/docs/orm/reference/error-reference#p2023
    INCONSISTENT_COLUMN_DATA: "P2023",

    // https://www.prisma.io/docs/orm/reference/error-reference#p2002
    UNIQUE_CONSTRAINT_FAILED: "P2002",
  } as const;
}
