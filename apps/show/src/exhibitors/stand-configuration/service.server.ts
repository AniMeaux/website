import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { Service } from "#core/services/service.server";
import type { Prisma } from "@prisma/client";
import { ShowExhibitorStandConfigurationStatus } from "@prisma/client";

export class ServiceStandConfiguration extends Service {
  async getByToken<T extends Prisma.ShowExhibitorStandConfigurationSelect>(
    token: string,
    params: { select: T },
  ) {
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { token },
      select: { standConfiguration: { select: params.select } },
    });

    if (exhibitor?.standConfiguration == null) {
      throw notFound();
    }

    return exhibitor.standConfiguration;
  }

  async getByExhibitor<T extends Prisma.ShowExhibitorStandConfigurationSelect>(
    exhibitorId: string,
    params: { select: T },
  ) {
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

  async update(token: string, data: ExhibitorStandConfigurationData) {
    await prisma.showExhibitor.update({
      where: { token },
      data: {
        updatedAt: new Date(),

        standConfiguration: {
          update: {
            ...data,
            status: ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION,
          },
        },
      },
    });

    return true;
  }
}

type ExhibitorStandConfigurationData = Pick<
  Prisma.ShowExhibitorStandConfigurationUpdateInput,
  | "chairCount"
  | "dividerCount"
  | "dividerType"
  | "hasElectricalConnection"
  | "hasTablecloths"
  | "installationDay"
  | "peopleCount"
  | "placementComment"
  | "size"
  | "tableCount"
  | "zone"
>;
