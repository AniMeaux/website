import type { ChipColor } from "#core/data-display/chip";
import { Chip } from "#core/data-display/chip";
import { ShowExhibitorApplicationStatus } from "@prisma/client";

export function StatusBadge({
  status,
}: {
  status: ShowExhibitorApplicationStatus;
}) {
  return (
    <Chip color={STATUS_CHIP_COLOR[status]}>{STATUS_TRANSLATION[status]}</Chip>
  );
}

const STATUS_CHIP_COLOR: Record<ShowExhibitorApplicationStatus, ChipColor> = {
  [ShowExhibitorApplicationStatus.REFUSED]: "red",
  [ShowExhibitorApplicationStatus.UNTREATED]: "black",
  [ShowExhibitorApplicationStatus.VALIDATED]: "green",
  [ShowExhibitorApplicationStatus.WAITING_LIST]: "yellow",
};

const STATUS_TRANSLATION: Record<ShowExhibitorApplicationStatus, string> = {
  [ShowExhibitorApplicationStatus.REFUSED]: "Refusée",
  [ShowExhibitorApplicationStatus.UNTREATED]: "Non traitée",
  [ShowExhibitorApplicationStatus.VALIDATED]: "Validée",
  [ShowExhibitorApplicationStatus.WAITING_LIST]: "Liste d’attente",
};
