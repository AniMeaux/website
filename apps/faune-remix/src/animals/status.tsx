import { Status } from "@prisma/client";
import { cn } from "~/core/classNames";

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
        "rounded-0.5 px-0.5 inline-flex text-white text-caption-emphasis",
        ANIMAL_STATUS_CLASS_NAMES[status]
      )}
    >
      {ANIMAL_STATUS_TRANSLATION[status]}
    </span>
  );
}

const ANIMAL_STATUS_CLASS_NAMES: Record<Status, string> = {
  [Status.ADOPTED]: "bg-green-600",
  [Status.DECEASED]: "bg-gray-800",
  [Status.FREE]: "bg-gray-800",
  [Status.OPEN_TO_ADOPTION]: "bg-blue-500",
  [Status.OPEN_TO_RESERVATION]: "bg-blue-500",
  [Status.RESERVED]: "bg-amber-600",
  [Status.UNAVAILABLE]: "bg-gray-800",
};

const ANIMAL_STATUS_TRANSLATION: Record<Status, string> = {
  [Status.ADOPTED]: "Adopté",
  [Status.DECEASED]: "Décédé",
  [Status.FREE]: "Libre",
  [Status.OPEN_TO_ADOPTION]: "Adoptable",
  [Status.OPEN_TO_RESERVATION]: "Réservable",
  [Status.RESERVED]: "Réservé",
  [Status.UNAVAILABLE]: "Indisponible",
};
