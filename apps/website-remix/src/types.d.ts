declare namespace NodeJS {
  interface ProcessEnv {
    PUBLIC_HOST?: string;
    DATABASE_URL?: string;
    CLOUDINARY_CLOUD_NAME?: string;
  }
}
