import { ApplicationPartnershipCategory } from "#show/partnership/category";
import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import {
  ShowActivityField,
  ShowActivityTarget,
  ShowExhibitorApplicationStatus,
} from "@prisma/client";

export const ApplicationSearchParams = SearchParamsIO.create({
  keys: {
    fields: "fi",
    name: "q",
    partnershipCategories: "pc",
    sort: "sort",
    statuses: "st",
    targets: "ta",
  },

  parseFunction: ({ keys, getValue, getValues }) => {
    return SearchParamsSchema.parse({
      fields: getValues(keys.fields),
      name: getValue(keys.name),
      partnershipCategories: getValues(keys.partnershipCategories),
      sort: getValue(keys.sort),
      statuses: getValues(keys.statuses),
      targets: getValues(keys.targets),
    });
  },

  setFunction: (data, { keys, setValue, setValues }) => {
    setValues(keys.fields, data.fields);
    setValue(keys.name, data.name);
    setValues(keys.partnershipCategories, data.partnershipCategories);
    setValue(keys.sort, data.sort);
    setValues(keys.statuses, data.statuses);
    setValues(keys.targets, data.targets);
  },
});

export namespace ApplicationSearchParamsN {
  export type Value = SearchParamsIO.Infer<typeof ApplicationSearchParams>;

  export enum Sort {
    CREATED_AT = "C",
    NAME = "N",
  }

  export const DEFAULT_SORT = Sort.CREATED_AT;
}

const SearchParamsSchema = zu.object({
  fields: zu.searchParams.set(zu.searchParams.nativeEnum(ShowActivityField)),
  name: zu.searchParams.string(),
  partnershipCategories: zu.searchParams.set(
    zu.searchParams.nativeEnum(ApplicationPartnershipCategory),
  ),
  sort: zu.searchParams
    .nativeEnum(ApplicationSearchParamsN.Sort)
    .default(ApplicationSearchParamsN.DEFAULT_SORT),
  statuses: zu.searchParams.set(
    zu.searchParams.nativeEnum(ShowExhibitorApplicationStatus),
  ),
  targets: zu.searchParams.set(zu.searchParams.nativeEnum(ShowActivityTarget)),
});
