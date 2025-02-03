import { ShowExhibitorApplicationLegalStatus } from "@prisma/client";
import invariant from "tiny-invariant";

export namespace LegalStatus {
  export const Enum = ShowExhibitorApplicationLegalStatus;
  export type Enum = ShowExhibitorApplicationLegalStatus;

  export const translation: Record<Enum, string> = {
    [Enum.ASSOCIATION]: "Association",
    [Enum.COMPANY]: "Société",
    [Enum.SOLE_PROPRIETORSHIP]: "Entreprise individuelle",
  };

  export function getVisibleLegalStatus(structure: {
    legalStatus?: null | Enum;
    otherLegalStatus?: null | string;
  }) {
    if (structure.legalStatus != null) {
      return translation[structure.legalStatus];
    }

    invariant(
      structure.otherLegalStatus != null,
      "An other legal status should be defined",
    );

    return structure.otherLegalStatus;
  }
}
