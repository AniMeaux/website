import { User } from "@prisma/client";
import { SearchClient } from "algoliasearch";

type UserFromAlgolia = Pick<
  User,
  "email" | "displayName" | "groups" | "isDisabled"
>;

export function createUserDelegate(client: SearchClient) {
  const index = client.initIndex("users");

  return {
    indexName: index.indexName,

    async update(userId: User["id"], data: Partial<UserFromAlgolia>) {
      await index.partialUpdateObject({ ...data, objectID: userId });
    },
  };
}
