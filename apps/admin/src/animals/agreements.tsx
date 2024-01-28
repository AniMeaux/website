import type { IconProps } from "#generated/icon.tsx";
import { Icon } from "#generated/icon.tsx";
import { cn } from "@animeaux/core";

export enum AgreementValue {
  TRUE = "TRUE",
  FALSE = "FALSE",
  UNKNOWN = "UNKNOWN",
}

export const AGREEMENT_TRANSLATION: Record<AgreementValue, string> = {
  [AgreementValue.TRUE]: "Oui",
  [AgreementValue.FALSE]: "Non",
  [AgreementValue.UNKNOWN]: "Inconnu",
};

export const SORTED_AGREEMENTS = [
  AgreementValue.TRUE,
  AgreementValue.FALSE,
  AgreementValue.UNKNOWN,
];

type Entity = "babies" | "cats" | "dogs";

export function AgreementItem({
  entity,
  value,
}: {
  entity: Entity;
  value: boolean | null;
}) {
  const agreement = agreementFromBoolean(value);

  return (
    <li
      className={cn(
        "rounded-0.5 p-1 flex flex-col items-center justify-center gap-0.5",
        AGREEMENT_CLASS_NAMES[agreement],
      )}
    >
      <Icon id={ICONS[entity][agreement]} className="text-[30px]" />
      <span className="text-body-emphasis">
        {AGREEMENT_TRANSLATION[agreement]}
      </span>
    </li>
  );
}

const AGREEMENT_CLASS_NAMES: Record<AgreementValue, string> = {
  [AgreementValue.TRUE]: "bg-green-50 text-green-600",
  [AgreementValue.FALSE]: "bg-red-50 text-red-500",
  [AgreementValue.UNKNOWN]: "bg-gray-100 text-gray-700",
};

const ICONS: Record<Entity, Record<AgreementValue, IconProps["id"]>> = {
  babies: {
    [AgreementValue.TRUE]: "babyCircleCheck",
    [AgreementValue.FALSE]: "babyCircleXMark",
    [AgreementValue.UNKNOWN]: "babyCircleQuestion",
  },
  cats: {
    [AgreementValue.TRUE]: "catCircleCheck",
    [AgreementValue.FALSE]: "catCircleXMark",
    [AgreementValue.UNKNOWN]: "catCircleQuestion",
  },
  dogs: {
    [AgreementValue.TRUE]: "dogCircleCheck",
    [AgreementValue.FALSE]: "dogCircleXMark",
    [AgreementValue.UNKNOWN]: "dogCircleQuestion",
  },
};

export function agreementToBoolean(value: AgreementValue) {
  const values: Record<AgreementValue, boolean | null> = {
    [AgreementValue.TRUE]: true,
    [AgreementValue.FALSE]: false,
    [AgreementValue.UNKNOWN]: null,
  };

  return values[value];
}

export function agreementFromBoolean(value: boolean | null) {
  return value == null
    ? AgreementValue.UNKNOWN
    : value
      ? AgreementValue.TRUE
      : AgreementValue.FALSE;
}
