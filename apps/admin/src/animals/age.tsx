import type { IconName } from "#i/generated/icon";
import { AnimalAge } from "@animeaux/core";
import orderBy from "lodash.orderby";

export const SORTED_AGES = orderBy(Object.values(AnimalAge), (age) =>
  age === AnimalAge.JUNIOR ? 0 : age === AnimalAge.ADULT ? 1 : 2,
);

export const AGE_ICON: Record<AnimalAge, IconName> = {
  [AnimalAge.JUNIOR]: "icon-circle-progress-1-solid",
  [AnimalAge.ADULT]: "icon-circle-progress-2-solid",
  [AnimalAge.SENIOR]: "icon-circle-progress-3-solid",
};

export const AGE_TRANSLATION: Record<AnimalAge, string> = {
  [AnimalAge.JUNIOR]: "Junior",
  [AnimalAge.ADULT]: "Adulte",
  [AnimalAge.SENIOR]: "Sénior",
};
