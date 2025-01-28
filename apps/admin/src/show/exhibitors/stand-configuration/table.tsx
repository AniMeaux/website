import { ShowStandSize } from "@prisma/client";

export const TABLE_COUNT_BY_SIZE: Record<ShowStandSize, number> = {
  [ShowStandSize.S_6]: 2,
  [ShowStandSize.S_9]: 3,
  [ShowStandSize.S_12]: 3,
  [ShowStandSize.S_18]: 6,
  [ShowStandSize.S_36]: 12,
};
