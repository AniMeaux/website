import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { cn } from "~/core/classNames";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { DynamicImage } from "~/dataDisplay/image";
import { agreementsImages } from "~/images/agreements";
import { bubbleSectionClassNames, BubbleShape } from "~/layout/bubbleSection";
import {
  HeroSection,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";
import { citiesWithAgreements } from "~/sterilisationAgreements/data.server";

export async function loader() {
  return json({ citiesWithAgreements });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({
    title: getPageTitle("Conventions de stérilisation"),
  });
};

export default function Route() {
  return (
    <main className="w-full px-page flex flex-col gap-24">
      <Header />
      <LawSection />
      <ErrandsSection />
      <CitiesSection />
    </main>
  );
}

function Header() {
  return (
    <HeroSection>
      <HeroSectionAside>
        <HeroSectionImage image={agreementsImages} loading="eager" />
      </HeroSectionAside>

      <HeroSectionAside>
        <HeroSectionTitle isLarge>
          Conventions de stérilisation
        </HeroSectionTitle>
        <HeroSectionParagraph>
          Prises en charge des chats errants et stérilisation.
        </HeroSectionParagraph>
      </HeroSectionAside>
    </HeroSection>
  );
}

function LawSection() {
  return (
    <section className={bubbleSectionClassNames.root()}>
      <span className={bubbleSectionClassNames.bubbleContainer()}>
        <BubbleShape />
      </span>

      <div
        className={cn(
          bubbleSectionClassNames.content(),
          "px-10 py-12 flex flex-col gap-6",
          "md:px-30 md:py-[60px]"
        )}
      >
        <h2 className="text-title-section-small text-center md:text-title-section-large">
          Législation
        </h2>

        <div className="flex flex-col">
          <h3 className="text-title-item text-center">
            Article L211-27 du Code Rural et de la Pêche Maritime
          </h3>

          <p className="text-center">
            Le maire peut, par arrêté, à son initiative ou à̀ la demande d’une
            association de protection des animaux, faire procéder à la capture
            de chats non identifiés, sans propriétaire ou sans détenteur, vivant
            en groupe dans des lieux publics de la commune, afin de faire
            procéder à leur stérilisation et à leur identification conformément
            à l’article L. 212-10, préalablement à leur relâcher dans ces mêmes
            lieux. Cette identification doit être réalisée au nom de la commune
            ou de ladite association.
          </p>
        </div>
      </div>
    </section>
  );
}

function ErrandsSection() {
  return (
    <section className="flex flex-col gap-6 md:gap-12">
      <h2 className="text-title-section-small md:text-title-section-large text-center">
        Gestion des chats errants
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-12">
        <p className="text-center md:text-left">
          La gestion des chats errants est délicate. Il est devenu impératif
          pour les municipalités et les associations de{" "}
          <strong className="text-body-emphasis">
            maîtriser leur population en contrôlant leur reproduction
          </strong>
          . En l’espace de 3 ans, un chat non stérilisé peut engendrer plus de
          20 000 descendants. Une solution fait l’unanimité :{" "}
          <strong className="text-body-emphasis">la stérilisation</strong>.
        </p>

        <p className="text-center md:text-left">
          En effet, il a été prouvé que l’euthanasie ou le déplacement des
          colonies de chats restent inefficaces. Alors que{" "}
          <strong className="text-body-emphasis">
            la stérilisation est reconnue par tous les experts
          </strong>{" "}
          et en particulier ceux de l’Organisation Mondiale de la Santé (OMS).
          Cette pratique permet de{" "}
          <strong className="text-body-emphasis">
            réguler sur le long terme les populations félines
          </strong>{" "}
          sur une zone donnée et par conséquent de{" "}
          <strong className="text-body-emphasis">
            limiter les nuisances aux riverains
          </strong>
          .
        </p>

        <p className="text-center md:text-left">
          Parmi toutes ses missions, Ani’Meaux{" "}
          <strong className="text-body-emphasis">
            prend en charge les chats errants quotidiennement
          </strong>
          . Afin de faire perdurer son action, une équipe de bénévoles dédiée
          aux chats errants a été mise en place, et des
          <strong className="text-body-emphasis">
            conventions de stérilisations ont été mises en place avec plusieurs
            communes
          </strong>
          .
        </p>
      </div>
    </section>
  );
}

function CitiesSection() {
  const { citiesWithAgreements } = useLoaderData<typeof loader>();

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <h2 className="text-title-section-small text-center md:text-title-section-large">
          Communes
        </h2>

        <p className="text-center">
          Communes disposant d’une convention avec Ani’Meaux pour l’année en
          cours.
        </p>
      </div>

      {citiesWithAgreements.length > 0 ? (
        <ul
          className={cn(
            "grid grid-cols-1 gap-12 items-start",
            "xs:grid-cols-2",
            "md:grid-cols-3"
          )}
        >
          {citiesWithAgreements.map((city) => (
            <li key={city.id} className="flex flex-col gap-3">
              <DynamicImage
                imageId={city.image}
                alt={city.name}
                sizes={{
                  lg: "300px",
                  md: "30vw",
                  xs: "50vw",
                  default: "100vw",
                }}
                fallbackSize="512"
                background="none"
                className="w-full aspect-4/3 flex-none rounded-bubble-md border border-gray-200"
              />

              <p className="text-title-item text-gray-500 text-center">
                {city.name}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p
          className={cn("py-12 text-center text-gray-500", "md:px-30 md:py-40")}
        >
          Aucune convention pour l’instant.
        </p>
      )}
    </section>
  );
}
