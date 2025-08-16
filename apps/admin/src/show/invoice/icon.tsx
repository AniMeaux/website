import type { IconName } from "#generated/icon.js";
import { Icon } from "#generated/icon.js";
import { InvoiceStatus } from "#show/invoice/status";

export function InvoiceIcon({
  status,
  variant = "light",
  className,
}: {
  status: InvoiceStatus.Enum;
  variant?: "light" | "solid";
  className?: string;
}) {
  return (
    <span title={InvoiceStatus.translation[status]} className={className}>
      <Icon href={ICON_NAME[status][variant]} />
    </span>
  );
}

const ICON_NAME: Record<
  InvoiceStatus.Enum,
  { light: IconName; solid: IconName }
> = {
  [InvoiceStatus.Enum.PAID]: {
    light: "icon-credit-card-light",
    solid: "icon-credit-card-solid",
  },
  [InvoiceStatus.Enum.TO_PAY]: {
    light: "icon-credit-card-slash-light",
    solid: "icon-credit-card-slash-solid",
  },
};
