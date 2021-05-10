import * as Sentry from "@sentry/react";

export function initializeSentry() {
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    });

    // Use tag to allow issues to be filtered.
    Sentry.setTag("application", process.env.NEXT_PUBLIC_APP_NAME);

    Sentry.setContext("Application", {
      name: process.env.NEXT_PUBLIC_APP_NAME,
      version: `${process.env.NEXT_PUBLIC_APP_VERSION}-${process.env.NEXT_PUBLIC_APP_BUILD_ID}`,
    });
  }
}
