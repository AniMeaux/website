import type { ServiceCache } from "#i/core/cache.service.server.js";
import type { ServiceImage } from "#i/core/image/service.server.js";
import type { PreviousEdition } from "#i/previous-editions/previous-edition.js";
import { zu } from "@animeaux/zod-utils";
import cachified from "@epic-web/cachified";
import { LazyFile } from "@mjackson/lazy-file";
import { writeReadableStreamToWritable } from "@remix-run/node";
import { captureException } from "@sentry/remix";
import { v2 as cloudinaryClient } from "cloudinary";

export class ServiceImageCloudinary implements ServiceImage {
  constructor(private cache: ServiceCache) {
    cloudinaryClient.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  createReversibleUpload() {
    const uploadedPublicIds: string[] = [];

    const upload: ServiceImage.Uploader = async (fileUpload, params) => {
      return await new Promise<File>((resolve, reject) => {
        const uploadStream = cloudinaryClient.uploader.upload_stream(
          { public_id: params.imageId },
          (error, result) => {
            if (error != null || result == null) {
              reject(error ?? new Error("No result nor errors"));

              return;
            }

            uploadedPublicIds.push(result.public_id);

            resolve(
              new LazyFile(
                {
                  byteLength: result.bytes,
                  stream: () => {
                    throw new Error("Not supported");
                  },
                },
                result.public_id,
                { type: fileUpload.type },
              ),
            );
          },
        );

        writeReadableStreamToWritable(fileUpload.stream(), uploadStream);
      });
    };

    const revert: ServiceImage.Reverter = async () => {
      const results = await Promise.all(
        uploadedPublicIds.map((imageId) => this.safeDeleteImage(imageId)),
      );

      const errors = results.filter(Boolean);

      return errors.length > 0 ? errors : undefined;
    };

    return { upload, revert };
  }

  private async safeDeleteImage(imageId: string) {
    try {
      await cloudinaryClient.uploader.destroy(imageId);

      return undefined;
    } catch (error) {
      return { imageId, error };
    }
  }

  async getAllImages(edition: PreviousEdition) {
    return await cachified({
      key: `service-image:get-all-images:${edition}`,
      cache: this.cache,
      // The pictures should never change.
      ttl: Infinity,

      getFreshValue: async () => {
        let nextCursor: undefined | string;
        let allPictures: ServiceImage.Image[] = [];

        try {
          do {
            const response = apiResponseSchema.parse(
              await cloudinaryClient.api.resources({
                context: true,
                max_results: 50,
                next_cursor: nextCursor,
                prefix: `show/gallery/${edition}/`,
                type: "upload",
              }),
            );

            allPictures = allPictures.concat(
              response.pictures
                // It looks like deleted pictures are still listed but have 0 bytes.
                .filter((picture) => picture.bytes > 0),
            );

            nextCursor = response.nextCursor;
          } while (nextCursor != null);
        } catch (error) {
          console.error(`Could not get images for ${edition} edition:`, error);

          captureException(error, {
            extra: {
              edition,
              allPicturesCount: allPictures.length,
              nextCursor,
            },
          });

          // We want all images or none.
          allPictures = [];
        }

        return allPictures;
      },
    });
  }

  async setBlurhash(imageId: string, blurhash: string) {
    await cloudinaryClient.uploader.add_context(
      ["blurhash", encodeURIComponent(blurhash)].join("="),
      [imageId],
    );
  }
}

// Because `cloudinary.api.resources` returns `any`.
const resourcesApiResponseSchema = zu.object({
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

const apiResponseSchema = resourcesApiResponseSchema.transform((response) => ({
  nextCursor: response.next_cursor,
  pictures: response.resources.map((resource) => ({
    id: resource.public_id,
    blurhash: resource.context?.custom?.blurhash,
    bytes: resource.bytes,
    width: resource.width,
    height: resource.height,
  })),
}));
