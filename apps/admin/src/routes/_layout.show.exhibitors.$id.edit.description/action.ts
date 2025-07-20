import { ExhibitorStatus } from "#show/exhibitors/status";
import { normalizeLineBreaks, zu } from "@animeaux/zod-utils";

export const ActionSchema = zu
  .object({
    description: zu.preprocess(
      normalizeLineBreaks,
      zu
        .string({ required_error: "Veuillez entrer une description" })
        .trim()
        .min(1, "Veuillez entrer une description")
        .max(512, "Veuillez entrer une description plus courte"),
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
