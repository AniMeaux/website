import type { Config } from "#i/core/config";
import invariant from "tiny-invariant";

export function createConfig(): Config {
  invariant(
    process.env.ADOPTION_FORM_URL,
    "ADOPTION_FORM_URL should be defined",
  );
  invariant(
    process.env.CLOUDINARY_CLOUD_NAME,
    "CLOUDINARY_CLOUD_NAME should be defined",
  );
  invariant(process.env.DONATION_URL, "DONATION_URL should be defined");
  invariant(process.env.FACEBOOK_URL, "FACEBOOK_URL should be defined");
  invariant(
    process.env.FOSTER_FAMILY_FORM_URL,
    "FOSTER_FAMILY_FORM_URL should be defined",
  );
  invariant(process.env.INSTAGRAM_URL, "INSTAGRAM_URL should be defined");
  invariant(process.env.LINKEDIN_URL, "LINKEDIN_URL should be defined");
  invariant(process.env.PAYPAL_URL, "PAYPAL_URL should be defined");
  invariant(process.env.PICK_UP_FORM_URL, "PICK_UP_FORM_URL should be defined");
  invariant(process.env.PUBLIC_HOST, "PUBLIC_HOST should be defined");
  invariant(process.env.SHOW_URL, "SHOW_URL should be defined");
  invariant(process.env.TEAMING_URL, "TEAMING_URL should be defined");
  invariant(process.env.TWITTER_URL, "TWITTER_URL should be defined");
  invariant(
    process.env.VOLUNTEER_FORM_URL,
    "VOLUNTEER_FORM_URL should be defined",
  );

  return {
    adoptionFormUrl: process.env.ADOPTION_FORM_URL,
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    donationUrl: process.env.DONATION_URL,
    facebookUrl: process.env.FACEBOOK_URL,
    fosterFamilyFormUrl: process.env.FOSTER_FAMILY_FORM_URL,
    googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID,
    instagramUrl: process.env.INSTAGRAM_URL,
    linkedInUrl: process.env.LINKEDIN_URL,
    paypalUrl: process.env.PAYPAL_URL,
    pickUpFormUrl: process.env.PICK_UP_FORM_URL,
    publicHost: process.env.PUBLIC_HOST,
    showUrl: process.env.SHOW_URL,
    teamingUrl: process.env.TEAMING_URL,
    twitterUrl: process.env.TWITTER_URL,
    volunteerFormUrl: process.env.VOLUNTEER_FORM_URL,
  };
}
