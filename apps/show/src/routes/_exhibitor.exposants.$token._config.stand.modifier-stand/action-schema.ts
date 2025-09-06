import type { DividerTypeAvailability } from "#divider-type/availability.js";
import { zu } from "@animeaux/zod-utils";
import type { ShowDividerType, ShowStandSize } from "@prisma/client";
import { ShowInstallationDay } from "@prisma/client";
import invariant from "tiny-invariant";

export const DividerType = {
  none: "none",
} as const;

export function createActionSchema({
  availableDividerTypes,
  availableStandSizes,
}: {
  availableDividerTypes: (Pick<ShowDividerType, "id"> &
    DividerTypeAvailability)[];
  availableStandSizes: Pick<
    ShowStandSize,
    "id" | "maxDividerCount" | "maxPeopleCount" | "maxTableCount"
  >[];
}) {
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
          .number({ message: "Veuillez entrer un nombre valide" })
          .int({ message: "Veuillez entrer un nombre entier" })
          .min(1, "Veuillez entrer un nombre supérieur ou égal à 1")
          .optional(),
        dividerType: zu.union([
          zu.literal(DividerType.none).transform(() => null),
          zu
            .string()
            .uuid()
            .transform((value, context) => {
              const dividerType = availableDividerTypes.find(
                (dividerType) => dividerType.id === value,
              );

              if (dividerType == null) {
                context.addIssue({
                  code: zu.ZodIssueCode.custom,
                  message: "Veuillez choisir un type de cloisons",
                });

                return zu.NEVER;
              }

              return dividerType;
            }),
        ]),
        hasElectricalConnection: zu
          .enum(["on", "off"], {
            required_error: "Veuillez choisir une option",
          })
          .transform((value) => value === "on"),
        hasTableCloths: zu
          .enum(["on", "off"])
          .transform((value) => value === "on")
          .optional(),
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
      })
      .refine(
        (value) => value.dividerType == null || value.dividerCount != null,
        () => ({
          message: "Veuillez entrer un nombre de cloisons",
          path: ["dividerCount"],
        }),
      )
      .refine(
        (value) =>
          value.dividerType == null ||
          value.dividerCount == null ||
          value.dividerCount <=
            Math.min(
              value.dividerType.availableCount,
              value.standSize.maxDividerCount,
            ),
        (value) => {
          invariant(
            value.dividerType != null,
            "`dividerType` should be defined",
          );

          return {
            message: `Veuillez entrer un nombre inférieur à ${Math.min(
              value.dividerType.availableCount,
              value.standSize.maxDividerCount,
            )}`,
            path: ["dividerCount"],
          };
        },
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
      // Use `Math.min(...)` to ensure that `chairCount` is never greater than
      // a valid `peopleCount`.
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
