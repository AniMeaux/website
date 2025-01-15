import type { ChipColor } from "#core/data-display/chip";
import { Chip } from "#core/data-display/chip";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Status } from "@prisma/client";
import difference from "lodash.difference";
import orderBy from "lodash.orderby";

export const STATUS_TRANSLATION: Record<Status, string> = {
  [Status.ADOPTED]: "Adopté",
  [Status.DECEASED]: "Décédé",
  [Status.FREE]: "Libre",
  [Status.LOST]: "Perdu",
  [Status.OPEN_TO_ADOPTION]: "Adoptable",
  [Status.OPEN_TO_RESERVATION]: "Réservable",
  [Status.RESERVED]: "Réservé",
  [Status.RETIRED]: "Retraité",
  [Status.RETURNED]: "Restitué",
  [Status.UNAVAILABLE]: "Indisponible",
  [Status.TRANSFERRED]: "Transféré",
};

export const SORTED_STATUS = orderBy(
  Object.values(Status),
  (status) => STATUS_TRANSLATION[status],
);

export const ACTIVE_ANIMAL_STATUS: Status[] = [
  Status.OPEN_TO_ADOPTION,
  Status.OPEN_TO_RESERVATION,
  Status.RESERVED,
  Status.RETIRED,
  Status.UNAVAILABLE,
];

export const NON_ACTIVE_ANIMAL_STATUS = difference(
  SORTED_STATUS,
  ACTIVE_ANIMAL_STATUS,
);

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <Chip
      variant="filled"
      color={STATUS_CHIP_COLOR[status]}
      className={className}
    >
      {STATUS_TRANSLATION[status]}
    </Chip>
  );
}

const STATUS_CHIP_COLOR: Record<Status, ChipColor> = {
  [Status.ADOPTED]: "green",
  [Status.DECEASED]: "black",
  [Status.FREE]: "black",
  [Status.LOST]: "red",
  [Status.OPEN_TO_ADOPTION]: "blue",
  [Status.OPEN_TO_RESERVATION]: "blue",
  [Status.RESERVED]: "yellow",
  [Status.RETIRED]: "black",
  [Status.RETURNED]: "black",
  [Status.UNAVAILABLE]: "red",
  [Status.TRANSFERRED]: "black",
};

export function StatusIcon({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <Icon
      href="icon-status-solid"
      className={cn(
        className,
        CHIP_COLOR_STATUS_ICON_CLASS_NAMES[STATUS_CHIP_COLOR[status]],
      )}
    />
  );
}

const CHIP_COLOR_STATUS_ICON_CLASS_NAMES: Record<ChipColor, string> = {
  green: cn("text-green-600"),
  black: cn("text-gray-800"),
  red: cn("text-red-500"),
  blue: cn("text-blue-500"),
  yellow: cn("text-yellow-400"),
  gray: cn("text-gray-100"),
  orange: cn("text-orange-500"),
};
