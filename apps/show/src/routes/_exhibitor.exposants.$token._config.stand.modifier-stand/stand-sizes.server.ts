import { services } from "#core/services.server.js";
import { withAllowedCategories } from "#stand-size/allowed-categories.js";
import type { Prisma } from "@prisma/client";

export async function getStandSizesData(
  exhibitor: Prisma.ShowExhibitorGetPayload<{
    select: {
      category: true;
      size: { select: { id: true } };
    };
  }>,
) {
  const allStandSizes = await services.standSize.getMany({
    select: {
      id: true,
      isVisible: true,
      label: true,
      maxDividerCount: true,
      maxPeopleCount: true,
      maxTableCount: true,
      priceForAssociations: true,
      priceForServices: true,
      priceForShops: true,
    },
  });

  let standSizes = allStandSizes
    .map(withAllowedCategories)
    .filter((standSize) => {
      // Display the selected stand size, even when it's a hidden one.
      if (standSize.id === exhibitor.size.id) {
        return true;
      }

      // Hide all other hidden stand sizes.
      if (!standSize.isVisible) {
        return false;
      }

      return standSize.allowedCategories.includes(exhibitor.category);
    });

  // Ensure the exhibitor's current stand size is available to let the user
  // select it back after a change.
  standSizes = standSizes.map((standSize) => {
    if (standSize.id === exhibitor.size.id && !standSize.isAvailable) {
      return { ...standSize, isAvailable: true };
    }

    return standSize;
  });

  return {
    standSizes,
    availableStandSizes: standSizes.filter(
      (standSize) => standSize.isAvailable,
    ),
  };
}
