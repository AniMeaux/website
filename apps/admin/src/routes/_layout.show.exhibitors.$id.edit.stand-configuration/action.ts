import { OnOff } from "#core/form-elements/field-on-off";
import { InstallationDay } from "#show/exhibitors/stand-configuration/installation-day";
import { ExhibitorStatus } from "#show/exhibitors/status";
import { zu } from "@animeaux/zod-utils";

export const DividerType = {
  none: "none",
} as const;

export const ActionSchema = zu
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
      .min(1, "Veuillez entrer un nombre supérieur ou égal à 1")
      .optional(),

    dividerType: zu.union([
      zu.literal(DividerType.none).transform(() => null),
      zu.string().uuid(),
    ]),

    hasElectricalConnection: zu
      .nativeEnum(OnOff.Enum, {
        required_error: "Veuillez choisir une option",
      })
      .transform(OnOff.toBoolean),

    hasTablecloths: zu
      .nativeEnum(OnOff.Enum, {
        required_error: "Veuillez choisir une option",
      })
      .transform(OnOff.toBoolean),

    installationDay: zu.nativeEnum(InstallationDay.Enum).optional(),

    peopleCount: zu.coerce
      .number({
        message: "Veuillez entrer un nombre valide",
      })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(1, "Veuillez entrer un nombre supérieur ou égal à 1"),

    sizeId: zu
      .string({ required_error: "Veuillez choisir une taille de stand" })
      .uuid(),

    status: zu.nativeEnum(ExhibitorStatus.Enum),

    statusMessage: zu.string().trim().optional(),

    tableCount: zu.coerce
      .number({
        message: "Veuillez entrer un nombre valide",
      })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre positif"),
  })
  .refine(
    (value) =>
      value.status !== ExhibitorStatus.Enum.VALIDATED ||
      value.installationDay != null,
    {
      message: "Veuillez choisir un jour d’installation",
      path: ["installationDay"],
    },
  )
  .refine(
    (value) =>
      value.status !== ExhibitorStatus.Enum.TO_MODIFY ||
      value.statusMessage != null,
    {
      message: "Veuillez entrer un message",
      path: ["statusMessage"],
    },
  );
