import { ShowStandSize } from "@prisma/client";
import orderBy from "lodash.orderby";

export namespace StandSize {
  export const Enum = ShowStandSize;
  export type Enum = ShowStandSize;

  export const translation: Record<Enum, string> = {
    [Enum.S_6]: "6 m² (3x2)",
    [Enum.S_9]: "9 m² (3x3)",
    [Enum.S_12]: "12 m² (4x3)",
    [Enum.S_18]: "18 m² (6x3)",
    [Enum.S_36]: "36 m² (6x6)",
  };

  const area: Record<Enum, number> = {
    [Enum.S_6]: 6,
    [Enum.S_9]: 9,
    [Enum.S_12]: 12,
    [Enum.S_18]: 18,
    [Enum.S_36]: 36,
  };

  export const values = orderBy(
    Object.values(Enum),
    (standSize) => area[standSize],
  );
}
