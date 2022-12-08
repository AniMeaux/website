import { SearchOptions } from "@algolia/client-search";
import { Color } from "@prisma/client";
import { SearchClient } from "algoliasearch";

export type ColorFromAlgolia = Pick<Color, "name">;

export function createColorDelegate(client: SearchClient) {
  const index = client.initIndex("colors");

  return {
    indexName: index.indexName,

    async search(text: string, options: SearchOptions = {}) {
      const result = await index.search<ColorFromAlgolia>(text, options);

      return result.hits.map((hit) => ({
        id: hit.objectID,
        name: hit.name,
        highlightedName: hit._highlightResult?.name?.value ?? hit.name,
      }));
    },
  };
}
