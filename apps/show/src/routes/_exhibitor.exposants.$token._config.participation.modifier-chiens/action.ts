import { Gender } from "@animeaux/prisma";
import { zu } from "@animeaux/zod-utils";

export const ActionSchema = zu.object({
  dogs: zu.array(
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

  // For some reason, without this, `isCategorized` and `isSterilized` are
  // typed as `string` and not `"on" | "off"`
  _useless: zu.string().optional(),
});
