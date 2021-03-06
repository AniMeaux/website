import * as Sentry from "@sentry/react";

export type SentryConfig = {
  environment: "production" | "development" | "test";
  dsn: string;
  applicationName: string;
  applicationVersion: string;
};

export function initializeSentry({
  environment,
  applicationName,
  applicationVersion,
  ...config
}: SentryConfig) {
  if (environment === "production") {
    Sentry.init(config);

    // Use tag to allow issues to be filtered.
    Sentry.setTag("application", applicationName);

    Sentry.setContext("Application", {
      name: applicationName,
      version: applicationVersion,
    });
  }
}
