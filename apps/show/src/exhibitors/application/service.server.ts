import type { ServiceBlurhash } from "#core/image/blurhash.service.server.js";
import { ImageData } from "#core/image/data.js";
import { ServicePrisma } from "#core/prisma.service.server.js";
import { notFound } from "#core/response.server";
import { Prisma } from "@animeaux/prisma/server";
import { captureException } from "@sentry/remix";
import type { Except } from "type-fest";

export class ServiceApplication {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private prisma: ServicePrisma,
    private blurhash: ServiceBlurhash,
  ) {}

  async get<T extends Prisma.ShowExhibitorApplicationSelect>(
    id: string,
    params: { select: T },
  ) {
    const application = await this.prisma.showExhibitorApplication.findFirst({
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
    const exhibitor = await this.prisma.showExhibitor.findUnique({
      where: { token },
      select: { application: { select: params.select } },
    });

    if (exhibitor?.application == null) {
      throw notFound();
    }

    return exhibitor.application;
  }

  async getByExhibitor<T extends Prisma.ShowExhibitorApplicationSelect>(
    exhibitorId: string,
    params: { select: T },
  ) {
    const exhibitor = await this.prisma.showExhibitor.findUnique({
      where: { id: exhibitorId },
      select: { application: { select: params.select } },
    });

    if (exhibitor?.application == null) {
      throw notFound();
    }

    return exhibitor.application;
  }

  async create(data: ExhibitorApplicationData) {
    try {
      const blurhash = await this.blurhash.create(data.structureLogoPath);

      data.structureLogoPath = ImageData.stringify({
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
      return await this.prisma.showExhibitorApplication.create({
        data,
        include: { desiredStandSize: { select: { label: true } } },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === ServicePrisma.ErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
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
  Prisma.ShowExhibitorApplicationUncheckedCreateInput,
  "id" | "createdAt" | "updatedAt"
>;
