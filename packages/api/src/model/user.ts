import { DBUser, DBUserForQueryContext, UserFilters } from "@animeaux/shared";
import { gql, IResolverObject, IResolvers } from "apollo-server";
import { database } from "../database";
import { QueryContext } from "./shared";

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    displayName: String!
    role: UserRole!
  }

  extend type Query {
    getCurrentUser: User
    getAllUsers(roleId: ID): [User!]! @auth
    getUser(id: ID!): User @auth
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

  getAllUsers: async (parent: any, filters: UserFilters): Promise<DBUser[]> => {
    return await database.getAllUsers(filters);
  },

  getUser: async (
    parent: any,
    { id }: { id: string }
  ): Promise<DBUser | null> => {
    return await database.getUser(id);
  },
};

export const UserModel = {
  typeDefs,
  queries,
  resolvers,
};
