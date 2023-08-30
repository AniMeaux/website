import { useLocation, useNavigation, useSearchParams } from "@remix-run/react";
import { useCallback, useMemo } from "react";

export function useOptimisticSearchParams() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const nextSearchParams = useMemo(() => {
    if (navigation.location?.pathname === location.pathname) {
      return new URLSearchParams(navigation.location.search);
    }

    return undefined;
  }, [
    location.pathname,
    navigation.location?.pathname,
    navigation.location?.search,
  ]);

  const optimisticSearchParams = nextSearchParams ?? searchParams;

  // When the set state function is called with a function, it needs to recieve
  // the optimistic search parameters.
  const setOptimisticSearchParams = useCallback<typeof setSearchParams>(
    (nextInit, navigateOpts) => {
      setSearchParams(
        typeof nextInit === "function"
          ? nextInit(optimisticSearchParams)
          : nextInit,
        navigateOpts,
      );
    },
    [optimisticSearchParams, setSearchParams],
  );

  return [optimisticSearchParams, setOptimisticSearchParams] as const;
}
