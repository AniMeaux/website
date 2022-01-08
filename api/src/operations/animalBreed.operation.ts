import {
  AnimalBreed,
  AnimalBreedOperations,
  AnimalBreedSearchHit,
  AnimalSpecies,
  UserGroup,
} from "@animeaux/shared";
import { getFirestore } from "firebase-admin/firestore";
import { v4 as uuid } from "uuid";
import { mixed, object, string } from "yup";
import {
  AlgoliaClient,
  createSearchFilters,
  DEFAULT_SEARCH_OPTIONS,
} from "../core/algolia";
import { assertUserHasGroups } from "../core/authentication";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";
import {
  AnimalBreedFromStore,
  ANIMAL_BREED_COLLECTION,
  getAnimalBreedFromStore,
} from "../entities/animalBreed.entity";

const AnimalBreedIndex = AlgoliaClient.initIndex(ANIMAL_BREED_COLLECTION);

export const animalBreedOperations: OperationsImpl<AnimalBreedOperations> = {
  async getAllAnimalBreeds(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const snapshots = await getFirestore()
      .collection(ANIMAL_BREED_COLLECTION)
      .orderBy("name")
      .get();

    return snapshots.docs.map<AnimalBreed>((doc) => {
      const animalBreed = doc.data() as AnimalBreedFromStore;

      return {
        id: animalBreed.id,
        name: animalBreed.name,
        species: animalBreed.species,
      };
    });
  },

  async searchAnimalBreeds(rawParams, context) {
    assertUserHasGroups(context.currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
    ]);

    const params = validateParams<"searchAnimalBreeds">(
      object({
        search: string().strict(true).defined(),
        species: mixed<AnimalSpecies>().oneOf(Object.values(AnimalSpecies)),
      }),
      rawParams
    );

    const result = await AnimalBreedIndex.search<AnimalBreedFromStore>(
      params.search ?? "",
      {
        ...DEFAULT_SEARCH_OPTIONS,
        filters: createSearchFilters({ species: params.species }),
      }
    );

    return result.hits.map<AnimalBreedSearchHit>((hit) => ({
      id: hit.id,
      name: hit.name,
      species: hit.species,
      highlightedName: hit._highlightResult?.name?.value ?? hit.name,
    }));
  },

  async getAnimalBreed(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getAnimalBreed">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const animalBreed = await getAnimalBreedFromStore(params.id);

    return {
      id: animalBreed.id,
      name: animalBreed.name,
      species: animalBreed.species,
    };
  },

  async createAnimalBreed(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"createAnimalBreed">(
      object({
        name: string().trim().required(),
        species: mixed<AnimalSpecies>()
          .oneOf(Object.values(AnimalSpecies))
          .required(),
      }),
      rawParams
    );

    const animalBreed: AnimalBreedFromStore = { id: uuid(), ...params };

    await assertIsValid(animalBreed);

    await getFirestore()
      .collection(ANIMAL_BREED_COLLECTION)
      .doc(animalBreed.id)
      .set(animalBreed);

    // TODO: Check if fields all fields are required.
    await AnimalBreedIndex.saveObject({
      ...animalBreed,
      objectID: animalBreed.id,
    });

    return {
      id: animalBreed.id,
      name: animalBreed.name,
      species: animalBreed.species,
    };
  },

  async updateAnimalBreed(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"updateAnimalBreed">(
      object({
        id: string().uuid().required(),
        name: string().trim().required(),
        species: mixed<AnimalSpecies>()
          .oneOf(Object.values(AnimalSpecies))
          .required(),
      }),
      rawParams
    );

    const currentAnimalBreed = await getAnimalBreedFromStore(params.id);
    const newAnimalBreed: AnimalBreedFromStore = {
      ...currentAnimalBreed,
      ...params,
    };

    await assertIsValid(newAnimalBreed, currentAnimalBreed);

    await getFirestore()
      .collection(ANIMAL_BREED_COLLECTION)
      .doc(newAnimalBreed.id)
      .update(newAnimalBreed);

    await AnimalBreedIndex.partialUpdateObject({
      ...newAnimalBreed,
      objectID: newAnimalBreed.id,
    });

    return {
      id: newAnimalBreed.id,
      name: newAnimalBreed.name,
      species: newAnimalBreed.species,
    };
  },

  async deleteAnimalBreed(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"deleteAnimalBreed">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    // TODO: Check that the breed is not referenced by an animal.
    await getFirestore()
      .collection(ANIMAL_BREED_COLLECTION)
      .doc(params.id)
      .delete();

    await AnimalBreedIndex.deleteObject(params.id);
    return true;
  },
};

async function assertIsValid(
  update: AnimalBreedFromStore,
  current?: AnimalBreedFromStore
) {
  if (
    current == null ||
    update.name !== current.name ||
    update.species !== current.species
  ) {
    const snapshot = await getFirestore()
      .collection(ANIMAL_BREED_COLLECTION)
      .where("name", "==", update.name)
      .where("species", "==", update.species)
      .get();

    if (!snapshot.empty) {
      throw new OperationError<"createAnimalBreed" | "updateAnimalBreed">(404, {
        code: "already-exists",
      });
    }
  }
}
