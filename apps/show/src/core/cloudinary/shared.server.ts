import type { v2 as cloudinaryClient } from "cloudinary";
import { z } from "zod";

export type CloudinaryClient = typeof cloudinaryClient;

// Because `cloudinary.api.resources` returns `any`.
export const CloudinaryApiResponseSchema = z.object({
  next_cursor: z.string().optional(),
  resources: z
    .object({
      public_id: z.string(),
      width: z.number(),
      height: z.number(),
      context: z
        .object({
          custom: z
            .object({
              blurhash: z
                .string()
                .optional()
                .transform((value) =>
                  value == null ? undefined : decodeURIComponent(value)
                ),
            })
            .optional(),
        })
        .optional(),
    })
    .array(),
});

export type CloudinaryApiResponse = z.infer<typeof CloudinaryApiResponseSchema>;

export abstract class CloudinaryDelegate {
  // It's not useless because it automatically initialize the instance
  // attribute `client`.
  // eslint-disable-next-line no-useless-constructor
  constructor(protected readonly client: CloudinaryClient) {}
}
