import { SearchOptions } from "@algolia/client-search";
import { Breed, Species } from "@prisma/client";
import { SearchClient } from "algoliasearch";
import { createSearchFilters, indexSearch } from "~/core/algolia/shared.server";

export type BreedFromAlgolia = Pick<Breed, "name" | "species">;

export function createBreedDelegate(client: SearchClient) {
  const index = client.initIndex("breeds");

  return {
    indexName: index.indexName,

    async search(
      name: string,
      filters: { species: null | Species },
      options: Omit<SearchOptions, "filters"> = {}
    ) {
      const hits = await indexSearch<BreedFromAlgolia>(index, name, {
        ...options,
        filters: createSearchFilters(filters),
      });

      return hits.map((hit) => ({
        id: hit.objectID,
        name: hit.name,
        highlightedName: hit._highlightResult?.name?.value ?? hit.name,
      }));
    },
  };
}
