import { FosterFamilyAvailability as PrismaFosterFamilyAvailability } from "@prisma/client";

export namespace FosterFamilyAvailability {
  export const Enum = PrismaFosterFamilyAvailability;
  export type Enum = PrismaFosterFamilyAvailability;

  export const translation: Record<Enum, string> = {
    [Enum.AVAILABLE]: "Disponible",
    [Enum.UNAVAILABLE]: "Indisponible",
    [Enum.UNKNOWN]: "Inconnue",
  };

  export const values = [Enum.UNKNOWN, Enum.AVAILABLE, Enum.UNAVAILABLE];
}
