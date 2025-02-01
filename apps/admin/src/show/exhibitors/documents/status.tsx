import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { ShowExhibitorDocumentsStatus } from "@prisma/client";

export namespace DocumentsStatus {
  export const Enum = ShowExhibitorDocumentsStatus;
  export type Enum = ShowExhibitorDocumentsStatus;

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

export function DocumentsStatusIcon({
  status,
  className,
}: {
  status: DocumentsStatus.Enum;
  className?: string;
}) {
  return (
    <span title={DocumentsStatus.translation[status]} className={className}>
      <Icon
        href={ICON_NAME_BY_STATUS[status]}
        className={ICON_CLASS_NAMES_BY_STATUS[status]}
      />
    </span>
  );
}

const ICON_NAME_BY_STATUS: Record<DocumentsStatus.Enum, IconName> = {
  [DocumentsStatus.Enum.AWAITING_VALIDATION]: "icon-circle-light",
  [DocumentsStatus.Enum.TO_BE_FILLED]: "icon-circle-dash-light",
  [DocumentsStatus.Enum.TO_MODIFY]: "icon-circle-pen-solid",
  [DocumentsStatus.Enum.VALIDATED]: "icon-circle-check-solid",
};

const ICON_CLASS_NAMES_BY_STATUS: Record<DocumentsStatus.Enum, string> = {
  [DocumentsStatus.Enum.AWAITING_VALIDATION]: cn("text-gray-900"),
  [DocumentsStatus.Enum.TO_BE_FILLED]: cn("text-gray-900"),
  [DocumentsStatus.Enum.TO_MODIFY]: cn("text-yellow-500"),
  [DocumentsStatus.Enum.VALIDATED]: cn("text-green-600"),
};
