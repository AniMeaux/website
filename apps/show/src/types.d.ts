import "@total-typescript/ts-reset";

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      ANIMEAUX_URL?: string;
      CARPOOL_FACEBOOK_GROUP_URL?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      EXHIBITORS_FORM_URL?: string;
      FACEBOOK_URL?: string;
      FEATURE_FLAG_SITE_ONLINE?: "true" | "false";
      GOOGLE_TAG_MANAGER_ID?: string;
      INSTAGRAM_URL?: string;
      KID_WORKSHOP_REGISTRATION_URL?: string;
      PARTNERS_FORM_URL?: string;
      PRESS_RELEASE_URL?: string;
      PUBLIC_HOST?: string;
      RUNTIME_ENV?: "staging" | "production";
      TICKETING_URL?: string;
    }
  }
}
