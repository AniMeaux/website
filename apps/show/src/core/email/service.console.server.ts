import type { ServiceEmail } from "#core/email/service.server.js";
import { render } from "@react-email/render";

export class ServiceEmailConsole implements ServiceEmail {
  async send(template: ServiceEmail.TemplateParam) {
    template = await template;

    if (template == null) {
      return;
    }

    const textBody = await render(template.body, { plainText: true });

    console.log(
      [
        "Send email:",
        `  From: ${template.from}`,
        `  To: ${template.to.join(", ")}`,
        `  Subject: ${template.subject}`,
        `  Text:\n\n${textBody}\n`,
      ].join("\n"),
    );
  }
}
