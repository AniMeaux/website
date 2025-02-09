import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { ShowPartnershipCategory } from "@prisma/client";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export namespace PartnershipCategory {
  export const Enum = ShowPartnershipCategory;
  export type Enum = ShowPartnershipCategory;

  export const translation: Record<Enum, string> = {
    [Enum.BRONZE]: "Pott de bronze",
    [Enum.SILVER]: "Pott d’argent",
    [Enum.GOLD]: "Pott d’or",
  };

  export const values = [Enum.BRONZE, Enum.SILVER, Enum.GOLD];
}

export const PartnershipCategoryIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    category: PartnershipCategory.Enum;
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
      title={PartnershipCategory.translation[category]}
    >
      <Icon href={PARTNERSHIP_CATEGORY_ICON[category][variant]} />
    </span>
  );
});

const PARTNERSHIP_CATEGORY_ICON: Record<
  PartnershipCategory.Enum,
  { solid: IconName; light: IconName }
> = {
  [PartnershipCategory.Enum.BRONZE]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
  [PartnershipCategory.Enum.SILVER]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
  [PartnershipCategory.Enum.GOLD]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
};
