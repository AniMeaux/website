import {
  AnimalBreed,
  AnimalBreedFilters,
  AnimalSpecies,
  CreateAnimalBreedPayload,
  ErrorCode,
  PaginatedRequest,
  PaginatedResponse,
  UpdateAnimalBreedPayload,
} from "@animeaux/shared-entities";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import isEmpty from "lodash.isempty";
import { v4 as uuid } from "uuid";
import { AnimalBreedDatabase } from "../../databaseType";
import { SearchFilters } from "../../searchFilters";
import { AlgoliaClient } from "./algoliaClient";

const AnimalBreedsIndex = AlgoliaClient.initIndex("animalBreeds");

async function assertAnimalBreedNameNotUsed(
  name: string,
  species: AnimalSpecies
) {
  const animalBreedSnapshot = await admin
    .firestore()
    .collection("animalBreeds")
    .where("name", "==", name)
    .where("species", "==", species)
    .get();

  if (!animalBreedSnapshot.empty) {
    throw new UserInputError(ErrorCode.ANIMAL_BREED_ALREADY_EXIST);
  }
}

export const animalBreedDatabase: AnimalBreedDatabase = {
  async getAllAnimalBreeds(
    filters: PaginatedRequest<AnimalBreedFilters>
  ): Promise<PaginatedResponse<AnimalBreed>> {
    const searchFilters: string[] = [];

    if (filters.species != null) {
      searchFilters.push(
        SearchFilters.createFilter("species", filters.species)
      );
    }

    const result = await AnimalBreedsIndex.search<AnimalBreed>(
      filters.search ?? "",
      {
        page: filters.page ?? 0,
        filters: SearchFilters.and(searchFilters),
      }
    );

    return {
      hits: result.hits,
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
    };
  },

  async getAnimalBreed(id: string): Promise<AnimalBreed | null> {
    const animalBreedSnapshot = await admin
      .firestore()
      .collection("animalBreeds")
      .doc(id)
      .get();

    return (animalBreedSnapshot.data() as AnimalBreed) ?? null;
  },

  async createAnimalBreed({
    name,
    species,
  }: CreateAnimalBreedPayload): Promise<AnimalBreed> {
    name = name.trim();
    if (name === "") {
      throw new UserInputError(ErrorCode.ANIMAL_BREED_MISSING_NAME);
    }

    await assertAnimalBreedNameNotUsed(name, species);

    const animalBreed: AnimalBreed = {
      id: uuid(),
      name,
      species,
    };

    await admin
      .firestore()
      .collection("animalBreeds")
      .doc(animalBreed.id)
      .set(animalBreed);

    await AnimalBreedsIndex.saveObject({
      ...animalBreed,
      objectID: animalBreed.id,
    });

    return animalBreed;
  },

  async updateAnimalBreed({
    id,
    name,
    species,
  }: UpdateAnimalBreedPayload): Promise<AnimalBreed> {
    const animalBreed = await animalBreedDatabase.getAnimalBreed(id);
    if (animalBreed == null) {
      throw new UserInputError(ErrorCode.ANIMAL_BREED_NOT_FOUND);
    }

    const payload: Partial<AnimalBreed> = {};

    if (name != null) {
      name = name.trim();

      if (name === "") {
        throw new UserInputError(ErrorCode.ANIMAL_BREED_MISSING_NAME);
      }

      if (name !== animalBreed.name) {
        await assertAnimalBreedNameNotUsed(
          name,
          species ?? animalBreed.species
        );
        payload.name = name;
      }
    }

    if (species != null && species !== animalBreed.species) {
      await assertAnimalBreedNameNotUsed(name ?? animalBreed.name, species);
      payload.species = species;
    }

    if (!isEmpty(payload)) {
      await admin
        .firestore()
        .collection("animalBreeds")
        .doc(id)
        .update(payload);

      await AnimalBreedsIndex.partialUpdateObject({
        ...payload,
        objectID: animalBreed.id,
      });
    }

    return { ...animalBreed, ...payload };
  },

  async deleteAnimalBreed(id: string): Promise<boolean> {
    // TODO: Check that the breed is not referenced by an animal.
    await admin.firestore().collection("animalBreeds").doc(id).delete();
    await AnimalBreedsIndex.deleteObject(id);
    return true;
  },
};
