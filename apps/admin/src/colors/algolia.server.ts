import { SearchOptions } from "@algolia/client-search";
import { Color } from "@prisma/client";
import { SearchClient } from "algoliasearch";
import { indexSearch } from "~/core/algolia/shared.server";

export type ColorFromAlgolia = Pick<Color, "name">;

export function createColorDelegate(client: SearchClient) {
  const index = client.initIndex("colors");

  return {
    indexName: index.indexName,

    async search(text: string, options: SearchOptions = {}) {
      const hits = await indexSearch<ColorFromAlgolia>(index, text, options);

      return hits.map((hit) => ({
        id: hit.objectID,
        name: hit.name,
        highlightedName: hit._highlightResult?.name?.value ?? hit.name,
      }));
    },
  };
}
