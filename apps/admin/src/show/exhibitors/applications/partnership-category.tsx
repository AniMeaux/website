import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import {
  PartnershipCategory,
  PartnershipCategoryIcon,
} from "#show/partners/category";
import { ShowExhibitorApplicationOtherPartnershipCategory } from "@prisma/client";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export namespace ApplicationPartnershipCategory {
  export const Enum = {
    ...PartnershipCategory.Enum,
    ...ShowExhibitorApplicationOtherPartnershipCategory,
  } as const;

  export type Enum = (typeof Enum)[keyof typeof Enum];

  export const translation: Record<Enum, string> = {
    ...PartnershipCategory.translation,

    [Enum.MAYBE]: "J’aimerais étudier un peu plus la question",
    [Enum.NO_PARTNERSHIP]: "Malheureusement ce n’est pas possible",
  };

  export const values = [
    ...PartnershipCategory.values,

    Enum.MAYBE,
    Enum.NO_PARTNERSHIP,
  ];

  export function isPartnershipCategory(
    category: PartnershipCategory.Enum | Enum,
  ): category is PartnershipCategory.Enum {
    return PartnershipCategory.values.includes(category);
  }
}

export const ApplicationPartnershipCategoryIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    category: ApplicationPartnershipCategory.Enum;
    variant?: "light" | "solid";
  }
>(function ApplicationPartnershipCategoryIcon(
  { category, variant = "light", ...props },
  ref,
) {
  if (ApplicationPartnershipCategory.isPartnershipCategory(category)) {
    return (
      <PartnershipCategoryIcon
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
      title={ApplicationPartnershipCategory.translation[category]}
    >
      <Icon href={APPLICATION_PARTNERSHIP_CATEGORY_ICON[category][variant]} />
    </span>
  );
});

const APPLICATION_PARTNERSHIP_CATEGORY_ICON: Record<
  ShowExhibitorApplicationOtherPartnershipCategory,
  { solid: IconName; light: IconName }
> = {
  [ApplicationPartnershipCategory.Enum.MAYBE]: {
    light: "icon-award-question-light",
    solid: "icon-award-question-solid",
  },
  [ApplicationPartnershipCategory.Enum.NO_PARTNERSHIP]: {
    light: "icon-award-slash-light",
    solid: "icon-award-slash-solid",
  },
};
