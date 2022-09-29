declare namespace NodeJS {
  interface ProcessEnv {
    CLOUDINARY_CLOUD_NAME?: string;
    DATABASE_URL?: string;
    PUBLIC_HOST?: string;
    RUNTIME_ENV?: "staging" | "production";
  }
}
