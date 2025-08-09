import { StandSize } from "#exhibitors/stand-size/stand-size.js";

export const MAX_TABLE_COUNT_BY_STAND_SIZE: Record<StandSize.Enum, number> = {
  [StandSize.Enum.S_6]: 2,
  [StandSize.Enum.S_9]: 3,
  [StandSize.Enum.S_12]: 3,
  [StandSize.Enum.S_18]: 6,
  [StandSize.Enum.S_36]: 12,
};

export const MAX_TABLE_COUNT = Math.max(
  ...Object.values(MAX_TABLE_COUNT_BY_STAND_SIZE),
);
