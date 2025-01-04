import { ShowExhibitorStandConfigurationDividerType } from "@prisma/client";
import orderBy from "lodash.orderby";

export const DIVIDER_TYPE_TRANSLATION: Record<
  ShowExhibitorStandConfigurationDividerType,
  string
> = {
  [ShowExhibitorStandConfigurationDividerType.FABRIC_PANEL]:
    "Panneau plein en tissus noir",
  [ShowExhibitorStandConfigurationDividerType.GRID]: "Grille",
  [ShowExhibitorStandConfigurationDividerType.WOOD_PANEL]:
    "Panneau plein en bois",
};

export const SORTED_DIVIDER_TYPES = orderBy(
  Object.values(ShowExhibitorStandConfigurationDividerType),
  (dividerType) => DIVIDER_TYPE_TRANSLATION[dividerType],
);
