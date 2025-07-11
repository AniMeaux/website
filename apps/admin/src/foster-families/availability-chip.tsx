import type { ChipColor } from "#core/data-display/chip";
import { Chip } from "#core/data-display/chip";
import { FosterFamilyAvailability } from "#foster-families/availability";
import type { IconName } from "#generated/icon";
import { DateTime } from "luxon";

export function AvailabilityChip({
  availability,
  expirationDate,
}: {
  availability: FosterFamilyAvailability.Enum;
  expirationDate?: null | string;
}) {
  let label = FosterFamilyAvailability.translation[availability];

  if (expirationDate != null) {
    const date = DateTime.fromISO(expirationDate).toLocaleString(
      DateTime.DATE_FULL,
    );

    label = `${label} jusqu’au ${date}`;
  }

  return (
    <Chip
      variant="primary"
      color={availabilityColor[availability]}
      icon={
        expirationDate == null
          ? availabilityIcon[availability]
          : availabilityIconWithExpiration[availability]
      }
    >
      {label}
    </Chip>
  );
}

const availabilityColor: Record<FosterFamilyAvailability.Enum, ChipColor> = {
  [FosterFamilyAvailability.Enum.AVAILABLE]: "green",
  [FosterFamilyAvailability.Enum.UNAVAILABLE]: "red",
  [FosterFamilyAvailability.Enum.UNKNOWN]: "black",
};

const availabilityIcon: Record<FosterFamilyAvailability.Enum, IconName> = {
  [FosterFamilyAvailability.Enum.AVAILABLE]: "icon-circle-check-solid",
  [FosterFamilyAvailability.Enum.UNAVAILABLE]: "icon-circle-x-mark-solid",
  [FosterFamilyAvailability.Enum.UNKNOWN]: "icon-circle-question-solid",
};

const availabilityIconWithExpiration: Record<
  FosterFamilyAvailability.Enum,
  IconName
> = {
  [FosterFamilyAvailability.Enum.AVAILABLE]: "icon-circle-half-stroke-solid",
  [FosterFamilyAvailability.Enum.UNAVAILABLE]: "icon-circle-half-stroke-solid",
  [FosterFamilyAvailability.Enum.UNKNOWN]: "icon-circle-question-solid",
};
