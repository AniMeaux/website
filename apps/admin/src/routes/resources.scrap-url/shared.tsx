import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export const ScrapUrlSearchParams = SearchParamsIO.create({
  keys: { url: "url" },

  parseFunction: (searchParams, keys) => {
    return Schema.parse({
      url: SearchParamsIO.getValue(searchParams, keys.url),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(searchParams, keys.url, data.url);
  },
});

const Schema = zu.object({
  url: zu.searchParams.string().pipe(zu.string().url().optional()),
});
