import { ActivityAction } from "#activity/action.js";
import { Activity } from "#activity/db.server.js";
import { ActivityResource } from "#activity/resource.js";
import { getAllAnimalPictures } from "#animals/pictures/all-pictures";
import type { AnimalPictures } from "#animals/pictures/db.server";
import { AnimalPictureDbDelegate } from "#animals/pictures/db.server";
import { AnimalProfileDbDelegate } from "#animals/profile/db.server";
import type { AnimalSearchParams } from "#animals/search-params";
import {
  AnimalIdentification,
  AnimalSort,
  AnimalSterilization,
  AnimalVaccination,
} from "#animals/search-params";
import { AnimalSituationDbDelegate } from "#animals/situation/db.server";
import { SORTED_SPECIES } from "#animals/species";
import { deleteImage } from "#core/cloudinary.server";
import { NotFoundError, PrismaErrorCodes } from "#core/errors.server";
import { orderByRank } from "#core/order-by-rank";
import { prisma } from "#core/prisma.server";
import { ANIMAL_AGE_RANGE_BY_SPECIES } from "@animeaux/core";
import type { Animal, AnimalDraft } from "@animeaux/prisma/server";
import { Prisma, Species, Status } from "@animeaux/prisma/server";
import type { SearchParamsIO } from "@animeaux/search-params-io";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";

export class AnimalDbDelegate {
  readonly picture = new AnimalPictureDbDelegate();
  readonly profile = new AnimalProfileDbDelegate();
  readonly situation = new AnimalSituationDbDelegate();

  async create(
    draft: null | AnimalDraft,
    pictures: AnimalPictures,
    currentUser: { id: string },
  ) {
    const animal = await prisma.$transaction(async (prisma) => {
      if (
        !this.profile.draftHasProfile(draft) ||
        !this.situation.draftHasSituation(draft)
      ) {
        throw new StepNotValidError();
      }

      await this.profile.validate(prisma, draft);
      await this.situation.validate(prisma, draft);
      this.situation.normalize(draft);

      const { ownerId, createdAt, updatedAt, ...data } = draft;

      const animal = await prisma.animal.create({
        data: { ...data, ...pictures },
      });

      await prisma.animalDraft.delete({ where: { ownerId } });

      return animal;
    });

    await Activity.create({
      currentUser,
      action: ActivityAction.Enum.CREATE,
      resource: ActivityResource.Enum.ANIMAL,
      resourceId: animal.id,
      after: animal,
    });

    return animal.id;
  }

  async delete(animalId: Animal["id"], currentUser: { id: string }) {
    try {
      const animal = await prisma.animal.delete({
        where: { id: animalId },
      });

      await Promise.allSettled(getAllAnimalPictures(animal).map(deleteImage));

      await Activity.create({
        currentUser,
        action: ActivityAction.Enum.DELETE,
        resource: ActivityResource.Enum.ANIMAL,
        resourceId: animalId,
        before: animal,
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

  async fuzzySearch<T extends Prisma.AnimalSelect>(
    nameOrAlias: undefined | string,
    {
      select,
      where,
      take,
    }: {
      select: T;
      where?: Prisma.AnimalWhereInput;
      take?: number;
    },
  ) {
    // Ensure we only use our selected properties.
    const internalSelect = { id: true } satisfies Prisma.AnimalSelect;

    if (nameOrAlias == null) {
      return await prisma.animal.findMany({
        where,
        select: { ...select, ...internalSelect },
        orderBy: [{ name: "asc" }, { alias: "asc" }, { pickUpDate: "desc" }],
        take,
      });
    }

    const hits = await this.getHits(nameOrAlias);

    const animals = (await prisma.animal.findMany({
      where: { ...where, id: { in: hits.map((hit) => hit.id) } },
      select: { ...select, ...internalSelect },
    })) as Prisma.AnimalGetPayload<{ select: typeof internalSelect }>[];

    return orderByRank(animals, hits, { take }) as Prisma.AnimalGetPayload<{
      select: typeof select & typeof internalSelect;
    }>[];
  }

  private async getHits(
    nameOrAlias: string,
  ): Promise<{ id: string; matchRank: number }[]> {
    return await prisma.$queryRaw`
      WITH
        ranked_animals AS (
          SELECT
            id,
            match_sorter_rank (ARRAY[name, alias], ${nameOrAlias}) AS "matchRank"
          FROM
            "Animal"
        )
      SELECT
        *
      FROM
        ranked_animals
      WHERE
        "matchRank" < 6.7
      ORDER BY
        "matchRank" ASC
    `;
  }

  async createFindManyParams(
    searchParams: SearchParamsIO.Infer<typeof AnimalSearchParams>,
    sort: AnimalSort,
  ) {
    const where: Prisma.AnimalWhereInput[] = [];

    if (searchParams.species.size > 0) {
      where.push({ species: { in: Array.from(searchParams.species) } });
    }

    if (searchParams.ages.size > 0) {
      const now = DateTime.now();

      const conditions: Prisma.AnimalWhereInput[] = [];
      SORTED_SPECIES.forEach((species) => {
        searchParams.ages.forEach((age) => {
          const ageRange = ANIMAL_AGE_RANGE_BY_SPECIES[species]?.[age];
          if (ageRange != null) {
            conditions.push({
              species,
              birthdate: {
                gt: now.minus({ months: ageRange.maxMonths }).toJSDate(),
                lte: now.minus({ months: ageRange.minMonths }).toJSDate(),
              },
            });
          }
        });
      });

      where.push({ OR: conditions });
    }

    if (
      searchParams.birthdateStart != null ||
      searchParams.birthdateEnd != null
    ) {
      const birthdate: Prisma.DateTimeFilter = {};

      if (searchParams.birthdateStart != null) {
        birthdate.gte = searchParams.birthdateStart;
      }

      if (searchParams.birthdateEnd != null) {
        birthdate.lte = searchParams.birthdateEnd;
      }

      where.push({ birthdate });
    }

    if (searchParams.statuses.size > 0) {
      where.push({ status: { in: Array.from(searchParams.statuses) } });
    }

    if (searchParams.managersId.size > 0) {
      where.push({
        managerId: { in: Array.from(searchParams.managersId) },
      });
    }

    if (searchParams.fosterFamiliesId.size > 0) {
      where.push({
        fosterFamilyId: {
          in: Array.from(searchParams.fosterFamiliesId),
        },
      });
    }

    if (
      searchParams.pickUpDateStart != null ||
      searchParams.pickUpDateEnd != null
    ) {
      const pickUpDate: Prisma.DateTimeFilter = {};

      if (searchParams.pickUpDateStart != null) {
        pickUpDate.gte = searchParams.pickUpDateStart;
      }

      if (searchParams.pickUpDateEnd != null) {
        pickUpDate.lte = searchParams.pickUpDateEnd;
      }

      where.push({ pickUpDate });
    }

    if (searchParams.pickUpLocations.size > 0) {
      where.push({
        pickUpLocation: {
          in: Array.from(searchParams.pickUpLocations),
          mode: "insensitive",
        },
      });
    }

    if (searchParams.pickUpReasons.size > 0) {
      where.push({
        pickUpReason: { in: Array.from(searchParams.pickUpReasons) },
      });
    }

    if (searchParams.nameOrAlias != null) {
      const hits = await this.getHits(searchParams.nameOrAlias);

      where.push({ id: { in: hits.map((hit) => hit.id) } });
    }

    if (searchParams.identification.size > 0) {
      where.push({
        OR: Array.from(searchParams.identification).map(
          (identification) => ANIMAL_IDENTIFICATION_WHERE[identification],
        ),
      });
    }

    if (searchParams.iCadNumber != null) {
      where.push({
        iCadNumber: { contains: searchParams.iCadNumber, mode: "insensitive" },
      });
    }

    if (searchParams.adoptionOptions.size > 0) {
      where.push({
        status: { in: [Status.ADOPTED] },
        adoptionOption: {
          in: Array.from(searchParams.adoptionOptions),
        },
      });
    }

    if (
      searchParams.adoptionDateStart != null ||
      searchParams.adoptionDateEnd != null
    ) {
      const adoptionDate: Prisma.DateTimeFilter = {};

      if (searchParams.adoptionDateStart != null) {
        adoptionDate.gte = searchParams.adoptionDateStart;
      }

      if (searchParams.adoptionDateEnd != null) {
        adoptionDate.lte = searchParams.adoptionDateEnd;
      }

      where.push({
        status: { in: [Status.ADOPTED] },
        adoptionDate,
      });
    }

    if (searchParams.fivResults.size > 0) {
      where.push({
        species: Species.CAT,
        screeningFiv: { in: Array.from(searchParams.fivResults) },
      });
    }

    if (searchParams.felvResults.size > 0) {
      where.push({
        species: Species.CAT,
        screeningFelv: { in: Array.from(searchParams.felvResults) },
      });
    }

    if (searchParams.diagnosis.size > 0) {
      where.push({
        species: Species.DOG,
        diagnosis: { in: Array.from(searchParams.diagnosis) },
      });
    }

    if (searchParams.genders.size > 0) {
      where.push({ gender: { in: Array.from(searchParams.genders) } });
    }

    if (searchParams.sterilizations.size > 0) {
      where.push({
        OR: Array.from(searchParams.sterilizations).map(
          (sterilization) => ANIMAL_STERILIZATION_WHERE[sterilization],
        ),
      });
    }

    if (searchParams.vaccinations.size > 0) {
      where.push({
        OR: Array.from(searchParams.vaccinations).map(
          (vaccination) => ANIMAL_VACCINATION_WHERE[vaccination],
        ),
      });
    }

    if (
      searchParams.nextVaccinationDateStart != null ||
      searchParams.nextVaccinationDateEnd != null
    ) {
      const nextVaccinationDate: Prisma.DateTimeFilter = {};

      if (searchParams.nextVaccinationDateStart != null) {
        nextVaccinationDate.gte = searchParams.nextVaccinationDateStart;
      }

      if (searchParams.nextVaccinationDateEnd != null) {
        nextVaccinationDate.lte = searchParams.nextVaccinationDateEnd;
      }

      where.push({ nextVaccinationDate });
    }

    const orderBy = ANIMAL_ORDER_BY[sort];

    return {
      orderBy,
      where: { AND: where },
    } satisfies Prisma.AnimalFindManyArgs;
  }
}

export class PickUpLocationDbDelegate {
  async fuzzySearch(
    name: undefined | string,
    { take }: { take?: number } = {},
  ) {
    // When there are no text search, return hits ordered by usage count.
    if (name == null) {
      const groups = await prisma.animal.groupBy({
        by: "pickUpLocation",
        where: { pickUpLocation: { not: null } },
        _count: { pickUpLocation: true },
        orderBy: { _count: { pickUpLocation: "desc" } },
        take,
      });

      return groups.map((group) => {
        invariant(
          group.pickUpLocation != null,
          "pickUpLocation should be defined",
        );

        return { name: group.pickUpLocation };
      });
    }

    let hits = await this.getHits(name);

    if (take != null) {
      hits = hits.slice(0, take);
    }

    return hits.map((hit) => {
      invariant(hit.name != null, "name should be defined");

      return { name: hit.name };
    });
  }

  private async getHits(
    name: string,
  ): Promise<{ name: string; matchRank: number }[]> {
    return await prisma.$queryRaw`
      WITH
        ranked_locations AS (
          WITH
            locations AS (
              SELECT
                "pickUpLocation" as name
              FROM
                "Animal"
              WHERE
                "pickUpLocation" IS NOT NULL
              GROUP BY
                "pickUpLocation"
            )
          SELECT
            name,
            match_sorter_rank (ARRAY[name], ${name}) AS "matchRank"
          FROM
            locations
        )
      SELECT
        *
      FROM
        ranked_locations
      WHERE
        "matchRank" < 6.7
      ORDER BY
        "matchRank" ASC
    `;
  }
}

class StepNotValidError extends Error {}

const ANIMAL_ORDER_BY: Record<
  AnimalSort,
  Prisma.AnimalFindManyArgs["orderBy"]
> = {
  [AnimalSort.BIRTHDATE]: { birthdate: "desc" },
  [AnimalSort.NAME]: { name: "asc" },
  [AnimalSort.PICK_UP]: { pickUpDate: "desc" },
  [AnimalSort.VACCINATION]: { nextVaccinationDate: "asc" },
};

const ANIMAL_STERILIZATION_WHERE: Record<
  AnimalSterilization,
  Prisma.AnimalWhereInput
> = {
  [AnimalSterilization.NO]: {
    isSterilized: false,
    isSterilizationMandatory: true,
  },
  [AnimalSterilization.NOT_MANDATORY]: {
    isSterilized: false,
    isSterilizationMandatory: false,
  },
  [AnimalSterilization.YES]: {
    isSterilized: true,
    isSterilizationMandatory: true,
  },
};

const ANIMAL_VACCINATION_WHERE: Record<
  AnimalVaccination,
  Prisma.AnimalWhereInput
> = {
  [AnimalVaccination.NONE_PLANNED]: {
    isVaccinationMandatory: true,
    nextVaccinationDate: null,
  },
  [AnimalVaccination.NOT_MANDATORY]: {
    isVaccinationMandatory: false,
  },
};

const ANIMAL_IDENTIFICATION_WHERE: Record<
  AnimalIdentification,
  Prisma.AnimalWhereInput
> = {
  [AnimalIdentification.NO_ICAD_NUMBER]: {
    iCadNumber: null,
  },
};
