import { services } from "#i/core/services.server.js";
import { withAllowedCategories } from "#i/stand-size/allowed-categories.js";

export async function getStandSizesData() {
  const standSizes = await services.standSize.getManyVisible({
    select: {
      id: true,
      label: true,
      priceForAssociations: true,
      priceForServices: true,
      priceForShops: true,
    },
  });

  return standSizes.map(withAllowedCategories);
}
