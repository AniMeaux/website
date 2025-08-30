import type { ServiceEmail } from "#core/email/service.server.js";
import { catchError } from "@animeaux/core";
import { render } from "@react-email/render";
import { Resend } from "resend";
import type { MergeExclusive } from "type-fest";

export class ServiceEmailResend implements ServiceEmail {
  private resend: Resend;

  constructor(
    apiKey: string,
    private options: {
      useTestEmail?: boolean;

      onError?: (
        error: unknown,
        context: { textBody?: string } & MergeExclusive<
          { template: ServiceEmail.Template; effectiveTo: string[] },
          {}
        >,
      ) => void;
    },
  ) {
    this.resend = new Resend(apiKey);
  }

  async send(templateParam: ServiceEmail.TemplateParam) {
    const [templateError, template] = await catchError(
      async () => await templateParam,
    );

    if (templateError != null) {
      this.options?.onError?.(templateError, {});

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
