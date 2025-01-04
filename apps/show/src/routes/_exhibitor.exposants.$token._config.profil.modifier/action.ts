import {
  IMAGE_SIZE_LIMIT_B,
  IMAGE_SIZE_LIMIT_MB,
} from "@animeaux/cloudinary/client";
import { zu } from "@animeaux/zod-utils";
import { ShowActivityField, ShowActivityTarget } from "@prisma/client";

export const ActionSchema = zu.object({
  logo: zu
    .instanceof(File, { message: "Veuillez choisir un logo" })
    .refine(
      (file) => file.size <= IMAGE_SIZE_LIMIT_B,
      `Le logo doit faire moins de ${IMAGE_SIZE_LIMIT_MB} MB`,
    )
    .optional(),
  activityTargets: zu.repeatable(
    zu
      .array(zu.nativeEnum(ShowActivityTarget))
      .min(1, "Veuillez choisir une cible"),
  ),
  activityFields: zu.repeatable(
    zu
      .array(zu.nativeEnum(ShowActivityField))
      .min(1, "Veuillez choisir un domaine d’activité"),
  ),
  links: zu.repeatable(
    zu
      .array(
        zu
          .string({ required_error: "Veuillez entrer une URL" })
          .trim()
          .url("Veuillez entrer une URL valide")
          .max(128, "Veuillez entrer une URL plus courte"),
      )
      .min(1, "Veuillez entrer une URL"),
  ),
  description: zu
    .string()
    .trim()
    .max(256, "Veuillez entrer une description plus courte")
    .optional(),
});
