import { ShowStandSize } from "@prisma/client";

export const MAX_TABLE_COUNT_BY_STAND_SIZE: Record<ShowStandSize, number> = {
  [ShowStandSize.S_6]: 2,
  [ShowStandSize.S_9]: 3,
  [ShowStandSize.S_12]: 3,
  [ShowStandSize.S_18]: 6,
  [ShowStandSize.S_36]: 12,
};

export const MAX_TABLE_COUNT = Math.max(
  ...Object.values(MAX_TABLE_COUNT_BY_STAND_SIZE),
);
