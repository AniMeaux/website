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

export const PARTNERSHIP_CATEGORY_DESCRIPTION: Record<
  ShowPartnershipCategory,
  string
> = {
  [ShowPartnershipCategory.BRONZE]: `À partir de 200 € de don :
- Visibilité digitale (réseaux sociaux, site internet)`,
  [ShowPartnershipCategory.SILVER]: `À partir de 500 € de don :
- Visibilité digitale (réseaux sociaux, site internet)
- Visibilité imprimée (flyer, affiche)
- Stand offert
- Flyer dans les gift bags`,
  [ShowPartnershipCategory.GOLD]: `À partir de 1 000 € de don :
- Visibilité digitale (réseaux sociaux, site internet)
- Visibilité imprimée (flyer, affiche)
- Stand offert
- Flyer dans les gift bags
- Visibilité sur les supports de l’association Ani’Meaux pendant 1 an`,
};

export const SORTED_PARTNERSHIP_CATEGORIES = [
  ShowPartnershipCategory.BRONZE,
  ShowPartnershipCategory.SILVER,
  ShowPartnershipCategory.GOLD,
];

export const EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORY_TRANSLATION: Record<
  ShowExhibitorApplicationOtherPartnershipCategory,
  string
> = {
  [ShowExhibitorApplicationOtherPartnershipCategory.MAYBE]:
    "J’aimerais étudier un peu plus la question",
  [ShowExhibitorApplicationOtherPartnershipCategory.NO_PARTNERSHIP]:
    "Malheureusement ce n’est pas possible",
};

export const SORTED_EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORIES = [
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
