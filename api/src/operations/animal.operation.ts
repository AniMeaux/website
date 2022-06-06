import { Hit } from "@algolia/client-search";
import {
  AdoptionOption,
  Animal,
  AnimalActiveBrief,
  AnimalAge,
  AnimalGender,
  AnimalOperations,
  AnimalSearchHit,
  AnimalSpecies,
  AnimalStatus,
  ANIMAL_AGE_RANGE_BY_SPECIES,
  hasGroups,
  LocationSearchHit,
  ManagerSearchHit,
  PickUpReason,
  PublicAnimal,
  PublicAnimalSearchHit,
  Trilean,
  UserGroup,
} from "@animeaux/shared";
import { getFirestore } from "firebase-admin/firestore";
import orderBy from "lodash.orderby";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";
import { v4 as uuid } from "uuid";
import { array, boolean, mixed, number, object, string } from "yup";
import {
  AlgoliaClient,
  createSearchFilters,
  DEFAULT_SEARCH_OPTIONS,
} from "../core/algolia";
import { assertUserHasGroups, getCurrentUser } from "../core/authentication";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";
import {
  AnimalFromStore,
  ANIMAL_COLLECTION,
  ANIMAL_SAVED_COLLECTION,
  getDisplayName,
} from "../entities/animal.entity";
import { getAnimalBreedFromStore } from "../entities/animalBreed.entity";
import { getAnimalColorFromStore } from "../entities/animalColor.entity";
import {
  getFormattedAddress,
  getHostFamilyFromStore,
  getShortLocation,
} from "../entities/hostFamily.entity";
import {
  getUserFromAuth,
  UserFromAlgolia,
  UserIndex,
} from "../entities/user.entity";

const AnimalIndex = AlgoliaClient.initIndex(ANIMAL_COLLECTION);
const SavedAnimalIndex = AlgoliaClient.initIndex(ANIMAL_SAVED_COLLECTION);

/** OPEN_TO_ADOPTION, OPEN_TO_RESERVATION, RESERVED, UNAVAILABLE */
const ACTIVE_ANIMAL_STATUS = [
  AnimalStatus.OPEN_TO_ADOPTION,
  AnimalStatus.OPEN_TO_RESERVATION,
  AnimalStatus.RESERVED,
  AnimalStatus.UNAVAILABLE,
];

/** ADOPTED, FREE */
const SAVED_ANIMAL_STATUS = [AnimalStatus.ADOPTED, AnimalStatus.FREE];

/** ADOPTED, DECEASED, FREE */
const NON_ACTIVE_ANIMAL_STATUS = [
  AnimalStatus.ADOPTED,
  AnimalStatus.DECEASED,
  AnimalStatus.FREE,
];

/** OPEN_TO_ADOPTION, OPEN_TO_RESERVATION */
const ADOPTABLE_ANIMAL_STATUS = [
  AnimalStatus.OPEN_TO_ADOPTION,
  AnimalStatus.OPEN_TO_RESERVATION,
];

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

    let query = getFirestore()
      .collection(ANIMAL_COLLECTION)
      .where("status", "in", ACTIVE_ANIMAL_STATUS);

    if (params.onlyManagedByCurrentUser) {
      if (!hasGroups(currentUser, [UserGroup.ANIMAL_MANAGER])) {
        throw new OperationError(400);
      }

      query = query.where("managerId", "==", currentUser.id);
    }

    const snapshots = await query.get();

    const animals = await Promise.all(
      snapshots.docs.map<Promise<AnimalActiveBrief>>(async (doc) => {
        const animal = doc.data() as AnimalFromStore;

        let managerName: AnimalActiveBrief["managerName"] = undefined;
        if (animal.managerId != null) {
          if (params.onlyManagedByCurrentUser) {
            managerName = currentUser.displayName;
          } else {
            const user = await getUserFromAuth(animal.managerId);
            invariant(
              user != null,
              `Manager "${animal.managerId}" should exist for animal "${animal.id}"`
            );

            managerName = user.displayName;
          }
        }

        return {
          id: animal.id,
          avatarId: animal.avatarId,
          displayName: getDisplayName(animal),
          status: animal.status,
          managerName,
        };
      })
    );

    return orderBy(animals, (animal) => animal.displayName);
  },

  async getAllSavedAnimals(rawParams) {
    const params = validateParams<"getAllSavedAnimals">(
      object({ page: number().min(0) }),
      rawParams
    );

    const result = await SavedAnimalIndex.search<AnimalFromStore>("", {
      ...DEFAULT_SEARCH_OPTIONS,
      page: params.page ?? 0,

      // Multiple of 2 and 3 to be nicely displayed.
      hitsPerPage: 18,

      filters: createSearchFilters({ status: SAVED_ANIMAL_STATUS }),
    });

    return {
      hits: await Promise.all(result.hits.map(mapHitToPublicAnimal)),
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
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

    const result = await AnimalIndex.search<AnimalFromStore>("", {
      ...DEFAULT_SEARCH_OPTIONS,
      page: params.page ?? 0,

      // Multiple of 2 and 3 to be nicely displayed.
      hitsPerPage: 18,

      filters: createSearchFilters({
        status: ADOPTABLE_ANIMAL_STATUS,
        species: params.species,
        birthdateTimestamp: getAgeRangeSearchFilter(params.species, params.age),
      }),
    });

    return {
      hits: await Promise.all(result.hits.map(mapHitToPublicAnimal)),
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
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
        status: array().of(
          mixed().oneOf(Object.values(AnimalStatus)).required()
        ),
      }),
      rawParams
    );

    const result = await AnimalIndex.search<AnimalFromStore>(params.search, {
      ...DEFAULT_SEARCH_OPTIONS,
      page: params.page ?? 0,
      filters: createSearchFilters({
        species: params.species,
        status: params.status,
      }),
    });

    const hits = result.hits.map<AnimalSearchHit>((hit) => ({
      id: hit.id,
      displayName: getDisplayName(hit),
      highlightedDisplayName: getDisplayName({
        officialName:
          hit._highlightResult?.officialName?.value ?? hit.officialName,
        commonName: hit._highlightResult?.commonName?.value ?? hit.commonName,
      }),
      avatarId: hit.avatarId,
      status: hit.status,
    }));

    return {
      hits,
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
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
      object({ id: string().required() }),
      rawParams
    );

    const animalFromStore = await getAnimal(params.id);

    let breed: Animal["breed"] = undefined;
    if (animalFromStore.breedId != null) {
      const breedFromStore = await getAnimalBreedFromStore(
        animalFromStore.breedId
      );

      breed = {
        id: breedFromStore.id,
        name: breedFromStore.name,
        species: breedFromStore.species,
      };
    }

    let color: Animal["color"] = undefined;
    if (animalFromStore.colorId != null) {
      const colorFromStore = await getAnimalColorFromStore(
        animalFromStore.colorId
      );

      color = {
        id: colorFromStore.id,
        name: colorFromStore.name,
      };
    }

    let hostFamily: Animal["hostFamily"] = undefined;
    if (animalFromStore.hostFamilyId != null) {
      const hostFamilyFromStore = await getHostFamilyFromStore(
        animalFromStore.hostFamilyId
      );

      hostFamily = {
        id: hostFamilyFromStore.id,
        name: hostFamilyFromStore.name,
        email: hostFamilyFromStore.email,
        phone: hostFamilyFromStore.phone,
        formattedAddress: getFormattedAddress(hostFamilyFromStore),
      };
    }

    let manager: Animal["manager"] = undefined;
    if (animalFromStore.managerId != null) {
      const user = await getUserFromAuth(animalFromStore.managerId);
      invariant(
        user != null,
        `Manager "${animalFromStore.managerId}" should exist for animal "${params.id}"`
      );

      manager = {
        id: user.id,
        displayName: user.displayName,
      };
    }

    const animal: Animal = {
      id: animalFromStore.id,
      officialName: animalFromStore.officialName,
      commonName: ignoreEmptyString(animalFromStore.commonName),
      displayName: getDisplayName(animalFromStore),
      birthdate: animalFromStore.birthdate,
      gender: animalFromStore.gender,
      species: animalFromStore.species,
      breed,
      color,
      description: ignoreEmptyString(animalFromStore.description),
      avatarId: animalFromStore.avatarId,
      picturesId: animalFromStore.picturesId,
      manager,
      pickUpDate: animalFromStore.pickUpDate,
      pickUpLocation: ignoreEmptyString(animalFromStore.pickUpLocation),
      pickUpReason: animalFromStore.pickUpReason,
      status: animalFromStore.status,
      adoptionDate: animalFromStore.adoptionDate ?? undefined,
      adoptionOption: animalFromStore.adoptionOption ?? undefined,
      hostFamily,
      iCadNumber: ignoreEmptyString(animalFromStore.iCadNumber),
      comments: ignoreEmptyString(animalFromStore.comments),
      isOkChildren: animalFromStore.isOkChildren,
      isOkDogs: animalFromStore.isOkDogs,
      isOkCats: animalFromStore.isOkCats,
      isSterilized: animalFromStore.isSterilized,
    };

    return animal;
  },

  async getAdoptableAnimal(rawParams) {
    const params = validateParams<"getAnimal">(
      object({ id: string().required() }),
      rawParams
    );

    const animalFromStore = await getAnimal(params.id);

    let breedName: PublicAnimal["breedName"] = undefined;
    if (animalFromStore.breedId != null) {
      const breed = await getAnimalBreedFromStore(animalFromStore.breedId);
      breedName = breed.name;
    }

    let colorName: PublicAnimal["colorName"] = undefined;
    if (animalFromStore.colorId != null) {
      const color = await getAnimalColorFromStore(animalFromStore.colorId);
      colorName = color.name;
    }

    let location: PublicAnimal["location"] = undefined;
    if (animalFromStore.hostFamilyId != null) {
      const hostFamilyFromStore = await getHostFamilyFromStore(
        animalFromStore.hostFamilyId
      );

      location = getShortLocation(hostFamilyFromStore);
    }

    const animal: PublicAnimal = {
      id: animalFromStore.id,
      avatarId: animalFromStore.avatarId,
      birthdate: animalFromStore.birthdate,
      displayName: animalFromStore.officialName,
      gender: animalFromStore.gender,
      isOkCats: animalFromStore.isOkCats,
      isOkChildren: animalFromStore.isOkChildren,
      isOkDogs: animalFromStore.isOkDogs,
      isSterilized: animalFromStore.isSterilized,
      picturesId: animalFromStore.picturesId,
      species: animalFromStore.species,
      breedName,
      colorName,
      description: ignoreEmptyString(animalFromStore.description),
      location,
    };

    return animal;
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
        status: mixed().oneOf(Object.values(AnimalStatus)).required(),
        managerId: string().required(),
        adoptionDate: string().dateISO().nullable().defined(),
        adoptionOption: mixed()
          .oneOf([...Object.values(AdoptionOption), null])
          .defined(),
        pickUpDate: string().dateISO().required(),
        pickUpLocation: string().trim().nullable().defined(),
        pickUpReason: mixed().oneOf(Object.values(PickUpReason)).required(),
        hostFamilyId: string().uuid().nullable().defined(),
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

    const animal = setTimestamps(
      await validate({
        ...params,
        id: uuid(),

        // Will be overidden in `setTimestamps`.
        // We passed them just for type checks.
        birthdateTimestamp: 0,
        pickUpDateTimestamp: 0,
      })
    );

    await getFirestore()
      .collection(ANIMAL_COLLECTION)
      .doc(animal.id)
      .set(animal);

    // TODO: Don't save the entire object.
    await AnimalIndex.saveObject({ ...animal, objectID: animal.id });

    return await animalOperations.getAnimal({ id: animal.id }, context);
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

    const currentAnimal = await getAnimal(params.id);
    const newAnimal = setTimestamps(
      await validate({ ...currentAnimal, ...params })
    );

    await getFirestore()
      .collection(ANIMAL_COLLECTION)
      .doc(newAnimal.id)
      .update(newAnimal);

    await AnimalIndex.partialUpdateObject({
      ...newAnimal,
      objectID: newAnimal.id,
    });

    return await animalOperations.getAnimal({ id: newAnimal.id }, context);
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
        status: mixed().oneOf(Object.values(AnimalStatus)).required(),
        managerId: string().required(),
        adoptionDate: string().dateISO().nullable().defined(),
        adoptionOption: mixed()
          .oneOf([...Object.values(AdoptionOption), null])
          .defined(),
        pickUpDate: string().dateISO().required(),
        pickUpLocation: string().trim().nullable().defined(),
        pickUpReason: mixed().oneOf(Object.values(PickUpReason)).required(),
        hostFamilyId: string().uuid().nullable().defined(),
        isOkChildren: mixed().oneOf(Object.values(Trilean)).required(),
        isOkDogs: mixed().oneOf(Object.values(Trilean)).required(),
        isOkCats: mixed().oneOf(Object.values(Trilean)).required(),
        isSterilized: boolean().required(),
        comments: string().trim().nullable().defined(),
      }),
      rawParams
    );

    const currentAnimal = await getAnimal(params.id);
    const newAnimal = setTimestamps(
      await validate({ ...currentAnimal, ...params })
    );

    await getFirestore()
      .collection(ANIMAL_COLLECTION)
      .doc(newAnimal.id)
      .update(newAnimal);

    await AnimalIndex.partialUpdateObject({
      ...newAnimal,
      objectID: newAnimal.id,
    });

    return await animalOperations.getAnimal({ id: newAnimal.id }, context);
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

    const currentAnimal = await getAnimal(params.id);
    const newAnimal = setTimestamps(
      await validate({ ...currentAnimal, ...params })
    );

    await getFirestore()
      .collection(ANIMAL_COLLECTION)
      .doc(newAnimal.id)
      .update(newAnimal);

    await AnimalIndex.partialUpdateObject({
      ...newAnimal,
      objectID: newAnimal.id,
    });

    return await animalOperations.getAnimal({ id: newAnimal.id }, context);
  },

  async deleteAnimal(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"deleteAnimal">(
      object({ id: string().required() }),
      rawParams
    );

    await getFirestore().collection(ANIMAL_COLLECTION).doc(params.id).delete();
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
      id: hit.id,
      email: hit.email,
      highlightedEmail: hit._highlightResult?.email?.value ?? hit.email,
      displayName: hit.displayName,
      highlightedDisplayName:
        hit._highlightResult?.displayName?.value ?? hit.displayName,
    }));
  },
};

async function getAnimal(id: string) {
  const snapshot = await getFirestore()
    .collection(ANIMAL_COLLECTION)
    .doc(id)
    .get();

  if (!snapshot.exists) {
    throw new OperationError(404);
  }

  return snapshot.data() as AnimalFromStore;
}

function ignoreEmptyString(value: string | null | undefined) {
  if (value != null && value !== "") {
    return value;
  }

  return undefined;
}

function setTimestamps(animal: AnimalFromStore): AnimalFromStore {
  return {
    ...animal,
    birthdateTimestamp: new Date(animal.birthdate).getTime(),
    pickUpDateTimestamp: new Date(animal.pickUpDate).getTime(),
    adoptionDateTimestamp:
      animal.adoptionDate == null
        ? undefined
        : new Date(animal.adoptionDate).getTime(),
  };
}

async function validate(animal: AnimalFromStore): Promise<AnimalFromStore> {
  if (animal.breedId != null) {
    const breed = await getAnimalBreedFromStore(animal.breedId);
    if (breed.species !== animal.species) {
      throw new OperationError(400);
    }
  }

  if (animal.status === AnimalStatus.ADOPTED && animal.adoptionDate == null) {
    throw new OperationError(400);
  }

  // Only active animals can be in a host family.
  if (NON_ACTIVE_ANIMAL_STATUS.includes(animal.status)) {
    animal = { ...animal, hostFamilyId: null };
  }

  // Only adopted animals can have adoption info.
  if (animal.status !== AnimalStatus.ADOPTED) {
    animal = { ...animal, adoptionDate: null, adoptionOption: null };
  }

  return animal;
}

async function mapHitToPublicAnimal(hit: Hit<AnimalFromStore>) {
  const animal: PublicAnimalSearchHit = {
    id: hit.id,
    displayName: hit.officialName,
    avatarId: hit.avatarId,
    birthdate: hit.birthdate,
    gender: hit.gender,
  };

  const [breed, color] = await Promise.all([
    hit.breedId == null
      ? Promise.resolve(null)
      : await getAnimalBreedFromStore(hit.breedId),

    hit.colorId == null
      ? Promise.resolve(null)
      : await getAnimalColorFromStore(hit.colorId),
  ]);

  if (breed != null) {
    animal.breedName = breed.name;
  }

  if (color != null) {
    animal.colorName = color.name;
  }

  return animal;
}

function getAgeRangeSearchFilter(species?: AnimalSpecies, age?: AnimalAge) {
  if (species == null || age == null) {
    return null;
  }

  const speciesAgeRanges = ANIMAL_AGE_RANGE_BY_SPECIES[species];
  if (speciesAgeRanges == null) {
    return null;
  }

  const ageRange = speciesAgeRanges[age];
  if (ageRange == null) {
    return null;
  }

  const today = DateTime.now().setZone("utc").startOf("day");

  // The `maxMonths` has the lowest timestamp value.
  const minTimestamp = today
    .minus({ months: ageRange.maxMonths })
    // Add one day because `maxMonths` is excluded.
    .plus({ days: 1 })
    .toMillis();

  const maxTimestamp = today.minus({ months: ageRange.minMonths }).toMillis();

  return `${minTimestamp} TO ${maxTimestamp}`;
}
