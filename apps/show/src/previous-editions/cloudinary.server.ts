import { lruCache } from "#core/cache.server";
import type { CloudinaryApiResponse } from "#core/cloudinary/shared.server";
import {
  CloudinaryApiResponseSchema,
  CloudinaryDelegate,
} from "#core/cloudinary/shared.server";
import type { PreviousEdition } from "#previous-editions/previous-edition";
import { cachified } from "cachified";

export class PrevousEditionCloudinaryDelegate extends CloudinaryDelegate {
  async findAllImages(edition: PreviousEdition) {
    return await cachified({
      key: `cloudinary:prevousEdition:${edition}:findAllImages`,
      cache: lruCache,
      // The images should never change.
      ttl: Infinity,

      getFreshValue: async () => {
        let nextCursor: undefined | string;
        let allImages: ReturnType<
          typeof flattenCloudinaryApiResponse
        >["images"] = [];

        try {
          do {
            const response = CloudinaryApiResponseSchema.transform(
              flattenCloudinaryApiResponse,
            ).parse(
              await this.client.api.resources({
                context: true,
                max_results: 50,
                next_cursor: nextCursor,
                prefix: `show/gallery/${edition}/`,
                type: "upload",
              }),
            );

            allImages = allImages.concat(response.images);
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

function flattenCloudinaryApiResponse(response: CloudinaryApiResponse) {
  return {
    nextCursor: response.next_cursor,
    images: response.resources.map((resource) => ({
      id: resource.public_id,
      blurhash: resource.context?.custom?.blurhash,
      width: resource.width,
      height: resource.height,
    })),
  };
}
