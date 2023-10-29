import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";

export const PageSearchParams = SearchParamsDelegate.create({
  page: zu.searchParams.number().pipe(zu.number().int().min(0).catch(0)),
});

export const NextSearchParams = SearchParamsDelegate.create({
  next: zu.searchParams.string(),
});
