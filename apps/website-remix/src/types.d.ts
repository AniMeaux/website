declare namespace NodeJS {
  interface ProcessEnv {
    RUNTIME_ENV?: "staging" | "production";
    PUBLIC_HOST?: string;
    DATABASE_URL?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    FACEBOOK_URL?: string;
    INSTAGRAM_URL?: string;
    LINKEDIN_URL?: string;
    TWITTER_URL?: string;
    ADOPTION_FORM_URL?: string;
    FOSTER_FAMILY_FORM_URL?: string;
    VOLUNTEER_FORM_URL?: string;
    DONATION_URL?: string;
    PAYPAL_URL?: string;
    TEAMING_URL?: string;
    PICK_UP_FORM_URL?: string;
  }
}
