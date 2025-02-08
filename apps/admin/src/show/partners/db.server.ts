import { prisma } from "#core/prisma.server";
import type { Prisma } from "@prisma/client";

export class ShowPartnerDbDelegate {
  async findUniqueByExhibitor<T extends Prisma.ShowPartnerSelect>(
    exhibitorId: string,
    params: { select: T },
  ) {
    return await prisma.showPartner.findUnique({
      where: { exhibitorId },
      select: params.select,
    });
  }
}
