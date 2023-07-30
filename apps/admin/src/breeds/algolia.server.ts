import { SearchOptions } from "@algolia/client-search";
import { Breed, Species } from "@prisma/client";
import { SearchClient, SearchIndex } from "algoliasearch";
import { createSearchFilters, indexSearch } from "~/core/algolia/shared.server";

export type BreedFromAlgolia = Pick<Breed, "name" | "species">;

export class BreedAlgoliaDelegate {
  readonly index: SearchIndex;

  constructor(client: SearchClient) {
    this.index = client.initIndex("breeds");
  }

  async delete(id: Breed["id"]) {
    await this.index.deleteObject(id);
  }

  async create(id: Breed["id"], data: BreedFromAlgolia) {
    await this.index.saveObject({ ...data, objectID: id });
  }

  async search({
    name,
    species = [],
    ...options
  }: Omit<SearchOptions, "filters"> & {
    name: string;
    species?: Species[];
  }) {
    const hits = await indexSearch<BreedFromAlgolia>(this.index, name, {
      ...options,
      filters: createSearchFilters({ species }),
    });

    return hits.map((hit) => ({
      id: hit.objectID,
      name: hit.name,
      highlightedName: hit._highlightResult?.name?.value ?? hit.name,
    }));
  }
}
