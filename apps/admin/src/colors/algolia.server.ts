import { SearchOptions } from "@algolia/client-search";
import { Color } from "@prisma/client";
import { SearchClient } from "algoliasearch";
import { DEFAULT_SEARCH_OPTIONS } from "~/core/algolia/shared.server";

export type ColorFromAlgolia = Pick<Color, "name">;

export function createColorDelegate(client: SearchClient) {
  const index = client.initIndex("colors");

  return {
    indexName: index.indexName,

    async search(text: string, options: Omit<SearchOptions, "filter"> = {}) {
      const result = await index.search<ColorFromAlgolia>(text, {
        ...DEFAULT_SEARCH_OPTIONS,
        ...options,
      });

      return result.hits.map((hit) => ({
        id: hit.objectID,
        name: hit.name,
        highlightedName: hit._highlightResult?.name?.value ?? hit.name,
      }));
    },
  };
}
