import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";

export enum ColorSort {
  NAME = "N",
  ANIMAL_COUNT = "A",
}

export const COLOR_DEFAULT_SORT = ColorSort.NAME;

export const ColorSearchParams = SearchParamsDelegate.create({
  name: {
    key: "q",
    schema: zu.searchParams.string(),
  },
  sort: zu.searchParams.nativeEnum(ColorSort).default(COLOR_DEFAULT_SORT),
});
