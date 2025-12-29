import type { IconName } from "#generated/icon.js";
import { ActivityResource as PrismaActivityResource } from "@animeaux/prisma";

export namespace ActivityResource {
  export const Enum = PrismaActivityResource;
  export type Enum = PrismaActivityResource;

  export const values = Object.values(PrismaActivityResource);

  export const translations: Record<Enum, string> = {
    [Enum.ANIMAL]: "Animal",
    [Enum.FOSTER_FAMILY]: "Famille d’accueil",
  };

  export const icon: Record<Enum, IconName> = {
    [Enum.ANIMAL]: "icon-paw-solid",
    [Enum.FOSTER_FAMILY]: "icon-house-solid",
  };
}
