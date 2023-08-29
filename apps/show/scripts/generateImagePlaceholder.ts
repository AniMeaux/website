import { getPixels } from "@unpic/pixels";
import { encode } from "blurhash";
import invariant from "tiny-invariant";

invariant(
  process.env.CLOUDINARY_CLOUD_NAME,
  "CLOUDINARY_CLOUD_NAME should be defined",
);

generateImagePlaceholder().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function generateImagePlaceholder() {
  const imageId = process.argv[2];
  invariant(imageId != null, "Missing image id in command line.");

  const imageData = await getPixels(
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_jpg,w_128/${imageId}`,
  );

  const blurhash = encode(
    Uint8ClampedArray.from(imageData.data),
    imageData.width,
    imageData.height,
    4,
    4,
  );

  console.log("blurhash:", blurhash);
}
