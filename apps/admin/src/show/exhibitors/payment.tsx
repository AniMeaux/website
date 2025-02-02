import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";

export namespace Payment {
  export const Enum = {
    HAS_PAID: "HAS_PAID",
    HAS_NOT_PAID: "HAS_NOT_PAID",
  } as const;

  export type Enum = (typeof Enum)[keyof typeof Enum];

  export const values = [Enum.HAS_PAID, Enum.HAS_NOT_PAID];

  export const translation: Record<Enum, string> = {
    [Enum.HAS_NOT_PAID]: "Non payé",
    [Enum.HAS_PAID]: "A payé",
  };

  export function fromBoolean(hasPaid: boolean) {
    return hasPaid ? Enum.HAS_PAID : Enum.HAS_NOT_PAID;
  }

  export function toBoolean(payment: Enum) {
    return payment === Enum.HAS_PAID;
  }
}

export function PaymentIcon({
  payment,
  variant = "light",
  className,
}: {
  payment: Payment.Enum;
  variant?: "light" | "solid";
  className?: string;
}) {
  return (
    <span title={Payment.translation[payment]} className={className}>
      <Icon href={ICON_NAME[payment][variant]} />
    </span>
  );
}

const ICON_NAME: Record<Payment.Enum, { light: IconName; solid: IconName }> = {
  [Payment.Enum.HAS_NOT_PAID]: {
    light: "icon-credit-card-slash-light",
    solid: "icon-credit-card-slash-solid",
  },
  [Payment.Enum.HAS_PAID]: {
    light: "icon-credit-card-light",
    solid: "icon-credit-card-solid",
  },
};
