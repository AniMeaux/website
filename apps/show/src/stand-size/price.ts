import { ExhibitorCategory } from "#exhibitors/category.js";
import type { Prisma } from "@animeaux/prisma";

export namespace StandSizePrice {
  export function getPrice({
    standSize,
    category,
  }: {
    standSize: Prisma.ShowStandSizeGetPayload<{
      select: {
        priceForAssociations: true;
        priceForServices: true;
        priceForShops: true;
      };
    }>;
    category: ExhibitorCategory.Enum;
  }) {
    switch (category) {
      case ExhibitorCategory.Enum.ASSOCIATION: {
        return standSize.priceForAssociations;
      }

      case ExhibitorCategory.Enum.SERVICE: {
        return standSize.priceForServices;
      }

      case ExhibitorCategory.Enum.SHOP: {
        return standSize.priceForShops;
      }

      default: {
        return category satisfies never;
      }
    }
  }
}
