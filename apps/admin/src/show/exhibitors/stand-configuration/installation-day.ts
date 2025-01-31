import { ShowExhibitorStandConfigurationInstallationDay } from "@prisma/client";

export namespace InstallationDay {
  export const Enum = ShowExhibitorStandConfigurationInstallationDay;
  export type Enum = ShowExhibitorStandConfigurationInstallationDay;

  export const translation: Record<Enum, string> = {
    [Enum.FRIDAY]: "Vendredi à partir de 15h",
    [Enum.SATURDAY]: "Samedi à partir de 8h",
  };

  export const values = [Enum.FRIDAY, Enum.SATURDAY];
}
