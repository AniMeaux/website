import { ShowStandZone } from "@prisma/client";

export const STAND_ZONE_TRANSLATION: Record<ShowStandZone, string> = {
  [ShowStandZone.INSIDE]: "Intérieur",
  [ShowStandZone.OUTSIDE]: "Extérieur couvert",
};

export const SORTED_STAND_ZONES = [ShowStandZone.INSIDE, ShowStandZone.OUTSIDE];
