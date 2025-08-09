import type { ServicePrisma } from "#core/prisma.service.server.js";
import { notFound } from "#core/response.server.js";
import { ShowDay } from "#core/show-day";
import type { Prisma } from "@prisma/client";

export class ServiceAnimation {
  // eslint-disable-next-line no-useless-constructor
  constructor(private prisma: ServicePrisma) {}

  async getManyVisibleByDay<T extends Prisma.ShowAnimationSelect>(
    day: ShowDay.Enum,
    params: { select: T },
  ) {
    return await this.prisma.showAnimation.findMany({
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
    const exhibitor = await this.prisma.showExhibitor.findUnique({
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
