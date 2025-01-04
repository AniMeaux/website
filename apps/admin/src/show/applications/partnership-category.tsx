import {
  ShowExhibitorApplicationOtherPartnershipCategory,
  ShowPartnershipCategory,
} from "@prisma/client";

export const PARTNERSHIP_CATEGORY_TRANSLATION: Record<
  ShowPartnershipCategory,
  string
> = {
  [ShowPartnershipCategory.BRONZE]: "Patte de bronze",
  [ShowPartnershipCategory.SILVER]: "Patte d’argent",
  [ShowPartnershipCategory.GOLD]: "Patte d’or",
};

export const EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORY_TRANSLATION: Record<
  ShowExhibitorApplicationOtherPartnershipCategory,
  string
> = {
  [ShowExhibitorApplicationOtherPartnershipCategory.MAYBE]:
    "J’aimerais étudier un peu plus la question",
  [ShowExhibitorApplicationOtherPartnershipCategory.NO_PARTNERSHIP]:
    "Malheureusement ce n’est pas possible",
};
