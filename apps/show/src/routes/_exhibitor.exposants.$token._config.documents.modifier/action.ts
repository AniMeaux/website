import {
  FILE_SIZE_LIMIT_B,
  FILE_SIZE_LIMIT_MB,
} from "@animeaux/google-client/client";
import { zu } from "@animeaux/zod-utils";

const fileSchema = zu
  .instanceof(File, { message: "Veuillez choisir un fichier" })
  .refine(
    (file) => file.size <= FILE_SIZE_LIMIT_B,
    `Le fichier doit faire moins de ${FILE_SIZE_LIMIT_MB} MB`,
  );

export const ActionSchema = zu
  .object({
    identificationFileCurrentId: zu.string().optional(),
    identificationFile: fileSchema.optional(),

    insuranceFileCurrentId: zu.string().optional(),
    insuranceFile: fileSchema.optional(),

    kbisFileCurrentId: zu.string().optional(),
    kbisFile: fileSchema.optional(),
  })
  .refine(
    (value) =>
      value.identificationFileCurrentId != null ||
      value.identificationFile != null,
    {
      message: "Veuillez choisir un fichier",
      path: ["identificationFile"],
    },
  )
  .refine(
    (value) =>
      value.insuranceFileCurrentId != null || value.insuranceFile != null,
    {
      message: "Veuillez choisir un fichier",
      path: ["insuranceFile"],
    },
  )
  .refine(
    (value) => value.kbisFileCurrentId != null || value.kbisFile != null,
    {
      message: "Veuillez choisir un fichier",
      path: ["kbisFile"],
    },
  );
