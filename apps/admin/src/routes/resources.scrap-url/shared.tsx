import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export const ScrapUrlSearchParams = SearchParamsIO.create({
  keys: { url: "url" },

  parseFunction: ({ keys, getValue }) => {
    return Schema.parse({
      url: getValue(keys.url),
    });
  },

  setFunction: (data, { keys, setValue }) => {
    setValue(keys.url, data.url);
  },
});

const Schema = zu.object({
  url: zu.searchParams.string().pipe(zu.string().url().optional()),
});
