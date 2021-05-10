import { ClientError, GraphQLClient } from "graphql-request";
import invariant from "invariant";

let graphQlClient: GraphQLClient | null;

export function initializeGraphQlClient() {
  if (graphQlClient == null) {
    graphQlClient = new GraphQLClient(process.env.NEXT_PUBLIC_API_URL);
  }
}

export type FetchGraphQLOptions<Variables> = {
  variables?: Variables;
  headers?: HeadersInit;
};

export async function fetchGraphQL<DataType = null, Variables = object>(
  query: string,
  { variables, headers }: FetchGraphQLOptions<Variables> = {}
): Promise<DataType> {
  invariant(
    graphQlClient != null,
    "initializeGraphQlClient should be called before any call to fetchGraphQL."
  );

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

export function isClientError(error: Error): error is ClientError {
  return error instanceof ClientError;
}
