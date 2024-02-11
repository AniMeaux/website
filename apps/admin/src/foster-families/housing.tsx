import { Icon } from "#generated/icon";
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

export const ICON_BY_HOUSING: Record<FosterFamilyHousing, React.ReactNode> = {
  [FosterFamilyHousing.FLAT]: <Icon href="icon-building" />,
  [FosterFamilyHousing.HOUSE]: <Icon href="icon-house" />,
  [FosterFamilyHousing.OTHER]: <Icon href="icon-tent" />,
  [FosterFamilyHousing.UNKNOWN]: <Icon href="icon-house-building" />,
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

export const ICON_BY_GARDEN: Record<FosterFamilyGarden, React.ReactNode> = {
  [FosterFamilyGarden.NO]: <Icon href="icon-tree-slash" />,
  [FosterFamilyGarden.UNKNOWN]: <Icon href="icon-tree-question" />,
  [FosterFamilyGarden.YES]: <Icon href="icon-tree" />,
};
