import type { IconName } from "#generated/icon";
import { FosterFamilyGarden, FosterFamilyHousing } from "@prisma/client";

export const SORTED_HOUSING = [
  FosterFamilyHousing.HOUSE,
  FosterFamilyHousing.FLAT,
  FosterFamilyHousing.OTHER,
  FosterFamilyHousing.UNKNOWN,
];

export const HOUSING_TRANSLATION: Record<FosterFamilyHousing, string> = {
  [FosterFamilyHousing.FLAT]: "Appartement",
  [FosterFamilyHousing.HOUSE]: "Maison",
  [FosterFamilyHousing.OTHER]: "Autre",
  [FosterFamilyHousing.UNKNOWN]: "Inconnu",
};

export const ICON_BY_HOUSING: Record<FosterFamilyHousing, IconName> = {
  [FosterFamilyHousing.FLAT]: "icon-building",
  [FosterFamilyHousing.HOUSE]: "icon-house",
  [FosterFamilyHousing.OTHER]: "icon-tent",
  [FosterFamilyHousing.UNKNOWN]: "icon-house-building",
};

export const SORTED_GARDEN = [
  FosterFamilyGarden.YES,
  FosterFamilyGarden.NO,
  FosterFamilyGarden.UNKNOWN,
];

export const GARDEN_TRANSLATION: Record<FosterFamilyGarden, string> = {
  [FosterFamilyGarden.NO]: "Non",
  [FosterFamilyGarden.UNKNOWN]: "Inconnu",
  [FosterFamilyGarden.YES]: "Oui",
};

export const ICON_BY_GARDEN: Record<FosterFamilyGarden, IconName> = {
  [FosterFamilyGarden.NO]: "icon-tree-slash",
  [FosterFamilyGarden.UNKNOWN]: "icon-tree-question",
  [FosterFamilyGarden.YES]: "icon-tree",
};
