import { init, setContext, setTag } from "@sentry/react";
import { getConfig } from "core/config";

if (process.env.NODE_ENV === "production") {
  init({ dsn: getConfig().sentryDsn });

  // Use tag to allow issues to be filtered.
  setTag("application", "website");

  setContext("Application", { name: "Website", version: "latest" });
}

export * from "@sentry/react";
