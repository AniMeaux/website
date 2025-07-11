import { SuggestionItem } from "#core/form-elements/resource-input";
import type { FosterFamilyAvailability } from "#foster-families/availability";
import { FosterFamilyAvatar } from "#foster-families/avatar";
import { getShortLocation } from "@animeaux/core";
import { forwardRef } from "react";

export const FosterFamilySuggestionItem = forwardRef<
  React.ComponentRef<typeof SuggestionItem>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SuggestionItem>,
    "leftAdornment" | "label" | "secondaryLabel"
  > & {
    fosterFamily: {
      id: string;
      displayName: string;
      availability: FosterFamilyAvailability.Enum;
      city: string;
      zipCode: string;
    };
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
      label={fosterFamily.displayName}
      secondaryLabel={getShortLocation(fosterFamily)}
    />
  );
});
