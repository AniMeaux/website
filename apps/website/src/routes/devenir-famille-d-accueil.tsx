import { actionClassNames } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import { getConfigFromMetaMatches, useConfig } from "#i/core/config";
import { Timeline, TimelineItem } from "#i/core/data-display/timeline";
import {
  HeroSection,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "#i/core/layout/hero-section";
import { createSocialMeta } from "#i/core/meta";
import { getPageTitle } from "#i/core/page-title";
import { engagementImages } from "#i/images/engagement";
import { equipmentImages } from "#i/images/equipment";
import { followUpImages } from "#i/images/follow-up";
import { fosterFamilyLargeImages } from "#i/images/foster-family-large";
import { socialImages } from "#i/images/social";
import { cn } from "@animeaux/core";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
  const config = getConfigFromMetaMatches(matches);
  return createSocialMeta({
    title: getPageTitle("Devenez famille d’accueil"),
    imageUrl: `${config.publicHost}${socialImages.fosterFamily.imagesBySize[1024]}`,
  });
};

export default function Route() {
  const { fosterFamilyFormUrl } = useConfig();

  return (
    <main className="flex w-full flex-col gap-24 px-page">
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

      <section className="flex flex-col gap-12">
        <h2
          className={cn(
            "text-center text-title-section-small",
            "md:text-title-section-large",
          )}
        >
          En 3 étapes
        </h2>

        <Timeline>
          <TimelineItem
            title="Formulaire"
            icon="file-lines"
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

          <TimelineItem title="Pré-visite" icon="clipboard-check">
            Un bénévole effectuera une pré-visite chez vous afin de préparer au
            mieux l’accueil de votre futur colocataire.
          </TimelineItem>

          <TimelineItem title="Arrivée de l’animal" icon="house-chimney-paw">
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
