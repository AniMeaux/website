import {
  AnimalBreedFilters,
  CreateAnimalBreedPayload,
  UpdateAnimalBreedPayload,
} from "@animeaux/shared-entities";
import { gql, IResolverObject } from "apollo-server";
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
    ): AllAnimalBreedsResponse! @auth

    getAnimalBreed(id: ID!): AnimalBreed @auth
  }

  extend type Mutation {
    createAnimalBreed(name: String!, species: AnimalSpecies!): AnimalBreed!
      @auth(resourceKey: "animal_breed")

    updateAnimalBreed(
      id: ID!
      name: String
      species: AnimalSpecies
    ): AnimalBreed! @auth(resourceKey: "animal_breed")

    deleteAnimalBreed(id: ID!): Boolean! @auth(resourceKey: "animal_breed")
  }
`;

const queries: IResolverObject = {
  getAllAnimalBreeds: async (parent: any, filters: AnimalBreedFilters) => {
    return await database.getAllAnimalBreeds(filters);
  },

  getAnimalBreed: async (parent: any, { id }: { id: string }) => {
    return await database.getAnimalBreed(id);
  },
};

const mutations: IResolverObject = {
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
