import { ErrorCode } from "@animeaux/shared-entities";
import { ClientError, GraphQLClient } from "graphql-request";
import invariant from "invariant";
import { firebase } from "../firebase";

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
      const message = isClientError(error)
        ? error.response.errors?.[0].message ?? "GraphQL Error"
        : (error.message as string);

      throw new Error(message);
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

function isClientError(error: Error): error is ClientError {
  return error instanceof ClientError;
}
