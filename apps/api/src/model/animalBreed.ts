import {
  AnimalBreedSearch,
  CreateAnimalBreedPayload,
  PaginatedRequestParameters,
  UpdateAnimalBreedPayload,
} from "@animeaux/shared-entities";
import { gql } from "apollo-server";
import { database } from "../database";

const typeDefs = gql`
  enum AnimalSpecies {
    BIRD
    CAT
    DOG
    REPTILE
    RODENT
  }

  type AnimalBreed {
    id: ID!
    name: String!
    species: AnimalSpecies!
  }

  type AllAnimalBreedsResponse {
    hits: [AnimalBreed!]!
    hitsTotalCount: Int!
    page: Int!
    pageCount: Int!
  }

  extend type Query {
    getAllAnimalBreeds(
      search: String
      page: Int
      species: AnimalSpecies
    ): AllAnimalBreedsResponse!
      @auth(groups: [ADMIN, ANIMAL_MANAGER, VETERINARIAN])

    getAnimalBreed(id: ID!): AnimalBreed
      @auth(groups: [ADMIN, ANIMAL_MANAGER, VETERINARIAN])
  }

  extend type Mutation {
    createAnimalBreed(name: String!, species: AnimalSpecies!): AnimalBreed!
      @auth(groups: [ADMIN])

    updateAnimalBreed(
      id: ID!
      name: String
      species: AnimalSpecies
    ): AnimalBreed! @auth(groups: [ADMIN])

    deleteAnimalBreed(id: ID!): Boolean! @auth(groups: [ADMIN])
  }
`;

const queries = {
  getAllAnimalBreeds: async (
    parent: any,
    parameters: PaginatedRequestParameters<AnimalBreedSearch>
  ) => {
    return await database.getAllAnimalBreeds(parameters);
  },

  getAnimalBreed: async (parent: any, { id }: { id: string }) => {
    return await database.getAnimalBreed(id);
  },
};

const mutations = {
  createAnimalBreed: async (parent: any, payload: CreateAnimalBreedPayload) => {
    return await database.createAnimalBreed(payload);
  },

  updateAnimalBreed: async (parent: any, payload: UpdateAnimalBreedPayload) => {
    return await database.updateAnimalBreed(payload);
  },

  deleteAnimalBreed: async (parent: any, { id }: { id: string }) => {
    return await database.deleteAnimalBreed(id);
  },
};

export const AnimalBreedModel = {
  typeDefs,
  queries,
  mutations,
};
