import { getCompleteLocation } from "@animeaux/core"
import type { Prisma } from "@animeaux/prisma"
import { ShowExhibitorApplicationStatus } from "@animeaux/prisma"
import { Img } from "@react-email/components"
import invariant from "tiny-invariant"

import {
  EMAIL_PARAGRAPH_COMPONENTS,
  EMAIL_SENTENCE_COMPONENTS,
  EmailHtml,
} from "#i/core/data-display/email-html.server"
import { createImageUrl } from "#i/core/data-display/image"
import type { ServiceEmail } from "#i/core/email/service.server.js"
import { ImageData } from "#i/core/image/data.js"
import { Routes } from "#i/core/navigation"
import { ActivityField } from "#i/exhibitors/activity-field/activity-field"
import { ACTIVITY_TARGET_TRANSLATION } from "#i/exhibitors/activity-target/activity-target"
import { DiscoverySource } from "#i/exhibitors/application/discovery-source"
import { LegalStatus } from "#i/exhibitors/application/legal-status"
import { SponsorshipCategory } from "#i/exhibitors/sponsorship/category"

import type { ServiceApplication } from "./service.server"

export class ServiceApplicationEmail {
  constructor(
    private email: ServiceEmail,
    private application: ServiceApplication,
  ) {}

  async submitted(
    application: Prisma.ShowExhibitorApplicationGetPayload<{
      include: { desiredStandSize: { select: { label: true } } }
    }>,
  ) {
    function SectionInformation() {
      return (
        <EmailHtml.Section.Root>
          <EmailHtml.Paragraph>
            <EmailHtml.Strong>
              Merci pour votre candidature au Salon des Ani’Meaux 2026 !
            </EmailHtml.Strong>
          </EmailHtml.Paragraph>

          <EmailHtml.Paragraph>
            Votre dossier a bien été reçu et est actuellement en cours d’étude
            par nos équipes de bénévoles. Vous serez informé(e) par e-mail dès
            qu’une mise à jour concernant votre demande sera disponible.
          </EmailHtml.Paragraph>

          <EmailHtml.Paragraph>
            Pour toute question ou complément d’information, n’hésitez pas à
            nous contacter en répondant à cet e-mail.
          </EmailHtml.Paragraph>
        </EmailHtml.Section.Root>
      )
    }

    function SectionContact() {
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
              <EmailHtml.Output.Label>Adresse e-mail</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {application.contactEmail}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Numéro de téléphone
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {application.contactPhone}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>
          </EmailHtml.Output.Table>
        </EmailHtml.Section.Root>
      )
    }

    function SectionStructure() {
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
                {LegalStatus.getVisibleValue({
                  legalStatus: application.structureLegalStatus,
                  legalStatusOther: application.structureLegalStatusOther,
                })}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Numéro d’identification
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
                <EmailHtml.Markdown
                  content={getCompleteLocation({
                    address: application.structureAddress,
                    zipCode: application.structureZipCode,
                    city: application.structureCity,
                    country: application.structureCountry,
                  })}
                  components={EMAIL_SENTENCE_COMPONENTS}
                />
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Présentation de l’activité
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {application.structureActivityDescription}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Cibles</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {application.structureActivityTargets
                  .map((target) => ACTIVITY_TARGET_TRANSLATION[target])
                  .join(", ")}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Domaines d’activités
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {application.structureActivityFields
                  .map((field) => ActivityField.translation[field])
                  .join(", ")}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Logo</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                <Img
                  src={createImageUrl(
                    process.env.CLOUDINARY_CLOUD_NAME,
                    ImageData.parse(application.structureLogoPath).id,
                    {
                      size: "512",
                      aspectRatio: "4:3",
                      objectFit: "contain",
                      fillTransparentBackground: true,
                    },
                  )}
                  alt={application.structureName}
                  // Reset Img default styles to avoid conflicts.
                  style={{ border: undefined }}
                  className="aspect-4/3 w-full min-w-0 rounded-2 border border-solid border-alabaster object-contain"
                />
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>
          </EmailHtml.Output.Table>
        </EmailHtml.Section.Root>
      )
    }

    function SectionParticipation() {
      return (
        <EmailHtml.Section.Root>
          <EmailHtml.Section.Title>Participation</EmailHtml.Section.Title>

          <EmailHtml.Output.Table>
            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Taille du stand souhaité
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {application.desiredStandSize.label}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Animation sur scène
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {application.proposalForOnStageEntertainment ?? "Aucune"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>
          </EmailHtml.Output.Table>
        </EmailHtml.Section.Root>
      )
    }

    function SectionSponsorship() {
      return (
        <EmailHtml.Section.Root>
          <EmailHtml.Section.Title>Sponsor</EmailHtml.Section.Title>

          <EmailHtml.Output.Table>
            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Catégorie</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {
                  SponsorshipCategory.translation[
                    SponsorshipCategory.fromDb(application.sponsorshipCategory)
                  ]
                }
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>
          </EmailHtml.Output.Table>
        </EmailHtml.Section.Root>
      )
    }

    function SectionComments() {
      return (
        <EmailHtml.Section.Root>
          <EmailHtml.Section.Title>Commentaires</EmailHtml.Section.Title>

          <EmailHtml.Output.Table>
            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Quelles sont vos motivations pour exposer spécifiquement au
                Salon des Ani’Meaux ?
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {application.motivation}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>
                Comment avez-vous connu le salon ?
              </EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {DiscoverySource.getVisibleValue(application)}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>

            <EmailHtml.Output.Row>
              <EmailHtml.Output.Label>Remarques</EmailHtml.Output.Label>

              <EmailHtml.Output.Value>
                {application.comments ?? "-"}
              </EmailHtml.Output.Value>
            </EmailHtml.Output.Row>
          </EmailHtml.Output.Table>
        </EmailHtml.Section.Root>
      )
    }

    await this.email.send({
      name: "candidature-exposant-confirmation",
      from: "Salon des Ani’Meaux <salon@animeaux.org>",
      to: [application.contactEmail],
      subject: "Candidature exposant - Salon des Ani’Meaux 2026",
      body: (
        <EmailHtml.Root>
          <EmailHtml.Title>Candidature exposant</EmailHtml.Title>

          <SectionInformation />

          <EmailHtml.SectionSeparator />

          <SectionContact />
          <SectionStructure />
          <SectionParticipation />
          <SectionSponsorship />
          <SectionComments />

          <EmailHtml.SectionSeparator />

          <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
        </EmailHtml.Root>
      ),
    })
  }

  async treated(applicationId: string) {
    const application = await this.application.get(applicationId, {
      select: {
        contactEmail: true,
        status: true,
        refusalMessage: true,
        exhibitor: {
          select: { token: true },
        },
      },
    })

    if (application.status === ShowExhibitorApplicationStatus.UNTREATED) {
      return
    }

    switch (application.status) {
      case ShowExhibitorApplicationStatus.REFUSED: {
        invariant(
          application.refusalMessage != null,
          "A refusalMessage should exists",
        )

        return await this.email.send({
          name: "candidature-exposant-refusee",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Candidature refusée - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Candidature refusée</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Markdown
                  content={application.refusalMessage}
                  components={EMAIL_PARAGRAPH_COMPONENTS}
                />
              </EmailHtml.Section.Root>

              <EmailHtml.SectionSeparator />

              <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
            </EmailHtml.Root>
          ),
        })
      }

      case ShowExhibitorApplicationStatus.VALIDATED: {
        invariant(application.exhibitor != null, "An exhibitor should exists")

        return await this.email.send({
          name: "candidature-exposant-validee",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject: "Candidature validée - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>Candidature validée</EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Paragraph>Bonjour,</EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  C’est avec un immense plaisir que nous vous annonçons que
                  votre candidature pour le{" "}
                  <EmailHtml.Strong>Salon des Ani’Meaux 2026</EmailHtml.Strong>{" "}
                  a été <EmailHtml.Strong>validée</EmailHtml.Strong> 🎉 !
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Nous vous invitons à consulter votre espace exposant (lien
                  ci-dessous) afin d’y retrouver toutes les informations utiles
                  pour la préparation de votre venue.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  <EmailHtml.Button
                    href={`${process.env.PUBLIC_HOST}${Routes.exhibitors.token(application.exhibitor.token)}`}
                  >
                    Accédez à votre espace exposant
                  </EmailHtml.Button>
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Dans cet espace, vous pourrez :
                </EmailHtml.Paragraph>

                <EmailHtml.UnorderedList>
                  <li>
                    <EmailHtml.Strong>
                      Compléter vos informations pratiques
                    </EmailHtml.Strong>{" "}
                    concernant votre stand ;
                  </li>

                  <li>
                    <EmailHtml.Strong>
                      Télécharger les documents
                    </EmailHtml.Strong>{" "}
                    relatifs à votre participation (plaquette, règlement,
                    modalités de paiement, etc.) ;
                  </li>

                  <li>
                    <EmailHtml.Strong>
                      Préparer vos supports de communication
                    </EmailHtml.Strong>{" "}
                    pour l’événement (flyers, visuels, bannières, etc.).
                  </li>
                </EmailHtml.UnorderedList>

                <EmailHtml.Paragraph>
                  ⚠️ <EmailHtml.Strong>Attention</EmailHtml.Strong>
                  {" "}: Votre inscription ne sera définitivement confirmée
                  qu’après{" "}
                  <EmailHtml.Strong>
                    réception de votre dossier complet
                  </EmailHtml.Strong>{" "}
                  et du{" "}
                  <EmailHtml.Strong>
                    règlement des frais liés à votre participation
                  </EmailHtml.Strong>
                  .<br />
                  Sans retour complet dans un délai de 2 semaines, votre place
                  sera automatiquement réattribuée à un autre exposant en liste
                  d’attente.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Pour toute question ou besoin d’assistance, notre équipe de
                  bénévoles reste à votre disposition par e-mail.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Nous avons hâte de vous accueillir et de partager ensemble
                  cette nouvelle édition du Salon des Ani’Meaux !
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>À très bientôt,</EmailHtml.Paragraph>
              </EmailHtml.Section.Root>

              <EmailHtml.SectionSeparator />

              <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
            </EmailHtml.Root>
          ),
        })
      }

      case ShowExhibitorApplicationStatus.WAITING_LIST: {
        return await this.email.send({
          name: "candidature-exposant-liste-d-attente",
          from: "Salon des Ani’Meaux <salon@animeaux.org>",
          to: [application.contactEmail],
          subject:
            "Mise en attente de votre candidature - Salon des Ani’Meaux 2026",
          body: (
            <EmailHtml.Root>
              <EmailHtml.Title>
                Mise en attente de votre candidature
              </EmailHtml.Title>

              <EmailHtml.Section.Root>
                <EmailHtml.Paragraph>Bonjour,</EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Nous vous remercions pour l’intérêt que vous portez au Salon
                  des Ani’Meaux 2026 et pour votre candidature.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Après examen de votre dossier, nous vous informons que votre
                  candidature a été placée sur liste d’attente. Cette décision
                  est liée à la forte demande de participation et au nombre
                  limité de places disponibles.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Nous reviendrons vers vous dès qu’une place se libérera ou si
                  nous sommes en mesure d’ouvrir des espaces supplémentaires.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  En attendant, n’hésitez pas à nous contacter pour toute
                  question ou complément d’information en répondant à cet
                  e-mail.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>
                  Merci pour votre compréhension et votre enthousiasme pour
                  notre événement.
                </EmailHtml.Paragraph>

                <EmailHtml.Paragraph>Bien à vous,</EmailHtml.Paragraph>
              </EmailHtml.Section.Root>

              <EmailHtml.SectionSeparator />

              <EmailHtml.Footer>Salon des Ani’Meaux</EmailHtml.Footer>
            </EmailHtml.Root>
          ),
        })
      }

      default: {
        return application.status satisfies never
      }
    }
  }
}
