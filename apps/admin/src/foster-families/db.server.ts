import { ActivityAction } from "#activity/action.js";
import { Activity } from "#activity/db.server.js";
import { ActivityResource } from "#activity/resource.js";
import {
  EmailAlreadyUsedError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server";
import { orderByRank } from "#core/order-by-rank";
import { prisma } from "#core/prisma.server";
import type { FosterFamilySearchParams } from "#foster-families/search-params";
import type { SearchParamsIO } from "@animeaux/search-params-io";
import type {
  FosterFamily,
  FosterFamilyGarden,
  FosterFamilyHousing,
  Species,
} from "@prisma/client";
import { FosterFamilyAvailability, Prisma } from "@prisma/client";
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

  async delete(
    fosterFamilyId: FosterFamily["id"],
    currentUser: { id: string },
  ) {
    try {
      const fosterFamily = await prisma.fosterFamily.delete({
        where: { id: fosterFamilyId },
      });

      await Activity.create({
        currentUser,
        action: ActivityAction.Enum.DELETE,
        resource: ActivityResource.Enum.FOSTER_FAMILY,
        resourceId: fosterFamilyId,
        before: fosterFamily,
      });
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

  async update(
    id: FosterFamily["id"],
    data: DataUpdate,
    currentUser: { id: string },
  ) {
    await prisma.$transaction(async (prisma) => {
      const currentFosterFamily = await prisma.fosterFamily.findUnique({
        where: { id },
      });

      if (currentFosterFamily == null) {
        throw new NotFoundError();
      }

      this.#normalizeUpdate(data, currentFosterFamily);
      this.#validateUpdate(data, currentFosterFamily);

      try {
        const newFosterFamily = await prisma.fosterFamily.update({
          where: { id },
          data,
        });

        await Activity.create({
          currentUser,
          action: ActivityAction.Enum.UPDATE,
          resource: ActivityResource.Enum.FOSTER_FAMILY,
          resourceId: id,
          before: currentFosterFamily,
          after: newFosterFamily,
        });
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

  #normalizeUpdate(
    data: DataUpdate,
    currentData: Prisma.FosterFamilyGetPayload<{
      select: {
        availability: true;
        isBanned: true;
      };
    }>,
  ) {
    const isBanned = data.isBanned ?? currentData.isBanned;

    if (isBanned) {
      data.availability = FosterFamilyAvailability.UNAVAILABLE;
      data.availabilityExpirationDate = null;
    }

    const availability = data.availability ?? currentData.availability;

    if (availability === FosterFamilyAvailability.UNKNOWN) {
      data.availabilityExpirationDate = null;
    }
  }

  #validateUpdate(
    newData: DataUpdate,
    currentData: Prisma.FosterFamilyGetPayload<{
      select: {
        speciesToHost: true;
      };
    }>,
  ) {
    if (newData.speciesToHost != null && newData.speciesToHost.length === 0) {
      // Allow old foster families (without species to host) to be updated
      // without setting them. But we can't unset them.
      if (currentData.speciesToHost.length > 0) {
        throw new MissingSpeciesToHostError();
      }
    }

    if (newData.availabilityExpirationDate != null) {
      if (
        DateTime.fromJSDate(newData.availabilityExpirationDate) <
        DateTime.now().startOf("day")
      ) {
        throw new InvalidAvailabilityDateError();
      }
    }
  }

  async create(data: DataCreate, currentUser: { id: string }) {
    this.#normalizeCreate(data);
    this.#validateCreate(data);

    try {
      const fosterFamily = await prisma.fosterFamily.create({ data });

      await Activity.create({
        currentUser,
        action: ActivityAction.Enum.CREATE,
        resource: ActivityResource.Enum.FOSTER_FAMILY,
        resourceId: fosterFamily.id,
        after: fosterFamily,
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
  }

  #normalizeCreate(data: DataCreate) {
    if (data.availability === FosterFamilyAvailability.UNKNOWN) {
      data.availabilityExpirationDate = null;
    }
  }

  #validateCreate(data: DataCreate) {
    if (data.speciesToHost.length === 0) {
      throw new MissingSpeciesToHostError();
    }

    if (data.availabilityExpirationDate != null) {
      if (
        DateTime.fromJSDate(data.availabilityExpirationDate) <
        DateTime.now().startOf("day")
      ) {
        throw new InvalidAvailabilityDateError();
      }
    }
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
}

type DataCreate = {
  address: string;
  availability: FosterFamilyAvailability;
  availabilityExpirationDate: Date | null;
  city: string;
  comments: string | null;
  displayName: string;
  email: string;
  garden: FosterFamilyGarden;
  housing: FosterFamilyHousing;
  phone: string;
  speciesAlreadyPresent: Species[];
  speciesToHost: Species[];
  zipCode: string;
};

type DataUpdate = {
  address?: string;
  availability?: FosterFamilyAvailability;
  availabilityExpirationDate?: Date | null;
  city?: string;
  comments?: string | null;
  displayName?: string;
  email?: string;
  garden?: FosterFamilyGarden;
  housing?: FosterFamilyHousing;
  isBanned?: boolean;
  phone?: string;
  speciesAlreadyPresent?: Species[];
  speciesToHost?: Species[];
  zipCode?: string;
};
