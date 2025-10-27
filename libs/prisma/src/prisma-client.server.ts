import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient as PrismaClientBase } from "./generated/client";

/**
 * Abstract Prisma adapter for PostgreSQL.
 *
 * @see https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/no-rust-engine#4-instantiate-prisma-client
 */
export class PrismaClient extends PrismaClientBase {
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
      }),
    });
  }
}
