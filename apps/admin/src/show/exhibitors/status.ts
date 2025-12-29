import { ShowExhibitorStatus } from "@animeaux/prisma";

export namespace ExhibitorStatus {
  export const Enum = ShowExhibitorStatus;
  export type Enum = ShowExhibitorStatus;

  export const translation: Record<Enum, string> = {
    [Enum.AWAITING_VALIDATION]: "Non traité",
    [Enum.TO_BE_FILLED]: "Aucune modification",
    [Enum.TO_MODIFY]: "Modification demandée",
    [Enum.VALIDATED]: "Validé",
  };

  export const values = [
    Enum.TO_BE_FILLED,
    Enum.AWAITING_VALIDATION,
    Enum.TO_MODIFY,
    Enum.VALIDATED,
  ];
}
