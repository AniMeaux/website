import { IconProps } from "#generated/icon.tsx";
import { AnimalAge } from "@animeaux/core";
import orderBy from "lodash.orderby";

export const SORTED_AGES = orderBy(Object.values(AnimalAge), (age) =>
  age === AnimalAge.JUNIOR ? 0 : age === AnimalAge.ADULT ? 1 : 2
);

export const AGE_ICON: Record<AnimalAge, IconProps["id"]> = {
  [AnimalAge.JUNIOR]: "circleProgress1",
  [AnimalAge.ADULT]: "circleProgress2",
  [AnimalAge.SENIOR]: "circleProgress3",
};

export const AGE_TRANSLATION: Record<AnimalAge, string> = {
  [AnimalAge.JUNIOR]: "Junior",
  [AnimalAge.ADULT]: "Adulte",
  [AnimalAge.SENIOR]: "Sénior",
};
