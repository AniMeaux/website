import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import { Species } from "@prisma/client";

export enum BreedSort {
  NAME = "N",
  ANIMAL_COUNT = "A",
}

export const BREED_DEFAULT_SORT = BreedSort.NAME;

export const BreedSearchParams = SearchParamsIO.create({
  keys: { name: "q", sort: "sort", species: "species" },

  parseFunction: (searchParams, keys) => {
    return BreedSearchParamsSchema.parse({
      name: SearchParamsIO.getValue(searchParams, keys.name),
      sort: SearchParamsIO.getValue(searchParams, keys.sort),
      species: SearchParamsIO.getValues(searchParams, keys.species),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(searchParams, keys.name, data.name);

    SearchParamsIO.setValue(
      searchParams,
      keys.sort,
      data.sort === BREED_DEFAULT_SORT ? undefined : data.sort,
    );

    SearchParamsIO.setValues(searchParams, keys.species, data.species);
  },
});

const BreedSearchParamsSchema = zu.object({
  name: zu.searchParams.string(),
  sort: zu.searchParams.nativeEnum(BreedSort).default(BREED_DEFAULT_SORT),
  species: zu.searchParams.set(zu.searchParams.nativeEnum(Species)),
});
