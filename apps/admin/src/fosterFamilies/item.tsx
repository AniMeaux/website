import { FosterFamily } from "@prisma/client";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { FosterFamilyAvatar } from "~/fosterFamilies/avatar";
import { getShortLocation } from "~/fosterFamilies/location";

export function ForsterFamilyItem({
  fosterFamily,
  className,
}: {
  fosterFamily: Pick<FosterFamily, "city" | "displayName" | "id" | "zipCode">;
  className?: string;
}) {
  return (
    <BaseLink
      disabled
      to={`/foster-families/${fosterFamily.id}`}
      className={cn(
        className,
        "group grid grid-cols-[auto_minmax(0px,1fr)] items-start gap-1 md:gap-2"
      )}
    >
      <FosterFamilyAvatar fosterFamily={fosterFamily} size="sm" />

      <span className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
        <span className="text-body-emphasis">{fosterFamily.displayName}</span>
        <span className="text-gray-500">{getShortLocation(fosterFamily)}</span>
      </span>
    </BaseLink>
  );
}
