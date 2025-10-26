import type { ServicePrisma } from "#core/prisma.service.server.js";
import type { DividerTypeAvailability } from "#divider-type/availability.js";
import type { Prisma } from "@animeaux/prisma/server";
import type { Simplify } from "type-fest";

export class ServiceDividerType {
  // eslint-disable-next-line no-useless-constructor
  constructor(private prisma: ServicePrisma) {}

  async getMany<T extends Prisma.ShowDividerTypeSelect>(params: { select: T }) {
    type Selected = Prisma.ShowDividerTypeGetPayload<{
      select: typeof params.select;
    }>;

    // Ensure we only use our selected properties.
    const internalSelect = {
      maxCount: true,
      exhibitors: { select: { dividerCount: true } },
    } satisfies Prisma.ShowDividerTypeSelect;

    type Internal = Prisma.ShowDividerTypeGetPayload<{
      select: typeof internalSelect;
    }>;

    const dividerTypes = (await this.prisma.showDividerType.findMany({
      select: { ...params.select, ...internalSelect },
      orderBy: { label: "asc" },
    })) as Internal[];

    const dividerTypesWithAvailability = dividerTypes.map<
      Internal & DividerTypeAvailability
    >((dividerType) => {
      const usedCount = dividerType.exhibitors.reduce(
        (usedCount, exhibitor) => usedCount + exhibitor.dividerCount,
        0,
      );

      let availableCount = dividerType.maxCount - usedCount;

      if (availableCount < 0) {
        availableCount = 0;
      }

      return { ...dividerType, availableCount };
    });

    return dividerTypesWithAvailability as Simplify<
      Selected & DividerTypeAvailability
    >[];
  }
}
