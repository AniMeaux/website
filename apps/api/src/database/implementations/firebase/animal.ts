import {
  ACTIVE_ANIMAL_STATUS,
  ADOPTABLE_ANIMAL_STATUS,
  AnimalSearch,
  CreateAnimalPayload,
  DBAnimal,
  DBSearchableAnimal,
  ErrorCode,
  isValidDate,
  PaginatedRequestParameters,
  PaginatedResponse,
  UpdateAnimalPayload,
} from "@animeaux/shared-entities";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import { v4 as uuid } from "uuid";
import { AnimalDatabase } from "../../databaseType";
import { SearchFilters } from "../../searchFilters";
import { AlgoliaClient } from "./algoliaClient";
import { animalBreedDatabase } from "./animalBreed";

const AnimalsIndex = AlgoliaClient.initIndex("animals");

function cleanMarkdown(content: string) {
  // Preserve whitespaces unless it's all there is in it.
  if (content.trim() === "") {
    return "";
  }

  return content;
}

export const animalDatabase: AnimalDatabase = {
  async getAllAdoptableAnimals(
    parameters: PaginatedRequestParameters
  ): Promise<PaginatedResponse<DBSearchableAnimal>> {
    const result = await AnimalsIndex.search<DBSearchableAnimal>("", {
      page: parameters.page ?? 0,
      filters: SearchFilters.or(
        ADOPTABLE_ANIMAL_STATUS.map((status) =>
          SearchFilters.createFilter("status", status)
        )
      ),
    });

    return {
      hits: result.hits,
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
    };
  },

  async getAllAnimals(
    parameters: PaginatedRequestParameters<AnimalSearch>
  ): Promise<PaginatedResponse<DBSearchableAnimal>> {
    const searchFilters: string[] = [];

    if (parameters.status != null && parameters.status.length > 0) {
      searchFilters.push(
        SearchFilters.or(
          parameters.status.map((status) =>
            SearchFilters.createFilter("status", status)
          )
        )
      );
    }

    if (parameters.hostFamilyId != null) {
      searchFilters.push(
        SearchFilters.createFilter("hostFamilyId", parameters.hostFamilyId)
      );
    }

    const result = await AnimalsIndex.search<DBSearchableAnimal>(
      parameters.search ?? "",
      {
        page: parameters.page ?? 0,
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

  async getAllActiveAnimals(
    parameters: PaginatedRequestParameters
  ): Promise<PaginatedResponse<DBSearchableAnimal>> {
    const result = await AnimalsIndex.search<DBSearchableAnimal>("", {
      page: parameters.page ?? 0,
      filters: SearchFilters.or(
        ACTIVE_ANIMAL_STATUS.map((status) =>
          SearchFilters.createFilter("status", status)
        )
      ),
    });

    return {
      hits: result.hits,
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
    };
  },

  async getAnimal(id: string): Promise<DBAnimal | null> {
    const animalBreedSnapshot = await admin
      .firestore()
      .collection("animals")
      .doc(id)
      .get();

    return (animalBreedSnapshot.data() as DBAnimal) ?? null;
  },

  async createAnimal(payload: CreateAnimalPayload): Promise<DBAnimal> {
    const officialName = payload.officialName.trim();
    if (officialName === "") {
      throw new UserInputError(ErrorCode.ANIMAL_MISSING_OFFICIAL_NAME);
    }

    if (!isValidDate(payload.birthdate)) {
      throw new UserInputError(ErrorCode.ANIMAL_INVALID_BIRTHDATE);
    }

    if (payload.breedId != null) {
      const breed = await animalBreedDatabase.getAnimalBreed(payload.breedId);

      if (breed != null && breed.species !== payload.species) {
        throw new UserInputError(ErrorCode.ANIMAL_SPECIES_BREED_MISSMATCH);
      }
    }

    if (!isValidDate(payload.pickUpDate)) {
      throw new UserInputError(ErrorCode.ANIMAL_INVALID_PICK_UP_DATE);
    }

    const searchableAnimal: DBSearchableAnimal = {
      id: uuid(),
      officialName,
      commonName: payload.commonName.trim(),
      birthdate: payload.birthdate,
      birthdateTimestamp: new Date(payload.birthdate).getTime(),
      gender: payload.gender,
      species: payload.species,
      breedId: payload.breedId,
      colorId: payload.colorId,
      status: payload.status,
      pickUpDate: payload.pickUpDate,
      pickUpDateTimestamp: new Date(payload.pickUpDate).getTime(),
      avatarId: payload.avatarId,
      hostFamilyId: payload.hostFamilyId,
      isOkChildren: payload.isOkChildren,
      isOkDogs: payload.isOkDogs,
      isOkCats: payload.isOkCats,
      isSterilized: payload.isSterilized,
    };

    const animal: DBAnimal = {
      ...searchableAnimal,
      description: cleanMarkdown(payload.description),
      picturesId: payload.picturesId,
      comments: cleanMarkdown(payload.comments),
    };

    await admin.firestore().collection("animals").doc(animal.id).set(animal);

    await AnimalsIndex.saveObject({
      ...searchableAnimal,
      objectID: searchableAnimal.id,
    });

    return animal;
  },

  async updateAnimal(payload: UpdateAnimalPayload): Promise<DBAnimal> {
    const animal = await animalDatabase.getAnimal(payload.id);
    if (animal == null) {
      throw new UserInputError(ErrorCode.ANIMAL_NOT_FOUND);
    }

    const searchableAnimalUpdate: Partial<DBSearchableAnimal> = {};

    if (payload.officialName != null) {
      const officialName = payload.officialName.trim();
      if (officialName === "") {
        throw new UserInputError(ErrorCode.ANIMAL_MISSING_OFFICIAL_NAME);
      }

      if (officialName !== animal.officialName) {
        searchableAnimalUpdate.officialName = officialName;
      }
    }

    // Allow null to clear the field.
    if (payload.commonName != null) {
      const commonName = payload.commonName.trim();
      if (commonName !== animal.commonName) {
        searchableAnimalUpdate.commonName = commonName;
      }
    }

    if (payload.birthdate != null) {
      if (!isValidDate(payload.birthdate)) {
        throw new UserInputError(ErrorCode.ANIMAL_INVALID_BIRTHDATE);
      }

      if (payload.birthdate !== animal.birthdate) {
        searchableAnimalUpdate.birthdate = payload.birthdate;
        searchableAnimalUpdate.birthdateTimestamp = new Date(
          payload.birthdate
        ).getTime();
      }
    }

    if (payload.pickUpDate != null) {
      if (!isValidDate(payload.pickUpDate)) {
        throw new UserInputError(ErrorCode.ANIMAL_INVALID_PICK_UP_DATE);
      }

      if (payload.pickUpDate !== animal.pickUpDate) {
        searchableAnimalUpdate.pickUpDate = payload.pickUpDate;
        searchableAnimalUpdate.pickUpDateTimestamp = new Date(
          payload.pickUpDate
        ).getTime();
      }
    }

    if (payload.gender != null && payload.gender !== animal.gender) {
      searchableAnimalUpdate.gender = payload.gender;
    }

    if (payload.species != null && payload.species !== animal.species) {
      searchableAnimalUpdate.species = payload.species;
    }

    // Allow null to clear the field.
    if (payload.breedId !== undefined && payload.breedId !== animal.breedId) {
      searchableAnimalUpdate.breedId = payload.breedId;
    }

    // If either one have changed, check that they match.
    if (
      searchableAnimalUpdate.species != null ||
      searchableAnimalUpdate.breedId != null
    ) {
      const breedId =
        searchableAnimalUpdate.breedId !== undefined
          ? searchableAnimalUpdate.breedId
          : animal.breedId;

      if (breedId != null) {
        const breed = await animalBreedDatabase.getAnimalBreed(breedId);

        if (breed != null) {
          const species = searchableAnimalUpdate.species ?? animal.species;

          if (breed.species !== species) {
            throw new UserInputError(ErrorCode.ANIMAL_SPECIES_BREED_MISSMATCH);
          }
        }
      }
    }

    // Allow null to clear the field.
    if (payload.colorId !== undefined && payload.colorId !== animal.colorId) {
      searchableAnimalUpdate.colorId = payload.colorId;
    }

    if (payload.status != null && payload.status !== animal.status) {
      searchableAnimalUpdate.status = payload.status;
    }

    if (
      payload.isOkChildren != null &&
      payload.isOkChildren !== animal.isOkChildren
    ) {
      searchableAnimalUpdate.isOkChildren = payload.isOkChildren;
    }

    if (payload.isOkDogs != null && payload.isOkDogs !== animal.isOkDogs) {
      searchableAnimalUpdate.isOkDogs = payload.isOkDogs;
    }

    if (payload.isOkCats != null && payload.isOkCats !== animal.isOkCats) {
      searchableAnimalUpdate.isOkCats = payload.isOkCats;
    }

    if (
      payload.isSterilized != null &&
      payload.isSterilized !== animal.isSterilized
    ) {
      searchableAnimalUpdate.isSterilized = payload.isSterilized;
    }

    if (payload.avatarId != null && payload.avatarId !== animal.avatarId) {
      searchableAnimalUpdate.avatarId = payload.avatarId;
    }

    // Allow null to clear the field.
    if (
      payload.hostFamilyId !== undefined &&
      payload.hostFamilyId !== animal.hostFamilyId
    ) {
      searchableAnimalUpdate.hostFamilyId = payload.hostFamilyId;
    }

    const animalUpdate: Partial<DBAnimal> = {
      ...searchableAnimalUpdate,
    };

    if (
      payload.description != null &&
      payload.description !== animal.description
    ) {
      animalUpdate.description = cleanMarkdown(payload.description);
    }

    if (
      payload.picturesId != null &&
      !isEqual(payload.picturesId, animal.picturesId)
    ) {
      animalUpdate.picturesId = payload.picturesId;
    }

    if (payload.comments != null && payload.comments !== animal.comments) {
      animalUpdate.comments = cleanMarkdown(payload.comments);
    }

    if (!isEmpty(searchableAnimalUpdate)) {
      await AnimalsIndex.partialUpdateObject({
        ...searchableAnimalUpdate,
        objectID: animal.id,
      });
    }

    if (!isEmpty(animalUpdate)) {
      await admin
        .firestore()
        .collection("animals")
        .doc(animal.id)
        .update(animalUpdate);
    }

    return { ...animal, ...animalUpdate };
  },

  async deleteAnimal(id: string): Promise<boolean> {
    const animal = await animalDatabase.getAnimal(id);

    if (animal != null) {
      await admin.firestore().collection("animals").doc(id).delete();
      await AnimalsIndex.deleteObject(id);
      return true;
    }

    return false;
  },
};
