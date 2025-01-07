import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { Service } from "#core/services/service.server";
import type { Prisma } from "@prisma/client";
import { ShowExhibitorDogsConfigurationStatus } from "@prisma/client";

export class ServiceDogsConfiguration extends Service {
  async getByToken<T extends Prisma.ShowExhibitorDogsConfigurationSelect>(
    token: string,
    params: { select: T },
  ) {
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { token },
      select: { dogsConfiguration: { select: params.select } },
    });

    if (exhibitor?.dogsConfiguration == null) {
      throw notFound();
    }

    return exhibitor.dogsConfiguration;
  }

  async update(token: string, data: ExhibitorDogData[]) {
    return await prisma.$transaction(async (prisma) => {
      const exhibitor = await prisma.showExhibitor.update({
        where: { token },
        data: {
          dogsConfiguration: {
            update: {
              status: ShowExhibitorDogsConfigurationStatus.AWAITING_VALIDATION,
            },
          },
        },
        select: { dogsConfiguration: { select: { id: true } } },
      });

      if (exhibitor?.dogsConfiguration == null) {
        throw notFound();
      }

      await prisma.showExhibitorDog.deleteMany({
        where: { dogsConfigurationId: exhibitor.dogsConfiguration.id },
      });

      await prisma.showExhibitorDog.createMany({
        data: data.map((dog) => ({
          ...dog,
          dogsConfigurationId: exhibitor.dogsConfiguration!.id,
        })),
      });

      return true;
    });
  }
}

type ExhibitorDogData = Pick<
  Prisma.ShowExhibitorDogCreateManyInput,
  "gender" | "idNumber" | "isCategorized" | "isSterilized"
>;
