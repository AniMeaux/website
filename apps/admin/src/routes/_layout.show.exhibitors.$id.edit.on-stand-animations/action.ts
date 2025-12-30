import { ExhibitorStatus } from "#i/show/exhibitors/status";
import { normalizeLineBreaks, zu } from "@animeaux/zod-utils";

export const ActionSchema = zu
  .object({
    onStandAnimations: zu.preprocess(
      normalizeLineBreaks,
      zu
        .string()
        .trim()
        .max(256, "Veuillez entrer une description plus courte")
        .optional(),
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
