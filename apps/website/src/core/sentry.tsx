import { init, setContext, setTag } from "@sentry/react";

if (process.env.NODE_ENV === "production") {
  init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });

  // Use tag to allow issues to be filtered.
  setTag("application", process.env.NEXT_PUBLIC_APP_NAME);

  setContext("Application", {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    version: `${process.env.NEXT_PUBLIC_APP_VERSION}-${process.env.NEXT_PUBLIC_APP_BUILD_ID}`,
  });
}

export * from "@sentry/react";
