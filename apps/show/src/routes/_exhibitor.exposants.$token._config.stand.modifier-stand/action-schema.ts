import { zu } from "@animeaux/zod-utils";
import type { ShowStandSize } from "@prisma/client";
import {
  ShowDividerType,
  ShowInstallationDay,
  ShowStandZone,
} from "@prisma/client";

export function createActionSchema(
  availableStandSizes: Pick<
    ShowStandSize,
    "id" | "maxDividerCount" | "maxPeopleCount" | "maxTableCount"
  >[],
) {
  return (
    zu
      .object({
        chairCount: zu.coerce
          .number({
            message: "Veuillez entrer un nombre valide",
          })
          .int({ message: "Veuillez entrer un nombre entier" })
          .min(1, "Veuillez entrer un nombre supérieur ou égal à 1"),
        dividerCount: zu.coerce
          .number({
            message: "Veuillez entrer un nombre valide",
          })
          .int({ message: "Veuillez entrer un nombre entier" })
          .min(0, "Veuillez entrer un nombre positif"),
        dividerType: zu.nativeEnum(ShowDividerType, {
          required_error: "Veuillez choisir un type de cloisons",
        }),
        hasElectricalConnection: zu
          .enum(["on", "off"], {
            required_error: "Veuillez choisir une option",
          })
          .transform((value) => value === "on"),
        hasTablecloths: zu
          .enum(["on", "off"], {
            required_error: "Veuillez choisir une option",
          })
          .transform((value) => value === "on"),
        installationDay: zu.nativeEnum(ShowInstallationDay, {
          required_error: "Veuillez choisir un jour d’installation",
        }),
        peopleCount: zu.coerce
          .number({
            message: "Veuillez entrer un nombre valide",
          })
          .int({ message: "Veuillez entrer un nombre entier" })
          .min(1, "Veuillez entrer un nombre supérieur ou égal à 1"),
        placementComment: zu
          .string()
          .trim()
          .max(256, "Veuillez entrer un commentaire plus court")
          .optional(),
        standSize: zu
          .string({ required_error: "Veuillez choisir une taille de stand" })
          .uuid()
          .transform((value, context) => {
            const standSize = availableStandSizes.find(
              (standSize) => standSize.id === value,
            );

            if (standSize == null) {
              context.addIssue({
                code: zu.ZodIssueCode.custom,
                message: "Veuillez choisir une taille de stand",
              });

              return zu.NEVER;
            }

            return standSize;
          }),
        tableCount: zu.coerce
          .number({
            message: "Veuillez entrer un nombre valide",
          })
          .int({ message: "Veuillez entrer un nombre entier" })
          .min(0, "Veuillez entrer un nombre positif"),
        zone: zu.nativeEnum(ShowStandZone, {
          required_error: "Veuillez choisir un emplacement",
        }),
      })
      .refine(
        (value) => value.dividerCount <= value.standSize.maxDividerCount,
        (value) => ({
          message: `Veuillez entrer un nombre inférieur à ${value.standSize.maxDividerCount}`,
          path: ["dividerCount"],
        }),
      )
      .refine(
        (value) => value.peopleCount <= value.standSize.maxPeopleCount,
        (value) => ({
          message: `Veuillez entrer un nombre inférieur à ${value.standSize.maxPeopleCount}`,
          path: ["peopleCount"],
        }),
      )
      .refine(
        (value) => value.tableCount <= value.standSize.maxTableCount,
        (value) => ({
          message: `Veuillez entrer un nombre inférieur à ${value.standSize.maxTableCount}`,
          path: ["tableCount"],
        }),
      )
      // Use `Math.min(value.peopleCount, value.standSize.maxPeopleCount)` to
      // ensure that `chairCount` is never greater than a valid `peopleCount`.
      .refine(
        (value) =>
          value.chairCount <=
          Math.min(value.peopleCount, value.standSize.maxPeopleCount),
        (value) => ({
          message: `Veuillez entrer un nombre inférieur à ${Math.min(value.peopleCount, value.standSize.maxPeopleCount)}`,
          path: ["chairCount"],
        }),
      )
  );
}
