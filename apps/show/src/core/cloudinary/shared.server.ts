import { zu } from "@animeaux/zod-utils";
import type { v2 as cloudinaryClient } from "cloudinary";

export type CloudinaryClient = typeof cloudinaryClient;

// Because `cloudinary.api.resources` returns `any`.
export const CloudinaryApiResponseSchema = zu.object({
  next_cursor: zu.string().optional(),
  resources: zu
    .object({
      public_id: zu.string(),
      width: zu.number(),
      height: zu.number(),
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

export type CloudinaryApiResponse = zu.infer<
  typeof CloudinaryApiResponseSchema
>;

export abstract class CloudinaryDelegate {
  // It's not useless because it automatically initialize the instance
  // attribute `client`.
  // eslint-disable-next-line no-useless-constructor
  constructor(protected readonly client: CloudinaryClient) {}
}
