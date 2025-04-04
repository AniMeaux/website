import { prisma } from "#core/prisma.server.js";
import { notFound } from "#core/response.server.js";
import type { Prisma } from "@prisma/client";

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
}
