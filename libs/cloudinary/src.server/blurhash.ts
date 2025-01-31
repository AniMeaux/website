import { getPixels } from "@unpic/pixels";
import { encode } from "blurhash";
import { CloudinaryImage } from "../src";

type AspectRatio = Exclude<
  CloudinaryImage.AspectRatio,
  typeof CloudinaryImage.AspectRatio.AR_NONE
>;

export async function createImageBlurhash(
  cloudName: string,
  imageId: string,
  {
    aspectRatio = CloudinaryImage.AspectRatio.AR_4x3,
    objectFit,
  }: {
    aspectRatio?: AspectRatio;
    objectFit?: CloudinaryImage.ObjectFit;
  } = {},
) {
  const imageData = await getPixels(
    CloudinaryImage.createUrl(cloudName, imageId, {
      format: CloudinaryImage.Format.JPG,
      size: CloudinaryImage.Size.S_128,
      fillTransparentBackground: true,
      aspectRatio,
      objectFit,
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
