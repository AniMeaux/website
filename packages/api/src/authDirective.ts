import { ErrorCode, ResourceKey } from "@animeaux/shared";
import {
  AuthenticationError,
  gql,
  SchemaDirectiveVisitor,
} from "apollo-server";
import { defaultFieldResolver, GraphQLField } from "graphql";
import { QueryContext } from "./model/shared";

const typeDefs = gql`
  directive @auth(resourceKey: String) on FIELD_DEFINITION
`;

class AuthDirectiveVisitor extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const resourceKey: ResourceKey | null = this.args.resourceKey;
    const originalResolve = field.resolve || defaultFieldResolver;

    field.resolve = function (...args) {
      const { user }: QueryContext = args[2];

      if (user == null) {
        throw new AuthenticationError(ErrorCode.AUTH_NOT_AUTHENTICATED);
      }

      if (resourceKey != null && !user.role.resourcePermissions[resourceKey]) {
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
