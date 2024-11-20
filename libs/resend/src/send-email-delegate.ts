import { render } from "@react-email/render";
import type { ErrorResponse } from "resend";
import { ResendDelegate } from "./delegate";

export type EmailTemplate = {
  /** The name of the template for debug purposes. */
  name: string;

  from: string;
  to: string[];
  subject: string;
  body: React.ReactElement;
};

export class SendResendDelegate extends ResendDelegate<{
  useTestEmail?: boolean;
  onError?: (
    error: ErrorResponse,
    context: {
      template: EmailTemplate;
      effectiveTo: string[];
      textBody: string;
    },
  ) => void;
}> {
  async template(template: EmailTemplate) {
    const textBody = await render(template.body, { plainText: true });

    if (this.resend == null) {
      console.log(
        [
          "Send email:",
          `  From: ${template.from}`,
          `  To: ${template.to.join(", ")}`,
          `  Subject: ${template.subject}`,
          `  Text:\n\n${textBody}\n`,
        ].join("\n"),
      );

      return;
    }

    const effectiveTo = this.options?.useTestEmail
      ? ["delivered@resend.dev"]
      : template.to;

    const { error } = await this.resend.emails.send({
      from: template.from,
      to: effectiveTo,
      subject: template.subject,
      react: template.body,
      text: textBody,
    });

    if (error != null) {
      this.options?.onError?.(error, { template, effectiveTo, textBody });
    }
  }
}
