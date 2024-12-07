import { ShowExhibitorApplicationLegalStatus } from "@prisma/client";

export const LEGAL_STATUS_TRANSLATION: Record<
  ShowExhibitorApplicationLegalStatus,
  string
> = {
  [ShowExhibitorApplicationLegalStatus.ASSOCIATION]: "Association",
  [ShowExhibitorApplicationLegalStatus.COMPANY]: "Société (SA, SAS, SARL…)",
  [ShowExhibitorApplicationLegalStatus.SOLE_PROPRIETORSHIP]:
    "Entreprise individuelle",
};
