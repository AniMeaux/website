import { Gender, ScreeningResult } from "@prisma/client";
import { IconProps } from "~/generated/icon";

export const SCREENING_RESULT_ICON: Record<
  Exclude<ScreeningResult, "UNKNOWN">,
  IconProps["id"]
> = {
  [ScreeningResult.NEGATIVE]: "virusSlash",
  [ScreeningResult.POSITIVE]: "virus",
};

export const SCREENING_RESULT_TRANSLATION: Record<
  Exclude<ScreeningResult, "UNKNOWN">,
  Record<Gender, string>
> = {
  [ScreeningResult.NEGATIVE]: {
    [Gender.FEMALE]: "négative",
    [Gender.MALE]: "négatif",
  },
  [ScreeningResult.POSITIVE]: {
    [Gender.FEMALE]: "positive",
    [Gender.MALE]: "positif",
  },
};
