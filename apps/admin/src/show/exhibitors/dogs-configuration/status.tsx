import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { ShowExhibitorDogsConfigurationStatus } from "@prisma/client";

export namespace DogsConfigurationStatus {
  export const Enum = ShowExhibitorDogsConfigurationStatus;
  export type Enum = ShowExhibitorDogsConfigurationStatus;

  export const translation: Record<Enum, string> = {
    [Enum.AWAITING_VALIDATION]: "Non traité",
    [Enum.NOT_TOUCHED]: "Aucune modification",
    [Enum.TO_MODIFY]: "Modification demandée",
    [Enum.VALIDATED]: "Validé",
  };

  export const values = [
    Enum.NOT_TOUCHED,
    Enum.AWAITING_VALIDATION,
    Enum.TO_MODIFY,
    Enum.VALIDATED,
  ];
}

export function DogsConfigurationStatusIcon({
  status,
  className,
}: {
  status: DogsConfigurationStatus.Enum;
  className?: string;
}) {
  return (
    <span
      title={DogsConfigurationStatus.translation[status]}
      className={className}
    >
      <Icon
        href={ICON_NAME_BY_STATUS[status]}
        className={ICON_CLASS_NAMES_BY_STATUS[status]}
      />
    </span>
  );
}

const ICON_NAME_BY_STATUS: Record<DogsConfigurationStatus.Enum, IconName> = {
  [DogsConfigurationStatus.Enum.AWAITING_VALIDATION]: "icon-circle-light",
  [DogsConfigurationStatus.Enum.NOT_TOUCHED]: "icon-circle-dash-light",
  [DogsConfigurationStatus.Enum.TO_MODIFY]: "icon-circle-pen-solid",
  [DogsConfigurationStatus.Enum.VALIDATED]: "icon-circle-check-solid",
};

const ICON_CLASS_NAMES_BY_STATUS: Record<DogsConfigurationStatus.Enum, string> =
  {
    [DogsConfigurationStatus.Enum.AWAITING_VALIDATION]: cn("text-gray-900"),
    [DogsConfigurationStatus.Enum.NOT_TOUCHED]: cn("text-gray-900"),
    [DogsConfigurationStatus.Enum.TO_MODIFY]: cn("text-yellow-500"),
    [DogsConfigurationStatus.Enum.VALIDATED]: cn("text-green-600"),
  };
