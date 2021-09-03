import { AnimalStatus, AnimalStatusLabels } from "@animeaux/shared-entities";
import cn from "classnames";

const StatusBadgeColors: Record<AnimalStatus, string> = {
  [AnimalStatus.ADOPTED]: "StatusBadge--success",
  [AnimalStatus.DECEASED]: "StatusBadge--grey",
  [AnimalStatus.FREE]: "StatusBadge--grey",
  [AnimalStatus.OPEN_TO_ADOPTION]: "StatusBadge--primary",
  [AnimalStatus.OPEN_TO_RESERVATION]: "StatusBadge--primary",
  [AnimalStatus.RESERVED]: "StatusBadge--warning",
  [AnimalStatus.UNAVAILABLE]: "StatusBadge--grey",
};

type StatusBadgeProps = {
  status: AnimalStatus;
  small?: boolean;
};

export function StatusBadge({ status, small = false }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "StatusBadge",
        { "StatusBadge--small": small },
        StatusBadgeColors[status]
      )}
    >
      {AnimalStatusLabels[status]}
    </span>
  );
}

type StatusIconProps = { status: AnimalStatus };

export function StatusIcon({ status }: StatusIconProps) {
  return (
    <span className={cn("StatusIcon", StatusBadgeColors[status])}>
      <span className="StatusIcon__letter">
        {AnimalStatusLabels[status][0]}
      </span>
    </span>
  );
}
