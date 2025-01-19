import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { ShowExhibitorDocumentsStatus } from "@prisma/client";

export const DOCUMENTS_STATUS_TRANSLATION: Record<
  ShowExhibitorDocumentsStatus,
  string
> = {
  [ShowExhibitorDocumentsStatus.AWAITING_VALIDATION]: "Non traité",
  [ShowExhibitorDocumentsStatus.TO_BE_FILLED]: "Aucune modification",
  [ShowExhibitorDocumentsStatus.TO_MODIFY]: "Modification demandée",
  [ShowExhibitorDocumentsStatus.VALIDATED]: "Validé",
};

export const DOCUMENTS_STATUS_VALUES: ShowExhibitorDocumentsStatus[] = [
  ShowExhibitorDocumentsStatus.TO_BE_FILLED,
  ShowExhibitorDocumentsStatus.AWAITING_VALIDATION,
  ShowExhibitorDocumentsStatus.TO_MODIFY,
  ShowExhibitorDocumentsStatus.VALIDATED,
];

export function DocumentsStatusIcon({
  status,
  className,
}: {
  status: ShowExhibitorDocumentsStatus;
  className?: string;
}) {
  return (
    <span title={DOCUMENTS_STATUS_TRANSLATION[status]} className={className}>
      <Icon
        href={ICON_NAME_BY_STATUS[status]}
        className={ICON_CLASS_NAMES_BY_STATUS[status]}
      />
    </span>
  );
}

const ICON_NAME_BY_STATUS: Record<ShowExhibitorDocumentsStatus, IconName> = {
  [ShowExhibitorDocumentsStatus.AWAITING_VALIDATION]: "icon-circle-light",
  [ShowExhibitorDocumentsStatus.TO_BE_FILLED]: "icon-circle-dash-light",
  [ShowExhibitorDocumentsStatus.TO_MODIFY]: "icon-circle-pen-solid",
  [ShowExhibitorDocumentsStatus.VALIDATED]: "icon-circle-check-solid",
};

const ICON_CLASS_NAMES_BY_STATUS: Record<ShowExhibitorDocumentsStatus, string> =
  {
    [ShowExhibitorDocumentsStatus.AWAITING_VALIDATION]: cn("text-gray-900"),
    [ShowExhibitorDocumentsStatus.TO_BE_FILLED]: cn("text-gray-900"),
    [ShowExhibitorDocumentsStatus.TO_MODIFY]: cn("text-yellow-500"),
    [ShowExhibitorDocumentsStatus.VALIDATED]: cn("text-green-600"),
  };
