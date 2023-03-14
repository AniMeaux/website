import invariant from "tiny-invariant";
import { Config } from "~/core/config";

export function createConfig(): Config {
  invariant(process.env.ANIMEAUX_URL, "ANIMEAUX_URL should be defined");
  invariant(
    process.env.CARPOOL_FACEBOOK_GROUP_URL,
    "CARPOOL_FACEBOOK_GROUP_URL should be defined"
  );
  invariant(
    process.env.CLOUDINARY_CLOUD_NAME,
    "CLOUDINARY_CLOUD_NAME should be defined"
  );
  invariant(process.env.FACEBOOK_URL, "FACEBOOK_URL should be defined");
  invariant(process.env.INSTAGRAM_URL, "INSTAGRAM_URL should be defined");
  invariant(
    process.env.KID_WORKSHOP_REGISTRATION_URL,
    "KID_WORKSHOP_REGISTRATION_URL should be defined"
  );
  invariant(
    process.env.PRESS_RELEASE_URL,
    "PRESS_RELEASE_URL should be defined"
  );
  invariant(process.env.PUBLIC_HOST, "PUBLIC_HOST should be defined");
  invariant(process.env.TICKETING_URL, "TICKETING_URL should be defined");

  return {
    animeauxUrl: process.env.ANIMEAUX_URL,
    carpoolFacebookGroupUrl: process.env.CARPOOL_FACEBOOK_GROUP_URL,
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    facebookUrl: process.env.FACEBOOK_URL,
    googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID,
    instagramUrl: process.env.INSTAGRAM_URL,
    kidWorkshopRegistrationUrl: process.env.KID_WORKSHOP_REGISTRATION_URL,
    pressReleaseUrl: process.env.PRESS_RELEASE_URL,
    publicHost: process.env.PUBLIC_HOST,
    ticketingUrl: process.env.TICKETING_URL,
  };
}
