import { zu } from "@animeaux/zod-utils";
import { DateTime } from "luxon";

export function checkEnv() {
  const result = ProcessEnvSchema.safeParse(process.env);

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
    ANIMEAUX_URL: process.env.ANIMEAUX_URL,
    APPLICATION_VALIDATION_START_DATE:
      process.env.APPLICATION_VALIDATION_START_DATE,
    CARPOOL_FACEBOOK_GROUP_URL: process.env.CARPOOL_FACEBOOK_GROUP_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    FACEBOOK_URL: process.env.FACEBOOK_URL,
    FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE:
      process.env.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE,
    FEATURE_FLAG_SHOW_EXHIBITORS: process.env.FEATURE_FLAG_SHOW_EXHIBITORS,
    FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS:
      process.env.FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS,
    FEATURE_FLAG_SHOW_PROVIDERS: process.env.FEATURE_FLAG_SHOW_PROVIDERS,
    FEATURE_FLAG_SHOW_PROGRAM: process.env.FEATURE_FLAG_SHOW_PROGRAM,
    FEATURE_FLAG_SHOW_SPONSORS: process.env.FEATURE_FLAG_SHOW_SPONSORS,
    FEATURE_FLAG_SITE_ONLINE: process.env.FEATURE_FLAG_SITE_ONLINE,
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
    INSTAGRAM_URL: process.env.INSTAGRAM_URL,
    PRESS_RELEASE_URL: process.env.PRESS_RELEASE_URL,
    PRICE_TABLE_CLOTHS: process.env.PRICE_TABLE_CLOTHS,
    PUBLIC_HOST: process.env.PUBLIC_HOST,
    RUNTIME_ENV: process.env.RUNTIME_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENABLE_LOCAL: process.env.SENTRY_ENABLE_LOCAL,
    SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE,
    SPONSORSHIP_URL: process.env.SPONSORSHIP_URL,
    TICKETING_URL: process.env.TICKETING_URL,
  };
}

type CLIENT_ENV = ReturnType<typeof getClientEnv>;

declare global {
  var CLIENT_ENV: CLIENT_ENV;

  interface Window {
    CLIENT_ENV: CLIENT_ENV;
  }

  namespace NodeJS {
    interface ProcessEnv extends zu.infer<typeof ProcessEnvSchema> {}
  }
}

const ProcessEnvSchema = zu
  .object({
    ANIMEAUX_URL: zu.string(),
    APPLICATION_TOKEN_ADMIN: zu.string(),
    APPLICATION_VALIDATION_START_DATE: zu.coerce
      .date()
      // Because we access the raw value and not the parsed one, we need to be
      // sure the type remains string and not Date.
      .transform((date) => DateTime.fromJSDate(date).toISODate()),
    CARPOOL_FACEBOOK_GROUP_URL: zu.string(),
    CLOUDINARY_API_KEY: zu.string(),
    CLOUDINARY_API_SECRET: zu.string(),
    CLOUDINARY_CLOUD_NAME: zu.string(),
    DATABASE_URL: zu.string(),
    FACEBOOK_URL: zu.string(),
    FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE: zu
      .enum(["true", "false"])
      .optional(),
    FEATURE_FLAG_SHOW_EXHIBITORS: zu.enum(["true", "false"]).optional(),
    FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS: zu
      .enum(["true", "false"])
      .optional(),
    FEATURE_FLAG_SHOW_PROVIDERS: zu.enum(["true", "false"]).optional(),
    FEATURE_FLAG_SHOW_PROGRAM: zu.enum(["true", "false"]).optional(),
    FEATURE_FLAG_SHOW_SPONSORS: zu.enum(["true", "false"]).optional(),
    FEATURE_FLAG_SITE_ONLINE: zu.enum(["true", "false"]).optional(),
    GOOGLE_API_CLIENT_EMAIL: zu.string().optional(),
    GOOGLE_API_PRIVATE_KEY: zu.string().optional(),
    GOOGLE_DRIVE_APPLICATION_FOLDER_ID: zu.string(),
    GOOGLE_DRIVE_SHARED_FOLDER_ID: zu.string(),
    GOOGLE_TAG_MANAGER_ID: zu.string().optional(),
    INSTAGRAM_URL: zu.string(),
    NODE_ENV: zu.enum(["development", "production", "test"]),
    ORGANIZER_EXHIBITOR_ID: zu.string().optional(),
    PRESS_RELEASE_URL: zu.string().optional(),
    PRICE_TABLE_CLOTHS: zu.coerce
      .number()
      .min(0)
      // Because we access the raw value and not the parsed one, we need to be
      // sure the type remains string and not number.
      .transform((value) => String(value)),
    PUBLIC_HOST: zu.string(),
    RESEND_API_KEY: zu.string().optional(),
    RESEND_ENABLE_LOCAL: zu.enum(["false", "true"]).optional(),
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
    SPONSORSHIP_URL: zu.string().optional(),
    TICKETING_URL: zu.string(),
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
