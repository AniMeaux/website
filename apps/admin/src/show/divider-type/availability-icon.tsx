import type { IconName } from "#generated/icon.js";
import { Icon } from "#generated/icon.js";
import type { ShowDividerTypeAvailability } from "#show/divider-type/availability.js";
import { formatAvailability } from "#show/divider-type/availability.js";
import { cn } from "@animeaux/core";

export function DividerTypeAvailabilityIcon({
  dividerType,
  className,
}: {
  dividerType: ShowDividerTypeAvailability;
  className?: string;
}) {
  let colorClassName: string;
  let href: IconName;

  if (dividerType.ratio === 0) {
    href = "icon-circle-light";
    colorClassName = cn("text-gray-600");
  } else if (dividerType.ratio < 0.33) {
    href = "icon-circle-progress-1-solid";
    colorClassName = cn("text-blue-500");
  } else if (dividerType.ratio < 0.66) {
    href = "icon-circle-progress-2-solid";
    colorClassName = cn("text-cyan-500");
  } else if (dividerType.ratio < 1) {
    href = "icon-circle-progress-3-solid";
    colorClassName = cn("text-emerald-500");
  } else if (dividerType.ratio === 1) {
    href = "icon-circle-check-solid";
    colorClassName = cn("text-green-600");
  } else {
    href = "icon-circle-exclamation-solid";
    colorClassName = cn("text-red-500");
  }

  return (
    <span
      title={`Utilisation : ${formatAvailability(dividerType)}`}
      className={cn(colorClassName, className)}
    >
      <Icon href={href} />
    </span>
  );
}
