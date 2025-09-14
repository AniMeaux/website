import { ActivityField } from "#exhibitors/activity-field/activity-field.js";
import { LegalStatus } from "#exhibitors/application/legal-status.js";
import type { Prisma } from "@prisma/client";

export namespace StandPrice {
  export function getPrice({
    exhibitor,
    application,
    standSize,
  }: {
    exhibitor: Prisma.ShowExhibitorGetPayload<{
      select: { activityFields: true };
    }>;
    standSize: Prisma.ShowStandSizeGetPayload<{
      select: {
        priceForAssociations: true;
        priceForServices: true;
        priceForShops: true;
      };
    }>;
    application: Prisma.ShowExhibitorApplicationGetPayload<{
      select: { structureLegalStatus: true };
    }>;
  }) {
    if (
      application.structureLegalStatus === LegalStatus.Enum.ASSOCIATION &&
      standSize.priceForAssociations != null
    ) {
      return standSize.priceForAssociations;
    }

    if (
      ActivityField.hasLimitedStandSizes(exhibitor.activityFields) &&
      standSize.priceForServices != null
    ) {
      return standSize.priceForServices;
    }

    return standSize.priceForShops;
  }

  export function format(price: number) {
    return price.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  }
}
