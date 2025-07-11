import {
  EmailAlreadyUsedError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server";
import { orderByRank } from "#core/order-by-rank";
import { prisma } from "#core/prisma.server";
import { FosterFamilyAvailability } from "#foster-families/availability";
import type { FosterFamilySearchParams } from "#foster-families/search-params";
import type { SearchParamsIO } from "@animeaux/search-params-io";
import type { FosterFamily } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { DateTime } from "luxon";

export class MissingSpeciesToHostError extends Error {}
export class InvalidAvailabilityDateError extends Error {}

export class FosterFamilyDbDelegate {
  async fuzzySearch<T extends Prisma.FosterFamilySelect>(
    displayName: undefined | string,
    {
      select,
      where,
      take,
    }: {
      select: T;
      where?: Prisma.FosterFamilyWhereInput;
      take?: number;
    },
  ) {
    // Ensure we only use our selected properties.
    const internalSelect = { id: true } satisfies Prisma.FosterFamilySelect;

    // When there are no text search, return hits ordered by name.
    if (displayName == null) {
      return await prisma.fosterFamily.findMany({
        where,
        select: { ...select, ...internalSelect },
        orderBy: { displayName: "asc" },
        take,
      });
    }

    const hits = await this.getHits(displayName);

    const fosterFamilies = (await prisma.fosterFamily.findMany({
      where: { ...where, id: { in: hits.map((hit) => hit.id) } },
      select: { ...select, ...internalSelect },
    })) as Prisma.FosterFamilyGetPayload<{ select: typeof internalSelect }>[];

    return orderByRank(fosterFamilies, hits, {
      take,
    }) as Prisma.FosterFamilyGetPayload<{
      select: typeof select & typeof internalSelect;
    }>[];
  }

  async delete(fosterFamilyId: FosterFamily["id"]) {
    try {
      await prisma.fosterFamily.delete({ where: { id: fosterFamilyId } });
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

  async setIsBanned(fosterFamilyId: FosterFamily["id"], isBanned: boolean) {
    try {
      await prisma.fosterFamily.update({
        where: { id: fosterFamilyId },
        data: {
          isBanned,

          ...(isBanned
            ? {
                availability: FosterFamilyAvailability.Enum.UNAVAILABLE,
                availabilityExpirationDate: null,
              }
            : undefined),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw new NotFoundError();
        }
      }

      throw error;
    }
  }

  async update(id: FosterFamily["id"], data: FosterFamilyData) {
    await prisma.$transaction(async (prisma) => {
      const fosterFamily = await prisma.fosterFamily.findUnique({
        where: { id },
        select: { speciesToHost: true },
      });

      if (fosterFamily == null) {
        throw new NotFoundError();
      }

      this.validate(data, fosterFamily);
      this.normalize(data);

      try {
        await prisma.fosterFamily.update({ where: { id }, data });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
            throw new EmailAlreadyUsedError();
          }
        }

        throw error;
      }
    });
  }

  async create(data: FosterFamilyData) {
    return await prisma.$transaction(async (prisma) => {
      this.validate(data);
      this.normalize(data);

      try {
        const fosterFamily = await prisma.fosterFamily.create({
          data,
          select: { id: true },
        });

        return fosterFamily.id;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
            throw new EmailAlreadyUsedError();
          }
        }

        throw error;
      }
    });
  }

  async createFindManyParams(
    searchParams: SearchParamsIO.Infer<typeof FosterFamilySearchParams>,
  ) {
    const where: Prisma.FosterFamilyWhereInput[] = [];

    if (searchParams.zipCode != null) {
      where.push({ zipCode: { startsWith: searchParams.zipCode } });
    }

    if (searchParams.cities.size > 0) {
      where.push({
        city: {
          in: Array.from(searchParams.cities),
          mode: "insensitive",
        },
      });
    }

    if (searchParams.displayName != null) {
      const hits = await this.getHits(searchParams.displayName);

      where.push({ id: { in: hits.map((hit) => hit.id) } });
    }

    if (searchParams.availability.size > 0) {
      where.push({
        availability: { in: Array.from(searchParams.availability) },
      });
    }

    if (searchParams.garden.size > 0) {
      where.push({ garden: { in: Array.from(searchParams.garden) } });
    }

    if (searchParams.housing.size > 0) {
      where.push({
        housing: { in: Array.from(searchParams.housing) },
      });
    }

    if (searchParams.speciesToHost != null) {
      where.push({
        speciesToHost: { has: searchParams.speciesToHost },
      });
    }

    searchParams.speciesAlreadyPresent.forEach((species) => {
      where.push({
        OR: [
          { speciesAlreadyPresent: { has: species } },
          { fosterAnimals: { some: { species } } },
        ],
      });
    });

    if (searchParams.speciesToAvoid.size > 0) {
      where.push({
        NOT: {
          speciesAlreadyPresent: {
            hasSome: Array.from(searchParams.speciesToAvoid),
          },
        },
        fosterAnimals: {
          none: {
            species: { in: Array.from(searchParams.speciesToAvoid) },
          },
        },
      });
    }

    return {
      orderBy: { displayName: "asc" },
      where: { AND: where },
    } satisfies Prisma.FosterFamilyFindManyArgs;
  }

  private async getHits(
    displayName: string,
  ): Promise<{ id: string; matchRank: number }[]> {
    return await prisma.$queryRaw`
      WITH
        ranked_foster_families AS (
          SELECT
            id,
            match_sorter_rank (ARRAY["displayName"], ${displayName}) AS "matchRank"
          FROM
            "FosterFamily"
        )
      SELECT
        *
      FROM
        ranked_foster_families
      WHERE
        "matchRank" < 6.7
      ORDER BY
        "matchRank" ASC
    `;
  }

  private validate(
    newData: FosterFamilyData,
    currentData?: null | Pick<FosterFamily, "speciesToHost">,
  ) {
    if (newData.speciesToHost.length === 0) {
      // Allow old foster family (without species to host) to be updated without
      // setting them. But we can't unset them.
      if (currentData == null || currentData.speciesToHost.length > 0) {
        throw new MissingSpeciesToHostError();
      }
    }

    if (
      newData.availability !== FosterFamilyAvailability.Enum.UNKNOWN &&
      newData.availabilityExpirationDate != null
    ) {
      if (
        DateTime.fromJSDate(newData.availabilityExpirationDate) <
        DateTime.now().startOf("day")
      ) {
        throw new InvalidAvailabilityDateError();
      }
    }
  }

  private normalize(data: FosterFamilyData) {
    if (data.availability === FosterFamilyAvailability.Enum.UNKNOWN) {
      data.availabilityExpirationDate = null;
    }
  }
}

type FosterFamilyData = Pick<
  FosterFamily,
  | "address"
  | "availability"
  | "availabilityExpirationDate"
  | "city"
  | "comments"
  | "displayName"
  | "garden"
  | "housing"
  | "email"
  | "phone"
  | "speciesAlreadyPresent"
  | "speciesToHost"
  | "zipCode"
>;
