import {
  CreateHostFamilyPayload,
  HostFamilyFilters,
  UpdateHostFamilyPayload,
} from "@animeaux/shared";
import { gql, IResolverObject } from "apollo-server";
import { database } from "../database";

const typeDefs = gql`
  type HostFamily {
    id: ID!
    name: String!
    address: String!
    phone: String!
  }

  type AllHostFamiliesResponse {
    hits: [HostFamily!]!
    hitsTotalCount: Int!
    page: Int!
    pageCount: Int!
  }

  extend type Query {
    getAllHostFamilies(search: String, page: Int): AllHostFamiliesResponse!
      @auth

    getHostFamily(id: ID!): HostFamily @auth
  }

  extend type Mutation {
    createHostFamily(
      name: String!
      address: String!
      phone: String!
    ): HostFamily! @auth(resourceKey: "host_family")

    updateHostFamily(
      id: ID!
      name: String
      address: String
      phone: String
    ): HostFamily! @auth(resourceKey: "host_family")

    deleteHostFamily(id: ID!): Boolean! @auth(resourceKey: "host_family")
  }
`;

const queries: IResolverObject = {
  getAllHostFamilies: async (parent: any, filters: HostFamilyFilters) => {
    return await database.getAllHostFamilies(filters);
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
