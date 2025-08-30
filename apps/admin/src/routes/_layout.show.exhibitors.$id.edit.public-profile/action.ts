import { ActivityField } from "#show/exhibitors/activity-field/activity-field";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target";
import { ExhibitorStatus } from "#show/exhibitors/status";
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
        .min(1, "Veuillez choisir un domaine d’activité")
        .max(
          ActivityField.MAX_COUNT,
          `Veuillez choisir au plus ${ActivityField.MAX_COUNT} domaines d’activité`,
        ),
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
