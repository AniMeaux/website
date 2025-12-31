import { IconInline } from "#i/core/data-display/icon-inline.js";
import { DynamicImage } from "#i/core/data-display/image.js";
import type { SuggestionItemProps } from "#i/core/form-elements/resource-input.js";
import { SuggestionItem } from "#i/core/form-elements/resource-input.js";
import { SponsorshipCategory } from "#i/show/sponsors/category.js";
import { ImageUrl, joinReactNodes } from "@animeaux/core";
import type { Prisma } from "@animeaux/prisma";
import { forwardRef } from "react";

export const ItemExhibitor = forwardRef<
  React.ComponentRef<typeof SuggestionItem>,
  Omit<SuggestionItemProps, "leftAdornment" | "label" | "secondaryLabel"> & {
    exhibitor: Prisma.ShowExhibitorGetPayload<{
      select: {
        isOrganizersFavorite: true;
        isRisingStar: true;
        logoPath: true;
        name: true;

        sponsorship: { select: { category: true } };
      };
    }>;
  }
>(function ItemExhibitor({ exhibitor, ...props }, ref) {
  const secondaryLabel = [
    exhibitor.sponsorship != null ? (
      <IconInline
        href="icon-award-light"
        title={`Sponsor ${SponsorshipCategory.translation[exhibitor.sponsorship.category]}`}
      />
    ) : null,

    exhibitor.isOrganizersFavorite ? (
      <IconInline href="icon-heart-light" title="Coup de cœur" />
    ) : null,

    exhibitor.isRisingStar ? (
      <IconInline href="icon-seedling-light" title="Espoir" />
    ) : null,
  ].filter(Boolean);

  return (
    <SuggestionItem
      {...props}
      ref={ref}
      leftAdornment={
        <DynamicImage
          imageId={ImageUrl.parse(exhibitor.logoPath).id}
          alt={exhibitor.name}
          sizeMapping={{ default: "20px" }}
          fallbackSize="256"
          background="none"
          className="h-2 rounded-0.5"
        />
      }
      label={exhibitor.name}
      secondaryLabel={
        secondaryLabel.length > 0 ? joinReactNodes(secondaryLabel, "") : null
      }
    />
  );
});
