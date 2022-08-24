declare namespace NodeJS {
  interface ProcessEnv {
    RUNTIME_ENV?: "staging" | "production";
    PUBLIC_HOST?: string;
    DATABASE_URL?: string;
    CLOUDINARY_CLOUD_NAME?: string;
  }
}
