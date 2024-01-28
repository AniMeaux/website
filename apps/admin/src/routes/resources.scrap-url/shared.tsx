import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";

export const ScrapUrlSearchParams = SearchParamsDelegate.create({
  url: zu.searchParams.string().pipe(zu.string().url()),
});
