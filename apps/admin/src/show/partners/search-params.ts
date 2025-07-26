import type { IconName } from "#generated/icon.js";
import { SponsorshipCategory } from "#show/partners/category";
import { Visibility } from "#show/visibility";
import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export const SponsorSearchParams = SearchParamsIO.create({
  keys: {
    categories: "c",
    exhibitor: "e",
    name: "q",
    visibility: "v",
  },

  parseFunction: (searchParams, keys) => {
    return SearchParamsSchema.parse({
      categories: SearchParamsIO.getValues(searchParams, keys.categories),
      exhibitor: SearchParamsIO.getValues(searchParams, keys.exhibitor),
      name: SearchParamsIO.getValue(searchParams, keys.name),
      visibility: SearchParamsIO.getValues(searchParams, keys.visibility),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValues(searchParams, keys.categories, data.categories);

    SearchParamsIO.setValues(searchParams, keys.exhibitor, data.exhibitor);

    SearchParamsIO.setValue(searchParams, keys.name, data.name);

    SearchParamsIO.setValues(searchParams, keys.visibility, data.visibility);
  },
});

export namespace SponsorSearchParamsN {
  export type Value = SearchParamsIO.Infer<typeof SponsorSearchParams>;

  export namespace Exhibitor {
    export const Enum = { YES: "YES", NO: "NO" } as const;
    export type Enum = (typeof Enum)[keyof typeof Enum];

    export const values = [Enum.YES, Enum.NO];

    export const translation: Record<Enum, string> = {
      [Enum.YES]: "Est exposant",
      [Enum.NO]: "N’est pas exposant",
    };

    export const icon: Record<Enum, { light: IconName; solid: IconName }> = {
      [Enum.YES]: {
        light: "icon-store-light",
        solid: "icon-store-solid",
      },
      [Enum.NO]: {
        light: "icon-store-slash-light",
        solid: "icon-store-slash-solid",
      },
    };
  }
}

const SearchParamsSchema = zu.object({
  categories: zu.searchParams.set(
    zu.searchParams.nativeEnum(SponsorshipCategory.Enum),
  ),
  exhibitor: zu.searchParams.set(
    zu.searchParams.nativeEnum(SponsorSearchParamsN.Exhibitor.Enum),
  ),
  name: zu.searchParams.string(),
  visibility: zu.searchParams.set(zu.searchParams.nativeEnum(Visibility.Enum)),
});
