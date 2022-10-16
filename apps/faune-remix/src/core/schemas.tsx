import { z } from "zod";

export function parseOrDefault<TSchema extends z.ZodType<any, any, any>>(
  schema: TSchema,
  value: unknown
): z.infer<TSchema> {
  const result = schema.safeParse(value);
  if (result.success) {
    return result.data;
  }

  return schema.parse(undefined);
}
