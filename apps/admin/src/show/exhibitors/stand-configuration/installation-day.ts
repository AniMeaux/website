import { ShowInstallationDay } from "@prisma/client";

export namespace InstallationDay {
  export const Enum = ShowInstallationDay;
  export type Enum = ShowInstallationDay;

  export const translation: Record<Enum, string> = {
    [Enum.FRIDAY]: "Vendredi à partir de 15h",
    [Enum.SATURDAY]: "Samedi à partir de 8h",
  };

  export const values = [Enum.FRIDAY, Enum.SATURDAY];
}
