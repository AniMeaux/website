import type { User } from "@animeaux/prisma/server";
import { init, setUser } from "@sentry/remix";

export function initMonitoring() {
  if (
    process.env.SENTRY_DSN != null &&
    (process.env.RUNTIME_ENV !== "local" ||
      process.env.SENTRY_ENABLE_LOCAL === "true")
  ) {
    init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.RUNTIME_ENV,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0),
    });
  }
}

export function setCurrentUserForMonitoring(
  currentUser: null | Pick<User, "displayName" | "email" | "groups" | "id">,
) {
  if (currentUser == null) {
    setUser(null);
    return;
  }

  setUser({
    id: currentUser.id,
    username: currentUser.displayName,
    email: currentUser.email,
    groups: currentUser.groups,
  });
}
