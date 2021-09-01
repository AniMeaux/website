import {
  AnimalSearch,
  CreateAnimalPayload,
  DBAnimal,
  DBSearchableAnimal,
  PaginatedRequestParameters,
  PublicAnimalFilters,
  SearchFilter,
  UpdateAnimalPayload,
} from "@animeaux/shared-entities";
import { gql, IResolverObject, IResolvers } from "apollo-server";
import { database } from "../database";

const typeDefs = gql`
  enum AnimalAge {
    JUNIOR
    ADULT
    SENIOR
  }

  enum AnimalStatus {
    ADOPTED
    DECEASED
    FREE
    OPEN_TO_ADOPTION
    OPEN_TO_RESERVATION
    RESERVED
    UNAVAILABLE
  }

  enum AnimalGender {
    FEMALE
    MALE
  }

  enum PickUpReason {
    ABANDONMENT
    DECEASED_MASTER
    MISTREATMENT
    STRAY_ANIMAL
    OTHER
  }

  enum AdoptionOption {
    WITH_STERILIZATION
    WITHOUT_STERILIZATION
    FREE_DONATION
    UNKNOWN
  }

  type PublicSearchableAnimal {
    id: ID!
    officialName: String!
    birthdate: String!
    gender: AnimalGender!
    species: AnimalSpecies!
    breed: AnimalBreed
    color: AnimalColor
    avatarId: String!
    isOkChildren: Trilean!
    isOkDogs: Trilean!
    isOkCats: Trilean!
    isSterilized: Boolean
  }

  type SearchableAnimal {
    id: ID!
    officialName: String!
    commonName: String!
    birthdate: String!
    pickUpDate: String!
    pickUpLocation: String
    pickUpReason: PickUpReason!
    gender: AnimalGender!
    species: AnimalSpecies!
    breed: AnimalBreed
    color: AnimalColor
    status: AnimalStatus!
    adoptionDate: String
    adoptionOption: AdoptionOption
    avatarId: String!
    hostFamily: HostFamily
    isOkChildren: Trilean!
    isOkDogs: Trilean!
    isOkCats: Trilean!
    isSterilized: Boolean
  }

  type PublicAnimal {
    id: ID!
    officialName: String!
    birthdate: String!
    gender: AnimalGender!
    species: AnimalSpecies!
    breed: AnimalBreed
    color: AnimalColor
    description: String!
    avatarId: String!
    picturesId: [String!]!
    isOkChildren: Trilean!
    isOkDogs: Trilean!
    isOkCats: Trilean!
    isSterilized: Boolean!
  }

  type Animal {
    id: ID!
    officialName: String!
    commonName: String!
    birthdate: String!
    pickUpDate: String!
    pickUpLocation: String
    pickUpReason: PickUpReason!
    gender: AnimalGender!
    species: AnimalSpecies!
    breed: AnimalBreed
    color: AnimalColor
    description: String!
    status: AnimalStatus!
    adoptionDate: String
    adoptionOption: AdoptionOption
    avatarId: String!
    picturesId: [String!]!
    hostFamily: HostFamily
    isOkChildren: Trilean!
    isOkDogs: Trilean!
    isOkCats: Trilean!
    isSterilized: Boolean!
    comments: String!
  }

  type AllPublicAnimalsResponse {
    hits: [PublicSearchableAnimal!]!
    hitsTotalCount: Int!
    page: Int!
    pageCount: Int!
  }

  type AllAnimalResponse {
    hits: [SearchableAnimal!]!
    hitsTotalCount: Int!
    page: Int!
    pageCount: Int!
  }

  type SearchResponseItem {
    value: String!
    highlighted: String!
    count: Int!
  }

  extend type Query {
    getAllAdoptableAnimals(
      page: Int
      hitsPerPage: Int
      species: AnimalSpecies
      age: AnimalAge
    ): AllPublicAnimalsResponse!

    getAllSavedAnimals(page: Int, hitsPerPage: Int): AllPublicAnimalsResponse!

    getAllAnimals(
      search: String
      page: Int
      status: [AnimalStatus!]
      species: [AnimalSpecies!]
      hostFamilyId: ID
    ): AllAnimalResponse! @auth(groups: [ADMIN, ANIMAL_MANAGER, VETERINARIAN])

    getAdoptableAnimal(id: ID!): PublicAnimal

    getAllActiveAnimals(search: String, page: Int): AllAnimalResponse!
      @auth(groups: [ADMIN, ANIMAL_MANAGER, VETERINARIAN])

    getAnimal(id: ID!): Animal
      @auth(groups: [ADMIN, ANIMAL_MANAGER, VETERINARIAN])

    searchLocation(search: String): [SearchResponseItem!]!
      @auth(groups: [ADMIN, ANIMAL_MANAGER])
  }

  extend type Mutation {
    createAnimal(
      officialName: String!
      commonName: String!
      birthdate: String!
      pickUpDate: String!
      pickUpLocation: String!
      pickUpReason: PickUpReason!
      gender: AnimalGender!
      species: AnimalSpecies!
      breedId: ID
      colorId: ID
      description: String!
      status: AnimalStatus!
      adoptionDate: String
      adoptionOption: AdoptionOption
      avatarId: String!
      picturesId: [String!]!
      hostFamilyId: ID
      isOkChildren: Trilean!
      isOkDogs: Trilean!
      isOkCats: Trilean!
      isSterilized: Boolean!
      comments: String!
    ): Animal! @auth(groups: [ADMIN, ANIMAL_MANAGER])

    updateAnimal(
      id: ID!
      officialName: String
      commonName: String
      birthdate: String
      pickUpDate: String
      pickUpLocation: String
      pickUpReason: PickUpReason
      gender: AnimalGender
      species: AnimalSpecies
      breedId: ID
      colorId: ID
      description: String
      status: AnimalStatus
      adoptionDate: String
      adoptionOption: AdoptionOption
      avatarId: String
      picturesId: [String!]
      hostFamilyId: ID
      isOkChildren: Trilean
      isOkDogs: Trilean
      isOkCats: Trilean
      isSterilized: Boolean
      comments: String
    ): Animal! @auth(groups: [ADMIN, ANIMAL_MANAGER])

    deleteAnimal(id: ID!): Boolean! @auth(groups: [ADMIN, ANIMAL_MANAGER])
  }
`;

const resolvers: IResolvers = {
  PublicSearchableAnimal: {
    breed: async (animal: DBSearchableAnimal) => {
      if (animal.breedId == null) {
        return null;
      }

      return await database.getAnimalBreed(animal.breedId);
    },

    color: async (animal: DBSearchableAnimal) => {
      if (animal.colorId != null) {
        return await database.getAnimalColor(animal.colorId);
      }

      return null;
    },
  },

  SearchableAnimal: {
    commonName: (animal: DBSearchableAnimal) => {
      return animal.commonName ?? "";
    },

    breed: async (animal: DBSearchableAnimal) => {
      if (animal.breedId == null) {
        return null;
      }

      return await database.getAnimalBreed(animal.breedId);
    },

    color: async (animal: DBSearchableAnimal) => {
      if (animal.colorId != null) {
        return await database.getAnimalColor(animal.colorId);
      }

      return null;
    },

    hostFamily: async (animal: DBSearchableAnimal) => {
      if (animal.hostFamilyId == null) {
        return null;
      }

      return await database.getHostFamily(animal.hostFamilyId);
    },
  },

  PublicAnimal: {
    breed: async (animal: DBAnimal) => {
      if (animal.breedId == null) {
        return null;
      }

      return await database.getAnimalBreed(animal.breedId);
    },

    color: async (animal: DBAnimal) => {
      if (animal.colorId != null) {
        return await database.getAnimalColor(animal.colorId);
      }

      return null;
    },

    description: (animal: DBAnimal) => {
      return animal.description ?? "";
    },
  },

  Animal: {
    commonName: (animal: DBAnimal) => {
      return animal.commonName ?? "";
    },

    breed: async (animal: DBAnimal) => {
      if (animal.breedId == null) {
        return null;
      }

      return await database.getAnimalBreed(animal.breedId);
    },

    color: async (animal: DBAnimal) => {
      if (animal.colorId != null) {
        return await database.getAnimalColor(animal.colorId);
      }

      return null;
    },

    description: (animal: DBAnimal) => {
      return animal.description ?? "";
    },

    hostFamily: async (animal: DBAnimal) => {
      if (animal.hostFamilyId == null) {
        return null;
      }

      return await database.getHostFamily(animal.hostFamilyId);
    },

    comments: (animal: DBAnimal) => {
      return animal.comments ?? "";
    },
  },
};

const queries: IResolverObject = {
  getAllAdoptableAnimals: async (
    parent: any,
    parameters: PaginatedRequestParameters<PublicAnimalFilters>
  ) => {
    return await database.getAllAdoptableAnimals(parameters);
  },

  getAllSavedAnimals: async (
    parent: any,
    parameters: PaginatedRequestParameters
  ) => {
    return await database.getAllSavedAnimals(parameters);
  },

  getAllAnimals: async (
    parent: any,
    parameters: PaginatedRequestParameters<AnimalSearch>
  ) => {
    return await database.getAllAnimals(parameters);
  },

  getAllActiveAnimals: async (
    parent: any,
    parameters: PaginatedRequestParameters
  ) => {
    return await database.getAllActiveAnimals(parameters);
  },

  getAdoptableAnimal: async (parent: any, { id }: { id: string }) => {
    return await database.getAdoptableAnimal(id);
  },

  getAnimal: async (parent: any, { id }: { id: string }) => {
    return await database.getAnimal(id);
  },

  searchLocation: async (parent: any, filters: SearchFilter) => {
    return await database.searchLocation(filters);
  },
};

const mutations: IResolverObject = {
  createAnimal: async (
    parent: any,
    payload: CreateAnimalPayload
  ): Promise<DBAnimal> => {
    return await database.createAnimal(payload);
  },

  updateAnimal: async (parent: any, payload: UpdateAnimalPayload) => {
    return await database.updateAnimal(payload);
  },

  deleteAnimal: async (parent: any, { id }: { id: string }) => {
    return await database.deleteAnimal(id);
  },
};

export const AnimalModel = {
  typeDefs,
  resolvers,
  queries,
  mutations,
};
