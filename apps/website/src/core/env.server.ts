import { zu } from "@animeaux/zod-utils";

export function checkEnv() {
  const result = processEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      "Invalid environment variables:",
      formatErrors(result.error.flatten()),
    );

    throw new Error("Invalid envirmonment variables");
  }
}

function formatErrors(
  errors: zu.inferFlattenedErrors<typeof processEnvSchema>,
) {
  const payload: Record<string, string[]> = {
    ...errors.fieldErrors,
  };

  if (errors.formErrors.length > 0) {
    payload.formErrors = errors.formErrors;
  }

  return JSON.stringify(payload, null, 2);
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
    ADOPTION_FORM_URL: process.env.ADOPTION_FORM_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    DONATION_URL: process.env.DONATION_URL,
    FACEBOOK_URL: process.env.FACEBOOK_URL,
    FOSTER_FAMILY_FORM_URL: process.env.FOSTER_FAMILY_FORM_URL,
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
    INSTAGRAM_URL: process.env.INSTAGRAM_URL,
    LINKEDIN_URL: process.env.LINKEDIN_URL,
    PAYPAL_URL: process.env.PAYPAL_URL,
    PICK_UP_FORM_URL: process.env.PICK_UP_FORM_URL,
    PUBLIC_HOST: process.env.PUBLIC_HOST,
    RUNTIME_ENV: process.env.RUNTIME_ENV,
    SHOW_URL: process.env.SHOW_URL,
    TEAMING_URL: process.env.TEAMING_URL,
    TWITTER_URL: process.env.TWITTER_URL,
    VOLUNTEER_FORM_URL: process.env.VOLUNTEER_FORM_URL,
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

const processEnvSchema = zu.object({
  ADOPTION_FORM_URL: zu.string(),
  CLOUDINARY_CLOUD_NAME: zu.string(),
  DATABASE_URL: zu.string(),
  DONATION_URL: zu.string(),
  FACEBOOK_URL: zu.string(),
  FOSTER_FAMILY_FORM_URL: zu.string(),
  GOOGLE_TAG_MANAGER_ID: zu.string().optional(),
  INSTAGRAM_URL: zu.string(),
  LINKEDIN_URL: zu.string(),
  PAYPAL_URL: zu.string(),
  PICK_UP_FORM_URL: zu.string(),
  PUBLIC_HOST: zu.string(),
  RUNTIME_ENV: zu.enum(["local", "production", "staging"]),
  SENDINBLUE_API_KEY: zu.string().optional(),
  SHOW_URL: zu.string(),
  TEAMING_URL: zu.string(),
  TWITTER_URL: zu.string(),
  VOLUNTEER_FORM_URL: zu.string(),
});
