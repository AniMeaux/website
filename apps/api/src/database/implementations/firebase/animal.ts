import {
  ACTIVE_ANIMAL_STATUS,
  ADOPTABLE_ANIMAL_STATUS,
  AdoptionOption,
  AnimalAgeRangeBySpecies,
  AnimalSearch,
  AnimalStatus,
  CreateAnimalPayload,
  DBAnimal,
  DBSearchableAnimal,
  ErrorCode,
  isValidDate,
  PaginatedRequestParameters,
  PaginatedResponse,
  PublicAnimalFilters,
  SAVED_ANIMAL_STATUS,
  SearchFilter,
  SearchResponseItem,
  startOfUTCDay,
  UpdateAnimalPayload,
} from "@animeaux/shared-entities";
import { UserInputError } from "apollo-server";
import { addDays, subMonths } from "date-fns";
import * as admin from "firebase-admin";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import { v4 as uuid } from "uuid";
import { AnimalDatabase } from "../../databaseType";
import { SearchFilters } from "../../searchFilters";
import { AlgoliaClient } from "./algoliaClient";
import { animalBreedDatabase } from "./animalBreed";

const AnimalsIndex = AlgoliaClient.initIndex("animals");
const SavedAnimalsIndex = AlgoliaClient.initIndex("saved_animals");

function cleanMarkdown(content: string) {
  // Preserve whitespaces unless it's all there is in it.
  if (content.trim() === "") {
    return "";
  }

  return content;
}

export const animalDatabase: AnimalDatabase = {
  async getAllAdoptableAnimals(
    parameters: PaginatedRequestParameters<PublicAnimalFilters>
  ): Promise<PaginatedResponse<DBSearchableAnimal>> {
    const searchFilters: string[] = [];

    searchFilters.push(
      SearchFilters.createFilter(
        ADOPTABLE_ANIMAL_STATUS.map((status) =>
          SearchFilters.createFilterValue("status", status)
        )
      )
    );

    if (parameters.species != null) {
      const species = parameters.species;
      searchFilters.push(SearchFilters.createFilterValue("species", species));

      const animalSpeciesAgeRanges = AnimalAgeRangeBySpecies[species];
      if (parameters.age != null && animalSpeciesAgeRanges != null) {
        const ageRange = animalSpeciesAgeRanges[parameters.age];
        if (ageRange != null) {
          const today = startOfUTCDay(new Date());

          // The `maxMonths` has the lowest timestamp value.
          const minTimestamp = addDays(
            subMonths(today, ageRange.maxMonths),
            1
          ).getTime();

          const maxTimestamp = subMonths(today, ageRange.minMonths).getTime();

          searchFilters.push(
            SearchFilters.createFilterValue(
              "birthdateTimestamp",
              `${minTimestamp} TO ${maxTimestamp}`
            )
          );
        }
      }
    }

    const result = await AnimalsIndex.search<DBSearchableAnimal>("", {
      page: parameters.page ?? 0,
      hitsPerPage: parameters.hitsPerPage ?? undefined,
      filters: SearchFilters.createFilters(searchFilters),
    });

    return {
      hits: result.hits,
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
    };
  },

  async getAllSavedAnimals(
    parameters: PaginatedRequestParameters
  ): Promise<PaginatedResponse<DBSearchableAnimal>> {
    const result = await SavedAnimalsIndex.search<DBSearchableAnimal>("", {
      page: parameters.page ?? 0,
      hitsPerPage: parameters.hitsPerPage ?? undefined,
      filters: SearchFilters.createFilter(
        SAVED_ANIMAL_STATUS.map((status) =>
          SearchFilters.createFilterValue("status", status)
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
        SearchFilters.createFilter(
          parameters.status.map((status) =>
            SearchFilters.createFilterValue("status", status)
          )
        )
      );
    }

    if (parameters.species != null && parameters.species.length > 0) {
      searchFilters.push(
        SearchFilters.createFilter(
          parameters.species.map((species) =>
            SearchFilters.createFilterValue("species", species)
          )
        )
      );
    }

    if (parameters.hostFamilyId != null) {
      searchFilters.push(
        SearchFilters.createFilterValue("hostFamilyId", parameters.hostFamilyId)
      );
    }

    const result = await AnimalsIndex.search<DBSearchableAnimal>(
      parameters.search ?? "",
      {
        page: parameters.page ?? 0,
        filters: SearchFilters.createFilters(searchFilters),
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
      filters: SearchFilters.createFilter(
        ACTIVE_ANIMAL_STATUS.map((status) =>
          SearchFilters.createFilterValue("status", status)
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

  async getAdoptableAnimal(id: string): Promise<DBAnimal | null> {
    const animalBreedSnapshot = await admin
      .firestore()
      .collection("animals")
      .doc(id)
      .get();

    const animal = (animalBreedSnapshot.data() as DBAnimal) ?? null;

    if (animal != null && ADOPTABLE_ANIMAL_STATUS.includes(animal.status)) {
      return animal;
    }

    return null;
  },

  async searchLocation(
    parameters: SearchFilter
  ): Promise<SearchResponseItem[]> {
    const response = await AnimalsIndex.searchForFacetValues(
      "pickUpLocation",
      parameters.search ?? "",
      {
        // Use markdown style bold.
        highlightPreTag: "**",
        highlightPostTag: "**",
      }
    );

    return response.facetHits;
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

    const pickUpLocation = payload.pickUpLocation.trim();
    if (pickUpLocation === "") {
      throw new UserInputError(ErrorCode.ANIMAL_MISSING_PICK_UP_LOCATION);
    }

    if (
      payload.status === AnimalStatus.ADOPTED &&
      !isValidDate(payload.adoptionDate ?? "")
    ) {
      throw new UserInputError(ErrorCode.ANIMAL_MISSING_ADOPTION_DATE);
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
      pickUpLocation,
      pickUpDateTimestamp: new Date(payload.pickUpDate).getTime(),
      pickUpReason: payload.pickUpReason,
      avatarId: payload.avatarId,
      hostFamilyId: payload.hostFamilyId,
      isOkChildren: payload.isOkChildren,
      isOkDogs: payload.isOkDogs,
      isOkCats: payload.isOkCats,
      isSterilized: payload.isSterilized,
    };

    if (
      payload.status === AnimalStatus.ADOPTED &&
      // Already checked, but just for TS
      payload.adoptionDate != null
    ) {
      searchableAnimal.adoptionDate = payload.adoptionDate;
      searchableAnimal.adoptionDateTimestamp = new Date(
        payload.adoptionDate
      ).getTime();

      if (
        payload.adoptionOption != null &&
        payload.adoptionOption !== AdoptionOption.UNKNOWN
      ) {
        searchableAnimal.adoptionOption = payload.adoptionOption;
      }
    }

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

    if (payload.pickUpLocation != null) {
      const pickUpLocation = payload.pickUpLocation.trim();
      if (pickUpLocation !== animal.pickUpLocation) {
        searchableAnimalUpdate.pickUpLocation = pickUpLocation;
      }
    }

    if (
      payload.pickUpReason != null &&
      payload.pickUpReason !== animal.pickUpReason
    ) {
      searchableAnimalUpdate.pickUpReason = payload.pickUpReason;
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

    // Allow null to clear the field.
    if (
      payload.hostFamilyId !== undefined &&
      payload.hostFamilyId !== animal.hostFamilyId
    ) {
      searchableAnimalUpdate.hostFamilyId = payload.hostFamilyId;
    }

    if (payload.status != null && payload.status !== animal.status) {
      searchableAnimalUpdate.status = payload.status;

      if (
        [
          AnimalStatus.ADOPTED,
          AnimalStatus.DECEASED,
          AnimalStatus.FREE,
        ].includes(payload.status)
      ) {
        searchableAnimalUpdate.hostFamilyId = null;
      }

      if (
        // The animal is now adopted.
        searchableAnimalUpdate.status === AnimalStatus.ADOPTED &&
        // The adoptionDate is required (set bellow).
        payload.adoptionDate == null
      ) {
        throw new UserInputError(ErrorCode.ANIMAL_MISSING_ADOPTION_DATE);
      }

      // The animal is no longer adopted.
      if (animal.status === AnimalStatus.ADOPTED) {
        searchableAnimalUpdate.adoptionDate = null;
        searchableAnimalUpdate.adoptionDateTimestamp = null;
        searchableAnimalUpdate.adoptionOption = null;
      }
    }

    const status = searchableAnimalUpdate.status ?? animal.status;
    if (status === AnimalStatus.ADOPTED) {
      if (payload.adoptionDate != null) {
        if (!isValidDate(payload.adoptionDate)) {
          throw new UserInputError(ErrorCode.ANIMAL_MISSING_ADOPTION_DATE);
        }

        searchableAnimalUpdate.adoptionDate = payload.adoptionDate;
        searchableAnimalUpdate.adoptionDateTimestamp = new Date(
          payload.adoptionDate
        ).getTime();
      }

      if (payload.adoptionOption != null) {
        if (payload.adoptionOption === AdoptionOption.UNKNOWN) {
          searchableAnimalUpdate.adoptionOption = null;
        } else {
          searchableAnimalUpdate.adoptionOption = payload.adoptionOption;
        }
      }
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
