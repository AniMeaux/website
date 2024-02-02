import type { zu } from "@animeaux/zod-utils";

export function createLocationState<TSchema extends zu.ZodTypeAny>(
  schema: TSchema,
) {
  return {
    parse(state: unknown) {
      // Without the cast the returned value is `any`.
      return schema.parse(state) as zu.infer<TSchema>;
    },

    create(state: Partial<zu.infer<TSchema>>) {
      return state;
    },
  };
}
