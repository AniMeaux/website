import type { IsFirstProps } from "#core/data-display/email-html.server.js";
import {
  EMAIL_PARAGRAPH_COMPONENTS,
  EmailHtml,
} from "#core/data-display/email-html.server.js";
import type { ServiceEmail } from "#core/email/service.server.js";
import { Routes } from "#core/navigation.js";
import type { ServiceApplication } from "#exhibitors/application/service.server.js";
import { GENDER_TRANSLATION } from "#exhibitors/dogs-configuration/gender.js";
import type { ServiceExhibitor } from "#exhibitors/service.server.js";
import { SectionId } from "#routes/_exhibitor.exposants.$token._config.stand._index/section-id.js";
import { joinReactNodes } from "@animeaux/core";
import { Gender, ShowExhibitorStatus } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";
import invariant from "tiny-invariant";

export class ServiceExhibitorDogConfigurationEmail {
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
          dogs: {
            select: {
              gender: true,
              id: true,
              idNumber: true,
              isCategorized: true,
              isSterilized: true,
            },
          },
        },
      }),

      application: this.application.getByToken(token, {
        select: { contactEmail: true },
      }),
    });

    function SectionDog({
      dog,
      _isFirst,
    }: IsFirstProps & {
      dog: (typeof exhibitor.dogs)[number];
    }) {
      return (
        <>
          <EmailHtml.Output.Row _isFirst={_isFirst}>
            <EmailHtml.Output.Label>
              Numéro d’identification
            </EmailHtml.Output.Label>

            <EmailHtml.Output.Value>{dog.idNumber}</EmailHtml.Output.Value>
          </EmailHtml.Output.Row>

          <EmailHtml.Output.Row>
            <EmailHtml.Output.Label>Genre</EmailHtml.Output.Label>

            <EmailHtml.Output.Value>
              {GENDER_TRANSLATION[dog.gender]}
            </EmailHtml.Output.Value>
          </EmailHtml.Output.Row>

          <EmailHtml.Output.Row>
            <EmailHtml.Output.Label>
              {dog.gender === Gender.FEMALE
                ? "Elle est stérilisée"
                : "Il est castré"}
            </EmailHtml.Output.Label>

            <EmailHtml.Output.Value>
              {dog.isSterilized ? "Oui" : "Non"}
            </EmailHtml.Output.Value>
          </EmailHtml.Output.Row>

          <EmailHtml.Output.Row>
            <EmailHtml.Output.Label>
              {dog.gender === Gender.FEMALE
                ? "Elle est catégorisée"
                : "Il est catégorisé"}
            </EmailHtml.Output.Label>

            <EmailHtml.Output.Value>
              {dog.isCategorized ? "Oui" : "Non"}
            </EmailHtml.Output.Value>
          </EmailHtml.Output.Row>
        </>
      );
    }

    function SectionDogs() {
      return (
        <EmailHtml.Section.Root>
          <EmailHtml.Section.Title>Chiens sur stand</EmailHtml.Section.Title>

          {exhibitor.dogs.length === 0 ? (
            <EmailHtml.Paragraph>
              Aucun chien présent sur le stand.
            </EmailHtml.Paragraph>
          ) : (
            <EmailHtml.Output.Table>
              {joinReactNodes(
                exhibitor.dogs.map((dog) => (
                  <SectionDog key={dog.id} dog={dog} />
                )),
                <EmailHtml.Output.RowSeparator />,
              )}
            </EmailHtml.Output.Table>
          )}
        </EmailHtml.Section.Root>
      );
    }

    await this.email.send({
      name: "chiens-exposant-demandé",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Présence de votre chien - Salon des Ani’Meaux 2026",
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Présence de votre chien</EmailHtml.Title>

          <EmailHtml.Section.Root>
            <EmailHtml.Paragraph>
              Votre demande a bien été envoyée et est en attente de traitement.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(token).stand.toString(SectionId.DOGS)}`}
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

          <SectionDogs />

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
          dogsConfigurationStatus: true,
          dogsConfigurationStatusMessage: true,

          dogs: {
            select: {
              gender: true,
              id: true,
              idNumber: true,
              isCategorized: true,
              isSterilized: true,
            },
          },
        },
      }),

      application: this.application.getByExhibitor(exhibitorId, {
        select: { contactEmail: true },
      }),
    });

    if (
      exhibitor.dogsConfigurationStatus ===
        ShowExhibitorStatus.AWAITING_VALIDATION ||
      exhibitor.dogsConfigurationStatus === ShowExhibitorStatus.TO_BE_FILLED
    ) {
      return;
    }

    switch (exhibitor.dogsConfigurationStatus) {
      case ShowExhibitorStatus.VALIDATED: {
        function SectionDog({
          dog,
          _isFirst,
        }: IsFirstProps & {
          dog: (typeof exhibitor.dogs)[number];
        }) {
          return (
            <>
              <EmailHtml.Output.Row _isFirst={_isFirst}>
                <EmailHtml.Output.Label>
                  Numéro d’identification
                </EmailHtml.Output.Label>

                <EmailHtml.Output.Value>{dog.idNumber}</EmailHtml.Output.Value>
              </EmailHtml.Output.Row>

              <EmailHtml.Output.Row>
                <EmailHtml.Output.Label>Genre</EmailHtml.Output.Label>

                <EmailHtml.Output.Value>
                  {GENDER_TRANSLATION[dog.gender]}
                </EmailHtml.Output.Value>
              </EmailHtml.Output.Row>

              <EmailHtml.Output.Row>
                <EmailHtml.Output.Label>
                  {dog.gender === Gender.FEMALE
                    ? "Elle est stérilisée"
                    : "Il est castré"}
                </EmailHtml.Output.Label>

                <EmailHtml.Output.Value>
                  {dog.isSterilized ? "Oui" : "Non"}
                </EmailHtml.Output.Value>
              </EmailHtml.Output.Row>

              <EmailHtml.Output.Row>
                <EmailHtml.Output.Label>
                  {dog.gender === Gender.FEMALE
                    ? "Elle est catégorisée"
                    : "Il est catégorisé"}
                </EmailHtml.Output.Label>

                <EmailHtml.Output.Value>
                  {dog.isCategorized ? "Oui" : "Non"}
                </EmailHtml.Output.Value>
              </EmailHtml.Output.Row>
            </>
          );
        }

        function SectionDogs() {
          return (
            <EmailHtml.Section.Root>
              <EmailHtml.Section.Title>
                Chiens sur stand
              </EmailHtml.Section.Title>

              {exhibitor.dogs.length === 0 ? (
                <EmailHtml.Paragraph>
                  Aucun chien présent sur le stand.
                </EmailHtml.Paragraph>
              ) : (
                <EmailHtml.Output.Table>
                  {joinReactNodes(
                    exhibitor.dogs.map((dog) => (
                      <SectionDog key={dog.id} dog={dog} />
                    )),
                    <EmailHtml.Output.RowSeparator />,
                  )}
                </EmailHtml.Output.Table>
              )}
            </EmailHtml.Section.Root>
          );
        }

        return await this.email.send({
          name: "chiens-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Présence de votre chien - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Présence de votre chien</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Paragraph>
                  Votre demande a été validée et ne peut plus être modifiée.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).stand.toString(SectionId.DOGS)}`}
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

              <SectionDogs />

              <EmailHtml.SectionSeparator />

              <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
            </EmailHtml.Root>
          ),
        });
      }

      case ShowExhibitorStatus.TO_MODIFY: {
        invariant(
          exhibitor.dogsConfigurationStatusMessage != null,
          "A dogsConfigurationStatusMessage should exists",
        );

        return await this.email.send({
          name: "chiens-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Présence de votre chien - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Présence de votre chien</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Markdown
                  content={exhibitor.dogsConfigurationStatusMessage}
                  components={EMAIL_PARAGRAPH_COMPONENTS}
                />

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).stand.toString(SectionId.DOGS)}`}
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
        return exhibitor.dogsConfigurationStatus satisfies never;
      }
    }
  }
}
