import type { IconName } from "#i/generated/icon.js";
import { Icon } from "#i/generated/icon.js";
import { InvoiceStatus } from "#i/show/invoice/status";
import { cn } from "@animeaux/core";

export function InvoiceIcon({
  status,
  className,
}: {
  status: InvoiceStatus.Enum;
  className?: string;
}) {
  return (
    <span
      title={InvoiceStatus.translation[status]}
      className={cn(CLASS_NAME[status], className)}
    >
      <Icon href={ICON_NAME[status]} />
    </span>
  );
}

const ICON_NAME: Record<InvoiceStatus.Enum, IconName> = {
  [InvoiceStatus.Enum.PAID]: "icon-circle-check-solid",
  [InvoiceStatus.Enum.TO_PAY]: "icon-circle-light",
};

const CLASS_NAME: Record<InvoiceStatus.Enum, string> = {
  [InvoiceStatus.Enum.PAID]: cn("text-green-600"),
  [InvoiceStatus.Enum.TO_PAY]: cn("text-gray-900"),
};
