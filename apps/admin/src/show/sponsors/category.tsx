import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { ShowSponsorshipCategory } from "@prisma/client";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export namespace SponsorshipCategory {
  export const Enum = ShowSponsorshipCategory;
  export type Enum = ShowSponsorshipCategory;

  export const translation: Record<Enum, string> = {
    [Enum.POLLEN]: "Pollen",
    [Enum.BRONZE]: "Pott de bronze",
    [Enum.SILVER]: "Pott d’argent",
    [Enum.GOLD]: "Pott d’or",
  };

  export const values = [Enum.POLLEN, Enum.BRONZE, Enum.SILVER, Enum.GOLD];
}

export const SponsorshipCategoryIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    category: SponsorshipCategory.Enum;
    variant?: "light" | "solid";
  }
>(function SponsorshipCategoryIcon(
  { category, variant = "light", ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      title={SponsorshipCategory.translation[category]}
    >
      <Icon href={SPONSORSHIP_CATEGORY_ICON[category][variant]} />
    </span>
  );
});

const SPONSORSHIP_CATEGORY_ICON: Record<
  SponsorshipCategory.Enum,
  { solid: IconName; light: IconName }
> = {
  [SponsorshipCategory.Enum.POLLEN]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
  [SponsorshipCategory.Enum.BRONZE]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
  [SponsorshipCategory.Enum.SILVER]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
  [SponsorshipCategory.Enum.GOLD]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
};
