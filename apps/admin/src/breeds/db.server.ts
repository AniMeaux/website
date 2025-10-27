import type { BreedSearchParams } from "#breeds/search-params";
import { BreedSort } from "#breeds/search-params";
import {
  AlreadyExistError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server";
import { orderByRank } from "#core/order-by-rank";
import { prisma } from "#core/prisma.server";
import type { Breed } from "@animeaux/prisma/server";
import { Prisma } from "@animeaux/prisma/server";
import type { SearchParamsIO } from "@animeaux/search-params-io";

export class BreedDbDelegate {
  async create(data: BreedData) {
    try {
      await prisma.breed.create({ data, select: { id: true } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
          throw new AlreadyExistError();
        }
      }

      throw error;
    }
  }

  async update(id: Breed["id"], data: BreedData) {
    try {
      await prisma.breed.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
          throw new AlreadyExistError();
        }
      }

      throw error;
    }
  }

  async delete(id: Breed["id"]) {
    try {
      await prisma.breed.delete({ where: { id } });
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

  async fuzzySearch<T extends Prisma.BreedSelect>(
    name: undefined | string,
    {
      select,
      where,
      take,
    }: {
      select: T;
      where?: Prisma.BreedWhereInput;
      take?: number;
    },
  ) {
    // Ensure we only use our selected properties.
    const internalSelect = { id: true } satisfies Prisma.BreedSelect;

    // When there are no text search, return hits ordered by name.
    if (name == null) {
      return await prisma.breed.findMany({
        where,
        select: { ...select, ...internalSelect },
        orderBy: { name: "asc" },
        take,
      });
    }

    const hits = await this.getHits(name);

    const breeds = (await prisma.breed.findMany({
      where: { ...where, id: { in: hits.map((hit) => hit.id) } },
      select: { ...select, ...internalSelect },
    })) as Prisma.BreedGetPayload<{ select: typeof internalSelect }>[];

    return orderByRank(breeds, hits, { take }) as Prisma.BreedGetPayload<{
      select: typeof select & typeof internalSelect;
    }>[];
  }

  async createFindManyParams(
    searchParams: SearchParamsIO.Infer<typeof BreedSearchParams>,
  ) {
    const where: Prisma.BreedWhereInput[] = [];

    if (searchParams.species.size > 0) {
      where.push({ species: { in: Array.from(searchParams.species) } });
    }

    if (searchParams.name != null) {
      const hits = await this.getHits(searchParams.name);

      where.push({ id: { in: hits.map((hit) => hit.id) } });
    }

    const orderBy = BREED_ORDER_BY[searchParams.sort];

    return {
      orderBy,
      where: { AND: where },
    } satisfies Prisma.BreedFindManyArgs;
  }

  private async getHits(
    name: string,
  ): Promise<{ id: string; matchRank: number }[]> {
    return await prisma.$queryRaw`
      WITH
        ranked_breeds AS (
          SELECT
            id,
            match_sorter_rank (ARRAY[name], ${name}) AS "matchRank"
          FROM
            "Breed"
        )
      SELECT
        *
      FROM
        ranked_breeds
      WHERE
        "matchRank" < 6.7
      ORDER BY
        "matchRank" ASC
    `;
  }
}

const BREED_ORDER_BY: Record<BreedSort, Prisma.BreedFindManyArgs["orderBy"]> = {
  [BreedSort.NAME]: { name: "asc" },
  [BreedSort.ANIMAL_COUNT]: { animals: { _count: "desc" } },
};

type BreedData = Pick<Breed, "name" | "species">;
