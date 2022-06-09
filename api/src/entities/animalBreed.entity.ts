import { Breed } from "@prisma/client";
import { AlgoliaClient } from "../core/algolia";

export const BREED_INDEX_NAME = "breeds";

export const BreedIndex = AlgoliaClient.initIndex(BREED_INDEX_NAME);

export type BreedFromAlgolia = Pick<Breed, "name" | "species">;
