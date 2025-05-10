import type { ColorSearchParams } from "#colors/search-params";
import { ColorSort } from "#colors/search-params";
import {
  AlreadyExistError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server";
import { orderByRank } from "#core/order-by-rank";
import { prisma } from "#core/prisma.server";
import type { SearchParamsIO } from "@animeaux/search-params-io";
import type { Color } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { fuzzySearchColors } from "@prisma/client/sql";

export class ColorDbDelegate {
  async create(data: ColorData) {
    try {
      await prisma.color.create({ data, select: { id: true } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
          throw new AlreadyExistError();
        }
      }

      throw error;
    }
  }

  async update(id: Color["id"], data: ColorData) {
    try {
      await prisma.color.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
          throw new AlreadyExistError();
        }
      }

      throw error;
    }
  }

  async delete(id: Color["id"]) {
    try {
      await prisma.color.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_FOUND: {
            throw new NotFoundError();
          }

          case PrismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED: {
            throw new ReferencedError();
          }
        }
      }

      throw error;
    }
  }

  async fuzzySearch<T extends Prisma.ColorSelect>(
    name: undefined | string,
    {
      select,
      where,
      take,
    }: {
      select: T;
      where?: Prisma.ColorWhereInput;
      take?: number;
    },
  ) {
    // Ensure we only use our selected properties.
    const internalSelect = { id: true } satisfies Prisma.ColorSelect;

    // When there are no text search, return hits ordered by name.
    if (name == null) {
      return await prisma.color.findMany({
        where,
        select: { ...select, ...internalSelect },
        orderBy: { name: "asc" },
        take,
      });
    }

    const hits = await prisma.$queryRawTyped(fuzzySearchColors(name));

    const colors = (await prisma.color.findMany({
      where: { ...where, id: { in: hits.map((hit) => hit.id) } },
      select: { ...select, ...internalSelect },
    })) as Prisma.ColorGetPayload<{ select: typeof internalSelect }>[];

    return orderByRank(colors, hits, { take }) as Prisma.ColorGetPayload<{
      select: typeof select & typeof internalSelect;
    }>[];
  }

  async createFindManyParams(
    searchParams: SearchParamsIO.Infer<typeof ColorSearchParams>,
  ) {
    const where: Prisma.ColorWhereInput[] = [];

    if (searchParams.name != null) {
      const hits = await prisma.$queryRawTyped(
        fuzzySearchColors(searchParams.name),
      );

      where.push({ id: { in: hits.map((hit) => hit.id) } });
    }

    const orderBy = COLOR_ORDER_BY[searchParams.sort];

    return {
      orderBy,
      where: { AND: where },
    } satisfies Prisma.ColorFindManyArgs;
  }
}

const COLOR_ORDER_BY: Record<ColorSort, Prisma.ColorFindManyArgs["orderBy"]> = {
  [ColorSort.NAME]: { name: "asc" },
  [ColorSort.ANIMAL_COUNT]: { animals: { _count: "desc" } },
};

type ColorData = Pick<Color, "name">;
