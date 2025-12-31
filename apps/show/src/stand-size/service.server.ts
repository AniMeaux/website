import type { ServicePrisma } from "#i/core/prisma.service.server.js";
import type { Prisma } from "@animeaux/prisma/server";
import type { Simplify } from "type-fest";

export class ServiceStandSize {
  // eslint-disable-next-line no-useless-constructor
  constructor(private prisma: ServicePrisma) {}

  async getMany<T extends Prisma.ShowStandSizeSelect>(params: {
    select: T;
    where?: Prisma.ShowStandSizeWhereInput;
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
      where: params.where,
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

  async getManyVisible<T extends Prisma.ShowStandSizeSelect>(params: {
    select: T;
  }) {
    return await this.getMany({ ...params, where: { isVisible: true } });
  }
}
