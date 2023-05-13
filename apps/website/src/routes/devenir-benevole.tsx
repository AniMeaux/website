import { V2_MetaFunction } from "@remix-run/react";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { getConfigFromMetaMatches, useConfig } from "~/core/config";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { StaticImage, StaticImageProps } from "~/dataDisplay/image";
import {
  OptionCard,
  OptionDescription,
  OptionList,
  OptionPrice,
  OptionTitle,
} from "~/dataDisplay/options";
import { missionAccountingImages } from "~/images/missionAccounting";
import { missionCarpoolImages } from "~/images/missionCarpool";
import { missionCommunicationImages } from "~/images/missionCommunication";
import { missionEventImages } from "~/images/missionEvent";
import { missionFieldImages } from "~/images/missionField";
import { missionFoodCollectionImages } from "~/images/missionFoodCollection";
import { missionInterventionImages } from "~/images/missionIntervention";
import { socialImages } from "~/images/social";
import { volunteerImages } from "~/images/volunteer";
import {
  HeroSection,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";

export const meta: V2_MetaFunction = ({ matches }) => {
  const config = getConfigFromMetaMatches(matches);
  return createSocialMeta({
    title: getPageTitle("Devenez bénévole"),
    imageUrl: `${config.publicHost}${socialImages.volunteer.imagesBySize[1024]}`,
  });
};

export default function Route() {
  return (
    <main className="w-full px-page flex flex-col gap-24">
      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={volunteerImages} loading="eager" />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle isLarge>Devenez bénévole</HeroSectionTitle>
          <HeroSectionParagraph>
            Contribuez aux{" "}
            <strong className="text-body-emphasis">
              sauvetages des animaux
            </strong>{" "}
            en difficultés que nous sommes amenés à prendre sous notre aile.
          </HeroSectionParagraph>
        </HeroSectionAside>
      </HeroSection>

      <OptionsSection />
      <VolunteerSection />
    </main>
  );
}

function OptionsSection() {
  const { volunteerFormUrl } = useConfig();

  return (
    <section className="flex flex-col gap-12">
      <h2
        className={cn(
          "text-title-section-small text-center",
          "md:text-title-section-large"
        )}
      >
        Options
      </h2>

      <OptionList>
        <OptionCard>
          <OptionTitle>Adhérent bienfaiteur</OptionTitle>
          <OptionDescription>
            Pour les personnes n’ayant pas la possibilité de beaucoup participer
            mais souhaitant nous soutenir.
          </OptionDescription>
          <OptionPrice suffix="/ an">35 €</OptionPrice>
        </OptionCard>

        <OptionCard>
          <OptionTitle>Adhérent dédié aux évènements</OptionTitle>
          <OptionDescription>
            Pour nous aider lors de nos évènements au moins 1 fois tous les 2
            mois !
          </OptionDescription>
          <OptionPrice suffix="/ an">25 €</OptionPrice>
        </OptionCard>

        <OptionCard>
          <OptionTitle>Adhérent actif</OptionTitle>
          <OptionDescription>
            Pour les personnes souhaitant s’investir et participer à au moins
            une mission par mois.
          </OptionDescription>
          <OptionPrice suffix="/ an">15 €</OptionPrice>
        </OptionCard>
      </OptionList>

      <BaseLink
        to={volunteerFormUrl}
        className={cn(actionClassNames.standalone(), "self-center")}
      >
        Adhérer sur Helloasso
      </BaseLink>
    </section>
  );
}

function VolunteerSection() {
  return (
    <section className="flex flex-col gap-12">
      <h2
        className={cn(
          "text-title-section-small text-center",
          "md:text-title-section-large"
        )}
      >
        Missions des bénévoles
      </h2>

      <ul
        className={cn(
          "grid grid-cols-1 gap-12 items-start",
          "xs:grid-cols-2",
          "md:grid-cols-3"
        )}
      >
        <MissionItem
          title="Collectes alimentaires"
          image={missionFoodCollectionImages}
        >
          Nous réalisons plusieurs fois par an des collectes dans les
          animaleries proches de Meaux. Il s’agit de collecter des denrées
          alimentaires ainsi que du matériel pour nos protégés en famille
          d’accueil.
        </MissionItem>

        <MissionItem title="Covoiturages" image={missionCarpoolImages}>
          Pour le transfert d’un animal vers sa famille d’accueil, pour une
          consultation vétérinaire ou bien simplement pour récupérer du matériel
          et de l’alimentation chez nos partenaires, les covoiturages sont
          parfois essentiels.
        </MissionItem>

        <MissionItem title="Sensibilisation" image={missionInterventionImages}>
          Lorsque l’occasion se présente, nous organisons une intervention de
          sensibilisation dans les établissements publiques afin de sensibiliser
          les personnes de tous les âges au bien-être des animaux.
        </MissionItem>

        <MissionItem
          title="Organisation d’événements"
          image={missionEventImages}
        >
          Dans un but de sensibiliser et nous retrouver autour de la cause
          animale, une équipe de bénévoles est dédiée à l’organisation
          d’évènements comme le Salon des Ani’Meaux.
        </MissionItem>

        <MissionItem title="Missions de terrain" image={missionFieldImages}>
          Nos bénévoles sont amenés à se rendre sur le terrain pour trapper les
          chats errants dans le cadre des conventions de stérilisation.
          <br />
          Les volontaires seront également les bienvenus pour réaliser les
          enquêtes dans le cadre de suspission de maltraitance.
        </MissionItem>

        <MissionItem title="Communication" image={missionCommunicationImages}>
          La communication est primordiale pour sensibiliser toute personne sur
          nos actions et sur le bien-être des animaux. Rédaction d’articles,
          gestion des réseaux sociaux, création de supports de communication...
          Les possibilités sont nombreuses.
        </MissionItem>

        <MissionItem title="Administratif" image={missionAccountingImages}>
          La gestion d’une association représente beaucoup de démarches
          administratives comme la gestion des contrats, le classement de
          document, le suivi de dossiers avec les administrations... Les
          bénévoles les plus éloignés peuvent parfaitement aider dans ces
          missions..
        </MissionItem>
      </ul>
    </section>
  );
}

function MissionItem({
  image,
  title,
  children,
}: {
  image: StaticImageProps["image"];
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-6">
      <StaticImage
        image={image}
        sizes={{ default: "128px" }}
        className="w-32 aspect-square"
      />
      <h3 className="text-title-item">{title}</h3>
      <p>{children}</p>
    </li>
  );
}
