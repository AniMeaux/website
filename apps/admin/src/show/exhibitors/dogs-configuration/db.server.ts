import { PrismaErrorCodes } from "#core/errors.server.js";
import { notifyShowApp } from "#core/notification.server.js";
import { prisma } from "#core/prisma.server.js";
import { notFound } from "#core/response.server.js";
import { DogsConfigurationStatus } from "#show/exhibitors/dogs-configuration/status";
import type { ShowExhibitorDogsConfiguration } from "@prisma/client";
import { Prisma } from "@prisma/client";

export class ShowExhibitorDogsConfigurationDbDelegate {
  async findUniqueByExhibitor<
    T extends Prisma.ShowExhibitorDogsConfigurationSelect,
  >(exhibitorId: string, params: { select: T }) {
    const dogsConfiguration =
      await prisma.showExhibitorDogsConfiguration.findUnique({
        where: { exhibitorId },
        select: params.select,
      });

    if (dogsConfiguration == null) {
      throw notFound();
    }

    return dogsConfiguration;
  }

  async update(exhibitorId: string, data: ShowExhibitorDogsConfigurationData) {
    this.normalize(data);

    try {
      await prisma.showExhibitor.update({
        where: { id: exhibitorId },
        data: {
          updatedAt: new Date(),
          dogsConfiguration: { update: data },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    await notifyShowApp({
      type: "dogs-configuration-treated",
      exhibitorId,
    });
  }

  normalize(data: ShowExhibitorDogsConfigurationData) {
    if (data.status !== DogsConfigurationStatus.Enum.TO_MODIFY) {
      data.statusMessage = null;
    }
  }
}

type ShowExhibitorDogsConfigurationData = Pick<
  ShowExhibitorDogsConfiguration,
  "status" | "statusMessage"
>;
