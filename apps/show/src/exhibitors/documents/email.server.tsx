import {
  EMAIL_PARAGRAPH_COMPONENTS,
  EmailHtml,
} from "#core/data-display/email-html.server";
import { Routes } from "#core/navigation";
import { services } from "#core/services/services.server";
import type { EmailTemplate } from "@animeaux/resend";
import { ShowExhibitorDocumentsStatus } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";
import invariant from "tiny-invariant";

export namespace DocumentsEmails {
  export async function submitted(token: string): Promise<EmailTemplate> {
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
              Vos documents ont bien été mis à jour et son en attente de
              traitement.
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

  export async function treated(
    exhibitorId: string,
  ): Promise<null | EmailTemplate> {
    const { documents, files, exhibitor, application } = await promiseHash({
      documents: services.exhibitor.documents.getByExhibitor(exhibitorId, {
        select: { status: true, statusMessage: true },
      }),

      files: services.exhibitor.documents.getFilesByExhibitor(exhibitorId),

      exhibitor: services.exhibitor.get(exhibitorId, {
        select: { token: true },
      }),

      application: services.exhibitor.application.getByExhibitor(exhibitorId, {
        select: { contactEmail: true },
      }),
    });

    if (
      documents.status === ShowExhibitorDocumentsStatus.AWAITING_VALIDATION ||
      documents.status === ShowExhibitorDocumentsStatus.TO_BE_FILLED
    ) {
      return null;
    }

    switch (documents.status) {
      case ShowExhibitorDocumentsStatus.VALIDATED: {
        return {
          name: "documents-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Documents - Salon des Ani’Meaux 2025",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Documents</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Paragraph>
                  Vos documents ont été validés et ne peuvent plus être
                  modifiés.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).documents.toString()}`}
                  >
                    Accédez à vos documents
                  </EmailHtml.Button>
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Pour toute question ou complément d’information, n’hésitez pas
                  à nous contacter en répondant à cet e-mail.
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
                      {files.identificationFile?.originalFilename ?? "-"}
                    </EmailHtml.Output.Value>
                  </EmailHtml.Output.Row>

                  <EmailHtml.Output.Row>
                    <EmailHtml.Output.Label>
                      Justificatif d’immatriculation (Kbis, SIRENE ou récépissé)
                    </EmailHtml.Output.Label>

                    <EmailHtml.Output.Value>
                      {files.kbisFile?.originalFilename ?? "-"}
                    </EmailHtml.Output.Value>
                  </EmailHtml.Output.Row>

                  <EmailHtml.Output.Row>
                    <EmailHtml.Output.Label>Assurance</EmailHtml.Output.Label>

                    <EmailHtml.Output.Value>
                      {files.insuranceFile?.originalFilename ?? "-"}
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

      case ShowExhibitorDocumentsStatus.TO_MODIFY: {
        invariant(
          documents.statusMessage != null,
          "A statusMessage should exists",
        );

        return {
          name: "documents-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Documents - Salon des Ani’Meaux 2025",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Documents</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Markdown
                  content={documents.statusMessage}
                  components={EMAIL_PARAGRAPH_COMPONENTS}
                />

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).documents.toString()}`}
                  >
                    Accédez à vos documents
                  </EmailHtml.Button>
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Pour toute question ou complément d’information, n’hésitez pas
                  à nous contacter en répondant à cet e-mail.
                </EmailHtml.Paragraph>
              </EmailHtml.Section.Root>

              <EmailHtml.SectionSeparator />

              <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
            </EmailHtml.Root>
          ),
        };
      }

      default: {
        return documents.status satisfies never;
      }
    }
  }
}
