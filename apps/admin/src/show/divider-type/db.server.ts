import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server.js";
import type { ShowDividerTypeAvailability } from "#show/divider-type/availability.js";
import type { Prisma } from "@animeaux/prisma/server";
import merge from "lodash.merge";
import type { Simplify } from "type-fest";

export class ShowDividerTypeDbDelegate {
  async findUnique<T extends Prisma.ShowDividerTypeSelect>(
    id: string,
    params: { select: T },
  ) {
    const dividerType = await prisma.showDividerType.findUnique({
      where: { id },
      select: params.select,
    });

    if (dividerType == null) {
      throw notFound();
    }

    return dividerType;
  }

  async findUniqueWithAvailability<T extends Prisma.ShowDividerTypeSelect>(
    id: string,
    params: { select: T },
  ) {
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

    const dividerType = (await this.findUnique(id, {
      select: merge({}, internalSelect, params.select),
    })) as Internal;

    const usedCount = dividerType.exhibitors.reduce(
      (usedCount, exhibitor) => usedCount + exhibitor.dividerCount,
      0,
    );

    const ratio =
      dividerType.maxCount === 0 ? 0 : usedCount / dividerType.maxCount;

    const dividerTypeWithAvailability: Internal & ShowDividerTypeAvailability =
      {
        ...dividerType,
        usedCount,
        ratio,
      };

    return dividerTypeWithAvailability as Simplify<
      Selected & ShowDividerTypeAvailability
    >;
  }

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
      select: merge({}, internalSelect, params.select),
    })) as Internal[];

    const dividerTypesWithAvailability = dividerTypes.map<
      Internal & ShowDividerTypeAvailability
    >((dividerType) => {
      const usedCount = dividerType.exhibitors.reduce(
        (usedCount, exhibitor) => usedCount + exhibitor.dividerCount,
        0,
      );

      const ratio =
        dividerType.maxCount === 0 ? 0 : usedCount / dividerType.maxCount;

      return { ...dividerType, usedCount, ratio };
    });

    return dividerTypesWithAvailability as Simplify<
      Selected & ShowDividerTypeAvailability
    >[];
  }
}
