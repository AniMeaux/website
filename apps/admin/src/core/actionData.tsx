import { getObjectSchemaKeys } from "#core/schemas.tsx";
import type { z } from "zod";

export function createActionData<TSchema extends z.ZodObject<any>>(
  schema: TSchema,
) {
  return { schema, keys: getObjectSchemaKeys(schema) };
}
