import { SearchOptions } from "@algolia/client-search";
import { Animal, Species, Status } from "@prisma/client";
import { SearchClient } from "algoliasearch";
import { createSearchFilters } from "~/core/algolia/shared.server";

export type AnimalFromAlgolia = Pick<
  Animal,
  "alias" | "name" | "pickUpLocation" | "species" | "status"
> & {
  pickUpDate: number;
};

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
      {
        nameOrAlias,
        maxPickUpDate,
        minPickUpDate,
        species,
        pickUpLocation,
        status,
      }: {
        nameOrAlias: string;
        maxPickUpDate?: null | Date;
        minPickUpDate?: null | Date;
        species?: null | Species | Species[];
        pickUpLocation?: null | string | string[];
        status?: null | Status | Status[];
      },
      options: Omit<SearchOptions, "filters"> = {}
    ) {
      let pickUpDate: undefined | string;
      if (minPickUpDate != null || maxPickUpDate != null) {
        pickUpDate = `${minPickUpDate?.getTime() ?? 0} TO ${
          maxPickUpDate?.getTime() ?? Date.now()
        }`;
      }

      const result = await index.search<AnimalFromAlgolia>(nameOrAlias, {
        ...options,
        filters: createSearchFilters({
          pickUpDate,
          species,
          pickUpLocation,
          status,
        }),
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
