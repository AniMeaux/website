import { ShowSponsorshipCategory } from "@animeaux/prisma/client";

export namespace SponsorshipCategory {
  export const Enum = {
    ...ShowSponsorshipCategory,
    NO_SPONSORSHIP: "NO_SPONSORSHIP",
  } as const;

  export type Enum = (typeof Enum)[keyof typeof Enum];

  export const translation: Record<Enum, string> = {
    [Enum.POLLEN]: "Pollen",
    [Enum.BRONZE]: "Pott de bronze",
    [Enum.SILVER]: "Pott d’argent",
    [Enum.GOLD]: "Pott d’or",
    [Enum.NO_SPONSORSHIP]: "Malheureusement ce n’est pas possible",
  };

  export const values = [
    Enum.POLLEN,
    Enum.BRONZE,
    Enum.SILVER,
    Enum.GOLD,
    Enum.NO_SPONSORSHIP,
  ];

  export function toDb(category: Enum): undefined | ShowSponsorshipCategory {
    return category === Enum.NO_SPONSORSHIP ? undefined : category;
  }

  export function fromDb(category: null | ShowSponsorshipCategory): Enum {
    return category == null ? Enum.NO_SPONSORSHIP : category;
  }
}
