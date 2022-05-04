import invariant from "invariant";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useIsFetching } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ProgressBar } from "~/core/loaders/progressBar";
import { NetworkStatus } from "~/core/request/networkStatus";

const queryClient = new QueryClient({
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

const RequestContext = createContext<RequestContextValue | null>(null);

export function useRequest() {
  const context = useContext(RequestContext);
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
  const [pendingMutationCount, setPendingMutationCount] = useState(0);

  const value = useMemo<RequestContextValue>(
    () => ({ pendingMutationCount, setPendingMutationCount }),
    [pendingMutationCount]
  );

  const showDevTools = useRef(
    typeof window !== "undefined" &&
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(window.location.search).has("show-cache")
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RequestContext.Provider value={value}>
        {children}
        <NetworkStatus />
        <RequestProgressBar />

        {showDevTools.current && <ReactQueryDevtools />}
      </RequestContext.Provider>
    </QueryClientProvider>
  );
}
