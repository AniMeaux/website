import { DocumentsStatus } from "#show/exhibitors/documents/status";
import { zu } from "@animeaux/zod-utils";

export const ActionSchema = zu
  .object({
    status: zu.nativeEnum(DocumentsStatus.Enum),

    statusMessage: zu.string().trim().optional(),
  })
  .refine(
    (value) =>
      value.status !== DocumentsStatus.Enum.TO_MODIFY ||
      value.statusMessage != null,
    {
      message: "Veuillez entrer un message",
      path: ["statusMessage"],
    },
  );
