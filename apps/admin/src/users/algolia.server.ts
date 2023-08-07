import { SearchOptions } from "@algolia/client-search";
import { User, UserGroup } from "@prisma/client";
import { SearchClient, SearchIndex } from "algoliasearch";
import { createSearchFilters, indexSearch } from "~/core/algolia/shared.server";

export type UserFromAlgolia = Pick<
  User,
  "displayName" | "groups" | "isDisabled"
>;

export class UserAlgoliaDelegate {
  readonly index: SearchIndex;

  constructor(client: SearchClient) {
    this.index = client.initIndex("users");
  }

  async update(userId: User["id"], data: Partial<UserFromAlgolia>) {
    await this.index.partialUpdateObject({ ...data, objectID: userId });
  }

  async delete(userId: User["id"]) {
    await this.index.deleteObject(userId);
  }

  async create(userId: User["id"], data: UserFromAlgolia) {
    await this.index.saveObject({ ...data, objectID: userId });
  }

  async search({
    displayName,
    groups,
    isDisabled,
    ...options
  }: Omit<SearchOptions, "filters"> & {
    displayName: string;
    groups?: Iterable<UserGroup>;
    isDisabled?: boolean;
  }) {
    const hits = await indexSearch<UserFromAlgolia>(this.index, displayName, {
      ...options,
      filters: createSearchFilters({ groups, isDisabled }),
    });

    return hits.map((hit) => ({
      id: hit.objectID,
      displayName: hit.displayName,
      highlightedDisplayName:
        hit._highlightResult?.displayName?.value ?? hit.displayName,
    }));
  }
}
