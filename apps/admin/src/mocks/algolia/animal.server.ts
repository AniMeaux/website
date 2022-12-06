import { algolia } from "~/core/algolia/algolia.server";
import { createBatchHandlers } from "~/mocks/algolia/shared.server";

export const animalHandlers = [
  ...createBatchHandlers(`/1/indexes/${algolia.animal.indexName}/batch`),
];
