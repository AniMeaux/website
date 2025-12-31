import {
  EMAIL_SENTENCE_COMPONENTS,
  EmailHtml,
} from "#i/core/data-display/email-html.server.js";
import type { ServiceEmail } from "#i/core/email/service.server.js";
import { Routes } from "#i/core/navigation.js";
import type { ServiceApplication } from "#i/exhibitors/application/service.server.js";
import type { ServiceExhibitor } from "#i/exhibitors/service.server.js";
import type { ServiceInvoice } from "#i/invoice/service.server";
import { getCompleteLocation } from "@animeaux/core";
import { promiseHash } from "remix-utils/promise";

export class ServiceInvoiceEmail {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private email: ServiceEmail,
    private exhibitor: ServiceExhibitor,
    private application: ServiceApplication,
    private invoice: ServiceInvoice,
  ) {}

  async billingAddressChanged(token: string) {
    const { exhibitor, application } = await promiseHash({
      exhibitor: this.exhibitor.getByToken(token, {
        select: {
          token: true,
          billingAddress: true,
          billingZipCode: true,
          billingCity: true,
          billingCountry: true,
        },
      }),

      application: this.application.getByToken(token, {
        select: { contactEmail: true },
      }),
    });

    function SectionBilling() {
      return (
        <EmailHtml.Section.Root>
          <EmailHtml.Output.Table>
            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Adresse de facturation
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                <EmailHtml.Markdown
                  content={getCompleteLocation({
                    address: exhibitor.billingAddress,
                    zipCode: exhibitor.billingZipCode,
                    city: exhibitor.billingCity,
                    country: exhibitor.billingCountry,
                  })}
                  components={EMAIL_SENTENCE_COMPONENTS}
                />
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>
          </EmailHtml.Output.Table>
        </EmailHtml.Section.Root>
      );
    }

    await this.email.send({
      name: "exposant-adresse-de-facturation-mise-a-jour",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Adresse de facturation mise à jour - Salon des Ani’Meaux 2026",
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Adresse de facturation mise à jour</EmailHtml.Title>

          <EmailHtml.Section.Root>
            <EmailHtml.Paragraph>
              Votre adresse de facturation a bien été mise à jour.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).invoice.toString()}`}
              >
                Accédez à la facturation
              </EmailHtml.Button>
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              Pour toute question ou complément d’information, n’hésitez pas à
              nous contacter en répondant à cet e-mail.
            </EmailHtml.Paragraph>
          </EmailHtml.Section.Root>

          <EmailHtml.SectionSeparator />

          <SectionBilling />

          <EmailHtml.SectionSeparator />

          <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
        </EmailHtml.Root>
      ),
    });
  }

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
              Bonjour,
              <br />
              <br />
              Une nouvelle facture a été ajoutée dans votre espace exposant.
              Vous pouvez la consulter et la régler directement en ligne.
              <br />
              <br />
              Merci de procéder au paiement dans les délais indiqués afin de
              confirmer définitivement votre inscription et de soutenir
              l’organisation du Salon des Ani’Meaux.
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
              Bonjour,
              <br />
              <br />
              Nous vous confirmons que la facture{" "}
              <EmailHtml.Strong>{invoice.number}</EmailHtml.Strong> a bien été
              réglée.
              <br />
              <br />
              Votre paiement a été pris en compte et votre
              inscription/prestation est désormais confirmée.
              <br />
              <br />
              Vous pouvez retrouver vos factures et justificatifs à tout moment
              depuis votre espace exposant.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).invoice.toString()}`}
              >
                Accédez à vos factures
              </EmailHtml.Button>
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              Merci pour votre confiance et pour votre soutien au Salon des
              Ani’Meaux.
              <br />
              <br />
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
