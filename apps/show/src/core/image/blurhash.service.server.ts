import { createImageUrl } from "#core/data-display/image";
import { getPixels } from "@unpic/pixels";
import { encode } from "blurhash";

export class ServiceBlurhash {
  async create(imageId: string) {
    const imageData = await getPixels(
      createImageUrl(process.env.CLOUDINARY_CLOUD_NAME, imageId, {
        format: "jpg",
        size: "128",
        aspectRatio: "4:3",
        objectFit: "contain",
      }),
    );

    return encode(
      Uint8ClampedArray.from(imageData.data),
      imageData.width,
      imageData.height,
      4,
      3,
    );
  }
}
