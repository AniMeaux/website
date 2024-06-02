import type { DefaultBodyType, HttpResponseResolver, PathParams } from "msw";
import { HttpResponse, http } from "msw";

export type QueryBody = {
  query?: string;
  page?: number;
  hitsPerPage?: number;
};

export type FacetBody = {
  facetQuery?: string;
  maxFacetHits?: number;
};

export function createPostHandlers<
  RequestBodyType extends DefaultBodyType = DefaultBodyType,
>(path: string, resolver: HttpResponseResolver<PathParams, RequestBodyType>) {
  // Mock all primary and fallback hosts.
  // See https://www.algolia.com/doc/rest-api/search/#hosts
  return [
    `https://mock-id.algolia.net${path}`,
    `https://mock-id-dsn.algolia.net${path}`,
    `https://mock-id-1.algolianet.com${path}`,
    `https://mock-id-2.algolianet.com${path}`,
    `https://mock-id-3.algolianet.com${path}`,
  ].map((path) => http.post(path, resolver));
}

export function createBatchHandlers(path: string) {
  return createPostHandlers(path, async () => {
    return HttpResponse.json({
      taskID: Math.round(Math.random() * 1000),
      objectIDs: [],
    });
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
