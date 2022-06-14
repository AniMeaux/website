import { CurrentUser } from "@animeaux/shared";
import * as Sentry from "@sentry/react";
import { getConfig } from "~/core/config";

if (process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: getConfig().sentryDsn });

  // Use tag to allow issues to be filtered.
  Sentry.setTag("application", "faune");

  Sentry.setContext("Application", { name: "Faune", version: "latest" });
}

export function setUser(user: CurrentUser | null) {
  if (user == null) {
    Sentry.setUser(null);
    return;
  }

  // Sentry expect a string id.
  const { id, ...rest } = user;
  Sentry.setUser({ ...rest, id: String(id) });
}

export { Sentry };
