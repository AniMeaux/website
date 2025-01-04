import { catchError } from "@animeaux/core";
import { render } from "@react-email/render";
import type { MergeExclusive } from "type-fest";
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
    error: unknown,
    context: { textBody?: string } & MergeExclusive<
      { template: EmailTemplate; effectiveTo: string[] },
      {}
    >,
  ) => void;
}> {
  async template(
    template: null | EmailTemplate | Promise<null | EmailTemplate>,
  ) {
    try {
      template = await template;
    } catch (error) {
      this.options?.onError?.(error, {});
      return;
    }

    if (template == null) {
      return;
    }

    const effectiveTo = this.options?.useTestEmail
      ? ["delivered@resend.dev"]
      : template.to;

    const [renderError, textBody] = await catchError(() =>
      render(template.body, { plainText: true }),
    );

    if (renderError != null) {
      this.options?.onError?.(renderError, { template, effectiveTo });
      return;
    }

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
