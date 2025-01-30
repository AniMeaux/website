import {
  EMAIL_PARAGRAPH_COMPONENTS,
  EMAIL_SENTENCE_COMPONENTS,
  EmailHtml,
} from "#core/data-display/email-html.server";
import { Routes } from "#core/navigation";
import { services } from "#core/services/services.server";
import { DIVIDER_TYPE_TRANSLATION } from "#exhibitors/stand-configuration/divider-type";
import { INSTALLATION_DAY_TRANSLATION } from "#exhibitors/stand-configuration/installation-day";
import { STAND_ZONE_TRANSLATION } from "#exhibitors/stand-configuration/stand-zone";
import { STAND_SIZE_TRANSLATION } from "#exhibitors/stand-size/stand-size";
import type { EmailTemplate } from "@animeaux/resend";
import { ShowExhibitorStandConfigurationStatus } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";
import invariant from "tiny-invariant";

export namespace StandConfigurationEmails {
  export async function submitted(token: string): Promise<EmailTemplate> {
    const { standConfiguration, application } = await promiseHash({
      standConfiguration: services.exhibitor.standConfiguration.getByToken(
        token,
        {
          select: {
            chairCount: true,
            dividerCount: true,
            dividerType: true,
            hasElectricalConnection: true,
            hasTablecloths: true,
            installationDay: true,
            peopleCount: true,
            placementComment: true,
            size: true,
            tableCount: true,
            zone: true,
          },
        },
      ),

      application: services.exhibitor.application.getByToken(token, {
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
                {STAND_SIZE_TRANSLATION[standConfiguration.size]}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Raccordement électrique
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {standConfiguration.hasElectricalConnection ? "Oui" : "Non"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Type de cloisons</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {standConfiguration.dividerType != null
                  ? DIVIDER_TYPE_TRANSLATION[standConfiguration.dividerType]
                  : "-"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Nombre de cloisons
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {standConfiguration.dividerCount}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Nombre de tables</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {standConfiguration.tableCount}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Nappage des tables
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {standConfiguration.hasTablecloths ? "Oui" : "Non"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Nombre de personnes sur le stand
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {standConfiguration.peopleCount}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Nombre de chaises</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {standConfiguration.chairCount}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Jour d’installation
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {standConfiguration.installationDay != null
                  ? INSTALLATION_DAY_TRANSLATION[
                      standConfiguration.installationDay
                    ]
                  : "-"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Emplacement</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {standConfiguration.zone != null
                  ? STAND_ZONE_TRANSLATION[standConfiguration.zone]
                  : "-"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Commentaire sur votre choix d’emplacement
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {standConfiguration.placementComment != null ? (
                  <EmailHtml.Markdown
                    content={standConfiguration.placementComment}
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

    return {
      name: "stand-exposant-demandé",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Demande de stand - Salon des Ani’Meaux 2025",
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Demande de stand</EmailHtml.Title>

          <EmailHtml.Section.Root>
            <EmailHtml.Paragraph>
              Votre demande a bien été envoyée et est en attente de traitement.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(token).stand.toString()}`}
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
    };
  }

  export async function treated(
    exhibitorId: string,
  ): Promise<null | EmailTemplate> {
    const { standConfiguration, exhibitor, application } = await promiseHash({
      standConfiguration: services.exhibitor.standConfiguration.getByExhibitor(
        exhibitorId,
        {
          select: {
            chairCount: true,
            dividerCount: true,
            dividerType: true,
            hasElectricalConnection: true,
            hasTablecloths: true,
            installationDay: true,
            peopleCount: true,
            placementComment: true,
            size: true,
            status: true,
            statusMessage: true,
            tableCount: true,
            zone: true,
          },
        },
      ),

      exhibitor: services.exhibitor.get(exhibitorId, {
        select: { token: true },
      }),

      application: services.exhibitor.application.getByExhibitor(exhibitorId, {
        select: { contactEmail: true },
      }),
    });

    if (
      standConfiguration.status ===
        ShowExhibitorStandConfigurationStatus.AWAITING_VALIDATION ||
      standConfiguration.status ===
        ShowExhibitorStandConfigurationStatus.TO_BE_FILLED
    ) {
      return null;
    }

    switch (standConfiguration.status) {
      case ShowExhibitorStandConfigurationStatus.VALIDATED: {
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
                    {STAND_SIZE_TRANSLATION[standConfiguration.size]}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Raccordement électrique
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {standConfiguration.hasElectricalConnection ? "Oui" : "Non"}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Type de cloisons
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {standConfiguration.dividerType != null
                      ? DIVIDER_TYPE_TRANSLATION[standConfiguration.dividerType]
                      : "-"}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Nombre de cloisons
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {standConfiguration.dividerCount}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Nombre de tables
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {standConfiguration.tableCount}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Nappage des tables
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {standConfiguration.hasTablecloths ? "Oui" : "Non"}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Nombre de personnes sur le stand
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {standConfiguration.peopleCount}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Nombre de chaises
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {standConfiguration.chairCount}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Jour d’installation
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {standConfiguration.installationDay != null
                      ? INSTALLATION_DAY_TRANSLATION[
                          standConfiguration.installationDay
                        ]
                      : "-"}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>Emplacement</EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {standConfiguration.zone != null
                      ? STAND_ZONE_TRANSLATION[standConfiguration.zone]
                      : "-"}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Commentaire sur votre choix d’emplacement
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {standConfiguration.placementComment != null ? (
                      <EmailHtml.Markdown
                        content={standConfiguration.placementComment}
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

        return {
          name: "stand-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Demande de stand - Salon des Ani’Meaux 2025",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Demande de stand</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Paragraph>
                  Votre demande a été validée et ne peut plus être modifiée.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).stand.toString()}`}
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
        };
      }

      case ShowExhibitorStandConfigurationStatus.TO_MODIFY: {
        invariant(
          standConfiguration.statusMessage != null,
          "A statusMessage should exists",
        );

        return {
          name: "stand-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Demande de stand - Salon des Ani’Meaux 2025",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Demande de stand</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Markdown
                  content={standConfiguration.statusMessage}
                  components={EMAIL_PARAGRAPH_COMPONENTS}
                />

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).stand.toString()}`}
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
        };
      }

      default: {
        return standConfiguration.status satisfies never;
      }
    }
  }
}
