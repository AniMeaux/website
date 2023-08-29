import { singleton } from "#core/singleton.server.ts";
import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";

invariant(
  typeof process.env.DATABASE_URL === "string",
  "DATABASE_URL must be defined.",
);

// This is needed because in development we don't want to restart the server
// with every change, but we want to make sure we don't create a new connection
// to the DB with every change either.
export const prisma = singleton("prisma", () => new PrismaClient());
prisma.$connect();
