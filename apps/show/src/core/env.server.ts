import { zu } from "@animeaux/zod-utils";

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
    CARPOOL_FACEBOOK_GROUP_URL: process.env.CARPOOL_FACEBOOK_GROUP_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    FACEBOOK_URL: process.env.FACEBOOK_URL,
    FEATURE_FLAG_SHOW_EXHIBITORS:
      process.env.FEATURE_FLAG_SHOW_EXHIBITORS === "true",
    FEATURE_FLAG_SHOW_PARTNERS:
      process.env.FEATURE_FLAG_SHOW_PARTNERS === "true",
    FEATURE_FLAG_SHOW_PROGRAM: process.env.FEATURE_FLAG_SHOW_PROGRAM === "true",
    FEATURE_FLAG_SITE_ONLINE: process.env.FEATURE_FLAG_SITE_ONLINE === "true",
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
    INSTAGRAM_URL: process.env.INSTAGRAM_URL,
    PARTNERS_FORM_URL: process.env.PARTNERS_FORM_URL,
    PRESS_RELEASE_URL: process.env.PRESS_RELEASE_URL,
    PUBLIC_HOST: process.env.PUBLIC_HOST,
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

const ProcessEnvSchema = zu.object({
  ANIMEAUX_URL: zu.string(),
  CARPOOL_FACEBOOK_GROUP_URL: zu.string(),
  CLOUDINARY_API_KEY: zu.string(),
  CLOUDINARY_API_SECRET: zu.string(),
  CLOUDINARY_CLOUD_NAME: zu.string(),
  DATABASE_URL: zu.string(),
  FACEBOOK_URL: zu.string(),
  FEATURE_FLAG_SHOW_EXHIBITORS: zu.enum(["true", "false"]).optional(),
  FEATURE_FLAG_SHOW_PARTNERS: zu.enum(["true", "false"]).optional(),
  FEATURE_FLAG_SHOW_PROGRAM: zu.enum(["true", "false"]).optional(),
  FEATURE_FLAG_SITE_ONLINE: zu.enum(["true", "false"]).optional(),
  GOOGLE_TAG_MANAGER_ID: zu.string().optional(),
  INSTAGRAM_URL: zu.string(),
  PARTNERS_FORM_URL: zu.string(),
  PRESS_RELEASE_URL: zu.string(),
  PUBLIC_HOST: zu.string(),
  RUNTIME_ENV: zu.enum(["local", "production", "staging"]),
  TICKETING_URL: zu.string(),
});
