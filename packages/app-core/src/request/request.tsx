import { ProgressBar } from "@animeaux/ui-library";
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
import { NetworkStatus } from "./networkStatus";

export * from "react-query";

export const queryCache = new QueryCache();

// Mutations are not taken into account in `useIsFetching` so we provide our own
// context and `useMutation` to support it.
// See https://github.com/tannerlinsley/react-query/issues/48#issuecomment-558239560

type RequestContextValue = {
  pendingMutationCount: number;
  setPendingMutationCount: React.Dispatch<React.SetStateAction<number>>;
};

const RequestContext = React.createContext<RequestContextValue | null>(null);

function useRequest() {
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

function RequestProgressBar() {
  const { pendingRequestCount } = useRequest();

  if (pendingRequestCount > 0) {
    return <ProgressBar />;
  }

  return null;
}

export function RequestContextProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [pendingMutationCount, setPendingMutationCount] = React.useState(0);

  const value = React.useMemo<RequestContextValue>(
    () => ({ pendingMutationCount, setPendingMutationCount }),
    [pendingMutationCount]
  );

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <RequestContext.Provider value={value}>
        {children}
        <NetworkStatus />
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
