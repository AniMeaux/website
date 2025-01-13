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

  parseFunction: ({ keys, getValue, getValues }) => {
    return BreedSearchParamsSchema.parse({
      name: getValue(keys.name),
      sort: getValue(keys.sort),
      species: getValues(keys.species),
    });
  },

  setFunction: (data, { keys, setValue, setValues }) => {
    setValue(keys.name, data.name);

    setValue(
      keys.sort,
      data.sort === BREED_DEFAULT_SORT ? undefined : data.sort,
    );

    setValues(keys.species, data.species);
  },
});

const BreedSearchParamsSchema = zu.object({
  name: zu.searchParams.string(),
  sort: zu.searchParams.nativeEnum(BreedSort).default(BREED_DEFAULT_SORT),
  species: zu.searchParams.set(zu.searchParams.nativeEnum(Species)),
});
