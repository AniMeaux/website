import { init } from "@sentry/remix";

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
