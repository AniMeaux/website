import { Event, Prisma } from "@prisma/client";
import { prisma } from "~/core/db.server";
import { NotFoundError, PrismaErrorCodes } from "~/core/errors.server";

export async function deleteEvent(eventId: Event["id"]) {
  try {
    await prisma.event.delete({ where: { id: eventId } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === PrismaErrorCodes.NOT_FOUND) {
        throw new NotFoundError();
      }
    }

    throw error;
  }
}
