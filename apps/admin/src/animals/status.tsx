import { Icon } from "#generated/icon.tsx";
import { cn } from "@animeaux/core";
import { Status } from "@prisma/client";
import orderBy from "lodash.orderby";

export const ACTIVE_ANIMAL_STATUS: Status[] = [
  Status.OPEN_TO_ADOPTION,
  Status.OPEN_TO_RESERVATION,
  Status.RESERVED,
  Status.RETIRED,
  Status.UNAVAILABLE,
];

export const NON_ACTIVE_ANIMAL_STATUS = Object.values(Status).filter(
  (status) => !ACTIVE_ANIMAL_STATUS.includes(status),
);

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      className={cn(
        className,
        "rounded-0.5 px-0.5 inline-flex text-caption-emphasis",
        STATUS_BADGE_CLASS_NAMES[status],
      )}
    >
      {STATUS_TRANSLATION[status]}
    </span>
  );
}

const STATUS_BADGE_CLASS_NAMES: Record<Status, string> = {
  [Status.ADOPTED]: "bg-green-600 text-white",
  [Status.DECEASED]: "bg-gray-800 text-white",
  [Status.FREE]: "bg-gray-800 text-white",
  [Status.LOST]: "bg-red-500 text-white",
  [Status.OPEN_TO_ADOPTION]: "bg-blue-500 text-white",
  [Status.OPEN_TO_RESERVATION]: "bg-blue-500 text-white",
  [Status.RESERVED]: "bg-yellow-400 text-black",
  [Status.RETIRED]: "bg-gray-800 text-white",
  [Status.RETURNED]: "bg-gray-800 text-white",
  [Status.UNAVAILABLE]: "bg-red-500 text-white",
  [Status.TRANSFERRED]: "bg-gray-800 text-white",
};

export function StatusIcon({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <Icon
      id="status"
      className={cn(className, STATUS_ICON_CLASS_NAMES[status])}
    />
  );
}

const STATUS_ICON_CLASS_NAMES: Record<Status, string> = {
  [Status.ADOPTED]: "text-green-600",
  [Status.DECEASED]: "text-gray-800",
  [Status.FREE]: "text-gray-800",
  [Status.LOST]: "text-red-500",
  [Status.OPEN_TO_ADOPTION]: "text-blue-500",
  [Status.OPEN_TO_RESERVATION]: "text-blue-500",
  [Status.RESERVED]: "text-yellow-400",
  [Status.RETIRED]: "text-gray-800",
  [Status.RETURNED]: "text-gray-800",
  [Status.UNAVAILABLE]: "text-red-500",
  [Status.TRANSFERRED]: "text-gray-800",
};

export const STATUS_TRANSLATION: Record<Status, string> = {
  [Status.ADOPTED]: "Adopté",
  [Status.DECEASED]: "Décédé",
  [Status.FREE]: "Libre",
  [Status.LOST]: "Perdu",
  [Status.OPEN_TO_ADOPTION]: "Adoptable",
  [Status.OPEN_TO_RESERVATION]: "Réservable",
  [Status.RESERVED]: "Réservé",
  [Status.RETIRED]: "Retraité",
  [Status.RETURNED]: "Restitué",
  [Status.UNAVAILABLE]: "Indisponible",
  [Status.TRANSFERRED]: "Transféré",
};

export const SORTED_STATUS = orderBy(
  Object.values(Status),
  (status) => STATUS_TRANSLATION[status],
);
