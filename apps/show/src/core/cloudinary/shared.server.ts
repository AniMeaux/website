import { zu } from "@animeaux/zod-utils";

// Because `cloudinary.api.resources` returns `any`.
export const CloudinaryResourcesApiResponseSchema = zu.object({
  next_cursor: zu.string().optional(),
  resources: zu
    .object({
      public_id: zu.string(),
      width: zu.number(),
      height: zu.number(),
      bytes: zu.number(),
      context: zu
        .object({
          custom: zu
            .object({
              blurhash: zu
                .string()
                .optional()
                .transform((value) =>
                  value == null ? undefined : decodeURIComponent(value),
                ),
            })
            .optional(),
        })
        .optional(),
    })
    .array(),
});

export type CloudinaryResourcesApiResponse = zu.infer<
  typeof CloudinaryResourcesApiResponseSchema
>;
