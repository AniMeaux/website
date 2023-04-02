import { z } from "zod";

export function createActionData<TSchema extends z.ZodObject<any>>(
  schema: TSchema
) {
  return { schema, keys: getSchemaKeys(schema) };
}

function getSchemaKeys<TSchema extends z.ZodObject<any>>(schema: TSchema) {
  const keys = Object.fromEntries(
    Object.keys(schema.shape).map((key) => [key, key])
  );

  return keys as {
    [key in keyof Required<z.infer<TSchema>>]: string;
  };
}
