import { SPECIES_ICON } from "#animals/species";
import { actionClassNames } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { getConfigFromMetaMatches } from "#core/config";
import { Tab } from "#core/controllers/tabs";
import {
  OptionCard,
  OptionDescription,
  OptionFeature,
  OptionFeatureList,
  OptionList,
  OptionPrice,
  OptionTitle,
} from "#core/data-display/options";
import { Timeline, TimelineItem } from "#core/data-display/timeline";
import {
  BubbleShape,
  bubbleSectionClassNames,
} from "#core/layout/bubble-section";
import {
  HeroSection,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "#core/layout/hero-section";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { Icon } from "#generated/icon";
import { adoptImages } from "#images/adopt";
import { questionsImages } from "#images/questions";
import { socialImages } from "#images/social";
import { cn } from "@animeaux/core";
import { Species } from "@animeaux/prisma/client";
import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = ({ matches }) => {
  const config = getConfigFromMetaMatches(matches);
  return createSocialMeta({
    title: getPageTitle("Conditions d’adoption"),
    imageUrl: `${config.publicHost}${socialImages.adoptionConditions.imagesBySize[1024]}`,
  });
};

export default function Route() {
  return (
    <main className="flex w-full flex-col gap-24 px-page">
      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={adoptImages} loading="eager" />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle isLarge>Conditions d’adoption</HeroSectionTitle>
          <HeroSectionParagraph>
            L’adoption est un{" "}
            <strong className="text-body-emphasis">acte responsable</strong> et
            un <strong className="text-body-emphasis">engagement</strong> pour
            toute la vie de l’animal.
          </HeroSectionParagraph>
        </HeroSectionAside>
      </HeroSection>

      <StepsSection />
      <CostsSection />

      <HeroSection isReversed>
        <HeroSectionAside>
          <HeroSectionImage image={questionsImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle>Encore des questions ?</HeroSectionTitle>
          <HeroSectionParagraph>
            Pour toutes questions relatives à une adoption ou une réservation,
            vous pouvez nous contacter via email à l’adresse{" "}
            <BaseLink
              to="mailto:adoption@animeaux.org"
              className={actionClassNames.proseInline()}
            >
              adoption@animeaux.org
            </BaseLink>
            .
          </HeroSectionParagraph>
        </HeroSectionAside>
      </HeroSection>
    </main>
  );
}

function StepsSection() {
  const [tab, setTab] = useState<"adoption" | "booking">("adoption");

  return (
    <section className="flex flex-col gap-12">
      <h2
        className={cn(
          "text-center text-title-section-small",
          "md:text-title-section-large",
        )}
      >
        Les étapes
      </h2>

      <div className={cn("flex justify-center gap-3", "md:gap-6")}>
        <Tab isActive={tab === "adoption"} onSelect={() => setTab("adoption")}>
          Adoption
        </Tab>

        <Tab isActive={tab === "booking"} onSelect={() => setTab("booking")}>
          Réservation
        </Tab>
      </div>

      {tab === "booking" && (
        <div className={bubbleSectionClassNames.root()}>
          <span className={bubbleSectionClassNames.bubbleContainer()}>
            <BubbleShape />
          </span>

          <div
            className={cn(
              bubbleSectionClassNames.content(),
              "flex flex-col items-center gap-6 px-10 py-12 text-center",
              "md:px-30 md:py-[60px]",
            )}
          >
            <p>
              Si un animal est à la réservation c’est qu’il{" "}
              <strong className="text-body-emphasis">
                n’est pas encore en mesure d’être adopté
              </strong>{" "}
              mais que vous pouvez le réserver.
            </p>
          </div>
        </div>
      )}

      <Timeline>
        <TimelineItem title="Formulaire" icon="file-lines">
          Un formulaire d’adoption sera à remplir afin que nous puissions mieux
          vous connaître.
        </TimelineItem>

        <TimelineItem title="Rencontre avec l’animal" icon="heart">
          Si votre dossier est retenu, nous organiserons une visite avec la
          famille d’accueil où se trouve l’élu de votre cœur.
        </TimelineItem>

        <TimelineItem title="Pré-visite" icon="clipboard-check">
          Un bénévole effectuera une pré-visite chez vous afin de vous
          conseiller au mieux pour l’arrivée de votre futur compagnon et de nous
          assurer de son futur bien-être et de sa sécurité.
        </TimelineItem>

        {tab === "booking" && (
          <TimelineItem title="Réservation" icon="ticket-simple">
            Pour officialiser la réservation il vous faudra verser la moitié des
            frais d’adoption demandés pour l’animal.
          </TimelineItem>
        )}

        <TimelineItem title="Arrivée de l’animal" icon="house-chimney-paw">
          {tab === "adoption"
            ? "Si votre dossier est validé, nous organiserons l’arrivée de l’animal chez vous."
            : "Si votre dossier est validé, nous organiserons l’arrivée de l’animal chez vous lorsqu’il sera en mesure d’être adopté après le versement du solde restant dû pour l’adoption."}
        </TimelineItem>
      </Timeline>
    </section>
  );
}

function CostsSection() {
  const [tab, setTab] = useState<"cats" | "dogs" | "newPets">("cats");

  return (
    <section className="flex flex-col gap-12">
      <h2
        className={cn(
          "text-center text-title-section-small",
          "md:text-title-section-large",
        )}
      >
        Frais d’adoption
      </h2>

      <section className={bubbleSectionClassNames.root()}>
        <span className={bubbleSectionClassNames.bubbleContainer()}>
          <BubbleShape isDouble />
        </span>

        <div
          className={cn(
            bubbleSectionClassNames.content(),
            "flex flex-col items-center gap-6 px-10 py-18 text-center",
            "md:px-30 md:py-[60px]",
          )}
        >
          <p>
            En réglant les frais d’adoption, vous effectuez un don précieux pour
            notre association. Ce don est{" "}
            <strong className="text-body-emphasis">
              déductible de vos impôts
            </strong>{" "}
            à hauteur de 66 % du montant versé. Si vous le souhaitez, nous vous
            fournirons un reçu fiscal sur simple demande.
          </p>
        </div>
      </section>

      <div className={cn("flex justify-center gap-3", "md:gap-6")}>
        <Tab isActive={tab === "cats"} onSelect={() => setTab("cats")}>
          <Icon id={SPECIES_ICON[Species.CAT]} />
          Chat
        </Tab>

        <Tab isActive={tab === "dogs"} onSelect={() => setTab("dogs")}>
          <Icon id={SPECIES_ICON[Species.DOG]} />
          Chien
        </Tab>

        <Tab isActive={tab === "newPets"} onSelect={() => setTab("newPets")}>
          <Icon id={SPECIES_ICON[Species.RODENT]} />
          NACs
        </Tab>
      </div>

      {tab === "cats" ? (
        <>
          <OptionList>
            <OptionCard>
              <OptionTitle>Sans stérilisation / castration</OptionTitle>
              <OptionDescription>
                <strong className="text-body-emphasis">
                  Exclusivement pour un chaton âgé de moins d’1 an
                </strong>
                . La stérilisation / castration est{" "}
                <strong className="text-body-emphasis">obligatoire</strong> à
                l’âge de 6 mois ; un chèque de caution de 200 € vous sera
                demandé et détruit, une fois la stérilisation / castration
                faite, sur présentation d’un justificatif.
              </OptionDescription>
              <OptionPrice>200 €</OptionPrice>
              <OptionFeatureList>
                <OptionFeature isIncluded>Identifié</OptionFeature>
                <OptionFeature isIncluded>
                  Vacciné (Typhus et Coryza)
                </OptionFeature>
                <OptionFeature isIncluded>Déparasité</OptionFeature>
                <OptionFeature>Dépisté FIV/FELV</OptionFeature>
                <OptionFeature>Stérilisée / castré</OptionFeature>
              </OptionFeatureList>
            </OptionCard>

            <OptionCard>
              <OptionTitle>Avec stérilisation / castration</OptionTitle>
              <OptionDescription>
                <strong className="text-body-emphasis">
                  Exclusivement pour un chaton âgé de moins d’1 an
                </strong>
                . La stérilisation / castration{" "}
                <strong className="text-body-emphasis">obligatoire</strong> est
                comprise en passant par l’un de nos vétérinaires partenaires, à
                faire à l’âge de 6 mois impérativement.
              </OptionDescription>
              <OptionPrice>300 €</OptionPrice>
              <OptionFeatureList>
                <OptionFeature isIncluded>Identifié</OptionFeature>
                <OptionFeature isIncluded>
                  Vacciné (Typhus et Coryza)
                </OptionFeature>
                <OptionFeature isIncluded>Déparasité</OptionFeature>
                <OptionFeature isIncluded>Dépisté FIV/FELV</OptionFeature>
                <OptionFeature isIncluded>Stérilisée / castré</OptionFeature>
              </OptionFeatureList>
            </OptionCard>

            <OptionCard>
              <OptionTitle>Avec stérilisation / castration</OptionTitle>
              <OptionDescription>
                <strong className="text-body-emphasis">
                  Exclusivement pour un chat âgé de plus d’1 an
                </strong>
                .
              </OptionDescription>
              <OptionPrice>250 €</OptionPrice>
              <OptionFeatureList>
                <OptionFeature isIncluded>Identifié</OptionFeature>
                <OptionFeature isIncluded>
                  Vacciné (Typhus et Coryza)
                </OptionFeature>
                <OptionFeature isIncluded>Déparasité</OptionFeature>
                <OptionFeature isIncluded>Dépisté FIV/FELV</OptionFeature>
                <OptionFeature isIncluded>Stérilisée / castré</OptionFeature>
              </OptionFeatureList>
            </OptionCard>

            <OptionCard>
              <OptionTitle>Don libre</OptionTitle>
              <OptionDescription>
                <strong className="text-body-emphasis">
                  Exclusivement pour un chat de plus de 9 ans
                </strong>
                . Un don libre d'un minimum de 80 € sera demandé.
              </OptionDescription>
              <OptionPrice>≥ 80 €</OptionPrice>
              <OptionFeatureList>
                <OptionFeature isIncluded>Identifié</OptionFeature>
                <OptionFeature isIncluded>
                  Vacciné (Typhus et Coryza)
                </OptionFeature>
                <OptionFeature isIncluded>Déparasité</OptionFeature>
                <OptionFeature isIncluded>Dépisté FIV/FELV</OptionFeature>
                <OptionFeature isIncluded>Stérilisée / castré</OptionFeature>
              </OptionFeatureList>
            </OptionCard>
          </OptionList>

          <div className={bubbleSectionClassNames.root()}>
            <span className={bubbleSectionClassNames.bubbleContainer()}>
              <BubbleShape />
            </span>

            <div
              className={cn(
                bubbleSectionClassNames.content(),
                "flex flex-col items-center gap-6 px-10 py-12 text-center",
                "md:px-30 md:py-[60px]",
              )}
            >
              <p>
                <strong className="text-body-emphasis">
                  Dans le cas d’une double adoption
                </strong>
                , nous pouvons envisager une{" "}
                <strong className="text-body-emphasis">
                  adaptation financière
                </strong>
                .<br />
                Contactez-nous pour discuter des détails et trouver la meilleure
                solution pour votre nouvelle famille de poilus.
              </p>
            </div>
          </div>
        </>
      ) : null}

      {tab === "dogs" ? (
        <OptionList>
          <OptionCard>
            <OptionTitle>Sans stérilisation / castration</OptionTitle>
            <OptionDescription>
              <strong className="text-body-emphasis">
                Exclusivement pour un chiot âgé de moins d’1 an
              </strong>
              . La stérilisation / castration est{" "}
              <strong className="text-body-emphasis">obligatoire</strong>, un
              chèque de caution de 200 € vous sera demandé et détruit, une fois
              la stérilisation / castration faite, sur présentation d’un
              justificatif.
            </OptionDescription>
            <OptionPrice>200 €</OptionPrice>
            <OptionFeatureList>
              <OptionFeature isIncluded>Identifié</OptionFeature>
              <OptionFeature isIncluded>Vacciné</OptionFeature>
              <OptionFeature isIncluded>Déparasité</OptionFeature>
              <OptionFeature>Stérilisée / castré</OptionFeature>
            </OptionFeatureList>
          </OptionCard>

          <OptionCard>
            <OptionTitle>Avec castration</OptionTitle>
            <OptionDescription>
              <strong className="text-body-emphasis">
                Exclusivement pour un chien mâle âgé de plus d’1 an
              </strong>
              . La castration{" "}
              <strong className="text-body-emphasis">obligatoire</strong> est
              comprise en passant par l’un de nos vétérinaires partenaires.
            </OptionDescription>
            <OptionPrice>300 €</OptionPrice>
            <OptionFeatureList>
              <OptionFeature isIncluded>Identifié</OptionFeature>
              <OptionFeature isIncluded>Vacciné</OptionFeature>
              <OptionFeature isIncluded>Déparasité</OptionFeature>
              <OptionFeature isIncluded>Castré</OptionFeature>
            </OptionFeatureList>
          </OptionCard>

          <OptionCard>
            <OptionTitle>Avec stérilisation</OptionTitle>
            <OptionDescription>
              <strong className="text-body-emphasis">
                Exclusivement pour une chienne âgée de plus d’1 an
              </strong>
              . La stérilisation obligatoire est comprise en passant par l’un de
              nos vétérinaires partenaires.
            </OptionDescription>
            <OptionPrice>350 €</OptionPrice>
            <OptionFeatureList>
              <OptionFeature isIncluded>Identifié</OptionFeature>
              <OptionFeature isIncluded>Vacciné</OptionFeature>
              <OptionFeature isIncluded>Déparasité</OptionFeature>
              <OptionFeature isIncluded>Stérilisée</OptionFeature>
            </OptionFeatureList>
          </OptionCard>

          <OptionCard>
            <OptionTitle>Don libre</OptionTitle>
            <OptionDescription>
              <strong className="text-body-emphasis">
                Exclusivement pour un chien de plus de 9 ans
              </strong>
              . Un don libre d’un minimum de 80 € sera demandé.
            </OptionDescription>
            <OptionPrice>≥ 80 €</OptionPrice>
            <OptionFeatureList>
              <OptionFeature isIncluded>Identifié</OptionFeature>
              <OptionFeature isIncluded>Vacciné</OptionFeature>
              <OptionFeature isIncluded>Déparasité</OptionFeature>
              <OptionFeature isIncluded>Stérilisée / castré</OptionFeature>
            </OptionFeatureList>
          </OptionCard>
        </OptionList>
      ) : null}

      {tab === "newPets" ? (
        <OptionList>
          <OptionCard>
            <OptionTitle>Don libre</OptionTitle>
            <OptionDescription>
              Pour les nouveaux animaux de compagnie, un don libre d’un minimum
              de 30 € sera demandé. Stérilisation et vaccination possible à
              votre demande et à votre charge.
            </OptionDescription>
            <OptionPrice>≥ 30 €</OptionPrice>
          </OptionCard>
        </OptionList>
      ) : null}
    </section>
  );
}
