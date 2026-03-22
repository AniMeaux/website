import { singleton } from "@animeaux/core"
import { PrismaClient } from "@animeaux/prisma/server"

// This is needed because in development we don't want to restart the server
// with every change, but we want to make sure we don't create a new connection
// to the DB with every change either.
export const prisma = singleton("prisma", () => new PrismaClient())
void prisma.$connect()
