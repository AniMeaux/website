import { ErrorCode } from "@animeaux/shared-entities";
import { firebase } from "core/firebase";
import { ClientError, GraphQLClient } from "graphql-request";

const graphQlClient = new GraphQLClient(process.env.NEXT_PUBLIC_API_URL);

function isClientError(error: Error): error is ClientError {
  return error instanceof ClientError;
}

type FetchGraphQLOptions<Variables> = {
  variables?: Variables;
  headers?: HeadersInit;
};

async function baseFetchGraphQL<DataType = null, Variables = object>(
  query: string,
  { variables, headers }: FetchGraphQLOptions<Variables> = {}
): Promise<DataType> {
  if (headers != null) {
    graphQlClient.setHeaders(headers);
  }

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

export async function fetchGraphQL<DataType = null, Variables = object>(
  query: string,
  { variables }: FetchGraphQLOptions<Variables> = {}
): Promise<DataType> {
  try {
    return await baseFetchGraphQL(query, {
      variables,
      headers: {
        Authorisation: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    if (error.message === ErrorCode.AUTH_NOT_AUTHENTICATED) {
      const currentUser = firebase.auth().currentUser;

      // Re-try the call after refreshing the token.
      if (currentUser != null) {
        await currentUser.reload();
        return await baseFetchGraphQL(query, {
          variables,
          headers: {
            Authorisation: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
    }

    throw error;
  }
}
