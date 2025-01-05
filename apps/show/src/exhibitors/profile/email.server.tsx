import {
  EMAIL_PARAGRAPH_COMPONENTS,
  EMAIL_SENTENCE_COMPONENTS,
  EmailHtml,
} from "#core/data-display/email-html.server";
import { createImageUrl } from "#core/data-display/image";
import { Routes } from "#core/navigation";
import { services } from "#core/services/services.server";
import { ACTIVITY_FIELD_TRANSLATION } from "#exhibitors/activity-field/activity-field";
import { ACTIVITY_TARGET_TRANSLATION } from "#exhibitors/activity-target/activity-target";
import { ImageUrl, joinReactNodes } from "@animeaux/core";
import type { EmailTemplate } from "@animeaux/resend";
import { Img } from "@react-email/components";
import { promiseHash } from "remix-utils/promise";

export async function createEmailTemplateUpdated(
  token: string,
): Promise<EmailTemplate> {
  const { profile, application } = await promiseHash({
    profile: services.exhibitor.profile.getByToken(token, {
      select: {
        activityFields: true,
        activityTargets: true,
        description: true,
        links: true,
        logoPath: true,
        name: true,
      },
    }),

    application: services.exhibitor.application.getByToken(token, {
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
                  ImageUrl.parse(profile.logoPath).id,
                  {
                    size: "512",
                    aspectRatio: "4:3",
                    objectFit: "contain",
                  },
                )}
                alt={profile.name}
                // Reset Img default styles to avoid conflicts.
                style={{ border: undefined }}
                className="aspect-4/3 w-full min-w-0 rounded-2 border border-solid border-mystic-200 object-contain"
              />
            </EmailHtml.Output.Value>
          </EmailHtml.Output.Row>

          <EmailHtml.Output.Row>
            <EmailHtml.Output.Label>Cibles</EmailHtml.Output.Label>

            <EmailHtml.Output.Value>
              {profile.activityTargets
                .map((target) => ACTIVITY_TARGET_TRANSLATION[target])
                .join(", ")}
            </EmailHtml.Output.Value>
          </EmailHtml.Output.Row>

          <EmailHtml.Output.Row>
            <EmailHtml.Output.Label>
              Domaines d’activités
            </EmailHtml.Output.Label>

            <EmailHtml.Output.Value>
              {profile.activityFields
                .map((field) => ACTIVITY_FIELD_TRANSLATION[field])
                .join(", ")}
            </EmailHtml.Output.Value>
          </EmailHtml.Output.Row>

          <EmailHtml.Output.Row>
            <EmailHtml.Output.Label>
              Liens du site internet ou réseaux sociaux
            </EmailHtml.Output.Label>

            <EmailHtml.Output.Value>
              {joinReactNodes(profile.links, <br />)}
            </EmailHtml.Output.Value>
          </EmailHtml.Output.Row>
        </EmailHtml.Output.Table>
      </EmailHtml.Section.Root>
    );
  }

  function SectionDescription() {
    return (
      <EmailHtml.Section.Root>
        <EmailHtml.Section.Title>Description</EmailHtml.Section.Title>

        {profile.description != null ? (
          <EmailHtml.Markdown
            content={profile.description}
            components={EMAIL_PARAGRAPH_COMPONENTS}
          />
        ) : (
          <EmailHtml.Paragraph>Aucune description</EmailHtml.Paragraph>
        )}
      </EmailHtml.Section.Root>
    );
  }

  return {
    name: "profil-exposant-mis-a-jour",
    from: "Salon des Ani’Meaux <salon@animeaux.org>",
    to: [application.contactEmail],
    subject: "Profil mis à jour - Salon des Ani’Meaux 2025",
    body: (
      <EmailHtml.Root>
        <EmailHtml.Title>Profil mis à jour</EmailHtml.Title>

        <EmailHtml.Section.Root>
          <EmailHtml.Paragraph>
            Votre profil exposant a bien été mis à jour.
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

        <SectionDescription />

        <EmailHtml.SectionSeparator />

        <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
      </EmailHtml.Root>
    ),
  };
}

export async function createEmailTemplateAnimationsOnStandUpdated(
  token: string,
): Promise<EmailTemplate> {
  const { profile, application } = await promiseHash({
    profile: services.exhibitor.profile.getByToken(token, {
      select: { onStandAnimations: true },
    }),

    application: services.exhibitor.application.getByToken(token, {
      select: { contactEmail: true },
    }),
  });

  return {
    name: "animation-sur-stand-exposant-mis-a-jour",
    from: "Salon des Ani’Meaux <salon@animeaux.org>",
    to: [application.contactEmail],
    subject: "Animations sur stand mis à jour - Salon des Ani’Meaux 2025",
    body: (
      <EmailHtml.Root>
        <EmailHtml.Title>Animations sur stand mis à jour</EmailHtml.Title>

        <EmailHtml.Section.Root>
          <EmailHtml.Paragraph>
            La description de vos animations sur stand a bien été mise à jour.
          </EmailHtml.Paragraph>

          <EmailHtml.Paragraph>
            <EmailHtml.Button
              href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(token).animations.toString()}`}
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
                {profile.onStandAnimations != null ? (
                  <EmailHtml.Markdown
                    content={profile.onStandAnimations}
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
  };
}
