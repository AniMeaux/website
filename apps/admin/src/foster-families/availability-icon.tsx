import { FosterFamilyAvailability } from "#foster-families/availability";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import type { Except } from "type-fest";

export function AvailabilityIcon({
  availability,
  className,
  ...props
}: Except<React.ComponentPropsWithoutRef<typeof Icon>, "href"> & {
  availability: FosterFamilyAvailability.Enum;
}) {
  return (
    <Icon
      {...props}
      href="icon-status-solid"
      className={cn(ICON_CLASS_NAMES_BY_AVAILABILITY[availability], className)}
    />
  );
}

const ICON_CLASS_NAMES_BY_AVAILABILITY: Record<
  FosterFamilyAvailability.Enum,
  string
> = {
  [FosterFamilyAvailability.Enum.AVAILABLE]: cn("text-green-600"),
  [FosterFamilyAvailability.Enum.UNAVAILABLE]: cn("text-red-500"),
  [FosterFamilyAvailability.Enum.UNKNOWN]: cn("text-gray-800"),
};
