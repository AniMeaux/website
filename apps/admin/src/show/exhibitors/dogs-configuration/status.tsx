import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { ShowExhibitorDogsConfigurationStatus } from "@prisma/client";

export const DOGS_CONFIGURATION_STATUS_TRANSLATION: Record<
  ShowExhibitorDogsConfigurationStatus,
  string
> = {
  [ShowExhibitorDogsConfigurationStatus.AWAITING_VALIDATION]: "Non traité",
  [ShowExhibitorDogsConfigurationStatus.NOT_TOUCHED]: "Aucune modification",
  [ShowExhibitorDogsConfigurationStatus.TO_MODIFY]: "Modification demandée",
  [ShowExhibitorDogsConfigurationStatus.VALIDATED]: "Validé",
};

export const DOGS_CONFIGURATION_STATUS_VALUES: ShowExhibitorDogsConfigurationStatus[] =
  [
    ShowExhibitorDogsConfigurationStatus.NOT_TOUCHED,
    ShowExhibitorDogsConfigurationStatus.AWAITING_VALIDATION,
    ShowExhibitorDogsConfigurationStatus.TO_MODIFY,
    ShowExhibitorDogsConfigurationStatus.VALIDATED,
  ];

export function DogsConfigurationStatusIcon({
  status,
  className,
}: {
  status: ShowExhibitorDogsConfigurationStatus;
  className?: string;
}) {
  return (
    <span
      title={DOGS_CONFIGURATION_STATUS_TRANSLATION[status]}
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
  ShowExhibitorDogsConfigurationStatus,
  IconName
> = {
  [ShowExhibitorDogsConfigurationStatus.AWAITING_VALIDATION]:
    "icon-circle-light",
  [ShowExhibitorDogsConfigurationStatus.NOT_TOUCHED]: "icon-circle-dash-light",
  [ShowExhibitorDogsConfigurationStatus.TO_MODIFY]: "icon-circle-pen-solid",
  [ShowExhibitorDogsConfigurationStatus.VALIDATED]: "icon-circle-check-solid",
};

const ICON_CLASS_NAMES_BY_STATUS: Record<
  ShowExhibitorDogsConfigurationStatus,
  string
> = {
  [ShowExhibitorDogsConfigurationStatus.AWAITING_VALIDATION]:
    cn("text-gray-900"),
  [ShowExhibitorDogsConfigurationStatus.NOT_TOUCHED]: cn("text-gray-900"),
  [ShowExhibitorDogsConfigurationStatus.TO_MODIFY]: cn("text-yellow-500"),
  [ShowExhibitorDogsConfigurationStatus.VALIDATED]: cn("text-green-600"),
};
