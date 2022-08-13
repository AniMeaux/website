import invariant from "tiny-invariant";
import { Config } from "~/core/config";

export function createConfig(): Config {
  invariant(
    process.env.CLOUDINARY_CLOUD_NAME,
    "CLOUDINARY_CLOUD_NAME should be defined"
  );

  return {
    cloudinary: { cloudName: process.env.CLOUDINARY_CLOUD_NAME },
  };
}
