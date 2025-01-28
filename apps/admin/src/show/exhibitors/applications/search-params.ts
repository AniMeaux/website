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

  parseFunction: (searchParams, keys) => {
    return SearchParamsSchema.parse({
      fields: SearchParamsIO.getValues(searchParams, keys.fields),
      name: SearchParamsIO.getValue(searchParams, keys.name),
      partnershipCategories: SearchParamsIO.getValues(
        searchParams,
        keys.partnershipCategories,
      ),
      sort: SearchParamsIO.getValue(searchParams, keys.sort),
      statuses: SearchParamsIO.getValues(searchParams, keys.statuses),
      targets: SearchParamsIO.getValues(searchParams, keys.targets),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValues(searchParams, keys.fields, data.fields);
    SearchParamsIO.setValue(searchParams, keys.name, data.name);
    SearchParamsIO.setValues(
      searchParams,
      keys.partnershipCategories,
      data.partnershipCategories,
    );
    SearchParamsIO.setValue(searchParams, keys.sort, data.sort);
    SearchParamsIO.setValues(searchParams, keys.statuses, data.statuses);
    SearchParamsIO.setValues(searchParams, keys.targets, data.targets);
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
