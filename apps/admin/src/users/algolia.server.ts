import { createSearchFilters } from "#/core/algolia/shared.server";
import { SearchOptions } from "@algolia/client-search";
import { User, UserGroup } from "@prisma/client";
import { SearchClient } from "algoliasearch";

export type UserFromAlgolia = Pick<
  User,
  "displayName" | "groups" | "isDisabled"
>;

export function createUserDelegate(client: SearchClient) {
  const index = client.initIndex("users");

  return {
    indexName: index.indexName,

    async update(userId: User["id"], data: Partial<UserFromAlgolia>) {
      await index.partialUpdateObject({ ...data, objectID: userId });
    },

    async search(
      text: string,
      filters: {
        groups: null | UserGroup | UserGroup[];
        isDisabled: null | boolean;
      },
      options: Omit<SearchOptions, "filters"> = {}
    ) {
      const result = await index.search<UserFromAlgolia>(text, {
        ...options,
        filters: createSearchFilters(filters),
      });

      return result.hits.map((hit) => ({
        id: hit.objectID,
        displayName: hit.displayName,
        highlightedDisplayName:
          hit._highlightResult?.displayName?.value ?? hit.displayName,
      }));
    },
  };
}
