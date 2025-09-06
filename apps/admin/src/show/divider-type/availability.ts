export type ShowDividerTypeAvailability = {
  ratio: number;
  usedCount: number;
  maxCount: number;
};

export function formatAvailability(dividerType: ShowDividerTypeAvailability) {
  if (dividerType.maxCount === 0) {
    return String(dividerType.usedCount);
  }

  return `${dividerType.usedCount} / ${dividerType.maxCount}`;
}
