import { FosterFamily } from "@prisma/client";
import { forwardRef } from "react";
import { SPECIES_ICON } from "~/animals/species";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { AvatarColor, inferAvatarColor } from "~/core/dataDisplay/avatar";
import {
  SuggestionItem,
  SuggestionItemProps,
} from "~/core/formElements/resourceInput";
import { FosterFamilyAvatar } from "~/fosterFamilies/avatar";
import { getShortLocation } from "~/fosterFamilies/location";
import { Icon } from "~/generated/icon";

export function ForsterFamilyItem({
  fosterFamily,
  className,
}: {
  fosterFamily: Pick<
    FosterFamily,
    "city" | "displayName" | "id" | "speciesToHost" | "zipCode"
  >;
  className?: string;
}) {
  return (
    <BaseLink
      to={`/foster-families/${fosterFamily.id}`}
      className={cn(
        className,
        "group rounded-0.5 py-1 grid grid-cols-[auto_minmax(0px,1fr)] grid-flow-col items-start gap-1 md:gap-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      )}
    >
      <FosterFamilyAvatar fosterFamily={fosterFamily} size="sm" />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span
          className={cn(
            "text-body-emphasis transition-colors duration-100 ease-in-out",
            DISPLAY_NAME_CLASS_NAME[inferAvatarColor(fosterFamily.id)]
          )}
        >
          {fosterFamily.displayName}
        </span>

        <span className="text-gray-500 transition-colors duration-100 ease-in-out group-hover:text-gray-800">
          {getShortLocation(fosterFamily)}
        </span>
      </span>

      {fosterFamily.speciesToHost.length > 0 ? (
        <span
          className="h-2 flex items-center gap-0.5"
          title="Espèces à accueillir"
        >
          {fosterFamily.speciesToHost.map((species) => (
            <Icon
              key={species}
              id={SPECIES_ICON[species]}
              className="text-[14px] text-gray-500 transition-colors duration-100 ease-in-out group-hover:text-gray-800"
            />
          ))}
        </span>
      ) : null}
    </BaseLink>
  );
}

const DISPLAY_NAME_CLASS_NAME: Record<AvatarColor, string> = {
  blue: "group-hover:text-blue-600",
  green: "group-hover:text-green-700",
  red: "group-hover:text-red-600",
  yellow: "group-hover:text-yellow-600",
};

export const FosterFamilySuggestionItem = forwardRef<
  HTMLLIElement,
  Omit<SuggestionItemProps, "leftAdornment" | "label" | "secondaryLabel"> & {
    fosterFamily: Pick<FosterFamily, "city" | "id" | "zipCode"> & {
      highlightedDisplayName: string;
    };
  }
>(function FosterFamilySuggestionItem({ fosterFamily, ...rest }, ref) {
  return (
    <SuggestionItem
      {...rest}
      ref={ref}
      leftAdornment={<FosterFamilyAvatar fosterFamily={fosterFamily} />}
      label={fosterFamily.highlightedDisplayName}
      secondaryLabel={getShortLocation(fosterFamily)}
    />
  );
});
