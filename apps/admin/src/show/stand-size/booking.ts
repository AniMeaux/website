export type ShowStandSizeBooking = {
  ratio: number;
  bookedCount: number;
  maxCount: number;
};

export function formatBooking(standSize: ShowStandSizeBooking) {
  if (standSize.maxCount === 0) {
    return String(standSize.bookedCount);
  }

  return `${standSize.bookedCount} / ${standSize.maxCount}`;
}
