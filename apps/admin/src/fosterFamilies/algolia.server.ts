import { SearchOptions } from "@algolia/client-search";
import { FosterFamily } from "@prisma/client";
import { SearchClient, SearchIndex } from "algoliasearch";
import { indexSearch } from "~/core/algolia/shared.server";

export type FosterFamilyFromAlgolia = Pick<FosterFamily, "displayName">;

export class FosterFamilyAlgoliaDelegate {
  readonly index: SearchIndex;

  constructor(client: SearchClient) {
    this.index = client.initIndex("fosterFamily");
  }

  async delete(id: FosterFamily["id"]) {
    await this.index.deleteObject(id);
  }

  async update(id: FosterFamily["id"], data: Partial<FosterFamilyFromAlgolia>) {
    await this.index.partialUpdateObject({ ...data, objectID: id });
  }

  async create(id: FosterFamily["id"], data: FosterFamilyFromAlgolia) {
    await this.index.saveObject({ ...data, objectID: id });
  }

  async search({
    displayName,
    ...options
  }: Omit<SearchOptions, "filters"> & { displayName: string }) {
    const hits = await indexSearch<FosterFamilyFromAlgolia>(
      this.index,
      displayName,
      options
    );

    return hits.map((hit) => ({
      id: hit.objectID,
      displayName: hit.displayName,
      highlightedDisplayName:
        hit._highlightResult?.displayName?.value ?? hit.displayName,
    }));
  }
}
