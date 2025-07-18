import "@total-typescript/ts-reset";
// This import is required for standard CSS properties to be autocompleted.
import "csstype";

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      APPLICATION_TOKEN?: string;
      CLOUDINARY_API_KEY?: string;
      CLOUDINARY_API_SECRET?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      DATABASE_URL?: string;
      ENABLE_CRONS?: "true" | "false";
      PUBLIC_HOST?: string;
      SESSION_SECRET?: string;
      SHOW_NOTIFICATION_ENDPOINT?: string;
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
