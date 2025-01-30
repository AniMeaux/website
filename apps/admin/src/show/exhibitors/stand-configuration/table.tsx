import { StandSize } from "#show/exhibitors/stand-configuration/stand-size";

export const TABLE_COUNT_BY_SIZE: Record<StandSize.Enum, number> = {
  [StandSize.Enum.S_6]: 2,
  [StandSize.Enum.S_9]: 3,
  [StandSize.Enum.S_12]: 3,
  [StandSize.Enum.S_18]: 6,
  [StandSize.Enum.S_36]: 12,
};
