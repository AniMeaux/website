import { ShowExhibitorApplicationDiscoverySource } from "@prisma/client";
import invariant from "tiny-invariant";

export namespace DiscoverySource {
  export const Enum = ShowExhibitorApplicationDiscoverySource;
  export type Enum = ShowExhibitorApplicationDiscoverySource;

  export const values = [
    Enum.FACEBOOK,
    Enum.INSTAGRAM,
    Enum.WORD_OF_MOUTH,
    Enum.SEARCH_ENGINE,
    Enum.PRESS,
    Enum.PREVIOUS_PARTICIPANT,
    Enum.OTHER,
  ];

  export const translation: Record<Enum, string> = {
    [Enum.FACEBOOK]: "Facebook",
    [Enum.INSTAGRAM]: "Instagram",
    [Enum.OTHER]: "Autre",
    [Enum.PRESS]: "Presse",
    [Enum.PREVIOUS_PARTICIPANT]: "Déjà participant(e) par le passé",
    [Enum.SEARCH_ENGINE]: "Moteur de recherche",
    [Enum.WORD_OF_MOUTH]: "Bouche-à-oreille",
  };

  export function getVisibleValue(application: {
    discoverySource: Enum;
    discoverySourceOther?: null | string;
  }) {
    if (application.discoverySource !== Enum.OTHER) {
      return translation[application.discoverySource];
    }

    invariant(
      application.discoverySourceOther != null,
      "An other discovery source should be defined",
    );

    return application.discoverySourceOther;
  }
}
