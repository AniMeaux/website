import type { Config } from "#core/config.ts";
import invariant from "tiny-invariant";

export function createConfig(): Config {
  invariant(process.env.ANIMEAUX_URL, "ANIMEAUX_URL should be defined");
  invariant(
    process.env.CARPOOL_FACEBOOK_GROUP_URL,
    "CARPOOL_FACEBOOK_GROUP_URL should be defined",
  );
  invariant(
    process.env.CLOUDINARY_CLOUD_NAME,
    "CLOUDINARY_CLOUD_NAME should be defined",
  );
  invariant(
    process.env.EXHIBITORS_FORM_URL,
    "EXHIBITORS_FORM_URL should be defined",
  );
  invariant(process.env.FACEBOOK_URL, "FACEBOOK_URL should be defined");
  invariant(process.env.INSTAGRAM_URL, "INSTAGRAM_URL should be defined");
  invariant(
    process.env.KID_WORKSHOP_REGISTRATION_URL,
    "KID_WORKSHOP_REGISTRATION_URL should be defined",
  );
  invariant(
    process.env.PARTNERS_FORM_URL,
    "PARTNERS_FORM_URL should be defined",
  );
  invariant(process.env.RAFFLE_URL, "RAFFLE_URL should be defined");
  invariant(
    process.env.PRESS_RELEASE_URL,
    "PRESS_RELEASE_URL should be defined",
  );
  invariant(process.env.PUBLIC_HOST, "PUBLIC_HOST should be defined");
  invariant(process.env.TICKETING_URL, "TICKETING_URL should be defined");

  return {
    animeauxUrl: process.env.ANIMEAUX_URL,
    carpoolFacebookGroupUrl: process.env.CARPOOL_FACEBOOK_GROUP_URL,
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    exhibitorsFormUrl: process.env.EXHIBITORS_FORM_URL,
    facebookUrl: process.env.FACEBOOK_URL,
    featureFlagShowExhibitors:
      process.env.FEATURE_FLAG_SHOW_EXHIBITORS === "true",
    featureFlagShowProgram: process.env.FEATURE_FLAG_SHOW_PROGRAM === "true",
    featureFlagSiteOnline: process.env.FEATURE_FLAG_SITE_ONLINE === "true",
    googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID,
    instagramUrl: process.env.INSTAGRAM_URL,
    kidWorkshopRegistrationUrl: process.env.KID_WORKSHOP_REGISTRATION_URL,
    partnersFormUrl: process.env.PARTNERS_FORM_URL,
    pressReleaseUrl: process.env.PRESS_RELEASE_URL,
    publicHost: process.env.PUBLIC_HOST,
    raffleUrl: process.env.RAFFLE_URL,
    ticketingUrl: process.env.TICKETING_URL,
  };
}
