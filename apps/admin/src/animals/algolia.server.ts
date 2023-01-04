import { SearchOptions } from "@algolia/client-search";
import { Animal, Species, Status } from "@prisma/client";
import { SearchClient } from "algoliasearch";
import { createSearchFilters } from "~/core/algolia/shared.server";

export type AnimalFromAlgolia = Pick<
  Animal,
  "alias" | "name" | "pickUpLocation" | "species" | "status"
>;

export function createAnimalDelegate(client: SearchClient) {
  const index = client.initIndex("animals");

  return {
    indexName: index.indexName,

    async update(animalId: Animal["id"], data: Partial<AnimalFromAlgolia>) {
      await index.partialUpdateObject({ ...data, objectID: animalId });
    },

    async create(animalId: Animal["id"], data: AnimalFromAlgolia) {
      await index.saveObject({ ...data, objectID: animalId });
    },

    async delete(animalId: Animal["id"]) {
      await index.deleteObject(animalId);
    },

    async search(
      text: string,
      filters: {
        species: null | Species | Species[];
        pickUpLocation: null | string | string[];
        status: null | Status | Status[];
      },
      options: Omit<SearchOptions, "filters"> = {}
    ) {
      const result = await index.search<AnimalFromAlgolia>(text, {
        ...options,
        filters: createSearchFilters(filters),
      });

      return result.hits.map((hit) => ({
        id: hit.objectID,
        name: hit.name,
        highlightedName: hit._highlightResult?.name?.value ?? hit.name,
        alias: hit.alias,
        highlightedAlias: hit._highlightResult?.alias?.value ?? hit.alias,
      }));
    },

    async searchPickUpLocation(text: string, options: SearchOptions = {}) {
      // Just for type safety.
      const facetName: keyof AnimalFromAlgolia = "pickUpLocation";
      const result = await index.searchForFacetValues(facetName, text, options);

      return result.facetHits.map((hit) => ({
        value: hit.value,
        highlightedValue: hit.highlighted,
      }));
    },
  };
}
