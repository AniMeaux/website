import { services } from "#core/services.server.js";
import { ActivityField } from "#exhibitors/activity-field/activity-field.js";
import type { Prisma } from "@prisma/client";

export async function getStandSizesData(
  exhibitor: Prisma.ShowExhibitorGetPayload<{
    select: { activityFields: true; size: { select: { id: true } } };
  }>,
) {
  const allStandSizes = await services.standSize.getManyVisible({
    select: {
      id: true,
      isRestrictedByActivityField: true,
      label: true,
      maxDividerCount: true,
      maxPeopleCount: true,
      maxTableCount: true,
    },
  });

  let standSizes = ActivityField.hasLimitedStandSizes(exhibitor.activityFields)
    ? allStandSizes.filter(
        (standSize) => !standSize.isRestrictedByActivityField,
      )
    : allStandSizes;

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
