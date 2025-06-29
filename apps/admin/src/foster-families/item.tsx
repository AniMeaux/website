import { SuggestionItem } from "#core/form-elements/resource-input";
import { FosterFamilyAvatar } from "#foster-families/avatar";
import { getShortLocation } from "@animeaux/core";
import type { FosterFamilyAvailability } from "@prisma/client";
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
      availability: FosterFamilyAvailability;
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
