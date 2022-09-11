declare namespace NodeJS {
  interface ProcessEnv {
    ANIMEAUX_URL?: string;
    EXHIBITORS_FORM_URL?: string;
    FACEBOOK_URL?: string;
    GOOGLE_TAG_MANAGER_ID?: string;
    INSTAGRAM_URL?: string;
    PRESS_RELEASE_URL?: string;
    PUBLIC_HOST?: string;
    RUNTIME_ENV?: "staging" | "production";
    TICKETING_URL?: string;
  }
}
