import { SearchOptions } from "@algolia/client-search";
import { Breed, Species } from "@prisma/client";
import { SearchClient } from "algoliasearch";
import {
  createSearchFilters,
  DEFAULT_SEARCH_OPTIONS,
} from "~/core/algolia/shared.server";

export type BreedFromAlgolia = Pick<Breed, "name" | "species">;

export function createBreedDelegate(client: SearchClient) {
  const index = client.initIndex("breeds");

  return {
    indexName: index.indexName,

    async search(
      text: string,
      filters: { species: null | Species },
      options: Omit<SearchOptions, "filter"> = {}
    ) {
      const result = await index.search<BreedFromAlgolia>(text, {
        ...DEFAULT_SEARCH_OPTIONS,
        ...options,
        filters: createSearchFilters(filters),
      });

      return result.hits.map((hit) => ({
        id: hit.objectID,
        name: hit.name,
        highlightedName: hit._highlightResult?.name?.value ?? hit.name,
      }));
    },
  };
}
