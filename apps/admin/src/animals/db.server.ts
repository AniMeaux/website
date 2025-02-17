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
import { algolia } from "#core/algolia/algolia.server";
import { deleteImage } from "#core/cloudinary.server";
import { NotFoundError, PrismaErrorCodes } from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import { ANIMAL_AGE_RANGE_BY_SPECIES } from "@animeaux/core";
import type { SearchParamsIO } from "@animeaux/search-params-io";
import type { Animal, AnimalDraft } from "@prisma/client";
import { Prisma, Species, Status } from "@prisma/client";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";

export class AnimalDbDelegate {
  readonly picture = new AnimalPictureDbDelegate();
  readonly profile = new AnimalProfileDbDelegate();
  readonly situation = new AnimalSituationDbDelegate();

  async create(draft: null | AnimalDraft, pictures: AnimalPictures) {
    return await prisma.$transaction(async (prisma) => {
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
        select: { id: true },
      });

      await prisma.animalDraft.delete({ where: { ownerId } });
      await algolia.animal.create({ ...data, id: animal.id });

      return animal.id;
    });
  }

  async delete(animalId: Animal["id"]) {
    await prisma.$transaction(async (prisma) => {
      try {
        const animal = await prisma.animal.delete({
          where: { id: animalId },
          select: { avatar: true, pictures: true },
        });

        await Promise.allSettled(getAllAnimalPictures(animal).map(deleteImage));
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.NOT_FOUND) {
            throw new NotFoundError();
          }
        }

        throw error;
      }

      await algolia.animal.delete(animalId);
    });
  }

  async fuzzySearch({
    nameOrAlias,
    maxHitCount,
  }: {
    nameOrAlias: string;
    maxHitCount: number;
  }) {
    const hits = await algolia.animal.findMany({
      where: { nameOrAlias },
      hitsPerPage: maxHitCount,
    });

    const animals = await prisma.animal.findMany({
      where: { id: { in: hits.map((hit) => hit.id) } },
      select: {
        avatar: true,
        breed: { select: { name: true } },
        color: { select: { name: true } },
        id: true,
      },
    });

    return hits.map((hit) => {
      const animal = animals.find((animal) => animal.id === hit.id);
      invariant(animal != null, "Animal from algolia should exists.");
      return { ...hit, ...animal };
    });
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
      const animals = await algolia.animal.findMany({
        where: {
          nameOrAlias: searchParams.nameOrAlias,
          pickUpDate: {
            gte: searchParams.pickUpDateStart,
            lte: searchParams.pickUpDateEnd,
          },
          pickUpLocation: searchParams.pickUpLocations,
          species: searchParams.species,
          status: searchParams.statuses,
        },
      });

      where.push({ id: { in: animals.map((animal) => animal.id) } });
    }

    if (searchParams.identification.size > 0) {
      where.push({
        OR: Array.from(searchParams.identification).map(
          (identification) => ANIMAL_IDENTIFICATION_WHERE[identification],
        ),
      });
    }

    if (searchParams.iCadNumber != null) {
      where.push({ iCadNumber: { equals: searchParams.iCadNumber } });
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
  async fuzzySearch({
    text = "",
    maxHitCount,
  }: {
    text?: string;
    maxHitCount: number;
  }) {
    return await algolia.pickUpLocation.findMany({
      where: { value: text },
      maxFacetHits: maxHitCount,
    });
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
