import { lruCache } from "#core/cache.server";
import { CloudinaryResourcesApiResponseSchema } from "#core/cloudinary/shared.server";
import type { PreviousEdition } from "#previous-editions/previous-edition";
import { CloudinaryDelegate } from "@animeaux/cloudinary/server";
import type { zu } from "@animeaux/zod-utils";
import { cachified } from "@epic-web/cachified";
import { captureException } from "@sentry/remix";

export class PrevousEditionCloudinaryDelegate extends CloudinaryDelegate {
  async findAllPictures(edition: PreviousEdition) {
    return await cachified({
      key: `cloudinary:prevousEdition:${edition}:findAllPictures`,
      cache: lruCache,
      // The pictures should never change.
      ttl: Infinity,

      getFreshValue: async () => {
        let nextCursor: undefined | string;
        let allPictures: PrevousEditionCloudinaryDelegate.Picture[] = [];

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

            allPictures = allPictures.concat(
              response.pictures
                // It looks like deleted pictures are still listed but have 0 bytes.
                .filter((picture) => picture.bytes > 0),
            );

            nextCursor = response.nextCursor;
          } while (nextCursor != null);
        } catch (error) {
          console.error(
            `Could not get pictures for ${edition} edition:`,
            error,
          );

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
}

export namespace PrevousEditionCloudinaryDelegate {
  export type Picture = zu.infer<typeof ApiResponseSchema>["pictures"][number];
}

const ApiResponseSchema = CloudinaryResourcesApiResponseSchema.transform(
  (response) => ({
    nextCursor: response.next_cursor,
    pictures: response.resources.map((resource) => ({
      id: resource.public_id,
      blurhash: resource.context?.custom?.blurhash,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
    })),
  }),
);
