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
      name: searchParams.get(keys.name),
      sort: searchParams.get(keys.sort) ?? undefined,
      species: searchParams.getAll(keys.species),
    });
  },

  setFunction: (searchParams, data, keys) => {
    if (data.name == null) {
      searchParams.delete(keys.name);
    } else {
      searchParams.set(keys.name, data.name);
    }

    if (data.sort == null || data.sort === BREED_DEFAULT_SORT) {
      searchParams.delete(keys.sort);
    } else {
      searchParams.set(keys.sort, data.sort);
    }

    searchParams.delete(keys.species);

    data.species?.forEach((species) => {
      searchParams.append(keys.species, species);
    });
  },
});

const BreedSearchParamsSchema = zu.object({
  name: zu.searchParams.string(),
  sort: zu.searchParams.nativeEnum(BreedSort).default(BREED_DEFAULT_SORT),
  species: zu.searchParams.set(zu.searchParams.nativeEnum(Species)),
});
