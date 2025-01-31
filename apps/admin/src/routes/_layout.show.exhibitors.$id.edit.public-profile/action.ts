import { ActivityField } from "#show/exhibitors/activity-field/activity-field";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target";
import { ProfileStatus } from "#show/exhibitors/profile/status";
import {
  IMAGE_SIZE_LIMIT_B,
  IMAGE_SIZE_LIMIT_MB,
} from "@animeaux/cloudinary/client";
import { simpleUrl, zu } from "@animeaux/zod-utils";

export const ActionSchema = zu
  .object({
    activityTargets: zu.repeatable(
      zu
        .array(zu.nativeEnum(ActivityTarget.Enum))
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

    logo: zu
      .instanceof(File, { message: "Veuillez choisir un logo" })
      .refine(
        (file) => file.size <= IMAGE_SIZE_LIMIT_B,
        `Le logo doit faire moins de ${IMAGE_SIZE_LIMIT_MB} MB`,
      )
      .optional(),

    status: zu.nativeEnum(ProfileStatus.Enum),

    statusMessage: zu.string().trim().optional(),
  })
  .refine(
    (value) =>
      value.status !== ProfileStatus.Enum.TO_MODIFY ||
      value.statusMessage != null,
    {
      message: "Veuillez entrer un message",
      path: ["statusMessage"],
    },
  );
