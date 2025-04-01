import { prisma } from "#core/prisma.server.js";
import { notFound } from "#core/response.server.js";
import { Service } from "#core/services/service.server.js";
import { ShowDay } from "#core/show-day";
import type { Prisma } from "@prisma/client";

export class ServiceAnimation extends Service {
  async getManyVisibleByDay<T extends Prisma.ShowAnimationSelect>(
    day: ShowDay.Enum,
    params: { select: T },
  ) {
    return await prisma.showAnimation.findMany({
      where: {
        isVisible: true,
        startTime: {
          gte: ShowDay.schedules[day].start.toJSDate(),
          lte: ShowDay.schedules[day].end.toJSDate(),
        },
      },
      orderBy: { startTime: "asc" },
      select: params.select,
    });
  }

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
