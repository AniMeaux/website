import { useLocation, useNavigation, useSearchParams } from "@remix-run/react";
import { useCallback, useMemo } from "react";

// Not exported from @remix-run/react.
type SetURLSearchParams = ReturnType<typeof useSearchParams>[1];

// Add explicit return type to fix:
// > The inferred type of 'useOptimisticSearchParams' cannot be named without a
// > reference to '.pnpm/react-router-dom@6.23.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/react-router-dom'.
// > This is likely not portable. A type annotation is necessary.
// > ts(2742)
export function useOptimisticSearchParams(): readonly [
  URLSearchParams,
  SetURLSearchParams,
] {
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
  const setOptimisticSearchParams = useCallback<SetURLSearchParams>(
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

  return [optimisticSearchParams, setOptimisticSearchParams];
}
