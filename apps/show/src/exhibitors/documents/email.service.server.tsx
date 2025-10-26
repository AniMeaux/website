import {
  EMAIL_PARAGRAPH_COMPONENTS,
  EmailHtml,
} from "#core/data-display/email-html.server.js";
import type { ServiceEmail } from "#core/email/service.server.js";
import { Routes } from "#core/navigation.js";
import type { ServiceApplication } from "#exhibitors/application/service.server.js";
import type { ServiceExhibitor } from "#exhibitors/service.server.js";
import { ShowExhibitorStatus } from "@animeaux/prisma/client";
import { promiseHash } from "remix-utils/promise";
import invariant from "tiny-invariant";

export class ServiceExhibitorDocumentEmail {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private email: ServiceEmail,
    private exhibitor: ServiceExhibitor,
    private application: ServiceApplication,
  ) {}

  async submitted(token: string) {
    const { files, application } = await promiseHash({
      files: this.exhibitor.getFilesByToken(token),

      application: this.application.getByToken(token, {
        select: { contactEmail: true },
      }),
    });

    await this.email.send({
      name: "documents-exposant-modifie",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Documents mis à jour - Salon des Ani’Meaux 2026",
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
    });
  }

  async treated(exhibitorId: string) {
    const { exhibitor, files, application } = await promiseHash({
      exhibitor: this.exhibitor.get(exhibitorId, {
        select: {
          token: true,
          documentStatus: true,
          documentStatusMessage: true,
        },
      }),

      files: this.exhibitor.getFilesByExhibitor(exhibitorId),

      application: this.application.getByExhibitor(exhibitorId, {
        select: { contactEmail: true },
      }),
    });

    if (
      exhibitor.documentStatus === ShowExhibitorStatus.AWAITING_VALIDATION ||
      exhibitor.documentStatus === ShowExhibitorStatus.TO_BE_FILLED
    ) {
      return;
    }

    switch (exhibitor.documentStatus) {
      case ShowExhibitorStatus.VALIDATED: {
        return await this.email.send({
          name: "documents-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Documents - Salon des Ani’Meaux 2026",
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
        });
      }

      case ShowExhibitorStatus.TO_MODIFY: {
        invariant(
          exhibitor.documentStatusMessage != null,
          "A documentStatusMessage should exists",
        );

        return await this.email.send({
          name: "documents-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Documents - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Documents</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Markdown
                  content={exhibitor.documentStatusMessage}
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
        });
      }

      default: {
        return exhibitor.documentStatus satisfies never;
      }
    }
  }
}
