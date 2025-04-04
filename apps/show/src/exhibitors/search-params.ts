import type { IconName } from "#generated/icon";
import {
  SearchParamsIO,
  SearchParamsReader,
  useOptimisticSearchParams,
} from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import { ShowActivityField, ShowActivityTarget } from "@prisma/client";
import { useMemo } from "react";

export const ExhibitorSearchParams = SearchParamsIO.create({
  keys: {
    targets: "target",
    fields: "field",
    eventTypes: "event",
    isPartner: "partner",
  },

  parseFunction: (searchParams, keys) => {
    return Schema.parse({
      targets: SearchParamsReader.getValues(searchParams, keys.targets),
      fields: SearchParamsReader.getValues(searchParams, keys.fields),
      eventTypes: SearchParamsReader.getValues(searchParams, keys.eventTypes),
      isPartner: SearchParamsReader.getValue(searchParams, keys.isPartner),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValues(searchParams, keys.targets, data.targets);

    SearchParamsIO.setValues(searchParams, keys.fields, data.fields);

    SearchParamsIO.setValues(searchParams, keys.eventTypes, data.eventTypes);

    SearchParamsIO.setValue(
      searchParams,
      keys.isPartner,
      data.isPartner ? "on" : undefined,
    );
  },
});

export namespace ExhibitorSearchParamsN {
  export type Value = SearchParamsReader.Infer<typeof ExhibitorSearchParams>;

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
}

const Schema = zu.object({
  targets: zu.searchParams.set(zu.searchParams.nativeEnum(ShowActivityTarget)),
  fields: zu.searchParams.set(zu.searchParams.nativeEnum(ShowActivityField)),

  eventTypes: zu.searchParams
    .set(zu.searchParams.nativeEnum(ExhibitorSearchParamsN.EventType.Enum))
    .transform((eventTypes) => {
      if (CLIENT_ENV.FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS !== "true") {
        eventTypes.delete(ExhibitorSearchParamsN.EventType.Enum.ON_STAND);
      }

      if (CLIENT_ENV.FEATURE_FLAG_SHOW_PROGRAM !== "true") {
        eventTypes.delete(ExhibitorSearchParamsN.EventType.Enum.ON_STAGE);
      }

      return eventTypes;
    }),

  isPartner: zu.searchParams
    .boolean()
    .transform(
      (isPartner) =>
        isPartner && CLIENT_ENV.FEATURE_FLAG_SHOW_PARTNERS === "true",
    ),
});

export function useExhibitorSearchParams() {
  const [searchParams] = useOptimisticSearchParams();

  const exhibitorSearchParams = useMemo(
    () => ExhibitorSearchParams.parse(searchParams),
    [searchParams],
  );

  return { exhibitorSearchParams };
}
