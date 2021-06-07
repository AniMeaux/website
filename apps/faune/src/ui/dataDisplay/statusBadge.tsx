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

type StatusBadgeProps = { status: AnimalStatus };
export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn("StatusBadge", StatusBadgeColors[status])}>
      {AnimalStatusLabels[status]}
    </span>
  );
}
