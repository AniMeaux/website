import { ShowDividerType } from "@prisma/client";
import orderBy from "lodash.orderby";

export const DIVIDER_TYPE_TRANSLATION: Record<ShowDividerType, string> = {
  [ShowDividerType.FABRIC_PANEL]: "Panneau plein en tissus noir",
  [ShowDividerType.GRID]: "Grille",
  [ShowDividerType.WOOD_PANEL]: "Panneau plein en bois",
};

export const SORTED_DIVIDER_TYPES = orderBy(
  Object.values(ShowDividerType),
  (dividerType) => DIVIDER_TYPE_TRANSLATION[dividerType],
);
