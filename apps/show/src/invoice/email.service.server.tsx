import { EmailHtml } from "#core/data-display/email-html.server.js";
import type { ServiceEmail } from "#core/email/service.server.js";
import { Routes } from "#core/navigation.js";
import type { ServiceApplication } from "#exhibitors/application/service.server.js";
import type { ServiceExhibitor } from "#exhibitors/service.server.js";
import type { ServiceInvoice } from "#invoice/service.server";
import { promiseHash } from "remix-utils/promise";

export class ServiceInvoiceEmail {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private email: ServiceEmail,
    private exhibitor: ServiceExhibitor,
    private application: ServiceApplication,
    private invoice: ServiceInvoice,
  ) {}

  async newInvoice(exhibitorId: string) {
    const { exhibitor, application } = await promiseHash({
      exhibitor: this.exhibitor.get(exhibitorId, {
        select: { token: true },
      }),

      application: this.application.getByExhibitor(exhibitorId, {
        select: { contactEmail: true },
      }),
    });

    await this.email.send({
      name: "exposant-nouvelle-facture",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Nouvelle facture - Salon des Ani’Meaux 2026",
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Une nouvelle facture est disponible</EmailHtml.Title>

          <EmailHtml.Section.Root>
            <EmailHtml.Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse vitae congue ipsum. Pellentesque non interdum nulla.
              Praesent efficitur porttitor ultricies. Proin sit amet libero
              facilisis, rhoncus massa ut, cursus felis. Pellentesque non libero
              ut tortor egestas hendrerit. Cras tincidunt sagittis eleifend.
              Fusce pellentesque pulvinar porttitor.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).invoice.toString()}`}
              >
                Accédez à vos factures
              </EmailHtml.Button>
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              Pour toute question ou complément d’information, n’hésitez pas à
              nous contacter en répondant à cet e-mail.
            </EmailHtml.Paragraph>
          </EmailHtml.Section.Root>

          <EmailHtml.SectionSeparator />

          <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
        </EmailHtml.Root>
      ),
    });
  }

  async paid(exhibitorId: string, invoiceId: string) {
    const { exhibitor, application, invoice } = await promiseHash({
      exhibitor: this.exhibitor.get(exhibitorId, {
        select: { token: true },
      }),

      application: this.application.getByExhibitor(exhibitorId, {
        select: { contactEmail: true },
      }),

      invoice: this.invoice.get(invoiceId, {
        select: { number: true },
      }),
    });

    await this.email.send({
      name: "exposant-facture-payee",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: `Facture ${invoice.number} réglée - Salon des Ani’Meaux 2026`,
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Facture {invoice.number} réglée</EmailHtml.Title>

          <EmailHtml.Section.Root>
            <EmailHtml.Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse vitae congue ipsum. Pellentesque non interdum nulla.
              Praesent efficitur porttitor ultricies. Proin sit amet libero
              facilisis, rhoncus massa ut, cursus felis. Pellentesque non libero
              ut tortor egestas hendrerit. Cras tincidunt sagittis eleifend.
              Fusce pellentesque pulvinar porttitor.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).invoice.toString()}`}
              >
                Accédez à vos factures
              </EmailHtml.Button>
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              Pour toute question ou complément d’information, n’hésitez pas à
              nous contacter en répondant à cet e-mail.
            </EmailHtml.Paragraph>
          </EmailHtml.Section.Root>

          <EmailHtml.SectionSeparator />

          <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
        </EmailHtml.Root>
      ),
    });
  }
}
