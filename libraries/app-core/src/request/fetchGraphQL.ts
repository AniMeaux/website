import { ErrorCode } from "@animeaux/shared-entities";
import firebase from "firebase/app";
import { GraphQLClient } from "graphql-request";
import invariant from "invariant";

let graphQlClient: GraphQLClient | null;

export function initializeGraphQlClient(apiUrl: string) {
  if (graphQlClient == null) {
    graphQlClient = new GraphQLClient(apiUrl);
  }
}

type fetchGraphQLOptions<Variables> = {
  variables?: Variables;
};

export async function fetchGraphQL<DataType = null, Variables = object>(
  query: string,
  { variables }: fetchGraphQLOptions<Variables> = {}
): Promise<DataType> {
  async function fetchWithHeaders() {
    invariant(
      graphQlClient != null,
      "initializeGraphQlClient should be called before any call to fetchGraphQL."
    );

    graphQlClient.setHeaders({
      Authorisation: `Bearer ${localStorage.getItem("token")}`,
    });

    try {
      return await graphQlClient.request(query, variables);
    } catch (error) {
      // Unwrap graphql-request's error messages.
      // See https://github.com/prisma-labs/graphql-request/blob/c75a29a9a2a177b0cddb41718b333fb14c9d9917/src/types.ts#L28
      throw new Error((error.message as string).replace(/:\s*\{.*\}/, ""));
    }
  }

  try {
    return await fetchWithHeaders();
  } catch (error) {
    if (error.message === ErrorCode.AUTH_NOT_AUTHENTICATED) {
      const currentUser = firebase.auth().currentUser;

      // Re-try the call after refreshing the token.
      if (currentUser != null) {
        await currentUser.reload();
        return await fetchWithHeaders();
      }
    }

    throw error;
  }
}
