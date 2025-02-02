import { EmailHtml } from "#core/data-display/email-html.server";
import { Routes } from "#core/navigation";
import { services } from "#core/services/services.server";
import type { EmailTemplate } from "@animeaux/resend";

export namespace ExhibitorEmails {
  export async function isVisible(exhibitorId: string): Promise<EmailTemplate> {
    const application = await services.exhibitor.application.getByExhibitor(
      exhibitorId,
      { select: { contactEmail: true } },
    );

    return {
      name: "exposant-visible",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Votre profil exposant est en ligne - Salon des Ani’Meaux 2025",
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
    };
  }
}
