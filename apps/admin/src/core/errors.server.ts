export class NotFoundError extends Error {}

export class ReferencedError extends Error {}

// Prisma only expose error codes as string.
// See https://github.com/prisma/prisma/issues/5040
export enum PrismaErrorCodes {
  // https://www.prisma.io/docs/reference/api-reference/error-reference#p2003
  FOREIGN_KEY_CONSTRAINT_FAILED = "P2003",

  // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
  NOT_FOUND = "P2025",

  // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
  UNIQUE_CONSTRAINT_FAILED = "P2002",
}
