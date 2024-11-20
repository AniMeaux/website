import { createImageBlurhash } from "#core/blurhash.server";
import { PrismaErrorCodes, prisma } from "#core/prisma.server";
import { ImageUrl } from "@animeaux/core";
import { Prisma } from "@prisma/client";
import { captureException } from "@sentry/remix";
import type { Except } from "type-fest";

export class ExhibitorApplicationDbDelegate {
  async get<T extends Prisma.ShowExhibitorApplicationSelect>(
    id: string,
    params: { select: T },
  ) {
    try {
      return await prisma.showExhibitorApplication.findFirst({
        where: { id },
        select: params.select,
      });
    } catch (error) {
      // Ignore the error when `id` is not an UUID.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCodes.INCONSISTENT_COLUMN_DATA
      ) {
        return null;
      }

      throw error;
    }
  }

  async create(data: ExhibitorApplicationData) {
    try {
      const blurhash = await createImageBlurhash(data.structureLogoPath);

      data.structureLogoPath = ImageUrl.stringify({
        id: data.structureLogoPath,
        blurhash,
      });
    } catch (error) {
      console.error(error);

      captureException(error, {
        extra: { structureLogoPath: data.structureLogoPath },
      });
    }

    try {
      return await prisma.showExhibitorApplication.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
          throw new ExhibitorApplicationDbDelegate.EmailAlreadyUsedError();
        }
      }

      throw error;
    }
  }
}

export namespace ExhibitorApplicationDbDelegate {
  export class EmailAlreadyUsedError extends Error {}
}

type ExhibitorApplicationData = Except<
  Prisma.ShowExhibitorApplicationCreateInput,
  "id" | "createdAt" | "updatedAt"
>;
