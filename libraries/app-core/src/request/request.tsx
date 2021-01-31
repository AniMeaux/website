import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  PaginatedResponse,
} from "@animeaux/shared-entities";
import { ProgressBar, showSnackbar, Snackbar } from "@animeaux/ui-library";
import invariant from "invariant";
import * as React from "react";
import {
  InfiniteData,
  MutationFunction,
  QueryClient,
  QueryClientProvider,
  QueryFunction,
  QueryKey,
  useQuery as useQueryReactQuery,
  useInfiniteQuery as useInfiniteQueryReactQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useIsFetching,
  useMutation as useMutationReactQuery,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
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

      // We don't want to span the server with calls.
      retry: false,
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

        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </RequestContext.Provider>
    </QueryClientProvider>
  );
}

function maybeShowSnackbarError(error: Error, errorCodesToIgnore: ErrorCode[]) {
  if (!hasErrorCode(error, errorCodesToIgnore)) {
    showSnackbar.error(
      <Snackbar type="error">{getErrorMessage(error)}</Snackbar>,
      { autoClose: false }
    );
  }
}

type CustomHookOptions = {
  errorCodesToIgnore?: ErrorCode[];
};

export function useQuery<
  TQueryFnData = unknown,
  TError extends Error = Error,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  {
    errorCodesToIgnore = [],
    ...options
  }: UseQueryOptions<TQueryFnData, TError, TData> & CustomHookOptions = {}
): UseQueryResult<TData, TError> {
  return useQueryReactQuery(queryKey, queryFn, {
    ...options,
    onError(error) {
      maybeShowSnackbarError(error, errorCodesToIgnore);
      options?.onError?.(error);
    },
  });
}

export function useMutation<
  TData = unknown,
  TError extends Error = Error,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  {
    errorCodesToIgnore = [],
    ...options
  }: UseMutationOptions<TData, TError, TVariables, TContext> &
    CustomHookOptions = {}
) {
  const { setPendingMutationCount } = useRequest();
  const mutation = useMutationReactQuery<TData, TError, TVariables, TContext>(
    mutationFn,
    {
      ...options,
      onError(error, ...rest) {
        maybeShowSnackbarError(error, errorCodesToIgnore);
        options?.onError?.(error, ...rest);
      },
    }
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
  TError extends Error = Error,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  {
    errorCodesToIgnore = [],
    ...options
  }: UseInfiniteQueryOptions<TQueryFnData, TError, TData> &
    CustomHookOptions = {}
): UseInfiniteQueryResult<TData, TError> {
  return useInfiniteQueryReactQuery<TQueryFnData, TError, TData>(
    queryKey,
    queryFn,
    {
      ...options,

      onError(error) {
        maybeShowSnackbarError(error, errorCodesToIgnore);
        options?.onError?.(error);
      },

      // Return the next page that will be passed as `pageParam` to the
      // `queryFn` function.
      getNextPageParam(lastGroup) {
        if (lastGroup.page < lastGroup.pageCount - 1) {
          return lastGroup.page + 1;
        }
      },
    }
  );
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
