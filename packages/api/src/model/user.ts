import { DBUser, User } from "@animeaux/shared";
import { gql, IResolverObject, IResolvers } from "apollo-server";
import { database } from "../database";
import { QueryContext } from "./shared";

const typeDefs = gql`
  type UserRole {
    id: ID!
    name: String!
    resourcePermissions: JSONObject!
  }

  type User {
    id: ID!
    email: String!
    displayName: String
    role: UserRole!
  }

  extend type Query {
    # User role
    getUserRole(id: ID!): UserRole @auth

    # User
    getCurrentUser: User
    getUser(id: ID!): User @auth
  }
`;

function hasUserRole(user: DBUser | User): user is User {
  return "role" in user;
}

const resolvers: IResolvers = {
  User: {
    role: async (user: DBUser | User) => {
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
  getUserRole: async (parent: any, { id }: { id: string }) => {
    return await database.getUserRole(id);
  },

  getCurrentUser: async (parent: any, args: any, context: QueryContext) => {
    return context.user;
  },

  getUser: async (parent: any, { id }: { id: string }) => {
    return await database.getUser(id);
  },
};

export const UserModel = {
  typeDefs,
  queries,
  resolvers,
};
