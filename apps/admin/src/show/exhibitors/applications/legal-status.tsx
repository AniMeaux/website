import { ShowExhibitorApplicationLegalStatus } from "@animeaux/prisma";
import invariant from "tiny-invariant";

export namespace LegalStatus {
  export const Enum = ShowExhibitorApplicationLegalStatus;
  export type Enum = ShowExhibitorApplicationLegalStatus;

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

  const translation: Record<Exclude<Enum, typeof Enum.OTHER>, string> = {
    [Enum.ASSOCIATION]: "Association",
    [Enum.COMPANY]: "Société",
    [Enum.SOLE_PROPRIETORSHIP]: "Entreprise individuelle",
  };
}
