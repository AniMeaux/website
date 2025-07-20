import { ShowDividerType } from "@prisma/client";
import orderBy from "lodash.orderby";

export namespace DividerType {
  export const Enum = ShowDividerType;
  export type Enum = ShowDividerType;

  export const translation: Record<Enum, string> = {
    [Enum.FABRIC_PANEL]: "Panneau plein en tissus noir",
    [Enum.GRID]: "Grille",
    [Enum.WOOD_PANEL]: "Panneau plein en bois",
  };

  export const values = orderBy(
    Object.values(Enum),
    (dividerType) => translation[dividerType],
  );
}
