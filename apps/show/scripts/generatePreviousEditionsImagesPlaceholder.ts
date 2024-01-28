import {
  cloudinary,
  cloudinaryClient,
} from "#core/cloudinary/cloudinary.server.ts";
import { PreviousEdition } from "#previousEditions/previousEdition.tsx";
import { getPixels } from "@unpic/pixels";
import { encode } from "blurhash";

for (const edition of Object.values(PreviousEdition)) {
  console.log(`📆 Edition ${edition}:`);

  const images = await cloudinary.previousEdition.findAllImages(edition);

  for (const image of images) {
    if (image.blurhash == null) {
      try {
        const imageData = await getPixels(
          `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_jpg,w_128/${image.id}`,
        );

        const blurhash = encode(
          Uint8ClampedArray.from(imageData.data),
          imageData.width,
          imageData.height,
          4,
          4,
        );

        await cloudinaryClient.uploader.add_context(
          ["blurhash", encodeURIComponent(blurhash)].join("="),
          [image.id],
        );

        console.log(`- 👍 ${image.id}`);
      } catch (error) {
        console.error(`- 👎 ${image.id}:`, error);
      }
    } else {
      console.log(`- 🤷 ${image.id}`);
    }
  }

  console.log(`🎉 Generated edition ${edition} placeholders.`);
}
