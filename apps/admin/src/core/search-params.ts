import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export const PageSearchParams = SearchParamsIO.create({
  keys: { page: "page" },

  parseFunction: (searchParams, keys) => {
    return PageSchema.parse({ page: searchParams.get(keys.page) });
  },

  setFunction: (searchParams, data, keys) => {
    if (data.page == null || data.page === 0) {
      searchParams.delete(keys.page);
      return;
    }

    searchParams.set(keys.page, String(data.page));
  },
});

const PageSchema = zu.object({
  page: zu.searchParams.number().pipe(zu.number().int().min(0).catch(0)),
});

export const NextSearchParams = SearchParamsIO.create({
  keys: { next: "next" },

  parseFunction: (searchParams, keys) => {
    return NextSchema.parse({ next: searchParams.get(keys.next) });
  },

  setFunction: (searchParams, data, keys) => {
    if (data.next == null) {
      searchParams.delete(keys.next);
      return;
    }

    searchParams.set(keys.next, data.next);
  },
});

const NextSchema = zu.object({
  next: zu.searchParams.string(),
});
