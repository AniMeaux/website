import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { Service } from "#core/services/service.server";
import type { Prisma } from "@prisma/client";
import { ShowExhibitorStandConfigurationStatus } from "@prisma/client";
import type { Except } from "type-fest";

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

  async update(
    token: string,
    data: ExhibitorStandConfigurationData,
    presentDogs: Except<
      Prisma.ShowExhibitorDogCreateManyInput,
      "standConfigurationId"
    >[],
  ) {
    return await prisma.$transaction(async (prisma) => {
      const exhibitor = await prisma.showExhibitor.update({
        where: { token },
        data: {
          standConfiguration: {
            update: {
              ...data,
              status: ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION,
            },
          },
        },
        select: { standConfiguration: { select: { id: true } } },
      });

      if (exhibitor.standConfiguration == null) {
        throw notFound();
      }

      await prisma.showExhibitorDog.deleteMany({
        where: { standConfigurationId: exhibitor.standConfiguration.id },
      });

      await prisma.showExhibitorDog.createMany({
        data: presentDogs.map((presentDog) => ({
          ...presentDog,
          standConfigurationId: exhibitor.standConfiguration!.id,
        })),
      });

      return exhibitor.standConfiguration;
    });
  }
}

type ExhibitorStandConfigurationData = Pick<
  Prisma.ShowExhibitorStandConfigurationUpdateInput,
  | "chairCount"
  | "dividerCount"
  | "dividerType"
  | "hasTablecloths"
  | "installationDay"
  | "peopleCount"
  | "placementComment"
  | "size"
  | "tableCount"
  | "zone"
>;
