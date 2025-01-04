import { ShowExhibitorStandConfigurationInstallationDay } from "@prisma/client";

export const INSTALLATION_DAY_TRANSLATION: Record<
  ShowExhibitorStandConfigurationInstallationDay,
  string
> = {
  [ShowExhibitorStandConfigurationInstallationDay.FRIDAY]:
    "Vendredi à partir de 15h",
  [ShowExhibitorStandConfigurationInstallationDay.SATURDAY]:
    "Samedi à partir de 8h",
};

export const SORTED_INSTALLATION_DAYS = [
  ShowExhibitorStandConfigurationInstallationDay.FRIDAY,
  ShowExhibitorStandConfigurationInstallationDay.SATURDAY,
];
