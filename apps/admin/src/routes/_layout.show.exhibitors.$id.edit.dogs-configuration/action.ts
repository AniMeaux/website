import { DogsConfigurationStatus } from "#show/exhibitors/dogs-configuration/status.js";
import { zu } from "@animeaux/zod-utils";

export const ActionSchema = zu
  .object({
    status: zu.nativeEnum(DogsConfigurationStatus.Enum),

    statusMessage: zu.string().trim().optional(),
  })
  .refine(
    (value) =>
      value.status !== DogsConfigurationStatus.Enum.TO_MODIFY ||
      value.statusMessage != null,
    {
      message: "Veuillez entrer un message",
      path: ["statusMessage"],
    },
  );
