import { Status } from "@prisma/client";
import orderBy from "lodash.orderby";
import { cn } from "~/core/classNames";

export const ACTIVE_ANIMAL_STATUS: Status[] = [
  Status.OPEN_TO_ADOPTION,
  Status.OPEN_TO_RESERVATION,
  Status.RESERVED,
  Status.UNAVAILABLE,
];

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
        STATUS_CLASS_NAMES[status]
      )}
    >
      {STATUS_TRANSLATION[status]}
    </span>
  );
}

export function StatusIcon({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      title={STATUS_TRANSLATION[status]}
      className={cn(
        className,
        "rounded-0.5 w-[1em] aspect-square inline-flex",
        STATUS_CLASS_NAMES[status]
      )}
    />
  );
}

const STATUS_CLASS_NAMES: Record<Status, string> = {
  [Status.ADOPTED]: "bg-green-600 text-white",
  [Status.DECEASED]: "bg-gray-800 text-white",
  [Status.FREE]: "bg-gray-800 text-white",
  [Status.OPEN_TO_ADOPTION]: "bg-blue-500 text-white",
  [Status.OPEN_TO_RESERVATION]: "bg-blue-500 text-white",
  [Status.RESERVED]: "bg-yellow-400 text-black",
  [Status.UNAVAILABLE]: "bg-gray-800 text-white",
};

export const STATUS_TRANSLATION: Record<Status, string> = {
  [Status.ADOPTED]: "Adopté",
  [Status.DECEASED]: "Décédé",
  [Status.FREE]: "Libre",
  [Status.OPEN_TO_ADOPTION]: "Adoptable",
  [Status.OPEN_TO_RESERVATION]: "Réservable",
  [Status.RESERVED]: "Réservé",
  [Status.UNAVAILABLE]: "Indisponible",
};

export const SORTED_STATUS = orderBy(
  Object.values(Status),
  (status) => STATUS_TRANSLATION[status]
);
