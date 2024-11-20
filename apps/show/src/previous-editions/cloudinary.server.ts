import { lruCache } from "#core/cache.server";
import { CloudinaryResourcesApiResponseSchema } from "#core/cloudinary/shared.server";
import type { PreviousEdition } from "#previous-editions/previous-edition";
import { CloudinaryDelegate } from "@animeaux/cloudinary/server";
import type { zu } from "@animeaux/zod-utils";
import { cachified } from "@epic-web/cachified";

export class PrevousEditionCloudinaryDelegate extends CloudinaryDelegate {
  async findAllImages(edition: PreviousEdition) {
    return await cachified({
      key: `cloudinary:prevousEdition:${edition}:findAllImages`,
      cache: lruCache,
      // The images should never change.
      ttl: Infinity,

      getFreshValue: async () => {
        let nextCursor: undefined | string;
        let allImages: zu.infer<typeof ApiResponseSchema>["images"] = [];

        try {
          do {
            const response = ApiResponseSchema.parse(
              await this.client.api.resources({
                context: true,
                max_results: 50,
                next_cursor: nextCursor,
                prefix: `show/gallery/${edition}/`,
                type: "upload",
              }),
            );

            allImages = allImages.concat(
              response.images
                // It looks like deleted images are still listed but have 0 bytes.
                .filter((image) => image.bytes > 0),
            );
            nextCursor = response.nextCursor;
          } while (nextCursor != null);
        } catch (error) {
          console.error(`Could not get photos for ${edition} edition:`, error);

          // We want all images or none.
          allImages = [];
        }

        return allImages;
      },
    });
  }
}

const ApiResponseSchema = CloudinaryResourcesApiResponseSchema.transform(
  (response) => ({
    nextCursor: response.next_cursor,
    images: response.resources.map((resource) => ({
      id: resource.public_id,
      blurhash: resource.context?.custom?.blurhash,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
    })),
  }),
);
