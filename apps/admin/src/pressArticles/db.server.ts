import { PressArticle, Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import { prisma } from "~/core/db.server";
import { NotFoundError, PrismaErrorCodes } from "~/core/errors.server";

type PressArticleData = Pick<
  PressArticle,
  "image" | "publicationDate" | "publisherName" | "title" | "url"
>;

export async function createPressArticle(data: PressArticleData) {
  validatePressArticle(data);

  try {
    await prisma.pressArticle.create({ data, select: { id: true } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
        throw new UrlAlreadyUsedError();
      }
    }

    throw error;
  }
}

export class UrlAlreadyUsedError extends Error {}
export class InvalidPublicationDateError extends Error {}

function validatePressArticle(data: PressArticleData) {
  const now = DateTime.now().toMillis();
  const publicationDate = DateTime.fromJSDate(data.publicationDate).toMillis();
  if (now < publicationDate) {
    throw new InvalidPublicationDateError();
  }
}

export async function deletePressArticle(id: PressArticle["id"]) {
  try {
    await prisma.pressArticle.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === PrismaErrorCodes.NOT_FOUND) {
        throw new NotFoundError();
      }
    }

    throw error;
  }
}
