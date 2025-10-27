import { SponsorshipOptionalCategory } from "#show/sponsors/category";
import {
  ShowActivityField,
  ShowActivityTarget,
  ShowExhibitorApplicationStatus,
} from "@animeaux/prisma/client";
import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export const ApplicationSearchParams = SearchParamsIO.create({
  keys: {
    fields: "fi",
    name: "q",
    sort: "sort",
    sponsorshipCategories: "pc",
    standSizesId: "size",
    statuses: "st",
    targets: "ta",
  },

  parseFunction: (searchParams, keys) => {
    return SearchParamsSchema.parse({
      fields: SearchParamsIO.getValues(searchParams, keys.fields),
      name: SearchParamsIO.getValue(searchParams, keys.name),
      sort: SearchParamsIO.getValue(searchParams, keys.sort),
      sponsorshipCategories: SearchParamsIO.getValues(
        searchParams,
        keys.sponsorshipCategories,
      ),
      standSizesId: SearchParamsIO.getValues(searchParams, keys.standSizesId),
      statuses: SearchParamsIO.getValues(searchParams, keys.statuses),
      targets: SearchParamsIO.getValues(searchParams, keys.targets),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValues(searchParams, keys.fields, data.fields);

    SearchParamsIO.setValue(searchParams, keys.name, data.name);

    SearchParamsIO.setValue(searchParams, keys.sort, data.sort);

    SearchParamsIO.setValues(
      searchParams,
      keys.sponsorshipCategories,
      data.sponsorshipCategories,
    );

    SearchParamsIO.setValues(
      searchParams,
      keys.standSizesId,
      data.standSizesId,
    );

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

  sort: zu.searchParams
    .nativeEnum(ApplicationSearchParamsN.Sort)
    .default(ApplicationSearchParamsN.DEFAULT_SORT),

  sponsorshipCategories: zu.searchParams.set(
    zu.searchParams.nativeEnum(SponsorshipOptionalCategory.Enum),
  ),

  standSizesId: zu.searchParams.set(
    zu.searchParams
      .string()
      .pipe(zu.string().uuid().optional().catch(undefined)),
  ),

  statuses: zu.searchParams.set(
    zu.searchParams.nativeEnum(ShowExhibitorApplicationStatus),
  ),

  targets: zu.searchParams.set(zu.searchParams.nativeEnum(ShowActivityTarget)),
});
