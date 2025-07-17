import { zu } from "@animeaux/zod-utils";

export function checkEnv() {
  const result = processEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      "Invalid environment variables:",
      result.error.flatten().fieldErrors,
    );

    throw new Error("Invalid envirmonment variables");
  }
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the client environment variables are set and globally available before the
 * app is started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 *
 * @returns All public ENV variables for client side
 */
export function getClientEnv() {
  return {
    RUNTIME_ENV: process.env.RUNTIME_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENABLE_LOCAL: process.env.SENTRY_ENABLE_LOCAL,
    SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE,
    SHOW_URL: process.env.SHOW_URL,
  };
}

type CLIENT_ENV = ReturnType<typeof getClientEnv>;

declare global {
  var CLIENT_ENV: CLIENT_ENV;

  interface Window {
    CLIENT_ENV: CLIENT_ENV;
  }

  namespace NodeJS {
    interface ProcessEnv extends zu.infer<typeof processEnvSchema> {}
  }
}

const processEnvSchema = zu
  .object({
    GOOGLE_API_CLIENT_EMAIL: zu.string().optional(),
    GOOGLE_API_PRIVATE_KEY: zu.string().optional(),
    GOOGLE_DRIVE_ROOT_FOLDER_ID: zu.string(),
    NODE_ENV: zu.enum(["development", "production", "test"]),
    RUNTIME_ENV: zu.enum(["local", "production", "staging"]),
    SENTRY_DSN: zu.string().optional(),
    SENTRY_ENABLE_LOCAL: zu.enum(["false", "true"]).optional(),
    SENTRY_TRACES_SAMPLE_RATE: zu.coerce
      .number()
      .min(0)
      .max(1)
      // Because we access the raw value and not the parsed one, we need to be
      // sure the type remains string and not number.
      .transform((value) => String(value))
      .optional(),
    SHOW_URL: zu.string(),
  })
  .refine(
    (env) =>
      env.GOOGLE_API_CLIENT_EMAIL != null || env.NODE_ENV !== "production",
    {
      message:
        "`GOOGLE_API_CLIENT_EMAIL` is required when `NODE_ENV=production`",
    },
  )
  .refine(
    (env) =>
      env.GOOGLE_API_PRIVATE_KEY != null || env.NODE_ENV !== "production",
    {
      message:
        "`GOOGLE_API_PRIVATE_KEY` is required when `NODE_ENV=production`",
    },
  );
