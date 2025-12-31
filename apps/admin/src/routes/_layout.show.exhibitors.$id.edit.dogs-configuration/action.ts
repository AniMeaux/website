import { ExhibitorStatus } from "#i/show/exhibitors/status";
import { zu } from "@animeaux/zod-utils";

export const ActionSchema = zu
  .object({
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
