import { isIterable } from "#core/collections.ts";
import { SearchOptions } from "@algolia/client-search";
import { SearchIndex } from "algoliasearch";
import chunk from "lodash.chunk";

export function createSearchFilters(
  params: Record<string, undefined | null | boolean | string | Iterable<string>>
): string | undefined {
  let filters: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      if (isIterable(value)) {
        const values = Array.from(value);
        if (values.length > 0) {
          filters.push(values.map((value) => `${key}:${value}`).join(" OR "));
        }
      } else {
        filters.push(`${key}:${value}`);
      }
    }
  });

  if (filters.length === 0) {
    return undefined;
  }

  if (filters.length > 1) {
    filters = filters.map((value) =>
      value.includes(" OR ") ? `(${value})` : value
    );
  }

  return filters.join(" AND ");
}

const HITS_PER_BATCH = 50;
const REQUEST_COUNT_PER_BATCH = 10;

/**
 * Algolia searches are paginated by default.
 * This function will fetch all hits if `hitsPerPage` is not specified.
 *
 * @param index The index to search.
 * @param query The query
 * @param options The search options
 * @returns Results hits.
 */
export async function indexSearch<TData>(
  index: SearchIndex,
  query: string,
  options: SearchOptions = {}
) {
  if (options.hitsPerPage != null) {
    const response = await index.search<TData>(query, options);
    return response.hits;
  }

  const firstResult = await index.search<TData>(query, {
    ...options,
    hitsPerPage: HITS_PER_BATCH,
    page: 0,
  });

  const otherResults = await batchRequests({
    totalCount: firstResult.nbPages - 1,
    countPerBatch: REQUEST_COUNT_PER_BATCH,
    request: (requestIndex) => {
      return index.search<TData>(query, {
        ...options,
        hitsPerPage: HITS_PER_BATCH,
        page: requestIndex + 1,
      });
    },
  });

  return firstResult.hits.concat(otherResults.flatMap((result) => result.hits));
}

async function batchRequests<T>({
  totalCount,
  countPerBatch,
  request,
}: {
  totalCount: number;
  countPerBatch: number;
  request: (index: number) => Promise<T>;
}) {
  const chunks = chunk(
    Array.from({ length: totalCount }, (_, index) => index),
    countPerBatch
  );

  let allResults: T[] = [];
  for (const chunk of chunks) {
    allResults = allResults.concat(await Promise.all(chunk.map(request)));
  }

  return allResults;
}
