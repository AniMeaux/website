import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import type { Prisma } from "@prisma/client";

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
}
