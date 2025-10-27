import { ShowExhibitorApplicationLegalStatus } from "@animeaux/prisma/client";
import invariant from "tiny-invariant";

export namespace LegalStatus {
  export const Enum = ShowExhibitorApplicationLegalStatus;
  export type Enum = ShowExhibitorApplicationLegalStatus;

  export const values = [
    Enum.ASSOCIATION,
    Enum.SOLE_PROPRIETORSHIP,
    Enum.COMPANY,
    Enum.OTHER,
  ];

  export const translation: Record<Enum, string> = {
    [Enum.ASSOCIATION]: "Association",
    [Enum.COMPANY]: "Société (SA, SAS, SARL…)",
    [Enum.SOLE_PROPRIETORSHIP]: "Entreprise individuelle",
    [Enum.OTHER]: "Autre",
  };

  export function getVisibleValue(application: {
    legalStatus: Enum;
    legalStatusOther?: null | string;
  }) {
    if (application.legalStatus != Enum.OTHER) {
      return translation[application.legalStatus];
    }

    invariant(
      application.legalStatusOther != null,
      "An other legal status should be defined",
    );

    return application.legalStatusOther;
  }
}
