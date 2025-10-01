import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { ExhibitorStatus } from "#show/exhibitors/status";
import { cn } from "@animeaux/core";

export function ExhibitorStatusIcon({
  status,
  className,
}: {
  status: ExhibitorStatus.Enum;
  className?: string;
}) {
  return (
    <span title={ExhibitorStatus.translation[status]} className={className}>
      <Icon
        href={ICON_NAME_BY_STATUS[status]}
        className={ICON_CLASS_NAMES_BY_STATUS[status]}
      />
    </span>
  );
}

const ICON_NAME_BY_STATUS: Record<ExhibitorStatus.Enum, IconName> = {
  [ExhibitorStatus.Enum.AWAITING_VALIDATION]: "icon-circle-light",
  [ExhibitorStatus.Enum.TO_BE_FILLED]: "icon-circle-dash-light",
  [ExhibitorStatus.Enum.TO_MODIFY]: "icon-circle-pen-solid",
  [ExhibitorStatus.Enum.VALIDATED]: "icon-circle-check-solid",
};

const ICON_CLASS_NAMES_BY_STATUS: Record<ExhibitorStatus.Enum, string> = {
  [ExhibitorStatus.Enum.AWAITING_VALIDATION]: cn("text-gray-900"),
  [ExhibitorStatus.Enum.TO_BE_FILLED]: cn("text-gray-900"),
  [ExhibitorStatus.Enum.TO_MODIFY]: cn("text-yellow-500"),
  [ExhibitorStatus.Enum.VALIDATED]: cn("text-green-600"),
};
