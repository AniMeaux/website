import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
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
        "flex flex-col items-center justify-center gap-0.5 rounded-0.5 p-1",
        AGREEMENT_CLASS_NAMES[agreement],
      )}
    >
      <Icon href={ICONS[entity][agreement]} className="text-[30px]" />
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

const ICONS: Record<Entity, Record<AgreementValue, IconName>> = {
  babies: {
    [AgreementValue.TRUE]: "icon-baby-circle-check",
    [AgreementValue.FALSE]: "icon-baby-circle-x-mark",
    [AgreementValue.UNKNOWN]: "icon-baby-circle-question",
  },
  cats: {
    [AgreementValue.TRUE]: "icon-cat-circle-check",
    [AgreementValue.FALSE]: "icon-cat-circle-x-mark",
    [AgreementValue.UNKNOWN]: "icon-cat-circle-question",
  },
  dogs: {
    [AgreementValue.TRUE]: "icon-dog-circle-check",
    [AgreementValue.FALSE]: "icon-dog-circle-x-mark",
    [AgreementValue.UNKNOWN]: "icon-dog-circle-question",
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
