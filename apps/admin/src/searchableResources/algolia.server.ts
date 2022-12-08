import { Animal, Event, FosterFamily, User } from "@prisma/client";
import { SearchClient } from "algoliasearch";
import { SearchableResourceType } from "~/searchableResources/type";

type SearchableResource =
  | SearchableAnimal
  | SearchableFosterFamily
  | SearchableEvent
  | SearchableUser;

type SearchableAnimal = {
  type: SearchableResourceType.ANIMAL;
  data: Pick<Animal, "name" | "alias" | "pickUpDate">;
};

type SearchableFosterFamily = {
  type: SearchableResourceType.FOSTER_FAMILY;
  data: Pick<FosterFamily, "displayName">;
};

type SearchableEvent = {
  type: SearchableResourceType.EVENT;
  data: Pick<Event, "title" | "endDate">;
};

type SearchableUser = {
  type: SearchableResourceType.USER;
  data: Pick<User, "displayName">;
};

type SearchableResourceFromAlgolia = TimestampDate<SearchableResource>;

export function createSearchableResourceDelegate(client: SearchClient) {
  const index = client.initIndex("searchableResources");

  return {
    indexName: index.indexName,

    async updateAnimal(objectId: Animal["id"], data: SearchableAnimal["data"]) {
      const fromAlgolia: SearchableResourceFromAlgolia = {
        type: SearchableResourceType.ANIMAL,
        data: {
          ...data,
          pickUpDate: data.pickUpDate.getTime(),
        },
      };

      await index.saveObject({ ...fromAlgolia, objectID: objectId });
    },

    async updateUser(objectId: User["id"], data: SearchableUser["data"]) {
      const fromAlgolia: SearchableResourceFromAlgolia = {
        type: SearchableResourceType.USER,
        data,
      };

      await index.saveObject({ ...fromAlgolia, objectID: objectId });
    },
  };
}

type TimestampDate<TValue> = TValue extends Date
  ? number
  : TValue extends object
  ? {
      [key in keyof TValue]: TimestampDate<TValue[key]>;
    }
  : TValue;
