import { services } from "#core/services.server.js";
import type { Prisma } from "@animeaux/prisma/server";

export async function getDividerTypesData(
  exhibitor: Prisma.ShowExhibitorGetPayload<{
    select: { dividerType: { select: { id: true } }; dividerCount: true };
  }>,
) {
  let dividerTypes = await services.dividerType.getMany({
    select: { id: true, label: true },
  });

  // Ensure the exhibitor's selected dividers are available to let the user
  // select it back after a change.
  dividerTypes = dividerTypes.map((dividerType) => {
    if (dividerType.id === exhibitor.dividerType?.id) {
      return {
        ...dividerType,

        availableCount: dividerType.availableCount + exhibitor.dividerCount,
      };
    }

    return dividerType;
  });

  return {
    dividerTypes,

    availableDividerTypes: dividerTypes.filter(
      (dividerType) => dividerType.availableCount > 0,
    ),
  };
}
