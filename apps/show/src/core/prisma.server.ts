import { singleton } from "@animeaux/core";
import { PrismaClient } from "@prisma/client";

// This is needed because in development we don't want to restart the server
// with every change, but we want to make sure we don't create a new connection
// to the DB with every change either.
export const prisma = singleton("prisma", () => new PrismaClient());
prisma.$connect();

// Prisma only expose error codes as string.
// See https://github.com/prisma/prisma/issues/5040
export const PrismaErrorCodes = {
  // https://www.prisma.io/docs/orm/reference/error-reference#p2023
  INCONSISTENT_COLUMN_DATA: "P2023",

  // https://www.prisma.io/docs/orm/reference/error-reference#p2002
  UNIQUE_CONSTRAINT_FAILED: "P2002",
} as const;
