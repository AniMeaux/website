import type { IconName } from "#i/generated/icon.js";
import { ActivityAction as PrismaActivityAction } from "@animeaux/prisma";

export namespace ActivityAction {
  export const Enum = PrismaActivityAction;
  export type Enum = PrismaActivityAction;

  export const values = Object.values(Enum);

  export const translations: Record<Enum, string> = {
    [Enum.CREATE]: "Création",
    [Enum.DELETE]: "Suppression",
    [Enum.UPDATE]: "Modification",
  };

  export const icon: Record<Enum, IconName> = {
    [Enum.CREATE]: "icon-plus-solid",
    [Enum.DELETE]: "icon-trash-solid",
    [Enum.UPDATE]: "icon-pen-solid",
  };
}
