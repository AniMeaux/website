import { ShowStandSize } from "@prisma/client";

export const MAX_PEOPLE_COUNT_BY_STAND_SIZE: Record<ShowStandSize, number> = {
  [ShowStandSize.S_6]: 2,
  [ShowStandSize.S_9]: 2,
  [ShowStandSize.S_12]: 4,
  [ShowStandSize.S_18]: 4,
  [ShowStandSize.S_36]: 6,
};

export const MAX_PEOPLE_COUNT = Math.max(
  ...Object.values(MAX_PEOPLE_COUNT_BY_STAND_SIZE),
);
