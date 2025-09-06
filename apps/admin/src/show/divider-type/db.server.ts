import { prisma } from "#core/prisma.server";
import type { ShowDividerTypeAvailability } from "#show/divider-type/availability";
import type { Prisma } from "@prisma/client";
import type { Simplify } from "type-fest";

export class ShowDividerTypeDbDelegate {
  async findMany<T extends Prisma.ShowDividerTypeSelect>(params: {
    select: T;
  }) {
    const dividerTypes = await prisma.showDividerType.findMany({
      select: params.select,
      orderBy: { label: "asc" },
    });

    return dividerTypes;
  }

  async findManyWithAvailability<
    T extends Prisma.ShowDividerTypeSelect,
  >(params: { select: T }) {
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

    const dividerTypes = (await this.findMany({
      select: { ...params.select, ...internalSelect },
    })) as Internal[];

    const dividerTypesWithAvailability = dividerTypes.map<
      Internal & ShowDividerTypeAvailability
    >((dividerType) => {
      const usedCount = dividerType.exhibitors.reduce(
        (usedCount, exhibitor) => usedCount + exhibitor.dividerCount,
        0,
      );

      let availableCount = dividerType.maxCount - usedCount;

      return { ...dividerType, availableCount };
    });

    return dividerTypesWithAvailability as Simplify<
      Selected & ShowDividerTypeAvailability
    >[];
  }
}
