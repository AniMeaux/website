import {
  CreateUserPayload,
  DBUser,
  DBUserForQueryContext,
  UpdateUserPayload,
  UserFilters,
} from "@animeaux/shared";
import { gql, IResolverObject, IResolvers } from "apollo-server";
import { database } from "../database";
import { QueryContext } from "./shared";

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    displayName: String!
    role: UserRole!
    disabled: Boolean!
  }

  extend type Query {
    getCurrentUser: User
    getAllUsers(roleId: ID): [User!]! @auth
    getUser(id: ID!): User @auth
  }

  extend type Mutation {
    createUser(
      email: String!
      displayName: String!
      password: String!
      roleId: ID!
    ): User! @auth(resourceKey: "user")

    updateUser(
      id: ID!
      displayName: String
      password: String
      roleId: ID
    ): User! @auth(resourceKey: "user")

    deleteUser(id: ID!): Boolean! @auth(resourceKey: "user")
    toggleUserBlockedStatus(id: ID!): User! @auth(resourceKey: "user")
  }
`;

function hasUserRole(
  user: DBUser | DBUserForQueryContext
): user is DBUserForQueryContext {
  return "role" in user;
}

const resolvers: IResolvers = {
  User: {
    role: async (user: DBUser | DBUserForQueryContext) => {
      // The user object can come from the context in which case the role has
      // already been fetched.
      // See `getCurrentUser` bellow.
      if (hasUserRole(user)) {
        return user.role;
      }

      return await database.getUserRole(user.roleId);
    },
  },
};

const queries: IResolverObject = {
  getCurrentUser: async (
    parent: any,
    args: any,
    context: QueryContext
  ): Promise<DBUserForQueryContext | null> => {
    return context.user;
  },

  getAllUsers: async (
    parent: any,
    filters: UserFilters,
    context: QueryContext
  ): Promise<DBUser[]> => {
    return await database.getAllUsers(context.user, filters);
  },

  getUser: async (
    parent: any,
    { id }: { id: string },
    context: QueryContext
  ): Promise<DBUser | null> => {
    return await database.getUser(context.user, id);
  },
};

const mutations: IResolverObject = {
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
  resolvers,
  queries,
  mutations,
};
