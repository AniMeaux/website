import { ActivityField } from "#i/show/exhibitors/activity-field/activity-field";
import { LegalStatus } from "#i/show/exhibitors/applications/legal-status";
import { ShowExhibitorCategory } from "@animeaux/prisma";

export namespace ExhibitorCategory {
  export type Enum = ShowExhibitorCategory;
  export const Enum = ShowExhibitorCategory;

  export const values = [Enum.ASSOCIATION, Enum.SERVICE, Enum.SHOP];

  export const translation: Record<Enum, string> = {
    [Enum.ASSOCIATION]: "Association",
    [Enum.SERVICE]: "Prestataire de service",
    [Enum.SHOP]: "Boutique",
  };

  export function get({
    legalStatus,
    activityFields,
  }: {
    legalStatus: LegalStatus.Enum;
    activityFields: ActivityField.Enum[];
  }) {
    if (
      legalStatus === LegalStatus.Enum.ASSOCIATION ||
      activityFields.includes(ActivityField.Enum.ASSOCIATION)
    ) {
      return Enum.ASSOCIATION;
    }

    const hasServiceActivityField = activityFields.some((activityField) =>
      serviceActivityFields.includes(activityField),
    );

    if (hasServiceActivityField) {
      return Enum.SERVICE;
    }

    return Enum.SHOP;
  }

  const serviceActivityFields = [
    ActivityField.Enum.ALTERNATIVE_MEDICINE,
    ActivityField.Enum.BEHAVIOR,
    ActivityField.Enum.CITY,
    ActivityField.Enum.EDUCATION,
    ActivityField.Enum.SENSITIZATION,
    ActivityField.Enum.SERVICES,
    ActivityField.Enum.TRAINING,
  ];
}
