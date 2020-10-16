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
`;

const queries: IResolverObject = {
  getAllUserRoles: async () => {
    return await database.getAllUserRoles();
  },

  getUserRole: async (parent: any, { id }: { id: string }) => {
    return await database.getUserRole(id);
  },
};

export const UserRoleModel = {
  typeDefs,
  queries,
};
