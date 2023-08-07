import { SearchOptions } from "@algolia/client-search";
import { Animal, Species, Status } from "@prisma/client";
import { SearchClient, SearchIndex } from "algoliasearch";
import { createSearchFilters, indexSearch } from "~/core/algolia/shared.server";

export type AnimalFromAlgolia = Pick<
  Animal,
  "alias" | "name" | "pickUpLocation" | "species" | "status"
> & {
  pickUpDate: number;
};

export class AnimalAlgoliaDelegate {
  readonly index: SearchIndex;

  constructor(client: SearchClient) {
    this.index = client.initIndex("animals");
  }

  async update(animalId: Animal["id"], data: Partial<AnimalFromAlgolia>) {
    await this.index.partialUpdateObject({ ...data, objectID: animalId });
  }

  async create(animalId: Animal["id"], data: AnimalFromAlgolia) {
    await this.index.saveObject({ ...data, objectID: animalId });
  }

  async delete(animalId: Animal["id"]) {
    await this.index.deleteObject(animalId);
  }

  async search({
    nameOrAlias,
    pickUpDateEnd,
    pickUpDateStart,
    pickUpLocations,
    species,
    statuses,
    ...options
  }: Omit<SearchOptions, "filters"> & {
    nameOrAlias: string;
    pickUpDateEnd?: Date;
    pickUpDateStart?: Date;
    pickUpLocations?: Iterable<string>;
    species?: Iterable<Species>;
    statuses?: Iterable<Status>;
  }) {
    let pickUpDate: undefined | string;
    if (pickUpDateStart != null || pickUpDateEnd != null) {
      pickUpDate = `${pickUpDateStart?.getTime() ?? 0} TO ${
        pickUpDateEnd?.getTime() ?? Date.now()
      }`;
    }

    const hits = await indexSearch<AnimalFromAlgolia>(this.index, nameOrAlias, {
      ...options,
      filters: createSearchFilters({
        pickUpDate,
        species,
        pickUpLocation: pickUpLocations,
        status: statuses,
      }),
    });

    return hits.map((hit) => ({
      id: hit.objectID,
      name: hit.name,
      highlightedName: hit._highlightResult?.name?.value ?? hit.name,
      alias: hit.alias,
      highlightedAlias: hit._highlightResult?.alias?.value ?? hit.alias,
    }));
  }

  async searchPickUpLocation({
    text,
    ...options
  }: Omit<SearchOptions, "filters"> & { text: string }) {
    const result = await this.index.searchForFacetValues(
      "pickUpLocation" satisfies keyof AnimalFromAlgolia,
      text,
      options
    );

    return result.facetHits.map((hit) => ({
      value: hit.value,
      highlightedValue: hit.highlighted,
    }));
  }
}
