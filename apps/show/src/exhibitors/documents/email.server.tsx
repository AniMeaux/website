import { EmailHtml } from "#core/data-display/email-html.server";
import { Routes } from "#core/navigation";
import { services } from "#core/services/services.server";
import type { EmailTemplate } from "@animeaux/resend";
import { promiseHash } from "remix-utils/promise";

export async function createEmailTemplateRequest(
  token: string,
): Promise<EmailTemplate> {
  const { documents, application } = await promiseHash({
    documents: services.exhibitor.documents.getFilesByToken(token),

    application: services.exhibitor.application.getByToken(token, {
      select: { contactEmail: true },
    }),
  });

  return {
    name: "documents-exposant-modifie",
    from: "Salon des Ani’Meaux <salon@animeaux.org>",
    to: [application.contactEmail],
    subject: "Documents mis à jour - Salon des Ani’Meaux 2025",
    body: (
      <EmailHtml.Root>
        <EmailHtml.Title>Documents mis à jour</EmailHtml.Title>

        <EmailHtml.Section.Root>
          <EmailHtml.Paragraph>
            Vos documents ont bien été mis à jour.
          </EmailHtml.Paragraph>

          <EmailHtml.Paragraph>
            <EmailHtml.Button
              href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(token).documents.toString()}`}
            >
              Accédez à vos documents
            </EmailHtml.Button>
          </EmailHtml.Paragraph>

          <EmailHtml.Paragraph>
            Pour toute question ou complément d’information, n’hésitez pas à
            nous contacter en répondant à cet e-mail.
          </EmailHtml.Paragraph>
        </EmailHtml.Section.Root>

        <EmailHtml.SectionSeparator />

        <EmailHtml.Section.Root>
          <EmailHtml.Output.Table>
            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Pièce d’identité (CNI ou Passeport)
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {documents.identificationFile?.originalFilename ?? "-"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Justificatif d’immatriculation (Kbis, SIRENE ou récépissé)
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {documents.kbisFile?.originalFilename ?? "-"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Assurance</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {documents.insuranceFile?.originalFilename ?? "-"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>
          </EmailHtml.Output.Table>
        </EmailHtml.Section.Root>

        <EmailHtml.SectionSeparator />

        <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
      </EmailHtml.Root>
    ),
  };
}
