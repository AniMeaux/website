import { SEARCHABLE_RESOURCES_INDEX_NAME } from "../../entities/searchableResources.entity";
import { createBatchHandlers } from "./shared";

export const searchableResourcesHandlers = [
  ...createBatchHandlers(`/1/indexes/${SEARCHABLE_RESOURCES_INDEX_NAME}/batch`),
];
