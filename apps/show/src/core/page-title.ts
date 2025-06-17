import { ensureArray } from "@animeaux/core";

export const pageDescription =
  "5ème édition du salon dédié au bien-être animal à Meaux.";

export function getPageTitle(title: string | string[] = []) {
  return ensureArray(title).concat(["Salon des Ani’Meaux"]).join(" • ");
}
