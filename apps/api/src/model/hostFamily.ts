import {
  CreateHostFamilyPayload,
  HostFamilySearch,
  PaginatedRequestParameters,
  UpdateHostFamilyPayload,
} from "@animeaux/shared-entities";
import { gql, IResolverObject } from "apollo-server";
import { database } from "../database";

const typeDefs = gql`
  type HostFamily {
    id: ID!
    name: String!
    phone: String!
    email: String!
    zipCode: String!
    city: String!
    address: String!
  }

  type AllHostFamiliesResponse {
    hits: [HostFamily!]!
    hitsTotalCount: Int!
    page: Int!
    pageCount: Int!
  }

  extend type Query {
    getAllHostFamilies(search: String, page: Int): AllHostFamiliesResponse!
      @auth(groups: [ADMIN, ANIMAL_MANAGER])

    getHostFamily(id: ID!): HostFamily @auth(groups: [ADMIN, ANIMAL_MANAGER])
  }

  extend type Mutation {
    createHostFamily(
      name: String!
      phone: String!
      email: String!
      zipCode: String!
      city: String!
      address: String!
    ): HostFamily! @auth(groups: [ADMIN, ANIMAL_MANAGER])

    updateHostFamily(
      id: ID!
      name: String
      phone: String
      email: String
      zipCode: String
      city: String
      address: String
    ): HostFamily! @auth(groups: [ADMIN, ANIMAL_MANAGER])

    deleteHostFamily(id: ID!): Boolean! @auth(groups: [ADMIN, ANIMAL_MANAGER])
  }
`;

const queries: IResolverObject = {
  getAllHostFamilies: async (
    parent: any,
    parameters: PaginatedRequestParameters<HostFamilySearch>
  ) => {
    return await database.getAllHostFamilies(parameters);
  },

  getHostFamily: async (parent: any, { id }: { id: string }) => {
    return await database.getHostFamily(id);
  },
};

const mutations: IResolverObject = {
  createHostFamily: async (parent: any, payload: CreateHostFamilyPayload) => {
    return await database.createHostFamily(payload);
  },

  updateHostFamily: async (parent: any, payload: UpdateHostFamilyPayload) => {
    return await database.updateHostFamily(payload);
  },

  deleteHostFamily: async (parent: any, { id }: { id: string }) => {
    return await database.deleteHostFamily(id);
  },
};

export const HostFamilyModel = {
  typeDefs,
  queries,
  mutations,
};
