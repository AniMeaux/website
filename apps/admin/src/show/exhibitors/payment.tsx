import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";

export const Payment = {
  HAS_PAID: "HAS_PAID",
  HAS_NOT_PAID: "HAS_NOT_PAID",
} as const;

export type Payment = (typeof Payment)[keyof typeof Payment];

export function paymentFromBoolean(hasPaid: boolean) {
  return hasPaid ? Payment.HAS_PAID : Payment.HAS_NOT_PAID;
}

export function paymentToBoolean(payment: Payment) {
  return payment === Payment.HAS_PAID;
}

export const PAYMENT_TRANSLATIONS: Record<Payment, string> = {
  [Payment.HAS_NOT_PAID]: "Non payé",
  [Payment.HAS_PAID]: "A payé",
};

export const PAYMENT_VALUES: Payment[] = [
  Payment.HAS_PAID,
  Payment.HAS_NOT_PAID,
];

export function PaymentIcon({
  payment,
  className,
}: {
  payment: Payment;
  className?: string;
}) {
  return (
    <span title={PAYMENT_TRANSLATIONS[payment]} className={className}>
      <Icon
        href={ICON_NAME[payment].solid}
        className={ICON_CLASS_NAME[payment]}
      />
    </span>
  );
}

const ICON_CLASS_NAME: Record<Payment, string> = {
  [Payment.HAS_NOT_PAID]: "text-gray-900",
  [Payment.HAS_PAID]: "text-green-600",
};

const ICON_NAME: Record<Payment, { light: IconName; solid: IconName }> = {
  [Payment.HAS_NOT_PAID]: {
    light: "icon-credit-card-slash-light",
    solid: "icon-credit-card-slash-solid",
  },
  [Payment.HAS_PAID]: {
    light: "icon-credit-card-light",
    solid: "icon-credit-card-solid",
  },
};
