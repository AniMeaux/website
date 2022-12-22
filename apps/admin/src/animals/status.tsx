import { cn } from "#/core/classNames";
import { Icon } from "#/generated/icon";
import { AdoptionOption, Status } from "@prisma/client";
import orderBy from "lodash.orderby";

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
        STATUS_BADGE_CLASS_NAMES[status]
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
  [Status.OPEN_TO_ADOPTION]: "bg-blue-500 text-white",
  [Status.OPEN_TO_RESERVATION]: "bg-blue-500 text-white",
  [Status.RESERVED]: "bg-yellow-400 text-black",
  [Status.UNAVAILABLE]: "bg-gray-800 text-white",
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
  [Status.OPEN_TO_ADOPTION]: "text-blue-500",
  [Status.OPEN_TO_RESERVATION]: "text-blue-500",
  [Status.RESERVED]: "text-yellow-400",
  [Status.UNAVAILABLE]: "text-gray-800",
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

export const ADOPTION_OPTION_TRANSLATION: Record<AdoptionOption, string> = {
  [AdoptionOption.WITH_STERILIZATION]: "Avec stérilisation",
  [AdoptionOption.WITHOUT_STERILIZATION]: "Sans stérilisation",
  [AdoptionOption.FREE_DONATION]: "Don libre",
  [AdoptionOption.UNKNOWN]: "Inconnu",
};

export const SORTED_ADOPTION_OPTION = orderBy(
  Object.values(AdoptionOption),
  (adoptionOption) => ADOPTION_OPTION_TRANSLATION[adoptionOption]
);
