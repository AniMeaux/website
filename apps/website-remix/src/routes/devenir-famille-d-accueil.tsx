import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { Timeline, TimelineItem } from "~/dataDisplay/timeline";
import { engagementImages } from "~/images/engagement";
import { equipmentImages } from "~/images/equipment";
import { followUpImages } from "~/images/followUp";
import { fosterFamilyLargeImages } from "~/images/fosterFamilyLarge";
import {
  HeroSection,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";

export default function FosterFamilyPage() {
  const { fosterFamilyFormUrl } = useConfig();

  return (
    <main className="w-full px-page flex flex-col gap-24">
      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={fosterFamilyLargeImages} loading="eager" />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle isLarge>Devenez famille d’accueil</HeroSectionTitle>
          <HeroSectionParagraph>
            Aidez-nous à{" "}
            <strong className="text-body-emphasis">sauver les animaux</strong>{" "}
            en leur consacrant{" "}
            <strong className="text-body-emphasis">temps et attention</strong>,
            sans aucune contrainte financière.
          </HeroSectionParagraph>
        </HeroSectionAside>
      </HeroSection>

      <section className="flex flex-col gap-6">
        <h2
          className={cn(
            "px-4 text-title-section-small text-center",
            "md:px-6 md:text-title-section-large"
          )}
        >
          En 3 étapes
        </h2>

        <Timeline>
          <TimelineItem
            title="Formulaire"
            icon="fileLines"
            action={
              <BaseLink
                to={fosterFamilyFormUrl}
                className={actionClassNames.standalone()}
              >
                Remplir le formulaire
              </BaseLink>
            }
          >
            Remplir le formulaire de famille d’accueil afin que nous puissions
            mieux vous connaître.
          </TimelineItem>

          <TimelineItem title="Pré-visite" icon="clipboardCheck">
            Un bénévole effectuera une pré-visite chez vous afin de préparer au
            mieux l’accueil de votre futur colocataire.
          </TimelineItem>

          <TimelineItem title="Arrivée de l’animal" icon="houseChimneyPaw">
            Si votre dossier est validé, nous organiserons l’arrivée de l’animal
            chez vous.
          </TimelineItem>
        </Timeline>
      </section>

      <HeroSection isReversed>
        <HeroSectionAside>
          <HeroSectionImage image={equipmentImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle>Matériel et frais vétérinaires</HeroSectionTitle>
          <HeroSectionParagraph>
            Le matériel et l’alimentation pourront vous être fournis sur demande
            et les frais vétérinaires sont à la charge de l’association.
          </HeroSectionParagraph>
        </HeroSectionAside>
      </HeroSection>

      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={followUpImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle>Suivi</HeroSectionTitle>
          <HeroSectionParagraph>
            Vous vous engagez à nous donner régulièrement des nouvelles de
            l’animal et à nous fournir des photos récentes tout au long de
            l’accueil.
          </HeroSectionParagraph>
        </HeroSectionAside>
      </HeroSection>

      <HeroSection isReversed>
        <HeroSectionAside>
          <HeroSectionImage image={engagementImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle>Engagement</HeroSectionTitle>
          <HeroSectionParagraph>
            L’accueil de l’animal est convenu pour une durée déterminée ou
            indeterminée, en cas d’imprévus un delai devra nous être accordé
            pour trouver une solution de secours.
          </HeroSectionParagraph>
        </HeroSectionAside>
      </HeroSection>
    </main>
  );
}
