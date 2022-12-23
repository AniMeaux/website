import { SearchOptions } from "@algolia/client-search";
import { Animal } from "@prisma/client";
import { SearchClient } from "algoliasearch";

type AnimalFromAlgolia = Pick<
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
