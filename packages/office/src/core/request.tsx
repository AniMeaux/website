import { ErrorCode } from "@animeaux/shared";
import firebase from "firebase/app";
import { GraphQLClient, gql } from "graphql-request";
import invariant from "invariant";
import * as React from "react";
import {
  MutationConfig,
  MutationFunction,
  QueryCache,
  ReactQueryCacheProvider,
  useIsFetching,
  useMutation as useMutationReactQuery,
} from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { ProgressBar } from "../ui/loaders/progressBar";
import { TOKEN_KEY } from "./user/currentUserContext";

export * from "react-query";

// For some reason we can't `export * from "graphql-request"`.
export { gql };

const graphQlClient = new GraphQLClient(process.env.NEXT_PUBLIC_API_URL);

type fetchGraphQLOptions<Variables> = {
  variables?: Variables;
};

export async function fetchGraphQL<DataType = null, Variables = object>(
  query: string,
  { variables }: fetchGraphQLOptions<Variables> = {}
): Promise<DataType> {
  async function fetchWithHeaders() {
    graphQlClient.setHeaders({
      Authorisation: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
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

////////////////////////////////////////////////////////////////////////////////

export const queryCache = new QueryCache();

// Mutations are not taken into account in `useIsFetching` so we provide our own
// context and `useMutation` to support it.
// See https://github.com/tannerlinsley/react-query/issues/48#issuecomment-558239560

type RequestContextValue = {
  pendingMutationCount: number;
  setPendingMutationCount: React.Dispatch<React.SetStateAction<number>>;
};

const RequestContext = React.createContext<RequestContextValue | null>(null);

export function useRequest() {
  const context = React.useContext(RequestContext);
  invariant(
    context != null,
    "useRequest should not be used outside of a RequestContextProvider."
  );

  const pendingQueryCount = useIsFetching();

  return {
    ...context,
    pendingRequestCount: pendingQueryCount + context.pendingMutationCount,
  };
}

export function RequestProgressBar() {
  const { pendingRequestCount } = useRequest();

  if (pendingRequestCount > 0) {
    return <ProgressBar />;
  }

  return null;
}

export function RequestContextProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [pendingMutationCount, setPendingMutationCount] = React.useState(0);

  const value = React.useMemo<RequestContextValue>(
    () => ({ pendingMutationCount, setPendingMutationCount }),
    [pendingMutationCount]
  );

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <RequestContext.Provider value={value}>
        {children}
        <RequestProgressBar />
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools
            toggleButtonProps={{ style: { bottom: "4rem" } }}
          />
        )}
      </RequestContext.Provider>
    </ReactQueryCacheProvider>
  );
}

export function useMutation<
  TResult,
  TError = unknown,
  TVariables = undefined,
  TSnapshot = unknown
>(
  mutationFn: MutationFunction<TResult, TVariables>,
  config?: MutationConfig<TResult, TError, TVariables, TSnapshot>
) {
  const { setPendingMutationCount } = useRequest();
  const mutation = useMutationReactQuery<
    TResult,
    TError,
    TVariables,
    TSnapshot
  >(mutationFn, config);

  const { isLoading } = mutation[1];

  React.useEffect(() => {
    if (isLoading) {
      setPendingMutationCount((c) => c + 1);
      return () => setPendingMutationCount((c) => c - 1);
    }
  }, [isLoading, setPendingMutationCount]);

  return mutation;
}
