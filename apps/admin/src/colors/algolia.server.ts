import { SearchOptions } from "@algolia/client-search";
import { Color } from "@prisma/client";
import { SearchClient, SearchIndex } from "algoliasearch";
import { indexSearch } from "~/core/algolia/shared.server";

export type ColorFromAlgolia = Pick<Color, "name">;

export class ColorAlgoliaDelegate {
  readonly index: SearchIndex;

  constructor(client: SearchClient) {
    this.index = client.initIndex("colors");
  }

  async search({
    name,
    ...options
  }: Omit<SearchOptions, "filters"> & { name: string }) {
    const hits = await indexSearch<ColorFromAlgolia>(this.index, name, options);

    return hits.map((hit) => ({
      id: hit.objectID,
      name: hit.name,
      highlightedName: hit._highlightResult?.name?.value ?? hit.name,
    }));
  }
}
