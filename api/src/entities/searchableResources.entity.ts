import { Animal, Event, FosterFamily, User } from "@prisma/client";
import { AlgoliaClient } from "../core/algolia";

export const SEARCHABLE_RESOURCES_INDEX_NAME = "searchableResources";

export const SearchableResourcesIndex = AlgoliaClient.initIndex(
  SEARCHABLE_RESOURCES_INDEX_NAME
);

export enum SearchableResourceType {
  ANIMAL = "ANIMAL",
  FOSTER_FAMILY = "FOSTER_FAMILY",
  EVENT = "EVENT",
  USER = "USER",
}

export type SearchableResourceFromAlgolia =
  | {
      type: SearchableResourceType.ANIMAL;
      data: TimestampDate<Pick<Animal, "name" | "alias" | "pickUpDate">>;
    }
  | {
      type: SearchableResourceType.FOSTER_FAMILY;
      data: Pick<FosterFamily, "displayName">;
    }
  | {
      type: SearchableResourceType.EVENT;
      data: TimestampDate<Pick<Event, "title" | "endDate">>;
    }
  | {
      type: SearchableResourceType.USER;
      data: Pick<User, "displayName">;
    };

type TimestampDate<TObject extends object> = {
  [key in keyof TObject]: TObject[key] extends Date ? number : TObject[key];
};
