import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { ShowExhibitorApplicationStatus } from "@prisma/client";
import orderBy from "lodash.orderby";

export const TRANSLATION_BY_STATUS: Record<
  ShowExhibitorApplicationStatus,
  string
> = {
  [ShowExhibitorApplicationStatus.REFUSED]: "Refusée",
  [ShowExhibitorApplicationStatus.UNTREATED]: "Non traitée",
  [ShowExhibitorApplicationStatus.VALIDATED]: "Validée",
  [ShowExhibitorApplicationStatus.WAITING_LIST]: "Sur liste d’attente",
};

export const SORTED_STATUSES = orderBy(
  Object.values(ShowExhibitorApplicationStatus),
  (status) => TRANSLATION_BY_STATUS[status],
);

export function StatusIcon({
  status,
  className,
}: {
  status: ShowExhibitorApplicationStatus;
  className?: string;
}) {
  return (
    <span title={TRANSLATION_BY_STATUS[status]} className={className}>
      <Icon
        href={ICON_NAME_BY_STATUS[status]}
        className={ICON_CLASS_NAMES_BY_STATUS[status]}
      />
    </span>
  );
}

const ICON_NAME_BY_STATUS: Record<ShowExhibitorApplicationStatus, IconName> = {
  [ShowExhibitorApplicationStatus.REFUSED]: "icon-circle-x-solid",
  [ShowExhibitorApplicationStatus.UNTREATED]: "icon-circle-light",
  [ShowExhibitorApplicationStatus.VALIDATED]: "icon-circle-check-solid",
  [ShowExhibitorApplicationStatus.WAITING_LIST]: "icon-clock-solid",
};

const ICON_CLASS_NAMES_BY_STATUS: Record<
  ShowExhibitorApplicationStatus,
  string
> = {
  [ShowExhibitorApplicationStatus.REFUSED]: cn("text-red-500"),
  [ShowExhibitorApplicationStatus.UNTREATED]: cn("text-gray-900"),
  [ShowExhibitorApplicationStatus.VALIDATED]: cn("text-green-600"),
  [ShowExhibitorApplicationStatus.WAITING_LIST]: cn("text-yellow-500"),
};
