import type { User } from "@prisma/client";
import { useLocation, useMatches } from "@remix-run/react";
import {
  browserTracingIntegration,
  httpClientIntegration,
  init,
  setUser,
} from "@sentry/remix";
import { useEffect } from "react";

export function initMonitoring() {
  if (
    CLIENT_ENV.SENTRY_DSN != null &&
    (CLIENT_ENV.RUNTIME_ENV !== "local" ||
      CLIENT_ENV.SENTRY_ENABLE_LOCAL === "true")
  ) {
    init({
      dsn: CLIENT_ENV.SENTRY_DSN,
      environment: CLIENT_ENV.RUNTIME_ENV,
      tracesSampleRate: Number(CLIENT_ENV.SENTRY_TRACES_SAMPLE_RATE ?? 0),
      integrations: [
        // https://docs.sentry.io/platforms/javascript/guides/remix/configuration/integrations/browsertracing
        browserTracingIntegration({ useEffect, useLocation, useMatches }),

        // https://docs.sentry.io/platforms/javascript/guides/remix/configuration/integrations/httpclient
        httpClientIntegration(),
      ],
    });
  }
}

export function useCurrentUserForMonitoring(
  currentUser: null | Pick<User, "displayName" | "email" | "groups" | "id">,
) {
  // Do this as early as possible for possible errors during rendering.

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
