import { HighlightResult, Hit, SearchOptions } from "@algolia/client-search";
import { Animal, Event, FosterFamily, User } from "@prisma/client";
import { SearchClient } from "algoliasearch";
import { createSearchFilters } from "~/core/algolia/shared.server";
import { visit } from "~/core/visitor";
import { SearchableResourceType } from "~/searchableResources/type";

type Searchable<TType extends SearchableResourceType, TData extends object> = {
  type: TType;
  data: TData;
};

type SearchableAnimal = Searchable<
  SearchableResourceType.ANIMAL,
  Pick<Animal, "name" | "alias" | "pickUpDate">
>;

type SearchableEvent = Searchable<
  SearchableResourceType.EVENT,
  Pick<Event, "title" | "endDate">
>;

type SearchableFosterFamily = Searchable<
  SearchableResourceType.FOSTER_FAMILY,
  Pick<FosterFamily, "displayName">
>;

type SearchableUser = Searchable<
  SearchableResourceType.USER,
  Pick<User, "displayName">
>;

type SearchableResource =
  | SearchableAnimal
  | SearchableEvent
  | SearchableFosterFamily
  | SearchableUser;

type TimestampDate<TValue> = TValue extends Date
  ? number
  : TValue extends object
  ? {
      [key in keyof TValue]: TimestampDate<TValue[key]>;
    }
  : TValue;

export type SearchableResourceFromAlgolia = TimestampDate<SearchableResource>;

type SearchableHit<
  TType extends Searchable<any, any>,
  TAttributes extends keyof TType["data"] = keyof TType["data"],
  TData = TType["data"]
> = {
  type: TType["type"];
  id: string;
  data: Pick<TData, TAttributes>;
  highlightedData: Pick<TData, TAttributes>;
};

export type SearchableAnimalHit = SearchableHit<
  SearchableAnimal,
  "alias" | "name"
>;
export type SearchableEventHit = SearchableHit<SearchableEvent, "title">;
export type SearchableFosterFamilyHit = SearchableHit<SearchableFosterFamily>;
export type SearchableUserHit = SearchableHit<SearchableUser>;

export type SearchableResourceHit =
  | SearchableAnimalHit
  | SearchableEventHit
  | SearchableFosterFamilyHit
  | SearchableUserHit;

export function createSearchableResourceDelegate(client: SearchClient) {
  const index = client.initIndex("searchableResources");

  return {
    indexName: index.indexName,

    async createOrUpdateAnimal(
      objectId: Animal["id"],
      data: SearchableAnimal["data"]
    ) {
      const fromAlgolia: SearchableResourceFromAlgolia = {
        type: SearchableResourceType.ANIMAL,
        data: {
          ...data,
          pickUpDate: data.pickUpDate.getTime(),
        },
      };

      await index.saveObject({ ...fromAlgolia, objectID: objectId });
    },

    async deleteAnimal(objectId: Animal["id"]) {
      await index.deleteObject(objectId);
    },

    async createOrUpdateUser(
      objectId: User["id"],
      data: SearchableUser["data"]
    ) {
      const fromAlgolia: SearchableResourceFromAlgolia = {
        type: SearchableResourceType.USER,
        data,
      };

      await index.saveObject({ ...fromAlgolia, objectID: objectId });
    },

    async search(
      text: string,
      filters: { type: SearchableResourceType[] | SearchableResourceType },
      options: Omit<SearchOptions, "filters"> = {}
    ) {
      const result = await index.search<SearchableResourceFromAlgolia>(text, {
        ...options,
        filters: createSearchFilters(filters),
      });

      return result.hits.map((hit) => {
        return visit<
          SearchableResourceType,
          Hit<SearchableResourceFromAlgolia>,
          SearchableResourceHit
        >(hit, {
          [SearchableResourceType.ANIMAL]: (hit) => {
            const highlightResult = hit._highlightResult as
              | undefined
              | HighlightResult<SearchableAnimal>;

            return {
              id: hit.objectID,
              type: SearchableResourceType.ANIMAL,
              data: { name: hit.data.name, alias: hit.data.alias },
              highlightedData: {
                name: highlightResult?.data?.name?.value ?? hit.data.name,
                alias: highlightResult?.data?.alias?.value ?? hit.data.alias,
              },
            };
          },

          [SearchableResourceType.EVENT]: (hit) => {
            const highlightResult = hit._highlightResult as
              | undefined
              | HighlightResult<SearchableEvent>;

            return {
              id: hit.objectID,
              type: SearchableResourceType.EVENT,
              data: { title: hit.data.title },
              highlightedData: {
                title: highlightResult?.data?.title?.value ?? hit.data.title,
              },
            };
          },

          [SearchableResourceType.FOSTER_FAMILY]: (hit) => {
            const highlightResult = hit._highlightResult as
              | undefined
              | HighlightResult<SearchableFosterFamily>;

            return {
              id: hit.objectID,
              type: SearchableResourceType.FOSTER_FAMILY,
              data: { displayName: hit.data.displayName },
              highlightedData: {
                displayName:
                  highlightResult?.data?.displayName?.value ??
                  hit.data.displayName,
              },
            };
          },

          [SearchableResourceType.USER]: (hit) => {
            const highlightResult = hit._highlightResult as
              | undefined
              | HighlightResult<SearchableUser>;

            return {
              id: hit.objectID,
              type: SearchableResourceType.USER,
              data: { displayName: hit.data.displayName },
              highlightedData: {
                displayName:
                  highlightResult?.data?.displayName?.value ??
                  hit.data.displayName,
              },
            };
          },
        });
      });
    },
  };
}
