import { EmailHtml } from "#core/data-display/email-html.server";
import { createImageUrl } from "#core/data-display/image";
import { ImageUrl } from "@animeaux/core";
import type { EmailTemplate } from "@animeaux/resend";
import type { ShowExhibitorApplication } from "@prisma/client";
import { Img } from "@react-email/components";
import { ACTIVITY_FIELD_TRANSLATION } from "./activity-field";
import { LEGAL_STATUS_TRANSLATION } from "./legal-status";
import {
  EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORY_TRANSLATION,
  PARTNERSHIP_CATEGORY_TRANSLATION,
} from "./partnership-category";
import { STAND_SIZE_TRANSLATION } from "./stand-size";

export function createEmailTemplateConfirmation(
  application: ShowExhibitorApplication,
): EmailTemplate {
  return {
    name: "candidature-exposant-confirmation",
    from: "Salon des Ani’Meaux <salon@animeaux.org>",
    to: [application.contactEmail],
    subject: "Candidature exposant - Salon des Ani’Meaux 2024",
    body: <EmailBody application={application} />,
  };
}

function EmailBody({ application }: { application: ShowExhibitorApplication }) {
  return (
    <EmailHtml.Root>
      <EmailHtml.Title>Candidature exposant</EmailHtml.Title>

      <EmailSectionInformation />

      <EmailHtml.Separator />

      <EmailSectionContact application={application} />
      <EmailSectionStructure application={application} />
      <EmailSectionBilling application={application} />
      <EmailSectionParticipation application={application} />
      <EmailSectionPartnership application={application} />
      <EmailSectionDiscoverySource application={application} />

      <EmailHtml.Separator />

      <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
    </EmailHtml.Root>
  );
}

function EmailSectionInformation() {
  return (
    <EmailHtml.Paragraph>
      Merci pour votre candidature au Salon des Ani’Meaux 2025.
      <br />
      <br />
      Votre dossier en cours de validation et vous recevrez par email toute
      évolution de votre demande.
      <br />
      <br />
      Pour tout complément d’informations, vous pouvez nous contacter via{" "}
      <EmailHtml.Link href={process.env.FACEBOOK_URL}>
        Facebook
      </EmailHtml.Link>,{" "}
      <EmailHtml.Link href={process.env.INSTAGRAM_URL}>
        Instagram
      </EmailHtml.Link>{" "}
      ou par{" "}
      <EmailHtml.Link href="mailto:salon@animeaux.org">email</EmailHtml.Link>.
    </EmailHtml.Paragraph>
  );
}

function EmailSectionContact({
  application,
}: {
  application: ShowExhibitorApplication;
}) {
  return (
    <EmailHtml.Section.Root>
      <EmailHtml.Section.Title>Contact</EmailHtml.Section.Title>

      <EmailHtml.Output.Table>
        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Nom</EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.contactLastname}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Prénom</EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.contactFirstname}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Adresse email</EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.contactEmail}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Numéro de téléphone</EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.contactPhone}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>
      </EmailHtml.Output.Table>
    </EmailHtml.Section.Root>
  );
}

function EmailSectionStructure({
  application,
}: {
  application: ShowExhibitorApplication;
}) {
  return (
    <EmailHtml.Section.Root>
      <EmailHtml.Section.Title>Structure</EmailHtml.Section.Title>

      <EmailHtml.Output.Table>
        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Nom</EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.structureName}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Lien</EmailHtml.Output.Label>
          <EmailHtml.Output.Value>
            {application.structureUrl}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Forme juridique</EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.structureLegalStatus != null
              ? LEGAL_STATUS_TRANSLATION[application.structureLegalStatus]
              : application.structureOtherLegalStatus}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>
            Identification (SIRET…)
          </EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.structureSiret}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>
            Adresse de domiciliation
          </EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.structureAddress}
            <br />
            {application.structureZipCode} {application.structureCity}
            <br />
            {application.structureCountry}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Domaines d’activités</EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.structureActivityFields
              .map((field) => ACTIVITY_FIELD_TRANSLATION[field])
              .join(", ")}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Logo</EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            <Img
              src={createImageUrl(
                process.env.CLOUDINARY_CLOUD_NAME,
                ImageUrl.parse(application.structureLogoPath).id,
                {
                  size: "512",
                  aspectRatio: "4:3",
                  objectFit: "contain",
                },
              )}
              alt={application.structureName}
              // Reset Img default styles to avoid conflicts.
              style={{ border: undefined }}
              className="aspect-4/3 w-full min-w-0 rounded-2 border border-solid border-mystic-200 object-contain"
            />
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>
      </EmailHtml.Output.Table>
    </EmailHtml.Section.Root>
  );
}

function EmailSectionBilling({
  application,
}: {
  application: ShowExhibitorApplication;
}) {
  return (
    <EmailHtml.Section.Root>
      <EmailHtml.Section.Title>Facturation</EmailHtml.Section.Title>

      <EmailHtml.Output.Table>
        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>
            Adresse de facturation
          </EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.billingAddress}
            <br />
            {application.billingZipCode} {application.billingCity}
            <br />
            {application.billingCountry}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>
      </EmailHtml.Output.Table>
    </EmailHtml.Section.Root>
  );
}

function EmailSectionParticipation({
  application,
}: {
  application: ShowExhibitorApplication;
}) {
  return (
    <EmailHtml.Section.Root>
      <EmailHtml.Section.Title>Participation</EmailHtml.Section.Title>

      <EmailHtml.Output.Table>
        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>
            Taille du stand souhaité
          </EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {STAND_SIZE_TRANSLATION[application.desiredStandSize]}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>

        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>Animation sur scène</EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.proposalForOnStageEntertainment ?? "Aucune"}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>
      </EmailHtml.Output.Table>
    </EmailHtml.Section.Root>
  );
}

function EmailSectionPartnership({
  application,
}: {
  application: ShowExhibitorApplication;
}) {
  return (
    <EmailHtml.Section.Root>
      <EmailHtml.Section.Title>Partenariat</EmailHtml.Section.Title>

      <EmailHtml.Output.Table>
        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>
            Catégorie de partenariat
          </EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.partnershipCategory != null
              ? PARTNERSHIP_CATEGORY_TRANSLATION[
                  application.partnershipCategory
                ]
              : application.otherPartnershipCategory != null
                ? EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORY_TRANSLATION[
                    application.otherPartnershipCategory
                  ]
                : null}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>
      </EmailHtml.Output.Table>
    </EmailHtml.Section.Root>
  );
}

function EmailSectionDiscoverySource({
  application,
}: {
  application: ShowExhibitorApplication;
}) {
  return (
    <EmailHtml.Section.Root>
      <EmailHtml.Section.Title>Source</EmailHtml.Section.Title>

      <EmailHtml.Output.Table>
        <EmailHtml.Output.Row>
          <EmailHtml.Output.Label>
            Comment avez-vous connus le salon ?
          </EmailHtml.Output.Label>

          <EmailHtml.Output.Value>
            {application.discoverySource}
          </EmailHtml.Output.Value>
        </EmailHtml.Output.Row>
      </EmailHtml.Output.Table>
    </EmailHtml.Section.Root>
  );
}
