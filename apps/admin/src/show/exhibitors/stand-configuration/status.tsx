import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { ShowExhibitorStandConfigurationStatus } from "@prisma/client";

export const STAND_CONFIGURATION_STATUS_TRANSLATION: Record<
  ShowExhibitorStandConfigurationStatus,
  string
> = {
  [ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION]: "Non traité",
  [ShowExhibitorStandConfigurationStatus.TO_BE_FILLED]: "Aucune modification",
  [ShowExhibitorStandConfigurationStatus.TO_MODIFY]: "Modification demandée",
  [ShowExhibitorStandConfigurationStatus.VALIDATED]: "Validé",
};

export const STAND_CONFIGURATION_STATUS_VALUES: ShowExhibitorStandConfigurationStatus[] =
  [
    ShowExhibitorStandConfigurationStatus.TO_BE_FILLED,
    ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION,
    ShowExhibitorStandConfigurationStatus.TO_MODIFY,
    ShowExhibitorStandConfigurationStatus.VALIDATED,
  ];

export function StandConfigurationStatusIcon({
  status,
  className,
}: {
  status: ShowExhibitorStandConfigurationStatus;
  className?: string;
}) {
  return (
    <span
      title={STAND_CONFIGURATION_STATUS_TRANSLATION[status]}
      className={className}
    >
      <Icon
        href={ICON_NAME_BY_STATUS[status]}
        className={ICON_CLASS_NAMES_BY_STATUS[status]}
      />
    </span>
  );
}

const ICON_NAME_BY_STATUS: Record<
  ShowExhibitorStandConfigurationStatus,
  IconName
> = {
  [ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION]:
    "icon-circle-light",
  [ShowExhibitorStandConfigurationStatus.TO_BE_FILLED]:
    "icon-circle-dash-light",
  [ShowExhibitorStandConfigurationStatus.TO_MODIFY]: "icon-circle-pen-solid",
  [ShowExhibitorStandConfigurationStatus.VALIDATED]: "icon-circle-check-solid",
};

const ICON_CLASS_NAMES_BY_STATUS: Record<
  ShowExhibitorStandConfigurationStatus,
  string
> = {
  [ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION]:
    cn("text-gray-900"),
  [ShowExhibitorStandConfigurationStatus.TO_BE_FILLED]: cn("text-gray-900"),
  [ShowExhibitorStandConfigurationStatus.TO_MODIFY]: cn("text-yellow-500"),
  [ShowExhibitorStandConfigurationStatus.VALIDATED]: cn("text-green-600"),
};
