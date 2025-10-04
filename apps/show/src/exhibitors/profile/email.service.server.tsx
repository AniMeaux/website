import {
  EMAIL_PARAGRAPH_COMPONENTS,
  EMAIL_SENTENCE_COMPONENTS,
  EmailHtml,
} from "#core/data-display/email-html.server.js";
import { createImageUrl } from "#core/data-display/image.js";
import type { ServiceEmail } from "#core/email/service.server.js";
import { ImageData } from "#core/image/data.js";
import { Routes } from "#core/navigation.js";
import { ActivityField } from "#exhibitors/activity-field/activity-field.js";
import { ACTIVITY_TARGET_TRANSLATION } from "#exhibitors/activity-target/activity-target.js";
import type { ServiceApplication } from "#exhibitors/application/service.server.js";
import type { ServiceExhibitor } from "#exhibitors/service.server.js";
import { SectionId } from "#routes/_exhibitor.exposants.$token._config.participation._index/section-id.js";
import { joinReactNodes } from "@animeaux/core";
import { ShowExhibitorStatus } from "@prisma/client";
import { Img } from "@react-email/components";
import { promiseHash } from "remix-utils/promise";
import invariant from "tiny-invariant";

export class ServiceExhibitorPublicProfileEmail {
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
          activityFields: true,
          activityTargets: true,
          links: true,
          logoPath: true,
          name: true,
        },
      }),

      application: this.application.getByToken(token, {
        select: { contactEmail: true },
      }),
    });

    function SectionPublicProfile() {
      return (
        <EmailHtml.Section.Root>
          <EmailHtml.Section.Title>Profil public</EmailHtml.Section.Title>

          <EmailHtml.Output.Table>
            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Logo</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                <Img
                  src={createImageUrl(
                    process.env.CLOUDINARY_CLOUD_NAME,
                    ImageData.parse(exhibitor.logoPath).id,
                    {
                      size: "512",
                      aspectRatio: "4:3",
                      objectFit: "contain",
                      fillTransparentBackground: true,
                    },
                  )}
                  alt={exhibitor.name}
                  // Reset Img default styles to avoid conflicts.
                  style={{ border: undefined }}
                  className="aspect-4/3 w-full min-w-0 rounded-2 border border-solid border-alabaster object-contain"
                />
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Cibles</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.activityTargets
                  .map((target) => ACTIVITY_TARGET_TRANSLATION[target])
                  .join(", ")}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Domaines d’activités
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {exhibitor.activityFields
                  .map((field) => ActivityField.translation[field])
                  .join(", ")}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Liens du site internet ou réseaux sociaux
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {joinReactNodes(exhibitor.links, <br />)}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>
          </EmailHtml.Output.Table>
        </EmailHtml.Section.Root>
      );
    }

    await this.email.send({
      name: "profil-public-exposant-mis-a-jour",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Profil public mis à jour - Salon des Ani’Meaux 2026",
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Profil public mis à jour</EmailHtml.Title>

          <EmailHtml.Section.Root>
            <EmailHtml.Paragraph>
              Votre profil public a bien été mis à jour et est en attente de
              traitement.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(token).profile.toString()}`}
              >
                Accédez à votre profil
              </EmailHtml.Button>
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              Pour toute question ou complément d’information, n’hésitez pas à
              nous contacter en répondant à cet e-mail.
            </EmailHtml.Paragraph>
          </EmailHtml.Section.Root>

          <EmailHtml.SectionSeparator />

          <SectionPublicProfile />

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
          activityFields: true,
          activityTargets: true,
          links: true,
          logoPath: true,
          name: true,
          publicProfileStatus: true,
          publicProfileStatusMessage: true,
        },
      }),

      application: this.application.getByExhibitor(exhibitorId, {
        select: { contactEmail: true },
      }),
    });

    if (
      exhibitor.publicProfileStatus ===
        ShowExhibitorStatus.AWAITING_VALIDATION ||
      exhibitor.publicProfileStatus === ShowExhibitorStatus.TO_BE_FILLED
    ) {
      return;
    }

    switch (exhibitor.publicProfileStatus) {
      case ShowExhibitorStatus.VALIDATED: {
        function SectionPublicProfile() {
          return (
            <EmailHtml.Section.Root>
              <EmailHtml.Section.Title>Profil public</EmailHtml.Section.Title>

              <EmailHtml.Output.Table>
                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>Logo</EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    <Img
                      src={createImageUrl(
                        process.env.CLOUDINARY_CLOUD_NAME,
                        ImageData.parse(exhibitor.logoPath).id,
                        {
                          size: "512",
                          aspectRatio: "4:3",
                          objectFit: "contain",
                          fillTransparentBackground: true,
                        },
                      )}
                      alt={exhibitor.name}
                      // Reset Img default styles to avoid conflicts.
                      style={{ border: undefined }}
                      className="aspect-4/3 w-full min-w-0 rounded-2 border border-solid border-alabaster object-contain"
                    />
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>Cibles</EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.activityTargets
                      .map((target) => ACTIVITY_TARGET_TRANSLATION[target])
                      .join(", ")}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Domaines d’activités
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {exhibitor.activityFields
                      .map((field) => ActivityField.translation[field])
                      .join(", ")}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>

                <EmailHtml.Output.Row>
                  <EmailHtml.Output.Label>
                    Liens du site internet ou réseaux sociaux
                  </EmailHtml.Output.Label>

                  <EmailHtml.Output.Value>
                    {joinReactNodes(exhibitor.links, <br />)}
                  </EmailHtml.Output.Value>
                </EmailHtml.Output.Row>
              </EmailHtml.Output.Table>
            </EmailHtml.Section.Root>
          );
        }

        return await this.email.send({
          name: "profil-public-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Profil public - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Profil public</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Paragraph>
                  Votre profil public a été validé et ne peut plus être
                  modifiée.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).profile.toString()}`}
                  >
                    Accédez à votre profil
                  </EmailHtml.Button>
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Pour toute question ou complément d’information, n’hésitez pas
                  à nous contacter en répondant à cet e-mail.
                </EmailHtml.Paragraph>
              </EmailHtml.Section.Root>

              <EmailHtml.SectionSeparator />

              <SectionPublicProfile />

              <EmailHtml.SectionSeparator />

              <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
            </EmailHtml.Root>
          ),
        });
      }

      case ShowExhibitorStatus.TO_MODIFY: {
        invariant(
          exhibitor.publicProfileStatusMessage != null,
          "A publicProfileStatusMessage should exists",
        );

        return await this.email.send({
          name: "profil-public-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Profil public - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Profil public</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Markdown
                  content={exhibitor.publicProfileStatusMessage}
                  components={EMAIL_PARAGRAPH_COMPONENTS}
                />

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).profile.toString()}`}
                  >
                    Accédez à votre profil
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
        return exhibitor.publicProfileStatus satisfies never;
      }
    }
  }
}

export class ServiceExhibitorDescriptionEmail {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private email: ServiceEmail,
    private exhibitor: ServiceExhibitor,
    private application: ServiceApplication,
  ) {}

  async submitted(token: string) {
    const { exhibitor, application } = await promiseHash({
      exhibitor: this.exhibitor.getByToken(token, {
        select: { description: true },
      }),

      application: this.application.getByToken(token, {
        select: { contactEmail: true },
      }),
    });

    function SectionDescription() {
      return (
        <EmailHtml.Section.Root>
          <EmailHtml.Section.Title>Description</EmailHtml.Section.Title>

          {exhibitor.description != null ? (
            <EmailHtml.Markdown
              content={exhibitor.description}
              components={EMAIL_PARAGRAPH_COMPONENTS}
            />
          ) : (
            <EmailHtml.Paragraph>Aucune description.</EmailHtml.Paragraph>
          )}
        </EmailHtml.Section.Root>
      );
    }

    await this.email.send({
      name: "description-exposant-mis-a-jour",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Description mise à jour - Salon des Ani’Meaux 2026",
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Description mise à jour</EmailHtml.Title>

          <EmailHtml.Section.Root>
            <EmailHtml.Paragraph>
              Votre description a bien été mise à jour et est en attente de
              traitement.
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              <EmailHtml.Button
                href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(token).profile.toString()}`}
              >
                Accédez à votre profil
              </EmailHtml.Button>
            </EmailHtml.Paragraph>

            <EmailHtml.Paragraph>
              Pour toute question ou complément d’information, n’hésitez pas à
              nous contacter en répondant à cet e-mail.
            </EmailHtml.Paragraph>
          </EmailHtml.Section.Root>

          <EmailHtml.SectionSeparator />

          <SectionDescription />

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
          description: true,
          descriptionStatus: true,
          descriptionStatusMessage: true,
        },
      }),

      application: this.application.getByExhibitor(exhibitorId, {
        select: { contactEmail: true },
      }),
    });

    if (
      exhibitor.descriptionStatus === ShowExhibitorStatus.AWAITING_VALIDATION ||
      exhibitor.descriptionStatus === ShowExhibitorStatus.TO_BE_FILLED
    ) {
      return;
    }

    switch (exhibitor.descriptionStatus) {
      case ShowExhibitorStatus.VALIDATED: {
        function SectionDescription() {
          return (
            <EmailHtml.Section.Root>
              <EmailHtml.Section.Title>Description</EmailHtml.Section.Title>

              {exhibitor.description != null ? (
                <EmailHtml.Markdown
                  content={exhibitor.description}
                  components={EMAIL_PARAGRAPH_COMPONENTS}
                />
              ) : (
                <EmailHtml.Paragraph>Aucune description.</EmailHtml.Paragraph>
              )}
            </EmailHtml.Section.Root>
          );
        }

        return await this.email.send({
          name: "description-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Description - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Description</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Paragraph>
                  Votre description a été validé et ne peut plus être modifiée.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).profile.toString()}`}
                  >
                    Accédez à votre profil
                  </EmailHtml.Button>
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Pour toute question ou complément d’information, n’hésitez pas
                  à nous contacter en répondant à cet e-mail.
                </EmailHtml.Paragraph>
              </EmailHtml.Section.Root>

              <EmailHtml.SectionSeparator />

              <SectionDescription />

              <EmailHtml.SectionSeparator />

              <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
            </EmailHtml.Root>
          ),
        });
      }

      case ShowExhibitorStatus.TO_MODIFY: {
        invariant(
          exhibitor.descriptionStatusMessage != null,
          "A descriptionStatusMessage should exists",
        );

        return await this.email.send({
          name: "description-exposant-traité",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Description - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Description</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Markdown
                  content={exhibitor.descriptionStatusMessage}
                  components={EMAIL_PARAGRAPH_COMPONENTS}
                />

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(exhibitor.token).profile.toString()}`}
                  >
                    Accédez à votre profil
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
        return exhibitor.descriptionStatus satisfies never;
      }
    }
  }
}

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
