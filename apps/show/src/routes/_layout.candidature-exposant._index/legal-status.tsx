import { ShowExhibitorApplicationLegalStatus } from "@prisma/client";
import orderBy from "lodash.orderby";

export const OTHER_SHOW_LEGAL_STATUS = "OTHER";

export const LEGAL_STATUS_TRANSLATION: Record<
  ShowExhibitorApplicationLegalStatus | typeof OTHER_SHOW_LEGAL_STATUS,
  string
> = {
  [ShowExhibitorApplicationLegalStatus.ASSOCIATION]: "Association",
  [ShowExhibitorApplicationLegalStatus.COMPANY]: "Société (SA, SAS, SARL…)",
  [ShowExhibitorApplicationLegalStatus.SOLE_PROPRIETORSHIP]:
    "Entreprise individuelle",
  [OTHER_SHOW_LEGAL_STATUS]: "Autre",
};

export const SORTED_LEGAL_STATUS = orderBy(
  Object.values(ShowExhibitorApplicationLegalStatus),
  (status) => LEGAL_STATUS_TRANSLATION[status],
);
