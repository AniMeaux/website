import { Chip } from "#i/core/data-display/chip.js";
import type { ShowDividerTypeAvailability } from "#i/show/divider-type/availability.js";
import { formatAvailability } from "#i/show/divider-type/availability.js";

export function DividerTypeAvailabilityChip({
  dividerType,
}: {
  dividerType: ShowDividerTypeAvailability;
}) {
  return (
    <Chip
      variant={dividerType.ratio > 1 ? "primary" : "secondary"}
      color={dividerType.ratio > 1 ? "red" : "black"}
    >
      {formatAvailability(dividerType)}
    </Chip>
  );
}
