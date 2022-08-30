import invariant from "tiny-invariant";
import { Config } from "~/core/config";

export function createConfig(): Config {
  invariant(
    process.env.CLOUDINARY_CLOUD_NAME,
    "CLOUDINARY_CLOUD_NAME should be defined"
  );
  invariant(process.env.PUBLIC_HOST, "PUBLIC_HOST should be defined");
  invariant(process.env.FACEBOOK_URL, "FACEBOOK_URL should be defined");
  invariant(process.env.INSTAGRAM_URL, "INSTAGRAM_URL should be defined");
  invariant(process.env.LINKEDIN_URL, "LINKEDIN_URL should be defined");
  invariant(process.env.TWITTER_URL, "TWITTER_URL should be defined");

  return {
    cloudinary: { cloudName: process.env.CLOUDINARY_CLOUD_NAME },
    publicHost: process.env.PUBLIC_HOST,
    facebookUrl: process.env.FACEBOOK_URL,
    instagramUrl: process.env.INSTAGRAM_URL,
    linkedInUrl: process.env.LINKEDIN_URL,
    twitterUrl: process.env.TWITTER_URL,
  };
}
