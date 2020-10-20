import {
  CreateUserRolePayload,
  DBUserRole,
  UpdateUserRolePayload,
} from "@animeaux/shared";
import { gql, IResolverObject, IResolvers } from "apollo-server";
import { database } from "../database";

const typeDefs = gql`
  type UserRole {
    id: ID!
    name: String!
    resourcePermissions: JSONObject!
    users: [User!]!
  }

  extend type Query {
    getAllUserRoles: [UserRole!]! @auth
    getUserRole(id: ID!): UserRole @auth
  }

  extend type Mutation {
    createUserRole(name: String!, resourcePermissions: JSONObject!): UserRole
      @auth(resourceKey: "user_role")

    updateUserRole(
      id: ID!
      name: String
      resourcePermissions: JSONObject
    ): UserRole @auth(resourceKey: "user_role")

    deleteUserRole(id: ID!): Boolean! @auth(resourceKey: "user_role")
  }
`;

const resolvers: IResolvers = {
  UserRole: {
    users: async (userRole: DBUserRole) => {
      return await database.getAllUsers({ roleId: userRole.id });
    },
  },
};

const queries: IResolverObject = {
  getAllUserRoles: async () => {
    return await database.getAllUserRoles();
  },

  getUserRole: async (parent: any, { id }: { id: string }) => {
    return await database.getUserRole(id);
  },
};

const mutations: IResolverObject = {
  createUserRole: async (parent: any, payload: CreateUserRolePayload) => {
    return await database.createUserRole(payload);
  },

  updateUserRole: async (parent: any, payload: UpdateUserRolePayload) => {
    return await database.updateUserRole(payload);
  },

  deleteUserRole: async (parent: any, { id }: { id: string }) => {
    return await database.deleteUserRole(id);
  },
};

export const UserRoleModel = {
  typeDefs,
  resolvers,
  queries,
  mutations,
};
