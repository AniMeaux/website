import type { z } from "zod";

export function createLocationState<TSchema extends z.ZodTypeAny>(
  schema: TSchema
) {
  return {
    parse(state: unknown) {
      // Without the cast the returned value is `any`.
      return schema.parse(state) as z.infer<TSchema>;
    },

    create(state: Partial<z.infer<TSchema>>) {
      return state;
    },
  };
}
