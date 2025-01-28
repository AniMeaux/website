import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { ShowExhibitorProfileStatus } from "@prisma/client";

export const PROFILE_STATUS_TRANSLATION: Record<
  ShowExhibitorProfileStatus,
  string
> = {
  [ShowExhibitorProfileStatus.AWAITING_VALIDATION]: "Non traité",
  [ShowExhibitorProfileStatus.NOT_TOUCHED]: "Aucune modification",
  [ShowExhibitorProfileStatus.TO_MODIFY]: "Modification demandée",
  [ShowExhibitorProfileStatus.VALIDATED]: "Validé",
};

export const PROFILE_STATUS_VALUES: ShowExhibitorProfileStatus[] = [
  ShowExhibitorProfileStatus.NOT_TOUCHED,
  ShowExhibitorProfileStatus.AWAITING_VALIDATION,
  ShowExhibitorProfileStatus.TO_MODIFY,
  ShowExhibitorProfileStatus.VALIDATED,
];

export function ProfileStatusIcon({
  status,
  className,
}: {
  status: ShowExhibitorProfileStatus;
  className?: string;
}) {
  return (
    <span title={PROFILE_STATUS_TRANSLATION[status]} className={className}>
      <Icon
        href={ICON_NAME_BY_STATUS[status]}
        className={ICON_CLASS_NAMES_BY_STATUS[status]}
      />
    </span>
  );
}

const ICON_NAME_BY_STATUS: Record<ShowExhibitorProfileStatus, IconName> = {
  [ShowExhibitorProfileStatus.AWAITING_VALIDATION]: "icon-circle-light",
  [ShowExhibitorProfileStatus.NOT_TOUCHED]: "icon-circle-dash-light",
  [ShowExhibitorProfileStatus.TO_MODIFY]: "icon-circle-pen-solid",
  [ShowExhibitorProfileStatus.VALIDATED]: "icon-circle-check-solid",
};

const ICON_CLASS_NAMES_BY_STATUS: Record<ShowExhibitorProfileStatus, string> = {
  [ShowExhibitorProfileStatus.AWAITING_VALIDATION]: cn("text-gray-900"),
  [ShowExhibitorProfileStatus.NOT_TOUCHED]: cn("text-gray-900"),
  [ShowExhibitorProfileStatus.TO_MODIFY]: cn("text-yellow-500"),
  [ShowExhibitorProfileStatus.VALIDATED]: cn("text-green-600"),
};
