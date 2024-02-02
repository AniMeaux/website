import { SuggestionItem } from "#core/form-elements/resource-input";
import { FosterFamilyAvatar } from "#foster-families/avatar";
import { getShortLocation } from "#foster-families/location";
import type { FosterFamilyHit } from "@animeaux/algolia-client";
import type { FosterFamily } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { forwardRef } from "react";

export const FosterFamilySuggestionItem = forwardRef<
  React.ComponentRef<typeof SuggestionItem>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SuggestionItem>,
    "leftAdornment" | "label" | "secondaryLabel"
  > & {
    fosterFamily: FosterFamilyHit &
      SerializeFrom<Pick<FosterFamily, "availability" | "city" | "zipCode">>;
  }
>(function FosterFamilySuggestionItem({ fosterFamily, ...rest }, ref) {
  return (
    <SuggestionItem
      {...rest}
      ref={ref}
      leftAdornment={
        <FosterFamilyAvatar
          size="sm"
          availability={fosterFamily.availability}
        />
      }
      label={fosterFamily._highlighted.displayName}
      secondaryLabel={getShortLocation(fosterFamily)}
    />
  );
});
