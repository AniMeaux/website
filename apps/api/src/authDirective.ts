import {
  doesGroupsIntersect,
  ErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  AuthenticationError,
  gql,
  SchemaDirectiveVisitor,
} from "apollo-server";
import { defaultFieldResolver, GraphQLField } from "graphql";
import { AuthContext } from "./model/shared";

const typeDefs = gql`
  enum UserGroup {
    ADMIN
    ANIMAL_MANAGER
    BLOGGER
    HEAD_OF_PARTNERSHIPS
    VETERINARIAN
  }

  directive @auth(groups: [UserGroup!]) on FIELD_DEFINITION
`;

class AuthDirectiveVisitor extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const authorisedGroups: UserGroup[] | null = this.args.groups;
    const originalResolve = field.resolve || defaultFieldResolver;

    field.resolve = function (...args) {
      const { user }: AuthContext = args[2];

      if (user == null) {
        throw new AuthenticationError(ErrorCode.AUTH_NOT_AUTHENTICATED);
      }

      if (
        authorisedGroups != null &&
        !doesGroupsIntersect(user.groups, authorisedGroups)
      ) {
        throw new AuthenticationError(ErrorCode.AUTH_NOT_AUTHORIZED);
      }

      return originalResolve.apply(this, args);
    };
  }
}

const schemaDirectives = {
  auth: AuthDirectiveVisitor,
};

export const AuthDirective = {
  typeDefs,
  schemaDirectives,
};
