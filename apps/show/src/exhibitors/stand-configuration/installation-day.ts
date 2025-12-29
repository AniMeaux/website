import { ShowInstallationDay } from "@animeaux/prisma";

export const INSTALLATION_DAY_TRANSLATION: Record<ShowInstallationDay, string> =
  {
    [ShowInstallationDay.FRIDAY]: "Vendredi à partir de 15h",
    [ShowInstallationDay.SATURDAY]: "Samedi à partir de 8h",
  };

export const SORTED_INSTALLATION_DAYS = [
  ShowInstallationDay.FRIDAY,
  ShowInstallationDay.SATURDAY,
];
