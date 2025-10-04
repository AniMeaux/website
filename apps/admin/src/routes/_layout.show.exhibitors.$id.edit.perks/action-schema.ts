import { ExhibitorStatus } from "#show/exhibitors/status";
import { zu } from "@animeaux/zod-utils";

export const ActionSchema = zu
  .object({
    appetizerPeopleCount: zu.coerce
      .number({ message: "Veuillez entrer un nombre valide" })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre supérieur positif"),

    breakfastPeopleCountSaturday: zu.coerce
      .number({ message: "Veuillez entrer un nombre valide" })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre supérieur positif"),

    breakfastPeopleCountSunday: zu.coerce
      .number({ message: "Veuillez entrer un nombre valide" })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre supérieur positif"),

    status: zu.nativeEnum(ExhibitorStatus.Enum),

    statusMessage: zu.string().trim().optional(),
  })
  .refine(
    (value) =>
      value.status !== ExhibitorStatus.Enum.TO_MODIFY ||
      value.statusMessage != null,
    {
      message: "Veuillez entrer un message",
      path: ["statusMessage"],
    },
  );
