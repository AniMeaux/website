import { ShowStandSize } from "@prisma/client";

export const STAND_SIZE_TRANSLATION: Record<ShowStandSize, string> = {
  [ShowStandSize.S_6]: "6 m² (3x2)",
  [ShowStandSize.S_9]: "9 m² (3x3)",
  [ShowStandSize.S_12]: "12 m² (4x3)",
  [ShowStandSize.S_18]: "18 m² (6x3)",
  [ShowStandSize.S_36]: "36 m² (6x6)",
};

export const TABLE_COUNT_BY_SIZE: Record<ShowStandSize, number> = {
  [ShowStandSize.S_6]: 2,
  [ShowStandSize.S_9]: 3,
  [ShowStandSize.S_12]: 3,
  [ShowStandSize.S_18]: 6,
  [ShowStandSize.S_36]: 12,
};
