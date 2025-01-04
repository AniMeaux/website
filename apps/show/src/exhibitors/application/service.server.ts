import { createImageBlurhash } from "#core/blurhash.server";
import { PrismaErrorCodes, prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { Service } from "#core/services/service.server";
import { ImageUrl } from "@animeaux/core";
import { Prisma } from "@prisma/client";
import { captureException } from "@sentry/remix";
import type { Except } from "type-fest";

export class ServiceApplication extends Service {
  async get<T extends Prisma.ShowExhibitorApplicationSelect>(
    id: string,
    params: { select: T },
  ) {
    const application = await prisma.showExhibitorApplication.findFirst({
      where: { id },
      select: params.select,
    });

    if (application == null) {
      throw notFound();
    }

    return application;
  }

  async getByToken<T extends Prisma.ShowExhibitorApplicationSelect>(
    token: string,
    params: { select: T },
  ) {
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { token },
      select: { application: { select: params.select } },
    });

    if (exhibitor?.application == null) {
      throw notFound();
    }

    return exhibitor.application;
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
          throw new ServiceApplication.EmailAlreadyUsedError();
        }
      }

      throw error;
    }
  }
}

export namespace ServiceApplication {
  export class EmailAlreadyUsedError extends Error {}
}

type ExhibitorApplicationData = Except<
  Prisma.ShowExhibitorApplicationCreateInput,
  "id" | "createdAt" | "updatedAt"
>;
