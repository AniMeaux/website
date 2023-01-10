import { SearchOptions } from "@algolia/client-search";
import { FosterFamily } from "@prisma/client";
import { SearchClient } from "algoliasearch";

export type FosterFamilyFromAlgolia = Pick<FosterFamily, "displayName">;

export function createFosterFamilyDelegate(client: SearchClient) {
  const index = client.initIndex("fosterFamily");

  return {
    indexName: index.indexName,

    async delete(fosterFamilyId: FosterFamily["id"]) {
      await index.deleteObject(fosterFamilyId);
    },

    async update(
      fosterFamilyId: FosterFamily["id"],
      data: Partial<FosterFamilyFromAlgolia>
    ) {
      await index.partialUpdateObject({ ...data, objectID: fosterFamilyId });
    },

    async create(
      fosterFamilyId: FosterFamily["id"],
      data: FosterFamilyFromAlgolia
    ) {
      await index.saveObject({ ...data, objectID: fosterFamilyId });
    },

    async search(
      { displayName }: { displayName: string },
      options: Omit<SearchOptions, "filters"> = {}
    ) {
      const result = await index.search<FosterFamilyFromAlgolia>(
        displayName,
        options
      );

      return result.hits.map((hit) => ({
        id: hit.objectID,
        displayName: hit.displayName,
        highlightedDisplayName:
          hit._highlightResult?.displayName?.value ?? hit.displayName,
      }));
    },
  };
}
