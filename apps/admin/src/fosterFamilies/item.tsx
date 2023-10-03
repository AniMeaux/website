import { SPECIES_ICON } from "#animals/species.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import type { InstanceColor } from "#core/dataDisplay/instanceColor.tsx";
import { inferInstanceColor } from "#core/dataDisplay/instanceColor.tsx";
import { SuggestionItem } from "#core/formElements/resourceInput.tsx";
import { Routes } from "#core/navigation.ts";
import { FosterFamilyAvatar } from "#fosterFamilies/avatar.tsx";
import { getShortLocation } from "#fosterFamilies/location.tsx";
import { Icon } from "#generated/icon.tsx";
import type { FosterFamilyHit } from "@animeaux/algolia-client";
import { cn } from "@animeaux/core";
import type { FosterFamily } from "@prisma/client";
import { forwardRef } from "react";

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
      to={Routes.fosterFamilies.id(fosterFamily.id).toString()}
      className={cn(
        className,
        "group rounded-0.5 py-1 grid grid-cols-[auto_minmax(0px,1fr)] grid-flow-col items-start gap-1 md:gap-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg",
      )}
    >
      <FosterFamilyAvatar fosterFamily={fosterFamily} size="sm" />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span
          className={cn(
            "text-body-emphasis transition-colors duration-100 ease-in-out",
            DISPLAY_NAME_CLASS_NAME[inferInstanceColor(fosterFamily.id)],
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
              className="text-[20px] text-gray-500 transition-colors duration-100 ease-in-out group-hover:text-gray-800"
            />
          ))}
        </span>
      ) : null}
    </BaseLink>
  );
}

const DISPLAY_NAME_CLASS_NAME: Record<InstanceColor, string> = {
  blue: "group-hover:text-blue-600",
  green: "group-hover:text-green-700",
  red: "group-hover:text-red-600",
  yellow: "group-hover:text-yellow-600",
};

export const FosterFamilySuggestionItem = forwardRef<
  React.ComponentRef<typeof SuggestionItem>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SuggestionItem>,
    "leftAdornment" | "label" | "secondaryLabel"
  > & {
    fosterFamily: FosterFamilyHit & Pick<FosterFamily, "city" | "zipCode">;
  }
>(function FosterFamilySuggestionItem({ fosterFamily, ...rest }, ref) {
  return (
    <SuggestionItem
      {...rest}
      ref={ref}
      leftAdornment={<FosterFamilyAvatar fosterFamily={fosterFamily} />}
      label={fosterFamily._highlighted.displayName}
      secondaryLabel={getShortLocation(fosterFamily)}
    />
  );
});
