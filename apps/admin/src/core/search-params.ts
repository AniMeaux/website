import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export const PageSearchParams = SearchParamsIO.create({
  keys: { page: "page" },

  parseFunction: ({ keys, getValue }) => {
    return PageSchema.parse({
      page: getValue(keys.page),
    });
  },

  setFunction: (data, { keys, setValue }) => {
    setValue(
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

  parseFunction: ({ keys, getValue }) => {
    return NextSchema.parse({
      next: getValue(keys.next),
    });
  },

  setFunction: (data, { keys, setValue }) => {
    setValue(keys.next, data.next);
  },
});

const NextSchema = zu.object({
  next: zu.searchParams.string(),
});
