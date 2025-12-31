import { EmailHtml } from "#i/core/data-display/email-html.server.js";
import type { ServiceEmail } from "#i/core/email/service.server.js";
import { Routes } from "#i/core/navigation.js";
import type { ServiceApplication } from "#i/exhibitors/application/service.server.js";

export class ServiceExhibitorVisibilityEmail {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private email: ServiceEmail,
    private application: ServiceApplication,
  ) {}

  async isVisible(exhibitorId: string) {
    const application = await this.application.getByExhibitor(exhibitorId, {
      select: { contactEmail: true },
    });

    await this.email.send({
      name: "exposant-visible",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Votre profil exposant est en ligne - Salon des Ani’Meaux 2026",
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Votre profil exposant est en ligne</EmailHtml.Title>

          <EmailHtml.Section.Root>
            <EmailHtml.Paragraph>
              Nous avons le plaisir de vous informer que votre profil exposant
              est désormais en ligne sur le site du Salon des Ani’Meaux.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.toString()}`}
              >
                Voir tous les exposants
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
