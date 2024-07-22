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
      name: SearchParamsIO.getValue(searchParams, keys.name),
      sort: SearchParamsIO.getValue(searchParams, keys.sort),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(searchParams, keys.name, data.name);

    SearchParamsIO.setValue(
      searchParams,
      keys.sort,
      data.sort === COLOR_DEFAULT_SORT ? undefined : data.sort,
    );
  },
});

const ColorSearchParamsSchema = zu.object({
  name: zu.searchParams.string(),
  sort: zu.searchParams.nativeEnum(ColorSort).default(COLOR_DEFAULT_SORT),
});
