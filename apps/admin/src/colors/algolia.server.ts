import { indexSearch } from "#core/algolia/shared.server.ts";
import type { SearchOptions } from "@algolia/client-search";
import type { Color } from "@prisma/client";
import type { SearchClient, SearchIndex } from "algoliasearch";

export type ColorFromAlgolia = Pick<Color, "name">;

export class ColorAlgoliaDelegate {
  readonly index: SearchIndex;

  constructor(client: SearchClient) {
    this.index = client.initIndex("colors");
  }

  async delete(id: Color["id"]) {
    await this.index.deleteObject(id);
  }

  async create(id: Color["id"], data: ColorFromAlgolia) {
    await this.index.saveObject({ ...data, objectID: id });
  }

  async update(id: Color["id"], data: Partial<ColorFromAlgolia>) {
    await this.index.partialUpdateObject({ ...data, objectID: id });
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
