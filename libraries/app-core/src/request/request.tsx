import { PaginatedResponse } from "@animeaux/shared-entities";
import { ProgressBar } from "@animeaux/ui-library";
import invariant from "invariant";
import * as React from "react";
import {
  InfiniteData,
  MutationFunction,
  QueryClient,
  QueryClientProvider,
  QueryFunction,
  QueryKey,
  useInfiniteQuery as useInfiniteQueryReactQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useIsFetching,
  useMutation as useMutationReactQuery,
  UseMutationOptions,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Updater } from "react-query/types/core/utils";
import { NetworkStatus } from "./networkStatus";

export * from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // This value doesn't need to be low as all mutations update the cache to
      // avoid refetching data we already have.
      // 1 minute
      staleTime: 1000 * 60,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
) {
  const { setPendingMutationCount } = useRequest();
  const mutation = useMutationReactQuery<TData, TError, TVariables, TContext>(
    mutationFn,
    options
  );

  const { isLoading } = mutation;

  React.useEffect(() => {
    if (isLoading) {
      setPendingMutationCount((c) => c + 1);
      return () => setPendingMutationCount((c) => c - 1);
    }
  }, [isLoading, setPendingMutationCount]);

  return mutation;
}

export function useInfiniteQuery<
  TQueryFnData extends PaginatedResponse<any> = PaginatedResponse<unknown>,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  filtersDependecies: React.DependencyList,
  queryFn: QueryFunction<TQueryFnData>,
  options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
): UseInfiniteQueryResult<TData, TError> {
  const isInitialRender = React.useRef(true);

  const query = useInfiniteQueryReactQuery<TQueryFnData, TError, TData>(
    queryKey,
    queryFn,
    {
      ...options,

      // Return the next page that will be passed as `pageParam` to the
      // `queryFn` function.
      getNextPageParam(lastGroup) {
        if (lastGroup.page < lastGroup.pageCount - 1) {
          return lastGroup.page + 1;
        }
      },
    }
  );

  const refetch = query.refetch;

  // We don't add filters to the key to avoid polluting the cache and all the
  // loading states.
  React.useEffect(() => {
    // We don't want to refetch after the inital render because
    // `useInfiniteQuery` already does it.
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      refetch();
    }
    // The caller is responsible to set the right `filtersDependecies`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, filtersDependecies.concat([refetch]));

  return query;
}

export function updateDataInCache<TData extends { id: string }>(
  newData: TData
): Updater<TData[] | null | undefined, TData[] | null> {
  return (hits) => {
    if (hits == null) {
      return null;
    }

    return hits.map((hit) => (hit.id === newData.id ? newData : hit));
  };
}

export function removeDataFromCache<TData extends { id: string }>(
  id: string
): Updater<TData[] | null | undefined, TData[] | null> {
  return (hits) => {
    if (hits == null) {
      return null;
    }

    return hits.filter((hit) => hit.id !== id);
  };
}

export function updateDataInInfiniteCache<TData extends { id: string }>(
  newData: TData
): Updater<
  InfiniteData<PaginatedResponse<TData>> | null | undefined,
  InfiniteData<PaginatedResponse<TData>> | null
> {
  return (infiniteData) => {
    if (infiniteData == null) {
      return null;
    }

    return {
      ...infiniteData,
      pages: infiniteData.pages.map((page) => ({
        ...page,
        hits: page.hits.map((hit) => (hit.id === newData.id ? newData : hit)),
      })),
    };
  };
}

export function removeDataFromInfiniteCache<TData extends { id: string }>(
  id: string
): Updater<
  InfiniteData<PaginatedResponse<TData>> | null | undefined,
  InfiniteData<PaginatedResponse<TData>> | null
> {
  return (infiniteData) => {
    if (infiniteData == null) {
      return null;
    }

    return {
      ...infiniteData,
      pages: infiniteData.pages.map((page) => ({
        ...page,
        hits: page.hits.filter((hit) => hit.id !== id),
      })),
    };
  };
}
