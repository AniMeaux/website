import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import type { Prisma } from "@prisma/client";

export class ShowExhibitorProfileDbDelegate {
  async findUniqueByExhibitor<T extends Prisma.ShowExhibitorProfileSelect>(
    exhibitorId: string,
    params: { select: T },
  ) {
    const profile = await prisma.showExhibitorProfile.findUnique({
      where: { exhibitorId },
      select: params.select,
    });

    if (profile == null) {
      throw notFound();
    }

    return profile;
  }
}
