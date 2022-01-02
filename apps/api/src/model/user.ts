import {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "@animeaux/shared-entities";
import { gql } from "apollo-server";
import { database } from "../database";
import { QueryContext } from "./shared";

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    displayName: String!
    groups: [UserGroup!]!
    disabled: Boolean!
  }

  extend type Query {
    getCurrentUser: User
    getAllUsers: [User!]! @auth(groups: [ADMIN])
    getUser(id: ID!): User @auth(groups: [ADMIN])
  }

  extend type Mutation {
    createUser(
      email: String!
      displayName: String!
      password: String!
      groups: [UserGroup!]!
    ): User! @auth(groups: [ADMIN])

    updateUser(
      id: ID!
      displayName: String
      password: String
      groups: [UserGroup!]
    ): User! @auth(groups: [ADMIN])

    deleteUser(id: ID!): Boolean! @auth(groups: [ADMIN])
    toggleUserBlockedStatus(id: ID!): User! @auth(groups: [ADMIN])
  }
`;

const queries = {
  getCurrentUser: async (
    parent: any,
    args: any,
    context: QueryContext
  ): Promise<User | null> => {
    return context.user;
  },

  getAllUsers: async (parent: any): Promise<User[]> => {
    return await database.getAllUsers();
  },

  getUser: async (
    parent: any,
    { id }: { id: string }
  ): Promise<User | null> => {
    return await database.getUser(id);
  },
};

const mutations = {
  createUser: async (parent: any, payload: CreateUserPayload) => {
    return await database.createUser(payload);
  },

  updateUser: async (
    parent: any,
    payload: UpdateUserPayload,
    context: QueryContext
  ) => {
    return await database.updateUser(context.user, payload);
  },

  deleteUser: async (
    parent: any,
    { id }: { id: string },
    context: QueryContext
  ) => {
    return await database.deleteUser(context.user, id);
  },

  toggleUserBlockedStatus: async (
    parent: any,
    { id }: { id: string },
    context: QueryContext
  ) => {
    return await database.toggleUserBlockedStatus(context.user, id);
  },
};

export const UserModel = {
  typeDefs,
  queries,
  mutations,
};
