import { prisma } from "#core/prisma.server";
import type { ShowStandSizeBooking } from "#show/stand-size/booking.js";
import type { Prisma } from "@prisma/client";
import type { Simplify } from "type-fest";

export class ShowStandSizeDbDelegate {
  async findMany<T extends Prisma.ShowStandSizeSelect>(params: { select: T }) {
    const standSizes = await prisma.showStandSize.findMany({
      select: params.select,
      orderBy: [{ area: "asc" }, { label: "asc" }],
    });

    return standSizes;
  }

  async findManyWithAvailability<T extends Prisma.ShowStandSizeSelect>(params: {
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

    const standSizes = (await this.findMany({
      select: { ...params.select, ...internalSelect },
    })) as Internal[];

    const standSizesWithAvailability = standSizes.map<
      Internal & ShowStandSizeBooking
    >((standSize) => {
      const bookedCount = standSize._count.exhibitors;

      const ratio =
        standSize.maxCount === 0 ? 0 : bookedCount / standSize.maxCount;

      return { ...standSize, bookedCount, ratio };
    });

    return standSizesWithAvailability as Simplify<
      Selected & ShowStandSizeBooking
    >[];
  }
}
