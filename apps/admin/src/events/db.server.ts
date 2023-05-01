import { Event, Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import { deleteImage } from "~/core/cloudinary.server";
import { prisma } from "~/core/db.server";
import { NotFoundError, PrismaErrorCodes } from "~/core/errors.server";

type EventData = Pick<
  Event,
  | "description"
  | "endDate"
  | "image"
  | "isFullDay"
  | "isVisible"
  | "location"
  | "startDate"
  | "title"
  | "url"
>;

export async function createEvent(data: EventData) {
  validateEvent(data);
  normalizeEvent(data);
  const event = await prisma.event.create({ data, select: { id: true } });
  return event.id;
}

export async function updateEvent(eventId: Event["id"], data: EventData) {
  validateEvent(data);
  normalizeEvent(data);

  await prisma.$transaction(async (prisma) => {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { image: true },
    });

    if (event == null) {
      throw new NotFoundError();
    }

    await prisma.event.update({ where: { id: eventId }, data });

    if (event.image !== data.image) {
      await deleteImage(event.image);
    }
  });
}

export async function deleteEvent(eventId: Event["id"]) {
  try {
    const event = await prisma.event.delete({
      where: { id: eventId },
      select: { image: true },
    });

    await deleteImage(event.image);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === PrismaErrorCodes.NOT_FOUND) {
        throw new NotFoundError();
      }
    }

    throw error;
  }
}

export class InvalidDateRangeError extends Error {}

function validateEvent(data: EventData) {
  const startDate = DateTime.fromJSDate(data.startDate).toMillis();
  const endDate = DateTime.fromJSDate(data.endDate).toMillis();
  if (startDate > endDate || (!data.isFullDay && startDate === endDate)) {
    throw new InvalidDateRangeError();
  }
}

function normalizeEvent(data: EventData) {
  if (data.isFullDay) {
    data.startDate = DateTime.fromJSDate(data.startDate)
      .startOf("day")
      .toJSDate();
    data.endDate = DateTime.fromJSDate(data.endDate).endOf("day").toJSDate();
  }
}
