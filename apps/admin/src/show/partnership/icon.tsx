import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import type { ApplicationPartnershipCategory } from "#show/partnership/category";
import {
  TRANSLATION_BY_APPLICATION_OTHER_PARTNERSHIP_CATEGORY,
  TRANSLATION_BY_PARTNERSHIP_CATEGORY,
  isPartnershipCategory,
} from "#show/partnership/category";
import type { ShowPartnershipCategory } from "@prisma/client";
import { ShowExhibitorApplicationOtherPartnershipCategory } from "@prisma/client";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const PartnershipCategoryIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    category: ShowPartnershipCategory;
    variant?: "light" | "solid";
  }
>(function PartnershipCategoryIcon(
  { category, variant = "light", ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      title={TRANSLATION_BY_PARTNERSHIP_CATEGORY[category]}
    >
      <Icon
        href={variant === "light" ? "icon-award-light" : "icon-award-solid"}
      />
    </span>
  );
});

export const ApplicationOtherPartnershipCategoryIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    category: ShowExhibitorApplicationOtherPartnershipCategory;
    variant?: "light" | "solid";
  }
>(function ApplicationOtherPartnershipCategoryIcon(
  { category, variant = "light", ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      title={TRANSLATION_BY_APPLICATION_OTHER_PARTNERSHIP_CATEGORY[category]}
    >
      <Icon
        href={ICON_BY_APPLICATION_OTHER_PARTNERSHIP_CATEGORY[category][variant]}
      />
    </span>
  );
});

const ICON_BY_APPLICATION_OTHER_PARTNERSHIP_CATEGORY: Record<
  ShowExhibitorApplicationOtherPartnershipCategory,
  { solid: IconName; light: IconName }
> = {
  [ShowExhibitorApplicationOtherPartnershipCategory.MAYBE]: {
    light: "icon-award-question-light",
    solid: "icon-award-question-solid",
  },
  [ShowExhibitorApplicationOtherPartnershipCategory.NO_PARTNERSHIP]: {
    light: "icon-award-slash-light",
    solid: "icon-award-slash-solid",
  },
};

export const ApplicationPartnershipCategoryIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    category: ApplicationPartnershipCategory;
    variant?: "light" | "solid";
  }
>(function ApplicationPartnershipCategoryIcon(
  { category, variant, ...props },
  ref,
) {
  if (isPartnershipCategory(category)) {
    return (
      <PartnershipCategoryIcon
        {...props}
        ref={ref}
        category={category}
        variant={variant}
      />
    );
  }

  return (
    <ApplicationOtherPartnershipCategoryIcon
      {...props}
      ref={ref}
      category={category}
      variant={variant}
    />
  );
});
