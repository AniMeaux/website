import { prisma } from "#core/prisma.server.js";
import { notFound } from "#core/response.server.js";
import { Service } from "#core/services/service.server.js";
import type { Prisma } from "@prisma/client";

export class ServiceAnimation extends Service {
  async getManyVisibleByToken<T extends Prisma.ShowAnimationSelect>(
    token: string,
    params: { select: T },
  ) {
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { token },
      select: {
        animations: {
          where: { isVisible: true },
          orderBy: { startTime: "asc" },
          select: params.select,
        },
      },
    });

    if (exhibitor?.animations == null) {
      throw notFound();
    }

    return exhibitor.animations;
  }
}
