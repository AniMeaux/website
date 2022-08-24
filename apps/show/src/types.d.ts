declare namespace NodeJS {
  interface ProcessEnv {
    RUNTIME_ENV?: "staging" | "production";
    PUBLIC_HOST?: string;
    ANIMEAUX_URL?: string;
    TICKETING_URL?: string;
    FACEBOOK_URL?: string;
    INSTAGRAM_URL?: string;
  }
}
