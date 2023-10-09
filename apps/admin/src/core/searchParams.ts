import { SearchParamsDelegate, zsp } from "@animeaux/form-data";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const PageSearchParams = SearchParamsDelegate.create({
  page: zfd.numeric(z.number().int().min(0).catch(0)),
});

export const NextSearchParams = SearchParamsDelegate.create({
  next: zsp.text(),
});
