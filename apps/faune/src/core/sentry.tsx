import * as Sentry from "@sentry/react";
import { getConfig } from "core/config";

if (process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: getConfig().sentryDsn });

  // Use tag to allow issues to be filtered.
  Sentry.setTag("application", "faune");

  Sentry.setContext("Application", { name: "Faune", version: "latest" });
}

export { Sentry };
