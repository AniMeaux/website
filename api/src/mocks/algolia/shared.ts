import {
  DefaultBodyType,
  PathParams,
  ResponseResolver,
  rest,
  RestContext,
  RestRequest,
} from "msw";

export function createPostHandlers(
  path: string,
  resolver: ResponseResolver<
    RestRequest<DefaultBodyType, PathParams<string>>,
    RestContext,
    DefaultBodyType
  >
) {
  // Mock all primary and fallback hosts.
  // See https://www.algolia.com/doc/rest-api/search/#hosts
  return [
    `https://mock-id.algolia.net${path}`,
    `https://mock-id-dsn.algolia.net${path}`,
    `https://mock-id-1.algolianet.com${path}`,
    `https://mock-id-2.algolianet.com${path}`,
    `https://mock-id-3.algolianet.com${path}`,
  ].map((path) => rest.post(path, resolver));
}

export function createBatchHandlers(path: string) {
  return createPostHandlers(path, async (req, res, ctx) => {
    return res(
      ctx.json({ taskID: Math.round(Math.random() * 1000), objectIDs: [] })
    );
  });
}

export function highlightValue(
  value: string,
  {
    search,
    highlightPreTag,
    highlightPostTag,
  }: {
    search: string;
    highlightPreTag: string;
    highlightPostTag: string;
  }
) {
  if (search === "") {
    return value;
  }

  return value.replaceAll(
    search,
    `${highlightPreTag}${search}${highlightPostTag}`
  );
}
