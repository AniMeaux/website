import {
  EMAIL_PARAGRAPH_COMPONENTS,
  EMAIL_SENTENCE_COMPONENTS,
  EmailHtml,
} from "#core/data-display/email-html.server.js";
import type { ServiceEmail } from "#core/email/service.server.js";
import { Routes } from "#core/navigation.js";
import type { ServiceApplication } from "#exhibitors/application/service.server.js";
import type { ServiceExhibitor } from "#exhibitors/service.server.js";
import { SectionId } from "#routes/_exhibitor.exposants.$token._config.participation._index/section-id.js";
import { ShowExhibitorStatus } from "@animeaux/prisma";
import { promiseHash } from "remix-utils/promise";
import invariant from "tiny-invariant";

export class ServiceExhibitorOnStandAnimationEmail {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private email: ServiceEmail,
    private exhibitor: ServiceExhibitor,
    private application: ServiceApplication,
  ) {}

  async submitted(token: string) {
    const { exhibitor, application } = await promiseHash({
      exhibitor: this.exhibitor.getByToken(token, {
        select: { onStandAnimations: true },
      }),

      application: this.application.getByToken(token, {
        select: { contactEmail: true },
      }),
    });

    await this.email.send({
      name: "animation-sur-stand-exposant-mis-a-jour",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Animations sur stand mis à jour - Salon des Ani’Meaux 2026",
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Animations sur stand mis à jour</EmailHtml.Title>

          <EmailHtml.Section.Root>
            <EmailHtml.Paragraph>
              La description de vos animations sur stand a bien été mise à jour
              et est en attente de traitement.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(token).participation.toString(SectionId.ON_STAND_ANIMATIONS)}`}
              >
                Accédez à vos animations
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
                <EmailHtml.Output.Label>Description</EmailHtml.Output.Label>

                <EmailHtml.Output.Value>
                  {exhibitor.onStandAnimations != null ? (
                    <EmailHtml.Markdown
                      content={exhibitor.onStandAnimations}
                      components={EMAIL_SENTENCE_COMPONENTS}
                    />
                  ) : (
                    "-"
                  )}
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
    const { exhibitor, application } = await promiseHash({
      exhibitor: this.exhibitor.get(exhibitorId, {
        select: {
          token: true,
          onStandAnimations: true,
          onStandAnimationsStatus: true,
          onStandAnimationsStatusMessage: true,
        },
      }),

      application: this.application.getByExhibitor(exhibitorId, {
        select: { contactEmail: true },
      }),
    });

    if (
      exhibitor.onStandAnimationsStatus ===
        ShowExhibitorStatus.AWAITING_VALIDATION ||
      exhibitor.onStandAnimationsStatus === ShowExhibitorStatus.TO_BE_FILLED
    ) {
      return;
    }

    switch (exhibitor.onStandAnimationsStatus) {
      case ShowExhibitorStatus.VALIDATED: {
        return await this.email.send({
          name: "animation-sur-stand-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Animations sur stand - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Animations sur stand</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Paragraph>
                  La description de vos animations sur stand a été validé et ne
                  peut plus être modifiée.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).participation.toString(SectionId.ON_STAND_ANIMATIONS)}`}
                  >
                    Accédez à vos animations
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
                    <EmailHtml.Output.Label>Description</EmailHtml.Output.Label>

                    <EmailHtml.Output.Value>
                      {exhibitor.onStandAnimations != null ? (
                        <EmailHtml.Markdown
                          content={exhibitor.onStandAnimations}
                          components={EMAIL_SENTENCE_COMPONENTS}
                        />
                      ) : (
                        "-"
                      )}
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
          exhibitor.onStandAnimationsStatusMessage != null,
          "A onStandAnimationsStatusMessage should exists",
        );

        return await this.email.send({
          name: "animation-sur-stand-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Animations sur stand - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Animations sur stand</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Markdown
                  content={exhibitor.onStandAnimationsStatusMessage}
                  components={EMAIL_PARAGRAPH_COMPONENTS}
                />

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).participation.toString(SectionId.ON_STAND_ANIMATIONS)}`}
                  >
                    Accédez à vos animations
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
        return exhibitor.onStandAnimationsStatus satisfies never;
      }
    }
  }
}
