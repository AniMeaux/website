import { DateTime } from "luxon";
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

export function getObjectSchemaKeys<TSchema extends z.ZodObject<any>>(
  schema: TSchema
) {
  const keys = Object.fromEntries(
    Object.keys(schema.shape).map((key) => [key, key])
  );

  return keys as {
    [key in keyof Required<z.infer<TSchema>>]: string;
  };
}

export function ensureDate(value: unknown) {
  if (typeof value === "string") {
    if (value === "") {
      return undefined;
    }

    return DateTime.fromISO(value).toJSDate();
  }

  return value;
}

export function ensureBoolean(value: unknown) {
  if (
    typeof value === "string" &&
    [String(true), String(false)].includes(value)
  ) {
    return value === String(true);
  }

  return value;
}
