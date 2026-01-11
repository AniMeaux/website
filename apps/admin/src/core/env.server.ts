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
    PRICE_ADDITIONAL_BRACELET: process.env.PRICE_ADDITIONAL_BRACELET,
    PRICE_BREAKFAST_PER_PERSON_PER_DAY:
      process.env.PRICE_BREAKFAST_PER_PERSON_PER_DAY,
    PRICE_CORNER_STAND: process.env.PRICE_CORNER_STAND,
    PRICE_DIVIDER: process.env.PRICE_DIVIDER,
    PRICE_TABLE_CLOTHS: process.env.PRICE_TABLE_CLOTHS,
    RUNTIME_ENV: process.env.RUNTIME_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
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
    GOOGLE_API_CLIENT_EMAIL: zu.string().min(1).optional(),
    GOOGLE_API_PRIVATE_KEY: zu.string().min(1).optional(),
    GOOGLE_DRIVE_ROOT_FOLDER_ID: zu.string(),
    NODE_ENV: zu.enum(["development", "production", "test"]),
    PRICE_ADDITIONAL_BRACELET: zu.coerce
      .number()
      .min(0)
      // Because we access the raw value and not the parsed one, we need to be
      // sure the type remains string and not number.
      .transform((value) => String(value)),
    PRICE_BREAKFAST_PER_PERSON_PER_DAY: zu.coerce
      .number()
      .min(0)
      // Because we access the raw value and not the parsed one, we need to be
      // sure the type remains string and not number.
      .transform((value) => String(value)),
    PRICE_CORNER_STAND: zu.coerce
      .number()
      .min(0)
      // Because we access the raw value and not the parsed one, we need to be
      // sure the type remains string and not number.
      .transform((value) => String(value)),
    PRICE_DIVIDER: zu.coerce
      .number()
      .min(0)
      // Because we access the raw value and not the parsed one, we need to be
      // sure the type remains string and not number.
      .transform((value) => String(value)),
    PRICE_TABLE_CLOTHS: zu.coerce
      .number()
      .min(0)
      // Because we access the raw value and not the parsed one, we need to be
      // sure the type remains string and not number.
      .transform((value) => String(value)),
    RUNTIME_ENV: zu.enum(["local", "production", "staging"]),
    SENTRY_DSN: zu.string().optional(),
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
    (env) => env.GOOGLE_API_CLIENT_EMAIL != null || env.RUNTIME_ENV == "local",
    (env) => ({
      path: ["GOOGLE_API_CLIENT_EMAIL"],
      message: `Required when \`RUNTIME_ENV=${env.RUNTIME_ENV}\``,
    }),
  )
  .refine(
    (env) => env.GOOGLE_API_PRIVATE_KEY != null || env.RUNTIME_ENV === "local",
    (env) => ({
      path: ["GOOGLE_API_PRIVATE_KEY"],
      message: `Required when \`RUNTIME_ENV=${env.RUNTIME_ENV}\``,
    }),
  );
