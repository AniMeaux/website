import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export enum ColorSort {
  NAME = "N",
  ANIMAL_COUNT = "A",
}

export const COLOR_DEFAULT_SORT = ColorSort.NAME;

export const ColorSearchParams = SearchParamsIO.create({
  keys: { name: "q", sort: "sort" },

  parseFunction: (searchParams, keys) => {
    return ColorSearchParamsSchema.parse({
      name: searchParams.get(keys.name),
      sort: searchParams.get(keys.sort) ?? undefined,
    });
  },

  setFunction: (searchParams, data, keys) => {
    if (data.name == null) {
      searchParams.delete(keys.name);
    } else {
      searchParams.set(keys.name, data.name);
    }

    if (data.sort == null || data.sort === COLOR_DEFAULT_SORT) {
      searchParams.delete(keys.sort);
    } else {
      searchParams.set(keys.sort, data.sort);
    }
  },
});

const ColorSearchParamsSchema = zu.object({
  name: zu.searchParams.string(),
  sort: zu.searchParams.nativeEnum(ColorSort).default(COLOR_DEFAULT_SORT),
});
