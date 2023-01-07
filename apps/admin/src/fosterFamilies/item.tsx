import { FosterFamily } from "@prisma/client";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { AvatarColor, inferAvatarColor } from "~/core/dataDisplay/avatar";
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
      to={`/foster-families/${fosterFamily.id}`}
      className={cn(
        className,
        "group rounded-0.5 py-1 grid grid-cols-[auto_minmax(0px,1fr)] items-start gap-1 md:gap-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      )}
    >
      <FosterFamilyAvatar fosterFamily={fosterFamily} size="sm" />

      <span className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
        <span
          className={cn(
            "text-body-emphasis",
            DISPLAY_NAME_CLASS_NAME[inferAvatarColor(fosterFamily.id)]
          )}
        >
          {fosterFamily.displayName}
        </span>

        <span className="text-gray-500 group-hover:text-gray-800">
          {getShortLocation(fosterFamily)}
        </span>
      </span>
    </BaseLink>
  );
}

const DISPLAY_NAME_CLASS_NAME: Record<AvatarColor, string> = {
  blue: "group-hover:text-blue-600",
  green: "group-hover:text-green-700",
  red: "group-hover:text-red-600",
  yellow: "group-hover:text-yellow-600",
};
