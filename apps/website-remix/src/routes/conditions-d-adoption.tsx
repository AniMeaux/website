import { Species } from "@prisma/client";
import { useState } from "react";
import { SPECIES_ICON } from "~/animals/species";
import { Tab } from "~/controllers/tabs";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import {
  OptionCard,
  OptionDescription,
  OptionFeature,
  OptionFeatureList,
  OptionList,
  OptionPrice,
  OptionTitle,
} from "~/dataDisplay/options";
import { Timeline, TimelineItem } from "~/dataDisplay/timeline";
import { Icon } from "~/generated/icon";
import { adoptImages } from "~/images/adopt";
import { questionsImages } from "~/images/questions";
import { bubbleSectionClassNames, BubbleShape } from "~/layout/bubbleSection";
import {
  HeroSection,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";

export default function AdoptionConditionsPage() {
  return (
    <main className="w-full px-page flex flex-col gap-24">
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
          "px-4 text-title-section-small text-center",
          "md:px-6 md:text-title-section-large"
        )}
      >
        Les étapes
      </h2>

      <div className={cn("px-4 flex gap-3 justify-center", "md:gap-6")}>
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
              "px-10 py-12 flex flex-col items-center gap-6 text-center",
              "md:px-30 md:py-[60px]"
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
        <TimelineItem title="Formulaire" icon="fileLines">
          Un formulaire d’adoption sera à remplir afin que nous puissions mieux
          vous connaître.
        </TimelineItem>

        <TimelineItem title="Rencontre avec l’animal" icon="heart">
          Si votre dossier est retenu, nous organiserons une visite avec la
          famille d’accueil où se trouve l’élu de votre cœur.
        </TimelineItem>

        <TimelineItem title="Pré-visite" icon="clipboardCheck">
          Un bénévole effectuera une pré-visite chez vous afin de vous
          conseiller au mieux pour l’arrivée de votre futur compagnon et de nous
          assurer de son futur bien-être et de sa sécurité.
        </TimelineItem>

        {tab === "booking" && (
          <TimelineItem title="Réservation" icon="ticketSimple">
            Pour officialiser la réservation il vous faudra verser la moitié des
            frais d’adoption demandés pour l’animal.
          </TimelineItem>
        )}

        <TimelineItem title="Arrivée de l’animal" icon="houseChimneyPaw">
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
          "px-4 text-title-section-small text-center",
          "md:px-6 md:text-title-section-large"
        )}
      >
        Frais d’adoption
      </h2>

      <div className={cn("px-4 flex gap-3 justify-center", "md:gap-6")}>
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

      {tab === "cats" && (
        <OptionList>
          <OptionCard>
            <OptionTitle>Don libre</OptionTitle>
            <OptionDescription>
              <strong className="text-body-emphasis">
                Exclusivement pour un chat de plus de 9 ans
              </strong>
              , un don libre d’un minimum de 50 € sera demandé.
            </OptionDescription>
            <OptionPrice>≥ 50 €</OptionPrice>
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
            <OptionTitle>Sans stérilisation / castration</OptionTitle>
            <OptionDescription>
              La stérilisation / castration est obligatoire à l’âge de 6 mois,
              un chèque de caution de 150 € vous sera demandé et rendu ou
              détruit, une fois la stérilisation / castration faite.
            </OptionDescription>
            <OptionPrice>180 €</OptionPrice>
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
              Stérilisée / castré comprise en passant par l’un de nos
              vétérinaires partenaires, à faire à l’âge de 6 mois pour les
              chatons ou déjà faite pour les adultes.
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
        </OptionList>
      )}

      {tab === "dogs" && (
        <OptionList>
          <OptionCard>
            <OptionTitle>Don libre</OptionTitle>
            <OptionDescription>
              <strong className="text-body-emphasis">
                Exclusivement pour un chien de plus de 9 ans
              </strong>
              , un don libre d’un minimum de 50 € sera demandé.
            </OptionDescription>
            <OptionPrice>≥ 50 €</OptionPrice>
            <OptionFeatureList>
              <OptionFeature isIncluded>Identifié</OptionFeature>
              <OptionFeature isIncluded>Vacciné</OptionFeature>
              <OptionFeature isIncluded>Déparasité</OptionFeature>
              <OptionFeature isIncluded>Stérilisée / castré</OptionFeature>
            </OptionFeatureList>
          </OptionCard>

          <OptionCard>
            <OptionTitle>Sans stérilisation / castration</OptionTitle>
            <OptionDescription>
              La stérilisation / castration est obligatoire à l’âge de 6 mois,
              un chèque de caution de 150 € vous sera demandé et rendu ou
              détruit, une fois la stérilisation / castration faite.
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
              <strong className="text-body-emphasis">Pour un mâle</strong>, la
              castration est comprise en passant par l’un de nos vétérinaires
              partenaires, à faire à l’âge de 6 mois pour les chiots ou déjà
              faite pour les adultes.
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
              <strong className="text-body-emphasis">Pour un femelle</strong>,
              la stérilisation est comprise en passant par l’un de nos
              vétérinaires partenaires, à faire à l’âge de 6 mois pour les
              chiots ou déjà faite pour les adultes.
            </OptionDescription>
            <OptionPrice>350 €</OptionPrice>
            <OptionFeatureList>
              <OptionFeature isIncluded>Identifié</OptionFeature>
              <OptionFeature isIncluded>Vacciné</OptionFeature>
              <OptionFeature isIncluded>Déparasité</OptionFeature>
              <OptionFeature isIncluded>Stérilisée</OptionFeature>
            </OptionFeatureList>
          </OptionCard>
        </OptionList>
      )}

      {tab === "newPets" && (
        <OptionList>
          <OptionCard>
            <OptionTitle>Don libre</OptionTitle>
            <OptionDescription>
              Pour les nouveaux animaux de compagnie, un don libre d’un minimum
              de 10 € sera demandé. Stérilisation et vaccination possible à
              votre demande et à votre charge.
            </OptionDescription>
            <OptionPrice>≥ 10 €</OptionPrice>
            <OptionFeatureList>
              <OptionFeature isIncluded>Identifié</OptionFeature>
              <OptionFeature isIncluded>Vacciné</OptionFeature>
            </OptionFeatureList>
          </OptionCard>
        </OptionList>
      )}
    </section>
  );
}
