import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export const ScrapUrlSearchParams = SearchParamsIO.create({
  keys: { url: "url" },

  parseFunction: (searchParams, keys) => {
    return Schema.parse({ url: searchParams.get(keys.url) });
  },

  setFunction: (searchParams, data, keys) => {
    if (data.url == null) {
      searchParams.delete(keys.url);
      return;
    }

    searchParams.set(keys.url, data.url);
  },
});

const Schema = zu.object({
  url: zu.searchParams.string().pipe(zu.string().url().optional()),
});
