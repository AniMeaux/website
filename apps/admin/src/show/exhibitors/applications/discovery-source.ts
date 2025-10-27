import { ShowExhibitorApplicationDiscoverySource } from "@animeaux/prisma/client";
import invariant from "tiny-invariant";

export namespace DiscoverySource {
  export const Enum = ShowExhibitorApplicationDiscoverySource;
  export type Enum = ShowExhibitorApplicationDiscoverySource;

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

  const translation: Record<Exclude<Enum, typeof Enum.OTHER>, string> = {
    [Enum.FACEBOOK]: "Facebook",
    [Enum.INSTAGRAM]: "Instagram",
    [Enum.PRESS]: "Presse",
    [Enum.PREVIOUS_PARTICIPANT]: "Déjà participant(e) par le passé",
    [Enum.SEARCH_ENGINE]: "Moteur de recherche",
    [Enum.WORD_OF_MOUTH]: "Bouche-à-oreille",
  };
}
