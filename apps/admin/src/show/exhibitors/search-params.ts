import type { IconName } from "#generated/icon";
import { ExhibitorStatus } from "#show/exhibitors/status";
import { InvoiceStatus } from "#show/invoice/status.js";
import { SponsorshipOptionalCategory } from "#show/sponsors/category";
import { Visibility } from "#show/visibility";
import {
  ShowActivityField,
  ShowActivityTarget,
  ShowExhibitorApplicationStatus,
} from "@animeaux/prisma/client";
import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";

export type ExhibitorSearchParams = SearchParamsIO.Infer<
  typeof ExhibitorSearchParams.io
>;

export namespace ExhibitorSearchParams {
  export namespace Animation {
    export const Enum = {
      NONE: "NONE",
      ON_STAGE: "ON_STAGE",
      ON_STAND: "ON_STAND",
    } as const;

    export type Enum = (typeof Enum)[keyof typeof Enum];

    export const translations: Record<Enum, string> = {
      [Enum.NONE]: "Aucune",
      [Enum.ON_STAGE]: "Sur scène",
      [Enum.ON_STAND]: "Sur stand",
    };

    export const values: Enum[] = [Enum.NONE, Enum.ON_STAGE, Enum.ON_STAND];

    export const icons: Record<Enum, { light: IconName; solid: IconName }> = {
      [Enum.NONE]: {
        light: "icon-circle-x-light",
        solid: "icon-circle-x-solid",
      },
      [Enum.ON_STAGE]: {
        light: "icon-microphone-stand-light",
        solid: "icon-microphone-stand-solid",
      },
      [Enum.ON_STAND]: {
        light: "icon-calendar-day-light",
        solid: "icon-calendar-day-solid",
      },
    };
  }

  export namespace Laureat {
    export const Enum = {
      ORGANIZERS_FAVORITE: "OF",
      RISING_STAR: "RS",
      NONE: "NONE",
    } as const;

    export type Enum = (typeof Enum)[keyof typeof Enum];

    export const values: Enum[] = [
      Enum.ORGANIZERS_FAVORITE,
      Enum.RISING_STAR,
      Enum.NONE,
    ];

    export const translations: Record<Enum, string> = {
      [Enum.ORGANIZERS_FAVORITE]: "Coup de cœur",
      [Enum.RISING_STAR]: "Espoir",
      [Enum.NONE]: "Aucun",
    };

    export const icons: Record<Enum, { light: IconName; solid: IconName }> = {
      [Enum.ORGANIZERS_FAVORITE]: {
        light: "icon-heart-light",
        solid: "icon-heart-solid",
      },
      [Enum.RISING_STAR]: {
        light: "icon-seedling-light",
        solid: "icon-seedling-solid",
      },
      [Enum.NONE]: {
        light: "icon-empty-set-light",
        solid: "icon-empty-set-solid",
      },
    };
  }

  export namespace Sort {
    export const Enum = {
      NAME: "N",
      UPDATED_AT: "U",
      DIVIDER_COUNT: "D",
    } as const;

    export type Enum = (typeof Enum)[keyof typeof Enum];

    export const defaultValue = Enum.UPDATED_AT;

    export const values: Enum[] = [
      Enum.UPDATED_AT,
      Enum.NAME,
      Enum.DIVIDER_COUNT,
    ];

    export const translations: Record<Enum, string> = {
      [Enum.DIVIDER_COUNT]: "Nombre de cloisons",
      [Enum.NAME]: "Alphabétique",
      [Enum.UPDATED_AT]: "Mise à jour",
    };

    export const icons: Record<Enum, { light: IconName; solid: IconName }> = {
      [Enum.DIVIDER_COUNT]: {
        light: "icon-fence-light",
        solid: "icon-fence-solid",
      },
      [Enum.NAME]: {
        light: "icon-clock-light",
        solid: "icon-clock-solid",
      },
      [Enum.UPDATED_AT]: {
        light: "icon-arrow-down-a-z-light",
        solid: "icon-arrow-down-a-z-solid",
      },
    };
  }

  export const io = SearchParamsIO.create({
    keys: {
      animations: "an",
      applicationStatuses: "as",
      descriptionStatuses: "ds",
      dividerTypesId: "dt",
      documentsStatuses: "dos",
      dogsConfigurationStatuses: "dcs",
      fields: "fi",
      invoiceStatuses: "is",
      laureats: "l",
      name: "q",
      onStandAnimationsStatuses: "osas",
      publicProfileStatuses: "ps",
      sort: "sort",
      sponsorshipCategories: "pc",
      standConfigurationStatuses: "scs",
      standSizesId: "size",
      targets: "ta",
      visibility: "vi",
    },

    parseFunction: (searchParams, keys) => {
      return schema.parse({
        animations: SearchParamsIO.getValues(searchParams, keys.animations),

        applicationStatuses: SearchParamsIO.getValues(
          searchParams,
          keys.applicationStatuses,
        ),

        descriptionStatuses: SearchParamsIO.getValues(
          searchParams,
          keys.descriptionStatuses,
        ),

        dividerTypesId: SearchParamsIO.getValues(
          searchParams,
          keys.dividerTypesId,
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

        invoiceStatuses: SearchParamsIO.getValues(
          searchParams,
          keys.invoiceStatuses,
        ),

        laureats: SearchParamsIO.getValues(searchParams, keys.laureats),

        name: SearchParamsIO.getValue(searchParams, keys.name),

        onStandAnimationsStatuses: SearchParamsIO.getValues(
          searchParams,
          keys.onStandAnimationsStatuses,
        ),

        publicProfileStatuses: SearchParamsIO.getValues(
          searchParams,
          keys.publicProfileStatuses,
        ),

        sort: SearchParamsIO.getValue(searchParams, keys.sort),

        sponsorshipCategories: SearchParamsIO.getValues(
          searchParams,
          keys.sponsorshipCategories,
        ),

        standConfigurationStatuses: SearchParamsIO.getValues(
          searchParams,
          keys.standConfigurationStatuses,
        ),

        standSizesId: SearchParamsIO.getValues(searchParams, keys.standSizesId),

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
        keys.dividerTypesId,
        data.dividerTypesId,
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

      SearchParamsIO.setValues(
        searchParams,
        keys.invoiceStatuses,
        data.invoiceStatuses,
      );

      SearchParamsIO.setValues(searchParams, keys.laureats, data.laureats);

      SearchParamsIO.setValue(searchParams, keys.name, data.name);

      SearchParamsIO.setValues(
        searchParams,
        keys.onStandAnimationsStatuses,
        data.onStandAnimationsStatuses,
      );

      SearchParamsIO.setValues(
        searchParams,
        keys.publicProfileStatuses,
        data.publicProfileStatuses,
      );

      SearchParamsIO.setValue(searchParams, keys.sort, data.sort);

      SearchParamsIO.setValues(
        searchParams,
        keys.sponsorshipCategories,
        data.sponsorshipCategories,
      );

      SearchParamsIO.setValues(
        searchParams,
        keys.standConfigurationStatuses,
        data.standConfigurationStatuses,
      );

      SearchParamsIO.setValues(
        searchParams,
        keys.standSizesId,
        data.standSizesId,
      );

      SearchParamsIO.setValues(searchParams, keys.targets, data.targets);

      SearchParamsIO.setValues(searchParams, keys.visibility, data.visibility);
    },
  });

  const schema = zu.object({
    animations: zu.searchParams.set(zu.searchParams.nativeEnum(Animation.Enum)),

    applicationStatuses: zu.searchParams.set(
      zu.searchParams.nativeEnum(ShowExhibitorApplicationStatus),
    ),

    descriptionStatuses: zu.searchParams.set(
      zu.searchParams.nativeEnum(ExhibitorStatus.Enum),
    ),

    dividerTypesId: zu.searchParams.set(
      zu.searchParams
        .string()
        .pipe(zu.string().uuid().optional().catch(undefined)),
    ),

    documentsStatuses: zu.searchParams.set(
      zu.searchParams.nativeEnum(ExhibitorStatus.Enum),
    ),

    dogsConfigurationStatuses: zu.searchParams.set(
      zu.searchParams.nativeEnum(ExhibitorStatus.Enum),
    ),

    fields: zu.searchParams.set(zu.searchParams.nativeEnum(ShowActivityField)),

    invoiceStatuses: zu.searchParams.set(
      zu.searchParams.nativeEnum(InvoiceStatus.Enum),
    ),

    laureats: zu.searchParams.set(zu.searchParams.nativeEnum(Laureat.Enum)),

    name: zu.searchParams.string(),

    onStandAnimationsStatuses: zu.searchParams.set(
      zu.searchParams.nativeEnum(ExhibitorStatus.Enum),
    ),

    publicProfileStatuses: zu.searchParams.set(
      zu.searchParams.nativeEnum(ExhibitorStatus.Enum),
    ),

    sort: zu.searchParams.nativeEnum(Sort.Enum).default(Sort.defaultValue),

    sponsorshipCategories: zu.searchParams.set(
      zu.searchParams.nativeEnum(SponsorshipOptionalCategory.Enum),
    ),

    standConfigurationStatuses: zu.searchParams.set(
      zu.searchParams.nativeEnum(ExhibitorStatus.Enum),
    ),

    standSizesId: zu.searchParams.set(
      zu.searchParams
        .string()
        .pipe(zu.string().uuid().optional().catch(undefined)),
    ),

    targets: zu.searchParams.set(
      zu.searchParams.nativeEnum(ShowActivityTarget),
    ),

    visibility: zu.searchParams.set(
      zu.searchParams.nativeEnum(Visibility.Enum),
    ),
  });
}
