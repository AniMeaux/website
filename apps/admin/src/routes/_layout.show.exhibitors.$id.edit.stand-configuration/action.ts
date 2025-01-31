import { OnOff } from "#core/form-elements/field-on-off";
import { DividerType } from "#show/exhibitors/stand-configuration/divider";
import { InstallationDay } from "#show/exhibitors/stand-configuration/installation-day";
import { StandSize } from "#show/exhibitors/stand-configuration/stand-size";
import { StandZone } from "#show/exhibitors/stand-configuration/stand-zone";
import { StandConfigurationStatus } from "#show/exhibitors/stand-configuration/status";
import { zu } from "@animeaux/zod-utils";

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

    dividerType: zu.nativeEnum(DividerType.Enum, {
      required_error: "Veuillez choisir un type de cloisons",
    }),

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

    installationDay: zu.nativeEnum(InstallationDay.Enum, {
      required_error: "Veuillez choisir un jour d’installation",
    }),

    peopleCount: zu.coerce
      .number({
        message: "Veuillez entrer un nombre valide",
      })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre positif"),

    size: zu.nativeEnum(StandSize.Enum, {
      required_error: "Veuillez choisir une taille de stand",
    }),

    status: zu.nativeEnum(StandConfigurationStatus.Enum),

    statusMessage: zu.string().trim().optional(),

    tableCount: zu.coerce
      .number({
        message: "Veuillez entrer un nombre valide",
      })
      .int({ message: "Veuillez entrer un nombre entier" })
      .min(0, "Veuillez entrer un nombre positif"),

    zone: zu.nativeEnum(StandZone.Enum, {
      required_error: "Veuillez choisir un emplacement",
    }),
  })
  .refine(
    (value) =>
      value.status !== StandConfigurationStatus.Enum.TO_MODIFY ||
      value.statusMessage != null,
    {
      message: "Veuillez entrer un message",
      path: ["statusMessage"],
    },
  );
