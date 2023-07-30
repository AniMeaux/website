import { useLocation, useNavigation, useSearchParams } from "@remix-run/react";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { parseOrDefault } from "~/core/schemas";

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
        navigateOpts
      );
    },
    [optimisticSearchParams, setSearchParams]
  );

  return [optimisticSearchParams, setOptimisticSearchParams] as const;
}

export class PageSearchParams extends URLSearchParams {
  static readonly Keys = {
    PAGE: "page",
  };

  getPage() {
    return parseOrDefault(
      zfd.numeric(z.number().default(0)),
      this.get(PageSearchParams.Keys.PAGE)
    );
  }

  setPage(page: number) {
    const copy = new PageSearchParams(this);

    if (page !== 0) {
      copy.set(PageSearchParams.Keys.PAGE, String(page));
    } else if (copy.has(PageSearchParams.Keys.PAGE)) {
      copy.delete(PageSearchParams.Keys.PAGE);
    }

    return copy;
  }
}

export class NextSearchParams extends URLSearchParams {
  static readonly Keys = {
    NEXT: "next",
  };

  getNext() {
    return parseOrDefault(
      z.string().optional().nullable().default(null),
      this.get(NextSearchParams.Keys.NEXT)
    );
  }

  getNextOrDefault() {
    return this.getNext() ?? "/";
  }

  setNext(next: string) {
    const copy = new NextSearchParams(this);

    if (next !== "/") {
      copy.set(NextSearchParams.Keys.NEXT, next);
    } else if (copy.has(NextSearchParams.Keys.NEXT)) {
      copy.delete(NextSearchParams.Keys.NEXT);
    }

    return copy;
  }
}
