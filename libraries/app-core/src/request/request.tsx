import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  PaginatedResponse,
} from "@animeaux/shared-entities";
import {
  ProgressBar,
  showSnackbar,
  Snackbar,
  useIsScrollAtFetchMore,
} from "@animeaux/ui-library";
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
  useQuery as useQueryReactQuery,
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
    return showSnackbar.error(
      <Snackbar type="error">{getErrorMessage(error)}</Snackbar>,
      { autoClose: false }
    );
  }

  return null;
}

export function useQuery<
  TQueryFnData = unknown,
  TError extends Error = Error,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options: UseQueryOptions<TQueryFnData, TError, TData> = {}
): UseQueryResult<TData, TError> {
  const snackbarId = React.useRef<React.ReactText | null>(null);

  return useQueryReactQuery(
    queryKey,
    (context) => {
      if (snackbarId.current != null) {
        showSnackbar.dismiss(snackbarId.current);
      }

      return queryFn(context);
    },
    options
  );
}

export function useInfiniteQuery<
  TQueryFnData extends PaginatedResponse<any> = PaginatedResponse<unknown>,
  TError extends Error = Error,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TData> = {}
): UseInfiniteQueryResult<TData, TError> {
  const snackbarId = React.useRef<React.ReactText | null>(null);

  const query = useInfiniteQueryReactQuery<TQueryFnData, TError, TData>(
    queryKey,
    (context) => {
      if (snackbarId.current != null) {
        showSnackbar.dismiss(snackbarId.current);
      }

      return queryFn(context);
    },
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

  useIsScrollAtFetchMore(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  });

  return query;
}

type CustomHookOptions = {
  errorCodesToIgnore?: ErrorCode[];
};

export function useMutation<
  TData = unknown,
  TError extends Error = Error,
  TVariables = void
>(
  mutationFn: MutationFunction<TData, TVariables>,
  {
    errorCodesToIgnore = [],
    ...options
  }: UseMutationOptions<TData, TError, TVariables> & CustomHookOptions = {}
) {
  const snackbarId = React.useRef<React.ReactText | null>(null);

  const { setPendingMutationCount } = useRequest();
  const mutation = useMutationReactQuery<TData, TError, TVariables>(
    mutationFn,
    {
      ...options,
      onMutate(variables) {
        if (snackbarId.current != null) {
          showSnackbar.dismiss(snackbarId.current);
        }

        options?.onMutate?.(variables);
      },
      onError(error, ...rest) {
        snackbarId.current = maybeShowSnackbarError(error, errorCodesToIgnore);
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
