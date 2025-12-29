import { ShowStandZone } from "@animeaux/prisma";

export namespace StandZone {
  export const Enum = ShowStandZone;
  export type Enum = ShowStandZone;

  export const translation: Record<Enum, string> = {
    [Enum.INSIDE]: "Intérieur",
    [Enum.OUTSIDE]: "Extérieur couvert",
  };

  export const values = [Enum.INSIDE, Enum.OUTSIDE];
}
