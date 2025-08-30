import type { ServicePrisma } from "#core/prisma.service.server.js";
import { StandSize } from "#exhibitors/stand-size/stand-size.js";
import { promiseHash } from "remix-utils/promise";

export class ServiceStandSize {
  // eslint-disable-next-line no-useless-constructor
  constructor(private prisma: ServicePrisma) {}

  async getAvailable() {
    const { limits, groups } = await promiseHash({
      limits: this.prisma.showStandSizeLimit.findMany(),

      groups: this.prisma.showExhibitor.groupBy({
        by: "size",
        _count: { size: true },
      }),
    });

    return StandSize.values.filter((standSize) => {
      const maxCount =
        limits.find((limit) => limit.size === standSize)?.maxCount ??
        Number.MAX_SAFE_INTEGER;

      const used =
        groups.find((group) => group.size === standSize)?._count.size ?? 0;

      return used < maxCount;
    });
  }
}
