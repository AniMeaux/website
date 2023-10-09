import { SearchParamsDelegate, zsp } from "@animeaux/form-data";

export enum ColorSort {
  NAME = "N",
  ANIMAL_COUNT = "A",
}

export const COLOR_DEFAULT_SORT = ColorSort.NAME;

export const ColorSearchParams = SearchParamsDelegate.create({
  name: { key: "q", schema: zsp.text() },
  sort: zsp.requiredEnum(ColorSort, COLOR_DEFAULT_SORT),
});
