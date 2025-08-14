import { ImageLimits } from "#core/image/limits.js";
import { ActivityField } from "#exhibitors/activity-field/activity-field.js";
import { simpleUrl, zu } from "@animeaux/zod-utils";
import { ShowActivityTarget } from "@prisma/client";

export const ActionSchema = zu.object({
  logo: zu
    .instanceof(File, { message: "Veuillez choisir un logo" })
    .refine(
      (file) => file.size <= ImageLimits.MAX_SIZE_B,
      `Le logo doit faire moins de ${ImageLimits.MAX_SIZE_MB} MB`,
    )
    .optional(),
  activityTargets: zu.repeatable(
    zu
      .array(zu.nativeEnum(ShowActivityTarget))
      .min(1, "Veuillez choisir une cible"),
  ),
  activityFields: zu.repeatable(
    zu
      .array(zu.nativeEnum(ActivityField.Enum))
      .min(1, "Veuillez choisir un domaine d’activité"),
  ),
  links: zu.repeatable(
    zu
      .array(
        zu
          .string({ required_error: "Veuillez entrer une URL" })
          .trim()
          .pipe(simpleUrl("Veuillez entrer une URL valide"))
          .pipe(zu.string().max(128, "Veuillez entrer une URL plus courte")),
      )
      .min(1, "Veuillez entrer une URL"),
  ),
});
