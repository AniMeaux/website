import { PrismaErrorCodes } from "#core/errors.server";
import { notifyShowApp } from "#core/notification.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { StandConfigurationStatus } from "#show/exhibitors/stand-configuration/status";
import type { ShowExhibitorStandConfiguration } from "@prisma/client";
import { Prisma } from "@prisma/client";

export class ShowExhibitorStandConfigurationDbDelegate {
  async findUniqueByExhibitor<
    T extends Prisma.ShowExhibitorStandConfigurationSelect,
  >(exhibitorId: string, params: { select: T }) {
    const standConfiguration =
      await prisma.showExhibitorStandConfiguration.findUnique({
        where: { exhibitorId },
        select: params.select,
      });

    if (standConfiguration == null) {
      throw notFound();
    }

    return standConfiguration;
  }

  async update(exhibitorId: string, data: ShowExhibitorStandConfigurationData) {
    this.normalize(data);

    try {
      await prisma.showExhibitor.update({
        where: { id: exhibitorId },
        data: {
          updatedAt: new Date(),
          standConfiguration: { update: data },
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
      type: "stand-configuration-treated",
      exhibitorId,
    });
  }

  normalize(data: ShowExhibitorStandConfigurationData) {
    if (data.status !== StandConfigurationStatus.Enum.TO_MODIFY) {
      data.statusMessage = null;
    }
  }
}

type ShowExhibitorStandConfigurationData = Pick<
  ShowExhibitorStandConfiguration,
  | "chairCount"
  | "dividerCount"
  | "dividerType"
  | "hasElectricalConnection"
  | "hasTablecloths"
  | "installationDay"
  | "peopleCount"
  | "size"
  | "status"
  | "statusMessage"
  | "tableCount"
  | "zone"
>;
