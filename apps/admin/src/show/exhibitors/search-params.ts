import type { IconName } from "#generated/icon";
import { DocumentsStatus } from "#show/exhibitors/documents/status";
import { Payment } from "#show/exhibitors/payment";
import { ProfileStatus } from "#show/exhibitors/profile/status";
import { StandConfigurationStatus } from "#show/exhibitors/stand-configuration/status";
import { PartnershipCategory } from "#show/partners/category";
import { Visibility } from "#show/visibility";
import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import {
  ShowActivityField,
  ShowActivityTarget,
  ShowExhibitorApplicationStatus,
  ShowExhibitorDogsConfigurationStatus,
} from "@prisma/client";

export const ExhibitorSearchParams = SearchParamsIO.create({
  keys: {
    animations: "an",
    applicationStatuses: "as",
    descriptionStatuses: "ds",
    documentsStatuses: "dos",
    dogsConfigurationStatuses: "dcs",
    fields: "fi",
    name: "q",
    onStandAnimationsStatuses: "osas",
    partnershipCategories: "pc",
    payment: "p",
    publicProfileStatuses: "ps",
    sort: "sort",
    standConfigurationStatuses: "scs",
    targets: "ta",
    visibility: "vi",
  },

  parseFunction: (searchParams, keys) => {
    return SearchParamsSchema.parse({
      animations: SearchParamsIO.getValues(searchParams, keys.animations),
      applicationStatuses: SearchParamsIO.getValues(
        searchParams,
        keys.applicationStatuses,
      ),
      descriptionStatuses: SearchParamsIO.getValues(
        searchParams,
        keys.descriptionStatuses,
      ),
      documentsStatuses: SearchParamsIO.getValues(
        searchParams,
        keys.documentsStatuses,
      ),
      dogsConfigurationStatuses: SearchParamsIO.getValues(
        searchParams,
        keys.dogsConfigurationStatuses,
      ),
      fields: SearchParamsIO.getValues(searchParams, keys.fields),
      name: SearchParamsIO.getValue(searchParams, keys.name),
      onStandAnimationsStatuses: SearchParamsIO.getValues(
        searchParams,
        keys.onStandAnimationsStatuses,
      ),
      partnershipCategories: SearchParamsIO.getValues(
        searchParams,
        keys.partnershipCategories,
      ),
      payment: SearchParamsIO.getValues(searchParams, keys.payment),
      publicProfileStatuses: SearchParamsIO.getValues(
        searchParams,
        keys.publicProfileStatuses,
      ),
      sort: SearchParamsIO.getValue(searchParams, keys.sort),
      standConfigurationStatuses: SearchParamsIO.getValues(
        searchParams,
        keys.standConfigurationStatuses,
      ),
      targets: SearchParamsIO.getValues(searchParams, keys.targets),
      visibility: SearchParamsIO.getValues(searchParams, keys.visibility),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValues(searchParams, keys.animations, data.animations);
    SearchParamsIO.setValues(
      searchParams,
      keys.applicationStatuses,
      data.applicationStatuses,
    );
    SearchParamsIO.setValues(
      searchParams,
      keys.descriptionStatuses,
      data.descriptionStatuses,
    );
    SearchParamsIO.setValues(
      searchParams,
      keys.documentsStatuses,
      data.documentsStatuses,
    );
    SearchParamsIO.setValues(
      searchParams,
      keys.dogsConfigurationStatuses,
      data.dogsConfigurationStatuses,
    );
    SearchParamsIO.setValues(searchParams, keys.fields, data.fields);
    SearchParamsIO.setValue(searchParams, keys.name, data.name);
    SearchParamsIO.setValues(
      searchParams,
      keys.partnershipCategories,
      data.partnershipCategories,
    );
    SearchParamsIO.setValues(searchParams, keys.payment, data.payment);
    SearchParamsIO.setValues(
      searchParams,
      keys.publicProfileStatuses,
      data.publicProfileStatuses,
    );
    SearchParamsIO.setValue(searchParams, keys.sort, data.sort);
    SearchParamsIO.setValues(
      searchParams,
      keys.standConfigurationStatuses,
      data.standConfigurationStatuses,
    );
    SearchParamsIO.setValues(searchParams, keys.targets, data.targets);
    SearchParamsIO.setValues(searchParams, keys.visibility, data.visibility);
  },
});

export namespace ExhibitorSearchParamsN {
  export type Value = SearchParamsIO.Infer<typeof ExhibitorSearchParams>;

  export const Sort = {
    NAME: "N",
    UPDATED_AT: "U",
  } as const;

  export type Sort = (typeof Sort)[keyof typeof Sort];

  export const SORT_DEFAULT_VALUE = Sort.UPDATED_AT;

  export const SORT_TRANSLATIONS: Record<Sort, string> = {
    [Sort.NAME]: "Alphabétique",
    [Sort.UPDATED_AT]: "Mise à jour",
  };

  export const SORT_VALUES: Sort[] = [Sort.UPDATED_AT, Sort.NAME];

  export const SORT_ICONS: Record<Sort, { light: IconName; solid: IconName }> =
    {
      [Sort.NAME]: {
        light: "icon-clock-light",
        solid: "icon-clock-solid",
      },
      [Sort.UPDATED_AT]: {
        light: "icon-arrow-down-a-z-light",
        solid: "icon-arrow-down-a-z-solid",
      },
    };

  export const Animation = {
    NONE: "NONE",
    ON_STAGE: "ON_STAGE",
    ON_STAND: "ON_STAND",
  } as const;

  export type Animation = (typeof Animation)[keyof typeof Animation];

  export const ANIMATION_TRANSLATIONS: Record<Animation, string> = {
    [Animation.NONE]: "Aucune",
    [Animation.ON_STAGE]: "Sur scène",
    [Animation.ON_STAND]: "Sur stand",
  };

  export const ANIMATION_VALUES: Animation[] = [
    Animation.NONE,
    Animation.ON_STAGE,
    Animation.ON_STAND,
  ];

  export const ANIMATION_ICONS: Record<
    Animation,
    { light: IconName; solid: IconName }
  > = {
    [Animation.NONE]: {
      light: "icon-circle-x-light",
      solid: "icon-circle-x-solid",
    },
    [Animation.ON_STAGE]: {
      light: "icon-microphone-stand-light",
      solid: "icon-microphone-stand-solid",
    },
    [Animation.ON_STAND]: {
      light: "icon-calendar-day-light",
      solid: "icon-calendar-day-solid",
    },
  };
}

const SearchParamsSchema = zu.object({
  animations: zu.searchParams.set(
    zu.searchParams.nativeEnum(ExhibitorSearchParamsN.Animation),
  ),
  applicationStatuses: zu.searchParams.set(
    zu.searchParams.nativeEnum(ShowExhibitorApplicationStatus),
  ),
  descriptionStatuses: zu.searchParams.set(
    zu.searchParams.nativeEnum(ProfileStatus.Enum),
  ),
  documentsStatuses: zu.searchParams.set(
    zu.searchParams.nativeEnum(DocumentsStatus.Enum),
  ),
  dogsConfigurationStatuses: zu.searchParams.set(
    zu.searchParams.nativeEnum(ShowExhibitorDogsConfigurationStatus),
  ),
  fields: zu.searchParams.set(zu.searchParams.nativeEnum(ShowActivityField)),
  name: zu.searchParams.string(),
  onStandAnimationsStatuses: zu.searchParams.set(
    zu.searchParams.nativeEnum(ProfileStatus.Enum),
  ),
  partnershipCategories: zu.searchParams.set(
    zu.searchParams.nativeEnum(PartnershipCategory.Enum),
  ),
  payment: zu.searchParams.set(zu.searchParams.nativeEnum(Payment.Enum)),
  publicProfileStatuses: zu.searchParams.set(
    zu.searchParams.nativeEnum(ProfileStatus.Enum),
  ),
  sort: zu.searchParams
    .nativeEnum(ExhibitorSearchParamsN.Sort)
    .default(ExhibitorSearchParamsN.SORT_DEFAULT_VALUE),
  standConfigurationStatuses: zu.searchParams.set(
    zu.searchParams.nativeEnum(StandConfigurationStatus.Enum),
  ),
  targets: zu.searchParams.set(zu.searchParams.nativeEnum(ShowActivityTarget)),
  visibility: zu.searchParams.set(zu.searchParams.nativeEnum(Visibility.Enum)),
});
