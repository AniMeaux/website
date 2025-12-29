import { ActivityField } from "#exhibitors/activity-field/activity-field";
import type { IconName } from "#generated/icon";
import { ShowActivityTarget } from "@animeaux/prisma";
import {
  SearchParamsIO,
  SearchParamsReader,
  useOptimisticSearchParams,
} from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import { useMemo } from "react";

export type ExhibitorSearchParams = SearchParamsReader.Infer<
  typeof ExhibitorSearchParams.io
>;

export namespace ExhibitorSearchParams {
  export namespace EventType {
    export const Enum = {
      ON_STAGE: "ON_STAGE",
      ON_STAND: "ON_STAND",
    } as const;

    export type Enum = (typeof Enum)[keyof typeof Enum];

    export const translation: Record<Enum, string> = {
      [Enum.ON_STAGE]: "Sur scène",
      [Enum.ON_STAND]: "Sur stand",
    };

    export const translationLong: Record<Enum, string> = {
      [Enum.ON_STAGE]: "Animations sur scène",
      [Enum.ON_STAND]: "Animations sur stand",
    };

    export const icon: Record<Enum, { light: IconName; solid: IconName }> = {
      [Enum.ON_STAGE]: {
        light: "microphone-stand-light",
        solid: "microphone-stand-solid",
      },

      [Enum.ON_STAND]: {
        light: "comments-light",
        solid: "comments-solid",
      },
    };
  }

  export const io = SearchParamsIO.create({
    keys: {
      eventTypes: "event",
      fields: "field",
      isOrganizersFavorite: "fav",
      isRisingStar: "rising",
      isSponsor: "sponsor",
      targets: "target",
    },

    parseFunction: (searchParams, keys) => {
      return schema.parse({
        eventTypes: SearchParamsReader.getValues(searchParams, keys.eventTypes),

        fields: SearchParamsReader.getValues(searchParams, keys.fields),

        isOrganizersFavorite: SearchParamsReader.getValue(
          searchParams,
          keys.isOrganizersFavorite,
        ),

        isRisingStar: SearchParamsReader.getValue(
          searchParams,
          keys.isRisingStar,
        ),

        isSponsor: SearchParamsReader.getValue(searchParams, keys.isSponsor),

        targets: SearchParamsReader.getValues(searchParams, keys.targets),
      });
    },

    setFunction: (searchParams, data, keys) => {
      SearchParamsIO.setValues(searchParams, keys.eventTypes, data.eventTypes);

      SearchParamsIO.setValues(searchParams, keys.fields, data.fields);

      SearchParamsIO.setValue(
        searchParams,
        keys.isOrganizersFavorite,
        data.isOrganizersFavorite ? "on" : undefined,
      );

      SearchParamsIO.setValue(
        searchParams,
        keys.isRisingStar,
        data.isRisingStar ? "on" : undefined,
      );

      SearchParamsIO.setValue(
        searchParams,
        keys.isSponsor,
        data.isSponsor ? "on" : undefined,
      );

      SearchParamsIO.setValues(searchParams, keys.targets, data.targets);
    },
  });

  const schema = zu.object({
    eventTypes: zu.searchParams
      .set(zu.searchParams.nativeEnum(ExhibitorSearchParams.EventType.Enum))
      .transform((eventTypes) => {
        if (CLIENT_ENV.FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS !== "true") {
          eventTypes.delete(ExhibitorSearchParams.EventType.Enum.ON_STAND);
        }

        if (CLIENT_ENV.FEATURE_FLAG_SHOW_PROGRAM !== "true") {
          eventTypes.delete(ExhibitorSearchParams.EventType.Enum.ON_STAGE);
        }

        return eventTypes;
      }),

    fields: zu.searchParams.set(zu.searchParams.nativeEnum(ActivityField.Enum)),

    isOrganizersFavorite: zu.searchParams.boolean(),

    isRisingStar: zu.searchParams.boolean(),

    isSponsor: zu.searchParams
      .boolean()
      .transform(
        (isSponsor) =>
          isSponsor && CLIENT_ENV.FEATURE_FLAG_SHOW_SPONSORS === "true",
      ),

    targets: zu.searchParams.set(
      zu.searchParams.nativeEnum(ShowActivityTarget),
    ),
  });
}

export function useExhibitorSearchParams() {
  const [searchParams] = useOptimisticSearchParams();

  const exhibitorSearchParams = useMemo(
    () => ExhibitorSearchParams.io.parse(searchParams),
    [searchParams],
  );

  return { exhibitorSearchParams };
}
