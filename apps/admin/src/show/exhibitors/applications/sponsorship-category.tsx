import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import {
  SponsorshipCategory,
  SponsorshipCategoryIcon,
} from "#show/sponsors/category";
import { ShowExhibitorApplicationOtherSponsorshipCategory } from "@prisma/client";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export namespace ApplicationSponsorshipCategory {
  export const Enum = {
    ...SponsorshipCategory.Enum,
    ...ShowExhibitorApplicationOtherSponsorshipCategory,
  } as const;

  export type Enum = (typeof Enum)[keyof typeof Enum];

  export const translation: Record<Enum, string> = {
    ...SponsorshipCategory.translation,

    [Enum.MAYBE]: "J’aimerais étudier un peu plus la question",
    [Enum.NO_SPONSORSHIP]: "Malheureusement ce n’est pas possible",
  };

  export const values = [
    ...SponsorshipCategory.values,

    Enum.MAYBE,
    Enum.NO_SPONSORSHIP,
  ];

  export function isSponsorshipCategory(
    category: SponsorshipCategory.Enum | Enum,
  ): category is SponsorshipCategory.Enum {
    return SponsorshipCategory.values.includes(category);
  }
}

export const ApplicationSponsorshipCategoryIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    category: ApplicationSponsorshipCategory.Enum;
    variant?: "light" | "solid";
  }
>(function ApplicationSponsorshipCategoryIcon(
  { category, variant = "light", ...props },
  ref,
) {
  if (ApplicationSponsorshipCategory.isSponsorshipCategory(category)) {
    return (
      <SponsorshipCategoryIcon
        {...props}
        category={category}
        variant={variant}
      />
    );
  }

  return (
    <span
      {...props}
      ref={ref}
      title={ApplicationSponsorshipCategory.translation[category]}
    >
      <Icon href={APPLICATION_SPONSORSHIP_CATEGORY_ICON[category][variant]} />
    </span>
  );
});

const APPLICATION_SPONSORSHIP_CATEGORY_ICON: Record<
  ShowExhibitorApplicationOtherSponsorshipCategory,
  { solid: IconName; light: IconName }
> = {
  [ApplicationSponsorshipCategory.Enum.MAYBE]: {
    light: "icon-award-question-light",
    solid: "icon-award-question-solid",
  },
  [ApplicationSponsorshipCategory.Enum.NO_SPONSORSHIP]: {
    light: "icon-award-slash-light",
    solid: "icon-award-slash-solid",
  },
};
