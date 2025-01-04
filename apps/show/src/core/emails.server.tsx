import { SendResendDelegate } from "@animeaux/resend";
import { captureException } from "@sentry/remix";
import { Resend } from "resend";

const resend =
  process.env.RESEND_API_KEY != null
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export const email = {
  send: new SendResendDelegate(resend, {
    useTestEmail:
      process.env.RUNTIME_ENV === "local" &&
      process.env.RESEND_ENABLE_LOCAL !== "true",

    onError: (error, { template, effectiveTo, textBody }) => {
      console.error("Could not send email:", error);

      const { body, ...templateWithoutBody } = template ?? {};

      captureException(new Error("Could not send email"), {
        extra: {
          error,
          template: { ...templateWithoutBody, effectiveTo, textBody },
        },
      });
    },
  }),
};
