import { CreateUserRolePayload, DBUserRole } from "@animeaux/shared";
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
};

export const UserRoleModel = {
  typeDefs,
  resolvers,
  queries,
  mutations,
};
