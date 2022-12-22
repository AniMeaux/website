import { algolia } from "#/core/algolia/algolia.server";
import { createBatchHandlers } from "#/mocks/algolia/shared.server";

export const userHandlers = [
  ...createBatchHandlers(`/1/indexes/${algolia.user.indexName}/batch`),
];
