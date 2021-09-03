import { NextRouter, useRouter as useNextRouter } from "next/router";

type HistoryOffsetOption = {
  historyOffset?: number;
};

type Router = Omit<NextRouter, "push" | "replace"> & {
  push(url: string, options?: HistoryOffsetOption): Promise<boolean>;
  replace(url: string, options?: HistoryOffsetOption): Promise<boolean>;
  backIfPossible: (
    fallbackUrl: string,
    options?: HistoryOffsetOption
  ) => Promise<boolean>;
};

export function useRouter() {
  const nextRouter = useNextRouter();

  function createMethod(
    name: "push" | "replace",
    defaultHistoryOffset: number
  ): Router["push" | "replace"] {
    return (url, { historyOffset = defaultHistoryOffset } = {}) => {
      const newHistoryIndex = getHistoryIndex(nextRouter) + historyOffset;
      const resolvedUrl = resolveUrl(nextRouter.asPath, url);
      const urlWithHistoryIndex = addHistoryIndexToUrl(
        resolvedUrl,
        newHistoryIndex
      );
      return nextRouter[name](urlWithHistoryIndex, resolvedUrl);
    };
  }

  const router: Router = {
    ...nextRouter,
    push: createMethod("push", 1),
    replace: createMethod("replace", 0),

    async backIfPossible(fallbackUrl, { historyOffset = 1 } = {}) {
      // Make sure the back navigation is safe.
      if (canGoBackHistory(nextRouter, historyOffset)) {
        window.history.go(-historyOffset);
        return true;
      } else {
        // Use `router` and not `nextRouter`.
        // Don't increment history index to allow multiple back navigations.
        return router.push(fallbackUrl, { historyOffset: 0 });
      }
    },
  };

  return router;
}

export const HISTORY_INDEX_QUERY_PARAMETER = "historyIndex";

export function getHistoryIndex(router: NextRouter | Router) {
  const queryValue = Number(router.query[HISTORY_INDEX_QUERY_PARAMETER]);
  return isNaN(queryValue) ? 0 : queryValue;
}

export function canGoBackHistory(router: NextRouter | Router, offset: number) {
  return getHistoryIndex(router) - offset >= 0;
}

// Flag all navigation with the hidden query parameter
// `HISTORY_INDEX_QUERY_PARAMETER`.
// As Next.js doesn't let us manipulate the history state directly, we can only
// pass hidden query parameters which are then put in the history state.
// https://github.com/vercel/next.js/issues/771#issuecomment-612018764
export function addHistoryIndexToUrl(url: string, index: number): string {
  const query = `${HISTORY_INDEX_QUERY_PARAMETER}=${index}`;

  if (url.includes("?")) {
    return `${url}&${query}`;
  }

  return `${url}?${query}`;
}

/**
 * Resolves a 2 Urls or Url segments into an absolute Url.
 *
 * Inspired by @reach/router and `path.resolve()`.
 * https://github.com/reach/router/blob/d2c9ad06715c9d48c2d16f55f7cd889b626d2521/src/lib/utils.js#L143
 * https://nodejs.org/api/path.html#path_path_resolve_paths
 *
 * @param from Current absolute Url
 * @param to New Url relative to `from`
 * @returns An absolute Url
 *
 * @example
 * resolveUrl('/baz/qux', '/foo/bar')  // => /foo/bar
 * resolveUrl('/users?b=c', '?a=b')    // => /users?a=b
 * resolveUrl('/users/789', 'profile') // => /users/789/profile
 * resolveUrl('/users/123', './')      // => /users/123
 * resolveUrl('/users/123', '../')     // => /users
 * resolveUrl('/users/123', '../..')   // => /
 * resolveUrl('/a/b/c/d', '../../one') // => /a/b/one
 * resolveUrl('/a/b/c/d', '.././one')  // => /a/b/c/one
 */
export function resolveUrl(from: string, to: string): string {
  // /baz/qux, /foo/bar => /foo/bar
  if (to.startsWith("/")) {
    return to;
  }

  // Remove existing hash.
  // `fromQuery` is always dropped.
  const [fromPathname] = from.split("#")[0].split("?");
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
    return addQuery(`/${allSegments.join("/")}`, toQuery);
  }

  // /users/123, ./        => /users/123
  // /users/123, ../       => /users
  // /users/123, ../..     => /
  // /a/b/c/d,   ../../one => /a/b/one
  // /a/b/c/d,   .././one  => /a/b/c/one
  const segments: string[] = [];

  allSegments.forEach((segment) => {
    if (segment === "..") {
      segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });

  return addQuery(`/${segments.join("/")}`, toQuery);
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
