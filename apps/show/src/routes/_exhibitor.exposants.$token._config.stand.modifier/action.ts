import { MAX_DIVIDER_COUNT_BY_STAND_SIZE } from "#exhibitors/stand-size/divider-count";
import { MAX_PEOPLE_COUNT_BY_STAND_SIZE } from "#exhibitors/stand-size/people-count";
import { MAX_TABLE_COUNT_BY_STAND_SIZE } from "#exhibitors/stand-size/table-count";
import { zu } from "@animeaux/zod-utils";
import {
  Gender,
  ShowExhibitorStandConfigurationDividerType,
  ShowExhibitorStandConfigurationInstallationDay,
  ShowStandSize,
  ShowStandZone,
} from "@prisma/client";

export const ActionSchema = zu
  .object({
    chairCount: zu.coerce
      .number({
        message: "Veuillez entrer un nombre valide",
      })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre positif"),
    dividerCount: zu.coerce
      .number({
        message: "Veuillez entrer un nombre valide",
      })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre positif"),
    dividerType: zu.nativeEnum(ShowExhibitorStandConfigurationDividerType, {
      required_error: "Veuillez choisir un type de cloisons",
    }),
    hasTablecloths: zu.boolean().default(false),
    installationDay: zu.nativeEnum(
      ShowExhibitorStandConfigurationInstallationDay,
      { required_error: "Veuillez choisir un jour d’installation" },
    ),
    peopleCount: zu.coerce
      .number({
        message: "Veuillez entrer un nombre valide",
      })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre positif"),
    placementComment: zu
      .string()
      .trim()
      .max(256, "Veuillez entrer un commentaire plus court")
      .optional(),
    size: zu.nativeEnum(ShowStandSize, {
      required_error: "Veuillez choisir une taille de stand",
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
    presentDogs: zu.array(
      zu.object({
        gender: zu.nativeEnum(Gender, {
          required_error: "Veuillez choisir un genre",
        }),
        idNumber: zu
          .string({
            required_error: "Veuillez entrer un numéro d’identification",
          })
          .trim()
          .min(1, "Veuillez entrer un numéro d’identification")
          .max(64, "Veuillez entrer un numéro d’identification plus court"),
        isCategorized: zu
          .enum(["on", "off"], {
            required_error: "Veuillez choisir une option",
          })
          .transform((value) => value === "on"),
        isSterilized: zu
          .enum(["on", "off"], {
            required_error: "Veuillez choisir une option",
          })
          .transform((value) => value === "on"),
      }),
    ),
  })
  .refine(
    (value) => value.chairCount <= value.peopleCount,
    (value) => ({
      message: `Veuillez entrer un nombre inférieur à ${value.peopleCount}`,
      path: ["chairCount"],
    }),
  )
  .refine(
    (value) =>
      value.dividerCount <= MAX_DIVIDER_COUNT_BY_STAND_SIZE[value.size],
    (value) => ({
      message: `Veuillez entrer un nombre inférieur à ${MAX_DIVIDER_COUNT_BY_STAND_SIZE[value.size]}`,
      path: ["dividerCount"],
    }),
  )
  .refine(
    (value) => value.peopleCount <= MAX_PEOPLE_COUNT_BY_STAND_SIZE[value.size],
    (value) => ({
      message: `Veuillez entrer un nombre inférieur à ${MAX_PEOPLE_COUNT_BY_STAND_SIZE[value.size]}`,
      path: ["peopleCount"],
    }),
  )
  .refine(
    (value) => value.tableCount <= MAX_TABLE_COUNT_BY_STAND_SIZE[value.size],
    (value) => ({
      message: `Veuillez entrer un nombre inférieur à ${MAX_TABLE_COUNT_BY_STAND_SIZE[value.size]}`,
      path: ["tableCount"],
    }),
  );
