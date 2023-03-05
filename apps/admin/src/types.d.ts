// This import is required for standard CSS properties to be autocompleted.
import "csstype";

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      ALGOLIA_ADMIN_KEY?: string;
      ALGOLIA_ID?: string;
      CLOUDINARY_API_KEY?: string;
      CLOUDINARY_API_SECRET?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      DATABASE_URL?: string;
      PUBLIC_HOST?: string;
      RUNTIME_ENV?: "staging" | "production";
      SENTRY_DSN?: string;
      SESSION_SECRET?: string;
    }
  }
}

// Add a custom CSS variables here.
// https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
declare module "csstype" {
  interface Properties {
    "--header-height"?: `${number}px`;
  }
}
