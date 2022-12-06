declare namespace NodeJS {
  interface ProcessEnv {
    ALGOLIA_ADMIN_KEY?: string;
    ALGOLIA_ID?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    DATABASE_URL?: string;
    PUBLIC_HOST?: string;
    RUNTIME_ENV?: "staging" | "production";
    SESSION_SECRET?: string;
  }
}
