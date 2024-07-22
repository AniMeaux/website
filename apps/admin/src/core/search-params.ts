import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export const PageSearchParams = SearchParamsIO.create({
  keys: { page: "page" },

  parseFunction: (searchParams, keys) => {
    return PageSchema.parse({
      page: SearchParamsIO.getValue(searchParams, keys.page),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(
      searchParams,
      keys.page,
      data.page == null || data.page === 0 ? undefined : String(data.page),
    );
  },
});

const PageSchema = zu.object({
  page: zu.searchParams.number().pipe(zu.number().int().min(0).catch(0)),
});

export const NextSearchParams = SearchParamsIO.create({
  keys: { next: "next" },

  parseFunction: (searchParams, keys) => {
    return NextSchema.parse({
      next: SearchParamsIO.getValue(searchParams, keys.next),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(searchParams, keys.next, data.next);
  },
});

const NextSchema = zu.object({
  next: zu.searchParams.string(),
});
