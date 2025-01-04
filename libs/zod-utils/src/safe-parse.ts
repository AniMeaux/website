import { captureException } from "@sentry/remix";
import type { z } from "zod";

export function safeParse<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: any,
  errorMessage: string,
): z.infer<TSchema> {
  const result = schema.safeParse(data);

  if (!result.success) {
    // Don't use `.flatten()` as it looses some information (e.g. object path).
    const errors = result.error.toString();

    console.error(errorMessage, errors, data);

    const error = new Error(errorMessage);

    captureException(error, {
      extra: {
        errors,
        data: JSON.stringify(data),
      },
    });

    throw error;
  }

  return result.data;
}
