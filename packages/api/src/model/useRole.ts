import { CreateUserRolePayload } from "@animeaux/shared";
import { gql, IResolverObject } from "apollo-server";
import { database } from "../database";

const typeDefs = gql`
  type UserRole {
    id: ID!
    name: String!
    resourcePermissions: JSONObject!
  }

  extend type Query {
    getAllUserRoles: [UserRole!]! @auth
    getUserRole(id: ID!): UserRole @auth
  }

  extend type Mutation {
    createUserRole(name: String!, resourcePermissions: JSONObject!): UserRole
      @auth(resourceKey: "user_role")
  }
`;

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
};

export const UserRoleModel = {
  typeDefs,
  queries,
  mutations,
};
