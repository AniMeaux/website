import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { FosterFamilyAvailability } from "@prisma/client";
import type { Except } from "type-fest";

export const AVAILABILITY_TRANSLATION: Record<
  FosterFamilyAvailability,
  string
> = {
  [FosterFamilyAvailability.AVAILABLE]: "Disponible",
  [FosterFamilyAvailability.UNAVAILABLE]: "Indisponible",
  [FosterFamilyAvailability.UNKNOWN]: "Inconnue",
};

export const SORTED_AVAILABILITIES = [
  FosterFamilyAvailability.UNKNOWN,
  FosterFamilyAvailability.AVAILABLE,
  FosterFamilyAvailability.UNAVAILABLE,
];

export function AvailabilityIcon({
  availability,
  className,
  ...props
}: Except<React.ComponentPropsWithoutRef<typeof Icon>, "href"> & {
  availability: FosterFamilyAvailability;
}) {
  return (
    <Icon
      {...props}
      href="icon-status"
      className={cn(ICON_CLASS_NAMES_BY_AVAILABILITY[availability], className)}
    />
  );
}

const ICON_CLASS_NAMES_BY_AVAILABILITY: Record<
  FosterFamilyAvailability,
  string
> = {
  [FosterFamilyAvailability.AVAILABLE]: cn("text-green-600"),
  [FosterFamilyAvailability.UNAVAILABLE]: cn("text-red-500"),
  [FosterFamilyAvailability.UNKNOWN]: cn("text-gray-800"),
};
