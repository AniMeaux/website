import { zsp } from "#core/schemas.tsx";
import { createSearchParams } from "@animeaux/form-data";
import { Species } from "@prisma/client";
import { z } from "zod";

export enum BreedSort {
  NAME = "N",
  ANIMAL_COUNT = "A",
}

export const BREED_DEFAULT_SORT = BreedSort.NAME;

export const BreedSearchParams = createSearchParams({
  name: { key: "q", schema: zsp.text() },
  sort: zsp.requiredEnum(BreedSort, BREED_DEFAULT_SORT),
  species: zsp.set(z.nativeEnum(Species)),
});
