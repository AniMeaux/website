import { cloudinary } from "#core/cloudinary/cloudinary.server";
import { PreviousEdition } from "#previous-editions/previous-edition";
import { getPixels } from "@unpic/pixels";
import { encode } from "blurhash";

for (const edition of Object.values(PreviousEdition)) {
  console.log(`📆 Edition ${edition}:`);

  const pictures = await cloudinary.previousEdition.findAllPictures(edition);

  for (const picture of pictures) {
    if (picture.blurhash == null) {
      try {
        const pictureData = await getPixels(
          `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_jpg,w_128/${picture.id}`,
        );

        const blurhash = encode(
          Uint8ClampedArray.from(pictureData.data),
          pictureData.width,
          pictureData.height,
          4,
          4,
        );

        await cloudinary.client.uploader.add_context(
          ["blurhash", encodeURIComponent(blurhash)].join("="),
          [picture.id],
        );

        console.log(`- 👍 ${picture.id}`);
      } catch (error) {
        console.error(`- 👎 ${picture.id}:`, error);
      }
    } else {
      console.log(`- 🤷 ${picture.id}`);
    }
  }

  console.log(`🎉 Generated edition ${edition} placeholders.`);
}
