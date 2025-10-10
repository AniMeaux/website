import { NotFoundError, PrismaErrorCodes } from "#core/errors.server.js";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server.js";
import type { ShowStandSizeBooking } from "#show/stand-size/booking.js";
import { catchError } from "@animeaux/core";
import { Prisma } from "@prisma/client";
import merge from "lodash.merge";
import type { Simplify } from "type-fest";

export class ShowStandSizeDbDelegate {
  async findUnique<T extends Prisma.ShowStandSizeSelect>(
    id: string,
    params: { select: T },
  ) {
    const standSize = await prisma.showStandSize.findUnique({
      where: { id },
      select: params.select,
    });

    if (standSize == null) {
      throw notFound();
    }

    return standSize;
  }

  async findUniqueWithAvailability<T extends Prisma.ShowStandSizeSelect>(
    id: string,
    params: { select: T },
  ) {
    type Selected = Prisma.ShowStandSizeGetPayload<{
      select: typeof params.select;
    }>;

    // Ensure we only use our selected properties.
    const internalSelect = {
      maxCount: true,
      exhibitors: { select: { id: true } },
    } satisfies Prisma.ShowStandSizeSelect;

    type Internal = Prisma.ShowStandSizeGetPayload<{
      select: typeof internalSelect;
    }>;

    const standSize = (await this.findUnique(id, {
      select: merge({}, internalSelect, params.select),
    })) as Internal;

    const bookedCount = standSize.exhibitors.length;

    const ratio =
      standSize.maxCount === 0 ? 0 : bookedCount / standSize.maxCount;

    const standSizeWithAvailability: Internal & ShowStandSizeBooking = {
      ...standSize,
      bookedCount,
      ratio,
    };

    return standSizeWithAvailability as Simplify<
      Selected & ShowStandSizeBooking
    >;
  }

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

  async update(standSizeId: string, data: ShowStandSizeUpdateData) {
    const [error] = await catchError(() =>
      prisma.showStandSize.update({
        where: { id: standSizeId },
        data,
        select: { id: true },
      }),
    );

    if (error != null) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw new NotFoundError();
        }
      }

      throw error;
    }
  }
}

type ShowStandSizeUpdateData = Pick<
  Prisma.ShowStandSizeUpdateInput,
  | "area"
  | "isVisible"
  | "label"
  | "maxBraceletCount"
  | "maxCount"
  | "maxDividerCount"
  | "maxPeopleCount"
  | "maxTableCount"
  | "priceForAssociations"
  | "priceForServices"
  | "priceForShops"
>;
