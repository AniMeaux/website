import {
  AllNonPaginatedOperationName,
  AllOperationName,
  AllPaginatedOperationName,
  OmitOperationErrorResult,
  OperationParams,
  OperationResult,
  PickOperationErrorResult,
} from "@animeaux/shared";
import { getConfig } from "core/config";
import { firebase } from "core/firebase";
import { useIsScrollAtFetchMore } from "core/layouts/usePageScroll";
import { useRequest } from "core/request";
import invariant from "invariant";
import { useEffect } from "react";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

type OperationSuccessResult<TName extends AllOperationName> =
  OmitOperationErrorResult<OperationResult<TName>>;

type OperationSuccessResponse<TName extends AllOperationName> = {
  state: "success";
  result: OperationSuccessResult<TName>;
  status: number;
  body: OperationBody<TName>;
};

type OperationErrorResponse<TName extends AllOperationName> = {
  state: "error";
  errorResult?: PickOperationErrorResult<OperationResult<TName>>;
  status: number;
  body: OperationBody<TName>;
};

type OperationResponse<TName extends AllOperationName> =
  | OperationSuccessResponse<TName>
  | OperationErrorResponse<TName>;

type OperationBodyWithoutParams<TName extends AllOperationName> = {
  name: TName;
  params?: undefined;
};

type OperationBodyWithParams<TName extends AllOperationName> = {
  name: TName;
  params: OperationParams<TName>;
};

type OperationBody<TName extends AllOperationName> = [
  OperationParams<TName>
] extends [undefined]
  ? OperationBodyWithoutParams<TName>
  : OperationBodyWithParams<TName>;

export async function runOperation<TName extends AllOperationName>(
  body: OperationBody<TName>
): Promise<OperationResponse<TName>> {
  const response = await baseRunOperation(body);

  if (response.state === "error" && response.status === 401) {
    const currentUser = firebase.auth().currentUser;

    // Re-try the call after refreshing the token.
    if (currentUser != null) {
      await currentUser.reload();
      return await baseRunOperation(body);
    }
  }

  return response;
}

async function baseRunOperation<TName extends AllOperationName>(
  body: OperationBody<TName>
): Promise<OperationResponse<TName>> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = localStorage.getItem("token");
    if (token != null) {
      headers["Authorization"] = token;
    }

    const response = await fetch(`${getConfig().apiUrl}/operation`, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });

    const contentType = response.headers.get("content-type");

    if (response.ok) {
      invariant(
        contentType?.includes("application/json"),
        `Only JSON content type is supported for succesfull calls. Got ${contentType}.`
      );

      return {
        state: "success",
        status: response.status,
        result: await response.json(),
        body,
      };
    }

    if (contentType?.includes("application/json")) {
      return {
        state: "error",
        status: response.status,
        errorResult: await response.json(),
        body,
      };
    }

    return { state: "error", status: response.status, body };
  } catch (error) {
    return { state: "error", status: 503, body };
  }
}

type OperationBodyForQueryKey<TName extends AllOperationName> = {
  name: TName;
  params?: OperationParams<TName>;
};

function getQueryKey<TName extends AllOperationName>(
  body: OperationBodyForQueryKey<TName>
) {
  return [body.name, ...(body.params == null ? [] : [body.params])];
}

class OperationCache {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  set<TName extends AllOperationName>(
    body: OperationBody<TName>,
    result: OperationSuccessResult<TName>
  ) {
    this.queryClient.setQueryData(getQueryKey<TName>(body), {
      state: "success",
      status: 200,
      result,
      body,
    });
  }

  invalidate<TName extends AllOperationName>(
    body: OperationBodyForQueryKey<TName>
  ) {
    this.queryClient.invalidateQueries(getQueryKey(body));
  }

  remove<TName extends AllOperationName>(
    body: OperationBodyForQueryKey<TName>
  ) {
    this.queryClient.removeQueries(getQueryKey(body));
  }
}

type UseOperationOptions<TName extends AllNonPaginatedOperationName> = {
  onSuccess?: (
    response: OperationSuccessResponse<TName>,
    cache: OperationCache
  ) => void;

  onError?: (
    result: OperationErrorResponse<TName>,
    cache: OperationCache
  ) => void;
};

type OperationLoadingResponse = {
  state: "loading";
};

type OperationQueryReRun = () => Promise<void>;

type OperationQueryResponse<TName extends AllNonPaginatedOperationName> = (
  | OperationLoadingResponse
  | OperationResponse<TName>
) & {
  reRun: OperationQueryReRun;
};

export function useOperationQuery<TName extends AllNonPaginatedOperationName>(
  body: OperationBody<TName>,
  { onSuccess, onError }: UseOperationOptions<TName> = {}
): OperationQueryResponse<TName> {
  const queryClient = useQueryClient();
  const cache = new OperationCache(queryClient);

  const query = useQuery(getQueryKey(body), () => runOperation(body), {
    onSuccess(response) {
      if (onSuccess != null && response.state === "success") {
        onSuccess(response, cache);
      } else if (onError != null && response.state === "error") {
        onError(response, cache);
      }
    },
  });

  const reRun: OperationQueryReRun = async () => {
    await query.refetch();
  };

  if (query.status === "loading") {
    return { state: "loading", reRun };
  }

  invariant(
    query.status === "success",
    "runOperation should not throw errors."
  );

  return { ...query.data, reRun };
}

type OperationMutationFunctionParamsArray<
  TName extends AllNonPaginatedOperationName
> = [OperationParams<TName>] extends [undefined]
  ? []
  : [OperationParams<TName>];

type OperationMutationFunction<TName extends AllNonPaginatedOperationName> = (
  ...paramsArray: OperationMutationFunctionParamsArray<TName>
) => void;

type OperationIdleResponse = {
  state: "idle";
};

export type OperationMutationResponse<
  TName extends AllNonPaginatedOperationName
> = (
  | OperationIdleResponse
  | OperationLoadingResponse
  | OperationResponse<TName>
) & {
  mutate: OperationMutationFunction<TName>;
};

export function useOperationMutation<
  TName extends AllNonPaginatedOperationName
>(
  name: TName,
  { onSuccess, onError }: UseOperationOptions<TName> = {}
): OperationMutationResponse<TName> {
  const queryClient = useQueryClient();
  const cache = new OperationCache(queryClient);
  const { setPendingMutationCount } = useRequest();

  const mutation = useMutation<
    OperationResponse<TName>,
    never,
    OperationMutationFunctionParamsArray<TName>
  >(
    async (paramsArray) => {
      // Not sure why `OperationBody<TName>` can't be inferred here.
      const body = { params: paramsArray[0], name } as OperationBody<TName>;
      return await runOperation(body);
    },
    {
      onSuccess(response) {
        if (onSuccess != null && response.state === "success") {
          onSuccess(response, cache);
        } else if (onError != null && response.state === "error") {
          onError(response, cache);
        }
      },
    }
  );

  const { isLoading } = mutation;

  useEffect(() => {
    if (isLoading) {
      setPendingMutationCount((c) => c + 1);
      return () => setPendingMutationCount((c) => c - 1);
    }
  }, [isLoading, setPendingMutationCount]);

  const mutate: OperationMutationFunction<TName> = (...paramsArray) => {
    mutation.mutate(paramsArray);
  };

  if (mutation.status === "idle") {
    return { state: "idle", mutate };
  }

  if (mutation.status === "loading") {
    return { state: "loading", mutate };
  }

  invariant(
    mutation.status === "success",
    "runOperation should not throw errors."
  );

  return { ...mutation.data, mutate };
}

type PaginatedOperationQueryResponse<TName extends AllPaginatedOperationName> =
  (
    | OperationLoadingResponse
    | OperationErrorResponse<TName>
    | {
        state: "success";
        results: OperationSuccessResult<TName>[];
        status: number;
        hasNextPage: boolean;
        isFetchingNextPage: boolean;
      }
  ) & {
    reRun: OperationQueryReRun;
  };

export function usePaginatedOperationQuery<
  TName extends AllPaginatedOperationName
>(body: OperationBody<TName>): PaginatedOperationQueryResponse<TName> {
  const query = useInfiniteQuery(
    getQueryKey(body),
    ({ pageParam = 0 }) =>
      runOperation({ ...body, params: { ...body.params, page: pageParam } }),
    {
      // Return the next page that will be passed as `pageParam` to the
      // `queryFn` function.
      getNextPageParam(lastResponse) {
        if (
          lastResponse.state === "success" &&
          lastResponse.result.page < lastResponse.result.pageCount - 1
        ) {
          return lastResponse.result.page + 1;
        }

        return undefined;
      },
    }
  );

  useIsScrollAtFetchMore(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  });

  const reRun: OperationQueryReRun = async () => {
    await query.refetch();
  };

  if (query.status === "loading") {
    return { state: "loading", reRun };
  }

  invariant(
    query.status === "success",
    "runOperation should not throw errors."
  );

  const error = query.data.pages.find(
    (response): response is OperationErrorResponse<TName> =>
      response.state === "error"
  );

  if (error != null) {
    return { ...error, reRun };
  }

  // `query.data.pages` can only contain success results at this point.
  const pages = query.data.pages as OperationSuccessResponse<TName>[];

  return {
    state: "success",
    results: pages.map((response) => response.result),
    status: query.data.pages[query.data.pages.length - 1].status,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    reRun,
  };
}
