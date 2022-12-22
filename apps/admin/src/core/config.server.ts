import { Config } from "#/core/config";
import invariant from "tiny-invariant";

export function createConfig(): Config {
  invariant(
    process.env.CLOUDINARY_CLOUD_NAME,
    "CLOUDINARY_CLOUD_NAME should be defined"
  );
  invariant(process.env.PUBLIC_HOST, "PUBLIC_HOST should be defined");

  return {
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    publicHost: process.env.PUBLIC_HOST,
  };
}
