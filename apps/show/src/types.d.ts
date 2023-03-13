declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      ANIMEAUX_URL?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      FACEBOOK_URL?: string;
      GOOGLE_TAG_MANAGER_ID?: string;
      INSTAGRAM_URL?: string;
      PRESS_RELEASE_URL?: string;
      PUBLIC_HOST?: string;
      RUNTIME_ENV?: "staging" | "production";
      TICKETING_URL?: string;
    }
  }
}

// Files containing module augmentation must be modules (as opposed to scripts).
// The difference between modules and scripts is that modules have at least one
// import/export statement.
export {};
