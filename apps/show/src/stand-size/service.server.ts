import type { ServicePrisma } from "#core/prisma.service.server.js";
import type { Prisma } from "@prisma/client";
import type { Simplify } from "type-fest";

export class ServiceStandSize {
  // eslint-disable-next-line no-useless-constructor
  constructor(private prisma: ServicePrisma) {}

  async getManyVisible<T extends Prisma.ShowStandSizeSelect>(params: {
    select: T;
  }) {
    type Selected = Prisma.ShowStandSizeGetPayload<{
      select: typeof params.select;
    }>;

    // Ensure we only use our selected properties.
    const internalSelect = {
      maxCount: true,
      _count: { select: { exhibitors: {} } },
    } satisfies Prisma.ShowStandSizeSelect;

    type Internal = Prisma.ShowStandSizeGetPayload<{
      select: typeof internalSelect;
    }>;

    const standSizes = (await this.prisma.showStandSize.findMany({
      where: { isVisible: true },
      select: { ...params.select, ...internalSelect },
      orderBy: [{ area: "asc" }, { label: "asc" }],
    })) as Internal[];

    type Availability = { isAvailable: boolean };

    const standSizesWithAvailability = standSizes.map<Internal & Availability>(
      (standSize) => ({
        ...standSize,

        isAvailable: standSize._count.exhibitors < standSize.maxCount,
      }),
    );

    return standSizesWithAvailability as Simplify<Selected & Availability>[];
  }
}
