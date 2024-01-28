import { NotFoundError, PrismaErrorCodes } from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import type { PressArticle } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { DateTime } from "luxon";

export class UrlAlreadyUsedError extends Error {}
export class InvalidPublicationDateError extends Error {}

export class PressArticleDbDelegate {
  async create(data: PressArticleData) {
    this.validatePressArticle(data);

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

  async delete(id: PressArticle["id"]) {
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

  private validatePressArticle(data: PressArticleData) {
    const now = DateTime.now().toMillis();
    const publicationDate = DateTime.fromJSDate(
      data.publicationDate,
    ).toMillis();
    if (now < publicationDate) {
      throw new InvalidPublicationDateError();
    }
  }
}

type PressArticleData = Pick<
  PressArticle,
  "image" | "publicationDate" | "publisherName" | "title" | "url"
>;
