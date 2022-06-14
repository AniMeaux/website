import {
  AdoptionOption,
  Animal,
  AnimalActiveBrief,
  AnimalAge,
  AnimalGender,
  AnimalOperations,
  AnimalSearchHit,
  AnimalSpecies,
  ANIMAL_AGE_RANGE_BY_SPECIES,
  hasGroups,
  LocationSearchHit,
  ManagerSearchHit,
  PickUpReason,
  PublicAnimalSearchHit,
  Trilean,
} from "@animeaux/shared";
import { Prisma, Status, UserGroup } from "@prisma/client";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";
import { array, boolean, mixed, number, object, string } from "yup";
import { createSearchFilters, DEFAULT_SEARCH_OPTIONS } from "../core/algolia";
import { assertUserHasGroups, getCurrentUser } from "../core/authentication";
import { prisma } from "../core/db";
import { OperationError, OperationsImpl } from "../core/operations";
import { booleanToTrilean, trileanToBoolean } from "../core/trilean";
import { validateParams } from "../core/validation";
import {
  ACTIVE_ANIMAL_STATUS,
  ADOPTABLE_ANIMAL_STATUS,
  AnimalFromAlgolia,
  AnimalIndex,
  getDisplayName,
  NON_ACTIVE_ANIMAL_STATUS,
  SAVED_ANIMAL_STATUS,
} from "../entities/animal.entity";
import {
  getFormattedAddress,
  getShortLocation,
} from "../entities/fosterFamily.entity";
import { UserFromAlgolia, UserIndex } from "../entities/user.entity";

// Multiple of 2 and 3 to be nicely displayed.
const ANIMAL_COUNT_PER_PAGE = 18;

const animalWithIncludes = Prisma.validator<Prisma.AnimalArgs>()({
  include: {
    breed: true,
    color: true,
    manager: true,
    fosterFamily: true,
  },
});

export const animalOperations: OperationsImpl<AnimalOperations> = {
  async getAllActiveAnimals(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
    ]);

    const params = validateParams<"getAllActiveAnimals">(
      object({ onlyManagedByCurrentUser: boolean() }),
      rawParams
    );

    const where: Prisma.AnimalWhereInput = {
      status: { in: ACTIVE_ANIMAL_STATUS },
    };

    if (params.onlyManagedByCurrentUser) {
      if (!hasGroups(currentUser, [UserGroup.ANIMAL_MANAGER])) {
        throw new OperationError(400);
      }

      where.managerId = currentUser.id;
    }

    const animals = await prisma.animal.findMany({
      where,
      orderBy: { name: "asc" },
      select: {
        id: true,
        avatar: true,
        name: true,
        alias: true,
        status: true,
        manager: true,
      },
    });

    return animals.map<AnimalActiveBrief>((animal) => ({
      id: animal.id,
      avatarId: animal.avatar,
      displayName: getDisplayName(animal),
      status: animal.status,
      managerName: animal.manager?.displayName,
    }));
  },

  async getAllSavedAnimals(rawParams) {
    const params = validateParams<"getAllSavedAnimals">(
      object({ page: number().min(0) }),
      rawParams
    );

    const page = params.page ?? 0;

    const where: Prisma.AnimalWhereInput = {
      status: { in: SAVED_ANIMAL_STATUS },
    };

    const [count, animals] = await Promise.all([
      prisma.animal.count({ where }),
      prisma.animal.findMany({
        where,
        skip: page * ANIMAL_COUNT_PER_PAGE,
        take: ANIMAL_COUNT_PER_PAGE,
        orderBy: { pickUpDate: "desc" },
        select: {
          id: true,
          name: true,
          avatar: true,
          birthdate: true,
          gender: true,
          breed: { select: { name: true } },
          color: { select: { name: true } },
        },
      }),
    ]);

    return {
      hitsTotalCount: count,
      page,
      pageCount: Math.ceil(count / ANIMAL_COUNT_PER_PAGE),
      hits: animals.map<PublicAnimalSearchHit>((animal) => ({
        id: animal.id,
        displayName: animal.name,
        avatarId: animal.avatar,
        birthdate: DateTime.fromJSDate(animal.birthdate).toISO(),
        gender: animal.gender,
        breedName: animal.breed?.name,
        colorName: animal.color?.name,
      })),
    };
  },

  async getAllAdoptableAnimals(rawParams) {
    const params = validateParams<"getAllAdoptableAnimals">(
      object({
        page: number().min(0),
        species: mixed().oneOf([...Object.values(AnimalSpecies), null]),
        age: mixed().oneOf([...Object.values(AnimalAge), null]),
      }),
      rawParams
    );

    const page = params.page ?? 0;

    const where: Prisma.AnimalWhereInput = {
      status: { in: ADOPTABLE_ANIMAL_STATUS },
      species: params.species,
      birthdate: getAgeRangeSearchFilter(params.species, params.age),
    };

    const [count, animals] = await Promise.all([
      prisma.animal.count({ where }),
      prisma.animal.findMany({
        where,
        skip: page * ANIMAL_COUNT_PER_PAGE,
        take: ANIMAL_COUNT_PER_PAGE,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          avatar: true,
          birthdate: true,
          gender: true,
          breed: { select: { name: true } },
          color: { select: { name: true } },
        },
      }),
    ]);

    return {
      hitsTotalCount: count,
      page,
      pageCount: Math.ceil(count / ANIMAL_COUNT_PER_PAGE),
      hits: animals.map<PublicAnimalSearchHit>((animal) => ({
        id: animal.id,
        displayName: animal.name,
        avatarId: animal.avatar,
        birthdate: DateTime.fromJSDate(animal.birthdate).toISO(),
        gender: animal.gender,
        breedName: animal.breed?.name,
        colorName: animal.color?.name,
      })),
    };
  },

  async searchAnimals(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
    ]);

    const params = validateParams<"searchAnimals">(
      object({
        search: string().strict(true).defined(),
        page: number().min(0),
        species: array().of(
          mixed().oneOf(Object.values(AnimalSpecies)).required()
        ),
        status: array().of(mixed().oneOf(Object.values(Status)).required()),
      }),
      rawParams
    );

    const page = params.page ?? 0;

    const response = await AnimalIndex.search<AnimalFromAlgolia>(
      params.search,
      {
        ...DEFAULT_SEARCH_OPTIONS,
        attributesToRetrieve: [],
        page,
        hitsPerPage: ANIMAL_COUNT_PER_PAGE,
        filters: createSearchFilters({
          species: params.species,
          status: params.status,
        }),
      }
    );

    const ids = response.hits.map((hit) => hit.objectID);
    const animals = await prisma.animal.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        alias: true,
        avatar: true,
        status: true,
      },
    });

    return {
      hitsTotalCount: response.nbHits,
      page,
      pageCount: response.nbPages,
      // Map on algolia's response to preserve search order.
      hits: response.hits.map<AnimalSearchHit>((hit) => {
        const animal = animals.find((animal) => animal.id === hit.objectID);
        invariant(animal != null, "Animal not found");

        return {
          id: animal.id,
          displayName: getDisplayName(animal),
          highlightedDisplayName: getDisplayName({
            name: hit._highlightResult?.name?.value ?? animal.name,
            alias: hit._highlightResult?.alias?.value ?? animal.alias,
          }),
          avatarId: animal.avatar,
          status: animal.status,
        };
      }),
    };
  },

  async getAnimal(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
    ]);

    const params = validateParams<"getAnimal">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const animal = await prisma.animal.findUnique({
      ...animalWithIncludes,
      where: { id: params.id },
    });

    if (animal == null) {
      throw new OperationError(404);
    }

    return mapToAnimal(animal);
  },

  async getAdoptableAnimal(rawParams) {
    const params = validateParams<"getAdoptableAnimal">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const animal = await prisma.animal.findUnique({
      where: { id: params.id },
      include: {
        breed: { select: { name: true } },
        color: { select: { name: true } },
        fosterFamily: { select: { city: true, zipCode: true } },
      },
    });

    if (animal == null) {
      throw new OperationError(404);
    }

    return {
      id: animal.id,
      avatarId: animal.avatar,
      birthdate: DateTime.fromJSDate(animal.birthdate).toISO(),
      displayName: animal.name,
      gender: animal.gender,
      isOkCats: booleanToTrilean(animal.isOkCats),
      isOkChildren: booleanToTrilean(animal.isOkChildren),
      isOkDogs: booleanToTrilean(animal.isOkDogs),
      isSterilized: animal.isSterilized,
      picturesId: animal.pictures,
      species: animal.species,
      breedName: animal.breed?.name ?? undefined,
      colorName: animal.color?.name ?? undefined,
      description: animal.description || undefined,
      location:
        animal.fosterFamily == null
          ? undefined
          : getShortLocation(animal.fosterFamily),
    };
  },

  async createAnimal(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"createAnimal">(
      object({
        officialName: string().trim().required(),
        commonName: string().trim().nullable().defined(),
        birthdate: string().dateISO().required(),
        gender: mixed().oneOf(Object.values(AnimalGender)).required(),
        species: mixed().oneOf(Object.values(AnimalSpecies)).required(),
        breedId: string().uuid().nullable().defined(),
        colorId: string().uuid().nullable().defined(),
        description: string().trim().nullable().defined(),
        iCadNumber: string().trim().nullable().defined(),
        status: mixed().oneOf(Object.values(Status)).required(),
        managerId: string().uuid().required(),
        adoptionDate: string().dateISO().nullable().defined(),
        adoptionOption: mixed()
          .oneOf([...Object.values(AdoptionOption), null])
          .defined(),
        pickUpDate: string().dateISO().required(),
        pickUpLocation: string().trim().nullable().defined(),
        pickUpReason: mixed().oneOf(Object.values(PickUpReason)).required(),
        fosterFamilyId: string().uuid().nullable().defined(),
        isOkChildren: mixed().oneOf(Object.values(Trilean)).required(),
        isOkDogs: mixed().oneOf(Object.values(Trilean)).required(),
        isOkCats: mixed().oneOf(Object.values(Trilean)).required(),
        isSterilized: boolean().required(),
        comments: string().trim().nullable().defined(),
        avatarId: string().required(),
        picturesId: array().of(string().required()).required(),
      }),
      rawParams
    );

    if (params.breedId != null) {
      const breed = await prisma.breed.findUnique({
        where: { id: params.breedId },
        select: { species: true },
      });

      if (breed == null || breed.species !== params.species) {
        throw new OperationError(400);
      }
    }

    if (params.status === Status.ADOPTED && params.adoptionDate == null) {
      throw new OperationError(400);
    }

    const animal = await prisma.animal.create({
      ...animalWithIncludes,
      data: {
        name: params.officialName,
        alias: params.commonName,
        birthdate: params.birthdate,
        gender: params.gender,
        species: params.species,
        breedId: params.breedId,
        colorId: params.colorId,
        description: params.description,
        iCadNumber: params.iCadNumber,
        status: params.status,
        managerId: params.managerId,
        adoptionDate:
          params.status === Status.ADOPTED ? params.adoptionDate : null,
        adoptionOption:
          params.status === Status.ADOPTED ? params.adoptionOption : null,
        pickUpDate: params.pickUpDate,
        pickUpLocation: params.pickUpLocation,
        pickUpReason: params.pickUpReason,
        fosterFamilyId: NON_ACTIVE_ANIMAL_STATUS.includes(params.status)
          ? null
          : params.fosterFamilyId,
        isOkChildren: trileanToBoolean(params.isOkChildren),
        isOkDogs: trileanToBoolean(params.isOkDogs),
        isOkCats: trileanToBoolean(params.isOkCats),
        isSterilized: params.isSterilized,
        comments: params.comments,
        avatar: params.avatarId,
        pictures: params.picturesId,
      },
    });

    const animalFromAlgolia: AnimalFromAlgolia = {
      name: animal.name,
      alias: animal.alias,
      species: animal.species,
      status: animal.status,
      pickUpLocation: animal.pickUpLocation,
    };

    await AnimalIndex.saveObject({ ...animalFromAlgolia, objectID: animal.id });

    return mapToAnimal(animal);
  },

  async updateAnimalProfile(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"updateAnimalProfile">(
      object({
        id: string().uuid().required(),
        officialName: string().trim().required(),
        commonName: string().trim().nullable().defined(),
        birthdate: string().dateISO().required(),
        gender: mixed().oneOf(Object.values(AnimalGender)).required(),
        species: mixed().oneOf(Object.values(AnimalSpecies)).required(),
        breedId: string().uuid().nullable().defined(),
        colorId: string().uuid().nullable().defined(),
        description: string().trim().nullable().defined(),
        iCadNumber: string().trim().nullable().defined(),
      }),
      rawParams
    );

    if (params.breedId != null) {
      const breed = await prisma.breed.findUnique({
        where: { id: params.breedId },
        select: { species: true },
      });

      if (breed == null || breed.species !== params.species) {
        throw new OperationError(400);
      }
    }

    try {
      const animal = await prisma.animal.update({
        ...animalWithIncludes,
        where: { id: params.id },
        data: {
          name: params.officialName,
          alias: params.commonName,
          birthdate: params.birthdate,
          gender: params.gender,
          species: params.species,
          breedId: params.breedId,
          colorId: params.colorId,
          description: params.description,
          iCadNumber: params.iCadNumber,
        },
      });

      const animalFromAlgolia: Partial<AnimalFromAlgolia> = {
        name: animal.name,
        alias: animal.alias,
        species: animal.species,
      };

      await AnimalIndex.partialUpdateObject({
        ...animalFromAlgolia,
        objectID: params.id,
      });

      return mapToAnimal(animal);
    } catch (error) {
      // Not found.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new OperationError(404);
      }

      throw error;
    }
  },

  async updateAnimalSituation(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"updateAnimalSituation">(
      object({
        id: string().uuid().required(),
        status: mixed().oneOf(Object.values(Status)).required(),
        managerId: string().required(),
        adoptionDate: string().dateISO().nullable().defined(),
        adoptionOption: mixed()
          .oneOf([...Object.values(AdoptionOption), null])
          .defined(),
        pickUpDate: string().dateISO().required(),
        pickUpLocation: string().trim().nullable().defined(),
        pickUpReason: mixed().oneOf(Object.values(PickUpReason)).required(),
        fosterFamilyId: string().uuid().nullable().defined(),
        isOkChildren: mixed().oneOf(Object.values(Trilean)).required(),
        isOkDogs: mixed().oneOf(Object.values(Trilean)).required(),
        isOkCats: mixed().oneOf(Object.values(Trilean)).required(),
        isSterilized: boolean().required(),
        comments: string().trim().nullable().defined(),
      }),
      rawParams
    );

    if (params.status === Status.ADOPTED && params.adoptionDate == null) {
      throw new OperationError(400);
    }

    try {
      const animal = await prisma.animal.update({
        ...animalWithIncludes,
        where: { id: params.id },
        data: {
          status: params.status,
          managerId: params.managerId,
          adoptionDate:
            params.status === Status.ADOPTED ? params.adoptionDate : null,
          adoptionOption:
            params.status === Status.ADOPTED ? params.adoptionOption : null,
          pickUpDate: params.pickUpDate,
          pickUpLocation: params.pickUpLocation,
          pickUpReason: params.pickUpReason,
          fosterFamilyId: NON_ACTIVE_ANIMAL_STATUS.includes(params.status)
            ? null
            : params.fosterFamilyId,
          isOkChildren: trileanToBoolean(params.isOkChildren),
          isOkDogs: trileanToBoolean(params.isOkDogs),
          isOkCats: trileanToBoolean(params.isOkCats),
          isSterilized: params.isSterilized,
          comments: params.comments,
        },
      });

      const animalFromAlgolia: Partial<AnimalFromAlgolia> = {
        status: animal.status,
        pickUpLocation: animal.pickUpLocation,
      };

      await AnimalIndex.partialUpdateObject({
        ...animalFromAlgolia,
        objectID: params.id,
      });

      return mapToAnimal(animal);
    } catch (error) {
      // Not found.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new OperationError(404);
      }

      throw error;
    }
  },

  async updateAnimalPictures(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"updateAnimalPictures">(
      object({
        id: string().uuid().required(),
        avatarId: string().required(),
        picturesId: array().of(string().required()).required(),
      }),
      rawParams
    );

    try {
      const animal = await prisma.animal.update({
        ...animalWithIncludes,
        where: { id: params.id },
        data: {
          avatar: params.avatarId,
          pictures: params.picturesId,
        },
      });

      return mapToAnimal(animal);
    } catch (error) {
      // Not found.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new OperationError(404);
      }

      throw error;
    }
  },

  async deleteAnimal(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"deleteAnimal">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    try {
      await prisma.animal.delete({ where: { id: params.id } });
    } catch (error) {
      // Not found.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new OperationError(404);
      }

      throw error;
    }

    await AnimalIndex.deleteObject(params.id);

    return true;
  },

  async searchLocation(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"searchLocation">(
      object({ search: string().strict(true).defined() }),
      rawParams
    );

    const result = await AnimalIndex.searchForFacetValues(
      "pickUpLocation",
      params.search ?? "",
      DEFAULT_SEARCH_OPTIONS
    );

    return result.facetHits.map<LocationSearchHit>((hit) => ({
      value: hit.value,
      highlightedValue: hit.highlighted,
    }));
  },

  async searchManager(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"searchManager">(
      object({ search: string().strict(true).defined() }),
      rawParams
    );

    const result = await UserIndex.search<UserFromAlgolia>(params.search, {
      ...DEFAULT_SEARCH_OPTIONS,
      filters: createSearchFilters({
        disabled: false,
        groups: UserGroup.ANIMAL_MANAGER,
      }),
    });

    return result.hits.map<ManagerSearchHit>((hit) => ({
      id: hit.objectID,
      email: hit.email,
      highlightedEmail: hit._highlightResult?.email?.value ?? hit.email,
      displayName: hit.displayName,
      highlightedDisplayName:
        hit._highlightResult?.displayName?.value ?? hit.displayName,
    }));
  },
};

function mapToAnimal(
  animal: Prisma.AnimalGetPayload<typeof animalWithIncludes>
): Animal {
  return {
    id: animal.id,
    officialName: animal.name,
    commonName: animal.alias || undefined,
    displayName: getDisplayName(animal),
    birthdate: DateTime.fromJSDate(animal.birthdate).toISO(),
    gender: animal.gender,
    species: animal.species,
    breed:
      animal.breed == null
        ? undefined
        : {
            id: animal.breed.id,
            name: animal.breed.name,
            species: animal.breed.species,
          },
    color:
      animal.color == null
        ? undefined
        : { id: animal.color.id, name: animal.color.name },
    description: animal.description || undefined,
    avatarId: animal.avatar,
    picturesId: animal.pictures,
    manager:
      animal.manager == null
        ? undefined
        : {
            id: animal.manager.id,
            displayName: animal.manager.displayName,
          },
    pickUpDate: DateTime.fromJSDate(animal.pickUpDate).toISO(),
    pickUpLocation: animal.pickUpLocation || undefined,
    pickUpReason: animal.pickUpReason,
    status: animal.status,
    adoptionDate:
      animal.adoptionDate == null
        ? undefined
        : DateTime.fromJSDate(animal.adoptionDate).toISO(),
    adoptionOption: animal.adoptionOption ?? undefined,
    fosterFamily:
      animal.fosterFamily == null
        ? undefined
        : {
            id: animal.fosterFamily.id,
            email: animal.fosterFamily.email,
            name: animal.fosterFamily.displayName,
            formattedAddress: getFormattedAddress(animal.fosterFamily),
            phone: animal.fosterFamily.phone,
          },
    iCadNumber: animal.iCadNumber || undefined,
    comments: animal.comments || undefined,
    isOkChildren: booleanToTrilean(animal.isOkChildren),
    isOkDogs: booleanToTrilean(animal.isOkDogs),
    isOkCats: booleanToTrilean(animal.isOkCats),
    isSterilized: animal.isSterilized,
  };
}

function getAgeRangeSearchFilter(
  species?: AnimalSpecies,
  age?: AnimalAge
): NonNullable<Prisma.AnimalWhereInput["birthdate"]> | undefined {
  if (species == null || age == null) {
    return undefined;
  }

  const speciesAgeRanges = ANIMAL_AGE_RANGE_BY_SPECIES[species];
  if (speciesAgeRanges == null) {
    return undefined;
  }

  const ageRange = speciesAgeRanges[age];
  if (ageRange == null) {
    return undefined;
  }

  const now = DateTime.now();

  return {
    gt: now.minus({ months: ageRange.maxMonths }).toJSDate(),
    lte: now.minus({ months: ageRange.minMonths }).toJSDate(),
  };
}
