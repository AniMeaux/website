import { Chip } from "#core/data-display/chip.js";
import type { ShowStandSizeBooking } from "#show/stand-size/booking.js";
import { formatBooking } from "#show/stand-size/booking.js";

export function StandSizeBookingChip({
  standSize,
}: {
  standSize: ShowStandSizeBooking;
}) {
  return (
    <Chip
      variant={standSize.ratio > 1 ? "primary" : "secondary"}
      color={standSize.ratio > 1 ? "red" : "black"}
    >
      {formatBooking(standSize)}
    </Chip>
  );
}
