import {
  AnimalColorSearch,
  CreateAnimalColorPayload,
  PaginatedRequestParameters,
  UpdateAnimalColorPayload,
} from "@animeaux/shared-entities";
import { gql } from "apollo-server";
import { database } from "../database";

const typeDefs = gql`
  type AnimalColor {
    id: ID!
    name: String!
  }

  type AllAnimalColorsResponse {
    hits: [AnimalColor!]!
    hitsTotalCount: Int!
    page: Int!
    pageCount: Int!
  }

  extend type Query {
    getAllAnimalColors(search: String, page: Int): AllAnimalColorsResponse!
      @auth(groups: [ADMIN, ANIMAL_MANAGER, VETERINARIAN])

    getAnimalColor(id: ID!): AnimalColor
      @auth(groups: [ADMIN, ANIMAL_MANAGER, VETERINARIAN])
  }

  extend type Mutation {
    createAnimalColor(name: String!): AnimalColor! @auth(groups: [ADMIN])

    updateAnimalColor(id: ID!, name: String): AnimalColor!
      @auth(groups: [ADMIN])

    deleteAnimalColor(id: ID!): Boolean! @auth(groups: [ADMIN])
  }
`;

const queries = {
  getAllAnimalColors: async (
    parent: any,
    parameters: PaginatedRequestParameters<AnimalColorSearch>
  ) => {
    return await database.getAllAnimalColors(parameters);
  },

  getAnimalColor: async (parent: any, { id }: { id: string }) => {
    return await database.getAnimalColor(id);
  },
};

const mutations = {
  createAnimalColor: async (parent: any, payload: CreateAnimalColorPayload) => {
    return await database.createAnimalColor(payload);
  },

  updateAnimalColor: async (parent: any, payload: UpdateAnimalColorPayload) => {
    return await database.updateAnimalColor(payload);
  },

  deleteAnimalColor: async (parent: any, { id }: { id: string }) => {
    return await database.deleteAnimalColor(id);
  },
};

export const AnimalColorModel = {
  typeDefs,
  queries,
  mutations,
};
