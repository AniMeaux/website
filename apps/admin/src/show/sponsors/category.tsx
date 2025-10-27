import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { ShowSponsorshipCategory } from "@animeaux/prisma/client";
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

export namespace SponsorshipOptionalCategory {
  export const Enum = {
    ...SponsorshipCategory.Enum,
    NO_SPONSORSHIP: "NO_SPONSORSHIP",
  } as const;

  export type Enum = (typeof Enum)[keyof typeof Enum];

  export const translation: Record<Enum, string> = {
    ...SponsorshipCategory.translation,
    [Enum.NO_SPONSORSHIP]: "Malheureusement ce n’est pas possible",
  };

  export const values = [...SponsorshipCategory.values, Enum.NO_SPONSORSHIP];

  export function toDb(category: Enum): undefined | ShowSponsorshipCategory {
    return category === Enum.NO_SPONSORSHIP ? undefined : category;
  }

  export function fromDb(category: null | ShowSponsorshipCategory): Enum {
    return category == null ? Enum.NO_SPONSORSHIP : category;
  }
}

export const SponsorshipCategoryIcon = forwardRef<
  React.ComponentRef<"span">,
  Except<React.ComponentPropsWithoutRef<"span">, "title"> & {
    category: SponsorshipOptionalCategory.Enum;
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
      title={SponsorshipOptionalCategory.translation[category]}
    >
      <Icon href={SPONSORSHIP_CATEGORY_ICON[category][variant]} />
    </span>
  );
});

const SPONSORSHIP_CATEGORY_ICON: Record<
  SponsorshipOptionalCategory.Enum,
  { solid: IconName; light: IconName }
> = {
  [SponsorshipOptionalCategory.Enum.POLLEN]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
  [SponsorshipOptionalCategory.Enum.BRONZE]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
  [SponsorshipOptionalCategory.Enum.SILVER]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
  [SponsorshipOptionalCategory.Enum.GOLD]: {
    light: "icon-award-light",
    solid: "icon-award-solid",
  },
  [SponsorshipOptionalCategory.Enum.NO_SPONSORSHIP]: {
    light: "icon-award-slash-light",
    solid: "icon-award-slash-solid",
  },
};
