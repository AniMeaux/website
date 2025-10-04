import {
  EMAIL_PARAGRAPH_COMPONENTS,
  EMAIL_SENTENCE_COMPONENTS,
  EmailHtml,
} from "#core/data-display/email-html.server.js";
import type { ServiceEmail } from "#core/email/service.server.js";
import { Routes } from "#core/navigation.js";
import type { ServiceApplication } from "#exhibitors/application/service.server.js";
import type { ServiceExhibitor } from "#exhibitors/service.server.js";
import { INSTALLATION_DAY_TRANSLATION } from "#exhibitors/stand-configuration/installation-day.js";
import { SectionId } from "#routes/_exhibitor.exposants.$token._config.stand._index/section-id.js";
import { ShowExhibitorStatus } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";
import invariant from "tiny-invariant";

export class ServiceExhibitorStandConfigurationEmail {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private email: ServiceEmail,
    private exhibitor: ServiceExhibitor,
    private application: ServiceApplication,
  ) {}

  async submitted(token: string) {
    const { exhibitor, application } = await promiseHash({
      exhibitor: this.exhibitor.getByToken(token, {
        select: {
          chairCount: true,
          dividerCount: true,
          dividerType: { select: { label: true } },
          hasCorner: true,
          hasElectricalConnection: true,
          hasTableCloths: true,
          installationDay: true,
          peopleCount: true,
          placementComment: true,
          size: { select: { label: true } },
          tableCount: true,
          zone: true,
        },
      }),

      application: this.application.getByToken(token, {
        select: { contactEmail: true },
      }),
    });

    function SectionStand() {
      return (
        <EmailHtml.Section.Root>
          <EmailHtml.Section.Title>
            Configuration de stand
          </EmailHtml.Section.Title>

          <EmailHtml.Output.Table>
            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Taille du stand souhaité
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.size.label}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Raccordement électrique
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.hasElectricalConnection ? "Oui" : "Non"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Placement privilégié (stand en angle)
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.hasCorner ? "Oui" : "Non"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Type de cloisons</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.dividerType?.label ?? "Aucune cloison"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            {exhibitor.dividerType != null ? (
              <EmailHtml.Output.Row>
                <EmailHtml.Output.Label>
                  Nombre de cloisons
                </EmailHtml.Output.Label>

                <EmailHtml.Output.Value>
                  {exhibitor.dividerCount}
                </EmailHtml.Output.Value>
              </EmailHtml.Output.Row>
            ) : null}

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Nombre de tables</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.tableCount}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Nappage des tables
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.hasTableCloths ? "Oui" : "Non"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Nombre total de personnes samedi et dimanche
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.peopleCount}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Nombre de chaises</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.chairCount}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Jour d’installation
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.installationDay != null
                  ? INSTALLATION_DAY_TRANSLATION[exhibitor.installationDay]
                  : "-"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Commentaire sur votre choix d’emplacement
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.placementComment != null ? (
                  <EmailHtml.Markdown
                    content={exhibitor.placementComment}
                    components={EMAIL_SENTENCE_COMPONENTS}
                  />
                ) : (
                  "-"
                )}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>
          </EmailHtml.Output.Table>
        </EmailHtml.Section.Root>
      );
    }

    await this.email.send({
      name: "stand-exposant-demandé",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Demande de stand - Salon des Ani’Meaux 2026",
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Demande de stand</EmailHtml.Title>

          <EmailHtml.Section.Root>
            <EmailHtml.Paragraph>
              Votre demande a bien été envoyée et est en attente de traitement.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(token).stand.toString(SectionId.STAND)}`}
              >
                Accédez à votre stand
              </EmailHtml.Button>
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              Pour toute question ou complément d’information, n’hésitez pas à
              nous contacter en répondant à cet e-mail.
            </EmailHtml.Paragraph>
          </EmailHtml.Section.Root>

          <EmailHtml.SectionSeparator />

          <SectionStand />

          <EmailHtml.SectionSeparator />

          <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
        </EmailHtml.Root>
      ),
    });
  }

  async treated(exhibitorId: string) {
    const { exhibitor, application } = await promiseHash({
      exhibitor: this.exhibitor.get(exhibitorId, {
        select: {
          token: true,
          chairCount: true,
          dividerCount: true,
          dividerType: { select: { label: true } },
          hasCorner: true,
          hasElectricalConnection: true,
          hasTableCloths: true,
          installationDay: true,
          peopleCount: true,
          placementComment: true,
          size: { select: { label: true } },
          standConfigurationStatus: true,
          standConfigurationStatusMessage: true,
          tableCount: true,
          zone: true,
        },
      }),

      application: this.application.getByExhibitor(exhibitorId, {
        select: { contactEmail: true },
      }),
    });

    if (
      exhibitor.standConfigurationStatus ===
        ShowExhibitorStatus.AWAITING_VALIDATION ||
      exhibitor.standConfigurationStatus === ShowExhibitorStatus.TO_BE_FILLED
    ) {
      return;
    }

    switch (exhibitor.standConfigurationStatus) {
      case ShowExhibitorStatus.VALIDATED: {
        function SectionStand() {
          return (
            <EmailHtml.Section.Root>
              <EmailHtml.Section.Title>
                Configuration de stand
              </EmailHtml.Section.Title>

              <EmailHtml.Output.Table>
                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Taille du stand souhaité
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.size.label}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Raccordement électrique
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.hasElectricalConnection ? "Oui" : "Non"}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Placement privilégié (stand en angle)
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.hasCorner ? "Oui" : "Non"}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Type de cloisons
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.dividerType?.label ?? "Aucune cloison"}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                {exhibitor.dividerType != null ? (
                  <EmailHtml.Output.Row>
                    <EmailHtml.Output.Label>
                      Nombre de cloisons
                    </EmailHtml.Output.Label>

                    <EmailHtml.Output.Value>
                      {exhibitor.dividerCount}
                    </EmailHtml.Output.Value>
                  </EmailHtml.Output.Row>
                ) : null}

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Nombre de tables
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.tableCount}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Nappage des tables
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.hasTableCloths ? "Oui" : "Non"}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Nombre total de personnes samedi et dimanche
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.peopleCount}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Nombre de chaises
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.chairCount}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Jour d’installation
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.installationDay != null
                      ? INSTALLATION_DAY_TRANSLATION[exhibitor.installationDay]
                      : "-"}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Commentaire sur votre choix d’emplacement
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.placementComment != null ? (
                      <EmailHtml.Markdown
                        content={exhibitor.placementComment}
                        components={EMAIL_SENTENCE_COMPONENTS}
                      />
                    ) : (
                      "-"
                    )}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>
              </EmailHtml.Output.Table>
            </EmailHtml.Section.Root>
          );
        }

        return await this.email.send({
          name: "stand-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Demande de stand - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Demande de stand</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Paragraph>
                  Votre demande a été validée et ne peut plus être modifiée.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).stand.toString(SectionId.STAND)}`}
                  >
                    Accédez à votre stand
                  </EmailHtml.Button>
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Pour toute question ou complément d’information, n’hésitez pas
                  à nous contacter en répondant à cet e-mail.
                </EmailHtml.Paragraph>
              </EmailHtml.Section.Root>

              <EmailHtml.SectionSeparator />

              <SectionStand />

              <EmailHtml.SectionSeparator />

              <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
            </EmailHtml.Root>
          ),
        });
      }

      case ShowExhibitorStatus.TO_MODIFY: {
        invariant(
          exhibitor.standConfigurationStatusMessage != null,
          "A standConfigurationStatusMessage should exists",
        );

        return await this.email.send({
          name: "stand-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Demande de stand - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Demande de stand</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Markdown
                  content={exhibitor.standConfigurationStatusMessage}
                  components={EMAIL_PARAGRAPH_COMPONENTS}
                />

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).stand.toString(SectionId.STAND)}`}
                  >
                    Accédez à votre stand
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
        return exhibitor.standConfigurationStatus satisfies never;
      }
    }
  }
}
