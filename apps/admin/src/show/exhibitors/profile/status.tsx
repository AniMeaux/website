import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { ShowExhibitorProfileStatus } from "@prisma/client";

export namespace ProfileStatus {
  export const Enum = ShowExhibitorProfileStatus;
  export type Enum = ShowExhibitorProfileStatus;

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

export function ProfileStatusIcon({
  status,
  className,
}: {
  status: ProfileStatus.Enum;
  className?: string;
}) {
  return (
    <span title={ProfileStatus.translation[status]} className={className}>
      <Icon
        href={ICON_NAME_BY_STATUS[status]}
        className={ICON_CLASS_NAMES_BY_STATUS[status]}
      />
    </span>
  );
}

const ICON_NAME_BY_STATUS: Record<ProfileStatus.Enum, IconName> = {
  [ProfileStatus.Enum.AWAITING_VALIDATION]: "icon-circle-light",
  [ProfileStatus.Enum.NOT_TOUCHED]: "icon-circle-dash-light",
  [ProfileStatus.Enum.TO_MODIFY]: "icon-circle-pen-solid",
  [ProfileStatus.Enum.VALIDATED]: "icon-circle-check-solid",
};

const ICON_CLASS_NAMES_BY_STATUS: Record<ProfileStatus.Enum, string> = {
  [ProfileStatus.Enum.AWAITING_VALIDATION]: cn("text-gray-900"),
  [ProfileStatus.Enum.NOT_TOUCHED]: cn("text-gray-900"),
  [ProfileStatus.Enum.TO_MODIFY]: cn("text-yellow-500"),
  [ProfileStatus.Enum.VALIDATED]: cn("text-green-600"),
};
