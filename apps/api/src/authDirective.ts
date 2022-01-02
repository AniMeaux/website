import {
  doesGroupsIntersect,
  ErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { AuthenticationError, gql } from "apollo-server";
import { defaultFieldResolver, GraphQLSchema } from "graphql";
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

function schemaTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      if (typeName === "Query" || typeName === "Mutation") {
        const { resolve = defaultFieldResolver } = fieldConfig;
        const directive = getDirective(schema, fieldConfig, "auth")?.[0];

        if (directive == null) {
          return fieldConfig;
        }

        const authorisedGroups: UserGroup[] | null = directive["groups"];

        fieldConfig.resolve = async (
          root,
          args,
          context: AuthContext,
          info
        ) => {
          if (context.user == null) {
            throw new AuthenticationError(ErrorCode.AUTH_NOT_AUTHENTICATED);
          }

          if (
            authorisedGroups != null &&
            !doesGroupsIntersect(context.user.groups, authorisedGroups)
          ) {
            throw new AuthenticationError(ErrorCode.AUTH_NOT_AUTHORIZED);
          }

          return resolve.apply(resolve, [root, args, context, info]);
        };
      }

      return fieldConfig;
    },
  });
}

export const AuthDirective = {
  typeDefs,
  schemaTransformer,
};
