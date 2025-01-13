import {
  ShowExhibitorApplicationOtherPartnershipCategory,
  ShowPartnershipCategory,
} from "@prisma/client";

export const TRANSLATION_BY_PARTNERSHIP_CATEGORY: Record<
  ShowPartnershipCategory,
  string
> = {
  [ShowPartnershipCategory.BRONZE]: "Pott de bronze",
  [ShowPartnershipCategory.SILVER]: "Pott d’argent",
  [ShowPartnershipCategory.GOLD]: "Pott d’or",
};

export const SORTED_PARTNERSHIP_CATEGORIES = [
  ShowPartnershipCategory.BRONZE,
  ShowPartnershipCategory.SILVER,
  ShowPartnershipCategory.GOLD,
];

export const TRANSLATION_BY_APPLICATION_OTHER_PARTNERSHIP_CATEGORY: Record<
  ShowExhibitorApplicationOtherPartnershipCategory,
  string
> = {
  [ShowExhibitorApplicationOtherPartnershipCategory.MAYBE]:
    "J’aimerais étudier un peu plus la question",
  [ShowExhibitorApplicationOtherPartnershipCategory.NO_PARTNERSHIP]:
    "Malheureusement ce n’est pas possible",
};

export const SORTED_APPLICATION_OTHER_PARTNERSHIP_CATEGORIES = [
  ShowExhibitorApplicationOtherPartnershipCategory.MAYBE,
  ShowExhibitorApplicationOtherPartnershipCategory.NO_PARTNERSHIP,
];

export function isPartnershipCategory(
  category:
    | ShowPartnershipCategory
    | ShowExhibitorApplicationOtherPartnershipCategory,
): category is ShowPartnershipCategory {
  return SORTED_PARTNERSHIP_CATEGORIES.includes(category);
}

export const ApplicationPartnershipCategory = {
  ...ShowPartnershipCategory,
  ...ShowExhibitorApplicationOtherPartnershipCategory,
} as const;

export type ApplicationPartnershipCategory =
  (typeof ApplicationPartnershipCategory)[keyof typeof ApplicationPartnershipCategory];

export const TRANSLATION_BY_APPLICATION_PARTNERSHIP_CATEGORY: Record<
  ApplicationPartnershipCategory,
  string
> = {
  ...TRANSLATION_BY_PARTNERSHIP_CATEGORY,
  ...TRANSLATION_BY_APPLICATION_OTHER_PARTNERSHIP_CATEGORY,
};

export const SORTED_APPLICATION_PARTNERSHIP_CATEGORIES = [
  ...SORTED_PARTNERSHIP_CATEGORIES,
  ...SORTED_APPLICATION_OTHER_PARTNERSHIP_CATEGORIES,
];
