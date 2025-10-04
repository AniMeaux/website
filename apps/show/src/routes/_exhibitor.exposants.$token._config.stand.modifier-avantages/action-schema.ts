import { zu } from "@animeaux/zod-utils";

export function createActionSchema({ peopleCount }: { peopleCount: number }) {
  return zu.object({
    appetizerPeopleCount: zu.coerce
      .number({ message: "Veuillez entrer un nombre valide" })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre supérieur positif")
      .max(peopleCount, `Veuillez entrer un nombre inférieur à ${peopleCount}`),

    breakfastPeopleCountSaturday: zu.coerce
      .number({ message: "Veuillez entrer un nombre valide" })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre supérieur positif")
      .max(peopleCount, `Veuillez entrer un nombre inférieur à ${peopleCount}`),

    breakfastPeopleCountSunday: zu.coerce
      .number({ message: "Veuillez entrer un nombre valide" })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre supérieur positif")
      .max(peopleCount, `Veuillez entrer un nombre inférieur à ${peopleCount}`),
  });
}
