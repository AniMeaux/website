import { ProfileStatus } from "#show/exhibitors/profile/status";
import { zu } from "@animeaux/zod-utils";

export const ActionSchema = zu
  .object({
    onStandAnimations: zu
      .string()
      .trim()
      .max(256, "Veuillez entrer une description plus courte")
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
