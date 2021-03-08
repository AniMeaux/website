import { NextRouter, useRouter as useNextRouter } from "next/router";
import { UrlObject } from "url";

type Url = UrlObject | string;
type TransitionOptions = Parameters<NextRouter["push"]>[2];

type Router = Omit<NextRouter, "push" | "replace"> & {
  push(
    url: Url,
    as?: Url,
    options?: TransitionOptions,
    historyOffset?: number
  ): Promise<boolean>;

  replace(
    url: Url,
    as?: Url,
    options?: TransitionOptions,
    historyOffset?: number
  ): Promise<boolean>;

  backIfPossible: (backUrl: string, historyOffset?: number) => Promise<boolean>;
};

export function useRouter() {
  const nextRouter = useNextRouter();

  function createMethod(
    name: "push" | "replace",
    defaultHistoryOffset: number
  ): Router["push" | "replace"] {
    return (url, as, options, historyOffset = defaultHistoryOffset) => {
      url = resolveUrl(nextRouter.asPath, url);

      if (as == null) {
        as = url;
        url = addHistoryIndexToUrl(
          url,
          getHistoryIndex(nextRouter) + historyOffset
        );
      } else {
        as = resolveUrl(nextRouter.asPath, as);
      }

      return nextRouter[name](url, as, options);
    };
  }

  const router: Router = {
    ...nextRouter,
    push: createMethod("push", 1),
    replace: createMethod("replace", 0),

    async backIfPossible(backUrl, historyOffset = 1) {
      // Make sure the back navigation is safe.
      if (canGoBackHistory(nextRouter, historyOffset)) {
        window.history.go(-historyOffset);
        return true;
      } else {
        // Use `router` and not `nextRouter`.
        // Don't increment history index to allow multiple back navigations.
        return router.push(backUrl, undefined, undefined, 0);
      }
    },
  };

  return router;
}

export const HISTORY_INDEX_QUERY_PARAMETER = "historyIndex";

export function getHistoryIndex(router: NextRouter) {
  const queryValue = Number(router.query[HISTORY_INDEX_QUERY_PARAMETER]);
  return isNaN(queryValue) ? 0 : queryValue;
}

export function canGoBackHistory(router: NextRouter, offset: number) {
  return getHistoryIndex(router) - offset >= 0;
}

// Flag all navigation with the hidden query parameter
// `HISTORY_INDEX_QUERY_PARAMETER`.
// https://github.com/vercel/next.js/issues/771#issuecomment-612018764
export function addHistoryIndexToUrl(url: UrlObject, index: number): UrlObject;
export function addHistoryIndexToUrl(url: string, index: number): string;
export function addHistoryIndexToUrl(url: Url, index: number): Url;
export function addHistoryIndexToUrl(url: Url, index: number): Url {
  if (typeof url === "object") {
    if (url.query == null || typeof url.query === "object") {
      return {
        ...url,
        query: {
          ...url.query,
          [HISTORY_INDEX_QUERY_PARAMETER]: index,
        },
      };
    }

    return {
      ...url,
      query: [url.query, `${HISTORY_INDEX_QUERY_PARAMETER}=${index}`].join("&"),
    };
  } else {
    return [url, `${HISTORY_INDEX_QUERY_PARAMETER}=${index}`].join(
      url.includes("?") ? "&" : "?"
    );
  }
}

export function resolveUrl(from: string, to: UrlObject): UrlObject;
export function resolveUrl(from: string, to: string): string;
export function resolveUrl(from: string, to: Url): Url;
export function resolveUrl(from: string, to: Url): Url {
  if (typeof to === "object") {
    if (to.pathname == null) {
      return to;
    }

    return { ...to, pathname: resolveStringUrl(from, to.pathname) };
  }

  return resolveStringUrl(from, to);
}

// Inspired by @reach/router.
// https://github.com/reach/router/blob/d2c9ad06715c9d48c2d16f55f7cd889b626d2521/src/lib/utils.js#L143
function resolveStringUrl(from: string, to: string): string {
  // /baz/qux, /foo/bar => /foo/bar
  if (to.startsWith("/")) {
    return to;
  }

  const [fromPathname] = from.split("?");
  const [toPathname, toQuery] = to.split("?");

  const fromSegments = segmentize(fromPathname);
  const toSegments = segmentize(toPathname);

  // /users?b=c, ?a=b => /users?a=b
  if (toSegments[0] === "") {
    return addQuery(fromPathname, toQuery);
  }

  const allSegments = fromSegments.concat(toSegments);

  // /users/789, profile => /users/789/profile
  if (!toSegments[0].startsWith(".")) {
    return addQuery(
      (fromPathname === "/" ? "" : "/") + allSegments.join("/"),
      toQuery
    );
  }

  // /users/123, ./        =>  /users/123
  // /users/123, ../       =>  /users
  // /users/123, ../..     =>  /
  // /a/b/c/d,   ../../one =>  /a/b/one
  // /a/b/c/d,   .././one  =>  /a/b/c/one
  const segments: string[] = [];

  allSegments.forEach((segment) => {
    if (segment === "..") {
      segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });

  return addQuery(
    (fromPathname === "/" ? "" : "/") + segments.join("/"),
    toQuery
  );
}

function segmentize(uri: string): string[] {
  return (
    uri
      // Strip starting/ending slashes.
      .replace(/(^\/+|\/+$)/g, "")
      .split("/")
  );
}

function addQuery(pathname: string, query: string | null): string {
  if (query == null) {
    return pathname;
  }

  return `${pathname}?${query}`;
}
