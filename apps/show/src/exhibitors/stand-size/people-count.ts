import { StandSize } from "#exhibitors/stand-size/stand-size.js";

export const MAX_PEOPLE_COUNT_BY_STAND_SIZE: Record<StandSize.Enum, number> = {
  [StandSize.Enum.S_6]: 2,
  [StandSize.Enum.S_9]: 2,
  [StandSize.Enum.S_12]: 4,
  [StandSize.Enum.S_18]: 4,
  [StandSize.Enum.S_36]: 6,
};

export const MAX_PEOPLE_COUNT = Math.max(
  ...Object.values(MAX_PEOPLE_COUNT_BY_STAND_SIZE),
);
