import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { ShowExhibitorStandConfigurationStatus } from "@prisma/client";

export namespace StandConfigurationStatus {
  export const Enum = ShowExhibitorStandConfigurationStatus;
  export type Enum = ShowExhibitorStandConfigurationStatus;

  export const translation: Record<Enum, string> = {
    [Enum.AWAITING_VALIDATION]: "Non traité",
    [Enum.TO_BE_FILLED]: "Aucune modification",
    [Enum.TO_MODIFY]: "Modification demandée",
    [Enum.VALIDATED]: "Validé",
  };

  export const values = [
    Enum.TO_BE_FILLED,
    Enum.AWAITING_VALIDATION,
    Enum.TO_MODIFY,
    Enum.VALIDATED,
  ];
}

export function StandConfigurationStatusIcon({
  status,
  className,
}: {
  status: StandConfigurationStatus.Enum;
  className?: string;
}) {
  return (
    <span
      title={StandConfigurationStatus.translation[status]}
      className={className}
    >
      <Icon
        href={ICON_NAME_BY_STATUS[status]}
        className={ICON_CLASS_NAMES_BY_STATUS[status]}
      />
    </span>
  );
}

const ICON_NAME_BY_STATUS: Record<StandConfigurationStatus.Enum, IconName> = {
  [StandConfigurationStatus.Enum.AWAITING_VALIDATION]: "icon-circle-light",
  [StandConfigurationStatus.Enum.TO_BE_FILLED]: "icon-circle-dash-light",
  [StandConfigurationStatus.Enum.TO_MODIFY]: "icon-circle-pen-solid",
  [StandConfigurationStatus.Enum.VALIDATED]: "icon-circle-check-solid",
};

const ICON_CLASS_NAMES_BY_STATUS: Record<
  StandConfigurationStatus.Enum,
  string
> = {
  [StandConfigurationStatus.Enum.AWAITING_VALIDATION]: cn("text-gray-900"),
  [StandConfigurationStatus.Enum.TO_BE_FILLED]: cn("text-gray-900"),
  [StandConfigurationStatus.Enum.TO_MODIFY]: cn("text-yellow-500"),
  [StandConfigurationStatus.Enum.VALIDATED]: cn("text-green-600"),
};
