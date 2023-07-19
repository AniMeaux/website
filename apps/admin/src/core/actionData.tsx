import { z } from "zod";
import { getObjectSchemaKeys } from "~/core/schemas";

export function createActionData<TSchema extends z.ZodObject<any>>(
  schema: TSchema
) {
  return { schema, keys: getObjectSchemaKeys(schema) };
}
