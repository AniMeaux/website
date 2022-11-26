import { Animal } from "@prisma/client";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

enum AgreementValue {
  TRUE = "TRUE",
  FALSE = "FALSE",
  UNKNOWN = "UNKNOWN",
}

const AGREEMENT_TRANSLATION: Record<AgreementValue, string> = {
  [AgreementValue.TRUE]: "Oui",
  [AgreementValue.FALSE]: "Non",
  [AgreementValue.UNKNOWN]: "Inconnu",
};

type Entity = "babies" | "cats" | "dogs";

export function AgreementItem({
  entity,
  value,
}: {
  entity: Entity;
  value: AgreementValue;
}) {
  return (
    <li
      className={cn(
        "rounded-0.5 p-1 flex flex-col items-center justify-center gap-0.5",
        AGREEMENT_CLASS_NAMES[value]
      )}
    >
      <Icon id={ICONS[entity][value]} className="text-[30px]" />
      <span className="text-body-emphasis">{AGREEMENT_TRANSLATION[value]}</span>
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

export function animalWithAgreements<
  T extends Pick<Animal, "isOkCats" | "isOkChildren" | "isOkDogs">
>({ isOkCats, isOkChildren, isOkDogs, ...rest }: T) {
  return {
    ...rest,
    isOkCats: agreementFromBoolean(isOkCats),
    isOkChildren: agreementFromBoolean(isOkChildren),
    isOkDogs: agreementFromBoolean(isOkDogs),
  };
}

function agreementFromBoolean(value: boolean | null) {
  return value == null
    ? AgreementValue.UNKNOWN
    : value
    ? AgreementValue.TRUE
    : AgreementValue.FALSE;
}
