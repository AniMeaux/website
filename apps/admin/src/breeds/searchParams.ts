import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import { Species } from "@prisma/client";

export enum BreedSort {
  NAME = "N",
  ANIMAL_COUNT = "A",
}

export const BREED_DEFAULT_SORT = BreedSort.NAME;

export const BreedSearchParams = SearchParamsDelegate.create({
  name: {
    key: "q",
    schema: zu.searchParams.string(),
  },
  sort: zu.searchParams.nativeEnum(BreedSort).default(BREED_DEFAULT_SORT),
  species: zu.searchParams.set(zu.searchParams.nativeEnum(Species)),
});
