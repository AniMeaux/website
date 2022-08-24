import invariant from "tiny-invariant";
import { Config } from "~/core/config";

export function createConfig(): Config {
  invariant(
    process.env.CLOUDINARY_CLOUD_NAME,
    "CLOUDINARY_CLOUD_NAME should be defined"
  );

  invariant(process.env.PUBLIC_HOST, "PUBLIC_HOST should be defined");

  return {
    cloudinary: { cloudName: process.env.CLOUDINARY_CLOUD_NAME },
    publicHost: process.env.PUBLIC_HOST,
  };
}
