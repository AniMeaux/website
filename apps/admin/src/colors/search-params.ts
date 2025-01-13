import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export enum ColorSort {
  NAME = "N",
  ANIMAL_COUNT = "A",
}

export const COLOR_DEFAULT_SORT = ColorSort.NAME;

export const ColorSearchParams = SearchParamsIO.create({
  keys: { name: "q", sort: "sort" },

  parseFunction: ({ keys, getValue }) => {
    return ColorSearchParamsSchema.parse({
      name: getValue(keys.name),
      sort: getValue(keys.sort),
    });
  },

  setFunction: (data, { keys, setValue }) => {
    setValue(keys.name, data.name);

    setValue(
      keys.sort,
      data.sort === COLOR_DEFAULT_SORT ? undefined : data.sort,
    );
  },
});

const ColorSearchParamsSchema = zu.object({
  name: zu.searchParams.string(),
  sort: zu.searchParams.nativeEnum(ColorSort).default(COLOR_DEFAULT_SORT),
});
