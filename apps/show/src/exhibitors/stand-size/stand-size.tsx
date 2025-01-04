import { ShowStandSize } from "@prisma/client";
import orderBy from "lodash.orderby";

export const STAND_SIZE_TRANSLATION: Record<ShowStandSize, string> = {
  [ShowStandSize.S_6]: "6 m² (3x2)",
  [ShowStandSize.S_9]: "9 m² (3x3)",
  [ShowStandSize.S_12]: "12 m² (4x3)",
  [ShowStandSize.S_18]: "18 m² (6x3)",
  [ShowStandSize.S_36]: "36 m² (6x6)",
};

const STAND_SIZE_VALUE: Record<ShowStandSize, number> = {
  [ShowStandSize.S_6]: 6,
  [ShowStandSize.S_9]: 9,
  [ShowStandSize.S_12]: 12,
  [ShowStandSize.S_18]: 18,
  [ShowStandSize.S_36]: 36,
};

export const SORTED_STAND_SIZES = orderBy(
  Object.values(ShowStandSize),
  (standSize) => STAND_SIZE_VALUE[standSize],
);

export function isLargeStandSize(standSize: ShowStandSize) {
  return STAND_SIZE_VALUE[standSize] >= STAND_SIZE_VALUE[ShowStandSize.S_12];
}
