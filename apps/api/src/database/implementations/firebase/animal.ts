import {
  AnimalStatus,
  CreateAnimalPayload,
  DATE_PATTERN,
  DBAnimal,
  DBSearchableAnimal,
  ErrorCode,
  PaginatedRequest,
  PaginatedResponse,
  UpdateAnimalPayload,
} from "@animeaux/shared-entities";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import isEmpty from "lodash.isempty";
import { AnimalDatabase } from "../../databaseType";
import { AlgoliaClient } from "./algoliaClient";
import { animalBreedDatabase } from "./animalBreed";

const AnimalsIndex = AlgoliaClient.initIndex("animals");

export const animalDatabase: AnimalDatabase = {
  async getAllAnimals(
    filters: PaginatedRequest
  ): Promise<PaginatedResponse<DBSearchableAnimal>> {
    const result = await AnimalsIndex.search<DBSearchableAnimal>(
      filters.search ?? "",
      { page: filters.page ?? 0 }
    );

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

    if (!DATE_PATTERN.test(payload.birthdate)) {
      throw new UserInputError(ErrorCode.ANIMAL_INVALID_BIRTHDATE);
    }

    if (payload.breedId != null) {
      const breed = await animalBreedDatabase.getAnimalBreed(payload.breedId);

      if (breed != null && breed.species !== payload.species) {
        throw new UserInputError(ErrorCode.ANIMAL_SPECIES_BREED_MISSMATCH);
      }
    }

    if (!DATE_PATTERN.test(payload.pickUpDate)) {
      throw new UserInputError(ErrorCode.ANIMAL_INVALID_PICK_UP_DATE);
    }

    const searchableAnimal: DBSearchableAnimal = {
      id: payload.id,
      officialName,
      birthdate: payload.birthdate,
      birthdateTimestamp: new Date(payload.birthdate).getTime(),
      gender: payload.gender,
      species: payload.species,
      breedId: payload.breedId,
      color: payload.color,
      status: payload.status,
      pickUpDate: payload.pickUpDate,
      pickUpDateTimestamp: new Date(payload.pickUpDate).getTime(),
      avatarId: payload.avatarId,
      isOkChildren: payload.isOkChildren,
      isOkDogs: payload.isOkDogs,
      isOkCats: payload.isOkCats,
      isSterilized: payload.isSterilized,
    };

    const commonName = payload.commonName?.trim() ?? "";
    if (commonName !== "") {
      searchableAnimal.commonName = commonName;
    }

    const animal: DBAnimal = {
      ...searchableAnimal,
      hostFamilyId: payload.hostFamilyId,
      picturesId: payload.picturesId,
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
    if (payload.commonName !== undefined) {
      const commonName = payload.commonName?.trim() ?? "";
      if (commonName === "") {
        searchableAnimalUpdate.commonName = null;
      } else if (commonName !== animal.commonName) {
        searchableAnimalUpdate.commonName = commonName;
      }
    }

    if (payload.birthdate != null) {
      if (!DATE_PATTERN.test(payload.birthdate)) {
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
      if (!DATE_PATTERN.test(payload.pickUpDate)) {
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

    if (
      // If either one have changed, check that they match.
      searchableAnimalUpdate.species != null ||
      searchableAnimalUpdate.breedId != null
    ) {
      const breedId = searchableAnimalUpdate.breedId ?? animal.breedId;

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
    if (payload.color !== undefined && payload.color !== animal.color) {
      searchableAnimalUpdate.color = payload.color;
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

    const animalUpdate: Partial<DBAnimal> = {
      ...searchableAnimalUpdate,
    };

    if (
      payload.hostFamilyId != null &&
      payload.hostFamilyId !== animal.hostFamilyId
    ) {
      animalUpdate.hostFamilyId = payload.hostFamilyId;
    }

    if (payload.picturesId != null) {
      animalUpdate.picturesId = payload.picturesId;
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
      if (
        [
          AnimalStatus.OPEN_TO_ADOPTION,
          AnimalStatus.OPEN_TO_RESERVATION,
        ].includes(animal.status)
      ) {
        throw new UserInputError(ErrorCode.ANIMAL_IS_ADOPTABLE);
      }

      await admin.firestore().collection("animals").doc(id).delete();
      await AnimalsIndex.deleteObject(id);
      return true;
    }

    return false;
  },
};
