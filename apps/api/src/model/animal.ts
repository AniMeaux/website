import {
  AnimalSearch,
  CreateAnimalPayload,
  DBAnimal,
  DBSearchableAnimal,
  PaginatedRequestParameters,
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

  enum AnimalColorEnum {
    BEIGE
    BLACK
    BLACK_AND_WHITE
    BLUE
    BRINDLE
    BROWN
    BROWN_AND_WHITE
    CHOCOLATE
    CREAM
    FAWN
    FAWN_AND_BLACK
    GINGER
    GINGER_AND_TABBY
    GINGER_AND_WHITE
    GRAY
    GRAY_AND_TABBY
    GRAY_AND_WHITE
    MERLE_BLUE
    SIAMESE_TYPE
    TABBY
    TORTOISE_SHELL
    TRICOLOR
    WHITE
    WHITE_AND_TABBY
  }

  type SearchableAnimal {
    id: ID!
    officialName: String!
    commonName: String!
    birthdate: String!
    pickUpDate: String!
    gender: AnimalGender!
    species: AnimalSpecies!
    breed: AnimalBreed
    color: AnimalColorEnum
    status: AnimalStatus!
    avatarId: String!
    hostFamily: HostFamily
    isOkChildren: Trilean!
    isOkDogs: Trilean!
    isOkCats: Trilean!
    isSterilized: Boolean
  }

  type Animal {
    id: ID!
    officialName: String!
    commonName: String!
    birthdate: String!
    pickUpDate: String!
    gender: AnimalGender!
    species: AnimalSpecies!
    breed: AnimalBreed
    color: AnimalColorEnum
    description: String!
    status: AnimalStatus!
    avatarId: String!
    picturesId: [String!]!
    hostFamily: HostFamily
    isOkChildren: Trilean!
    isOkDogs: Trilean!
    isOkCats: Trilean!
    isSterilized: Boolean!
    comments: String!
  }

  type AllAnimalResponse {
    hits: [SearchableAnimal!]!
    hitsTotalCount: Int!
    page: Int!
    pageCount: Int!
  }

  extend type Query {
    getAllAnimals(
      search: String
      page: Int
      status: [AnimalStatus!]
      hostFamilyId: ID
    ): AllAnimalResponse! @auth(groups: [ADMIN, ANIMAL_MANAGER, VETERINARIAN])

    getAllActiveAnimals(search: String, page: Int): AllAnimalResponse!
      @auth(groups: [ADMIN, ANIMAL_MANAGER, VETERINARIAN])

    getAnimal(id: ID!): Animal
      @auth(groups: [ADMIN, ANIMAL_MANAGER, VETERINARIAN])
  }

  extend type Mutation {
    createAnimal(
      officialName: String!
      commonName: String!
      birthdate: String!
      pickUpDate: String!
      gender: AnimalGender!
      species: AnimalSpecies!
      breedId: ID
      color: AnimalColorEnum
      description: String!
      status: AnimalStatus!
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
      gender: AnimalGender
      species: AnimalSpecies
      breedId: ID
      color: AnimalColorEnum
      description: String
      status: AnimalStatus
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

    hostFamily: async (animal: DBSearchableAnimal) => {
      if (animal.hostFamilyId == null) {
        return null;
      }

      return await database.getHostFamily(animal.hostFamilyId);
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

  getAnimal: async (parent: any, { id }: { id: string }) => {
    return await database.getAnimal(id);
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
