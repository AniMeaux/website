import { ExhibitorCategory } from "#exhibitors/category.js";
import type { Prisma } from "@animeaux/prisma";

export type StandSizeAllowedCategories = {
  allowedCategories: ExhibitorCategory.Enum[];
};

export function withAllowedCategories<
  TStandSize extends Prisma.ShowStandSizeGetPayload<{
    select: {
      priceForAssociations: true;
      priceForServices: true;
      priceForShops: true;
    };
  }>,
>(standSize: TStandSize): TStandSize & StandSizeAllowedCategories {
  const allowedCategories: ExhibitorCategory.Enum[] = [];

  if (standSize.priceForAssociations != null) {
    allowedCategories.push(ExhibitorCategory.Enum.ASSOCIATION);
  }

  if (standSize.priceForServices != null) {
    allowedCategories.push(ExhibitorCategory.Enum.SERVICE);
  }

  if (standSize.priceForShops != null) {
    allowedCategories.push(ExhibitorCategory.Enum.SHOP);
  }

  return { ...standSize, allowedCategories };
}
