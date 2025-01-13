import type { ChipColor } from "#core/data-display/chip";
import { Chip } from "#core/data-display/chip";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { ShowExhibitorApplicationStatus } from "@prisma/client";
import orderBy from "lodash.orderby";

export const STATUS_TRANSLATION: Record<
  ShowExhibitorApplicationStatus,
  string
> = {
  [ShowExhibitorApplicationStatus.REFUSED]: "Refusée",
  [ShowExhibitorApplicationStatus.UNTREATED]: "Non traitée",
  [ShowExhibitorApplicationStatus.VALIDATED]: "Validée",
  [ShowExhibitorApplicationStatus.WAITING_LIST]: "Sur liste d’attente",
};

export const SORTED_STATUS = orderBy(
  Object.values(ShowExhibitorApplicationStatus),
  (status) => STATUS_TRANSLATION[status],
);

export function StatusBadge({
  status,
}: {
  status: ShowExhibitorApplicationStatus;
}) {
  return (
    <Chip variant="filled" color={STATUS_CHIP_COLOR[status]}>
      {STATUS_TRANSLATION[status]}
    </Chip>
  );
}

const STATUS_CHIP_COLOR: Record<ShowExhibitorApplicationStatus, ChipColor> = {
  [ShowExhibitorApplicationStatus.REFUSED]: "red",
  [ShowExhibitorApplicationStatus.UNTREATED]: "black",
  [ShowExhibitorApplicationStatus.VALIDATED]: "green",
  [ShowExhibitorApplicationStatus.WAITING_LIST]: "yellow",
};

export function StatusIcon({
  status,
  className,
}: {
  status: ShowExhibitorApplicationStatus;
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
