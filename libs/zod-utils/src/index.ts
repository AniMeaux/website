import type { z } from "zod";

export function getObjectSchemaKeys<TSchema extends z.ZodObject<any>>(
  schema: TSchema,
) {
  const keys = Object.fromEntries(
    Object.keys(schema.shape).map((key) => [key, key]),
  );

  return keys as ObjectSchemaKeys<TSchema>;
}

type ObjectSchemaKeys<TSchema extends z.ZodObject<any>> = {
  [key in keyof Required<z.infer<TSchema>>]: key;
};
