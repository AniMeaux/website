declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      ADOPTION_FORM_URL?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      DATABASE_URL?: string;
      DONATION_URL?: string;
      FACEBOOK_URL?: string;
      FOSTER_FAMILY_FORM_URL?: string;
      GOOGLE_TAG_MANAGER_ID?: string;
      INSTAGRAM_URL?: string;
      LINKEDIN_URL?: string;
      PAYPAL_URL?: string;
      PICK_UP_FORM_URL?: string;
      PUBLIC_HOST?: string;
      RUNTIME_ENV?: "staging" | "production";
      TEAMING_URL?: string;
      TWITTER_URL?: string;
      VOLUNTEER_FORM_URL?: string;
    }
  }
}
