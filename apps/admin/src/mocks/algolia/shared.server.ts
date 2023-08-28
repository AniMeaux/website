import type {
  DefaultBodyType,
  PathParams,
  ResponseResolver,
  RestContext,
  RestRequest,
} from "msw";
import { rest } from "msw";

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
  return createPostHandlers(path, async (_req, res, ctx) => {
    return res(
      ctx.json({ taskID: Math.round(Math.random() * 1000), objectIDs: [] })
    );
  });
}

export function highlightValue(value: string, { search }: { search: string }) {
  // We can't start or end hightlighting with spaces, it's not supported by
  // markdown.
  search = search.trim();

  if (search === "") {
    return value;
  }

  const newValue = value.replace(new RegExp(search, "ig"), "**$&**");

  // Merge consecutives highlights.
  return newValue.replace(/\*\*\*\*/g, "");
}
