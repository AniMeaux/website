import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { actionClassNames } from "~/core/actions";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { StaticImage, StaticImageProps } from "~/dataDisplay/image";
import { adoptionImages } from "~/images/adoption";
import anideo from "~/images/anideo.png";
import { animationImages } from "~/images/animation";
import arbreVert from "~/images/arbreVert.png";
import { associationImages } from "~/images/association";
import citronad from "~/images/citronad.png";
import evasion from "~/images/evasion.png";
import { exhibitorsImages } from "~/images/exhibitors";
import { foodImages } from "~/images/food";
import leTraiteurImaginaire from "~/images/leTraiteurImaginaire.png";
import { mapImages } from "~/images/map";
import meaux from "~/images/meaux.png";
import { medicalImages } from "~/images/medical";
import nameAndLogo from "~/images/nameAndLogo.svg";
import neoVoice from "~/images/neoVoice.svg";
import { showImages } from "~/images/show";
import superlogo from "~/images/superlogo.png";
import { bubbleSectionClassNames, BubbleShape } from "~/layout/bubbleSection";
import {
  HeroSection,
  HeroSectionAction,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";

const OPENING_TIME = DateTime.fromISO("2023-06-10T10:00:00.000+02:00");
const ONE_MINUTE_IN_MS = 60 * 1000;

export default function HomePage() {
  const { ticketingUrl } = useConfig();

  return (
    <main className="w-full px-page flex flex-col gap-24">
      <HeroSection isReversed>
        <HeroSectionAside>
          <HeroSectionImage image={showImages} loading="eager" />
        </HeroSectionAside>

        <HeroSectionAside>
          <img
            src={nameAndLogo}
            alt="Salon des Ani’Meaux"
            className="w-full aspect-[440_/_126]"
          />

          <HeroSectionParagraph>
            Premier salon dédié au bien-être animal à Meaux.
            <br />
            <strong className="text-body-emphasis">
              <time dateTime={OPENING_TIME.toISO()}>
                10 et 11 juin 2023 - 10h à 18h
              </time>{" "}
              - Colisée de Meaux.
            </strong>
          </HeroSectionParagraph>

          <Countdown />

          <HeroSectionAction>
            <BaseLink
              to={ticketingUrl}
              className={actionClassNames.standalone()}
            >
              Achetez votre billet
            </BaseLink>
          </HeroSectionAction>
        </HeroSectionAside>
      </HeroSection>

      <ComeWithYourDogSection />
      <PresentationSection />
      <OriginSection />
      <PartnersSection />
      <ExhibitorsSection />

      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={mapImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle>Accès au Salon</HeroSectionTitle>
          <HeroSectionParagraph>
            Voiture, bus, vélo ou à pied, tous les moyens sont bons pour visiter
            le Salon des Ani’Meaux !
          </HeroSectionParagraph>

          <HeroSectionAction>
            <BaseLink to="/acces" className={actionClassNames.standalone()}>
              S’y rendre
            </BaseLink>
          </HeroSectionAction>
        </HeroSectionAside>
      </HeroSection>
    </main>
  );
}

function Countdown() {
  const [, forceUpdate] = useState(true);

  const now = DateTime.now();
  const diff = OPENING_TIME.diff(now, ["days", "hours", "minutes"]);

  // Force a re-rendering every minutes to recompute the diff.
  useEffect(() => {
    const interval = setInterval(
      () => forceUpdate((b) => !b),
      ONE_MINUTE_IN_MS
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (diff.toMillis() <= 0) {
    return null;
  }

  return (
    <HeroSectionAction>
      <div className="flex items-center gap-3">
        <CountDownItem
          label={diff.days > 1 ? "Jours" : "Jour"}
          value={diff.days}
        />

        <CountDownItem
          label={diff.hours > 1 ? "Heures" : "Heure"}
          value={diff.hours}
        />

        <CountDownItem
          // `minutes` can have decimals because it's the smallest unit
          // asked in the diff
          label={Math.floor(diff.minutes) > 1 ? "Minutes" : "Minute"}
          value={Math.floor(diff.minutes)}
        />
      </div>
    </HeroSectionAction>
  );
}

function CountDownItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-bubble-sm bg-gray-100 px-3 py-2 flex flex-col items-center">
      <span className="font-serif text-[32px] font-bold leading-normal text-brandBlue">
        {value.toLocaleString("fr-FR", { minimumIntegerDigits: 2 })}
      </span>

      <span>{label}</span>
    </div>
  );
}

function ComeWithYourDogSection() {
  return (
    <section className={bubbleSectionClassNames.root()}>
      <span className={bubbleSectionClassNames.bubbleContainer()}>
        <BubbleShape isDouble />
      </span>

      <div
        className={cn(
          bubbleSectionClassNames.content(),
          "px-10 py-18 flex flex-col items-center gap-6 text-center",
          "md:px-30 md:py-[60px]"
        )}
      >
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large"
          )}
        >
          Venir avec son chien
        </h2>

        <p>
          Votre chien est le bienvenu durant le salon. Cependant,{" "}
          <strong className="text-body-emphasis">
            un contrôle vétérinaire sera effectué à l’entrée
          </strong>
          . Le carnet de santé et les papiers d’identification des animaux
          seront obligatoire lors de ce contrôle. Pour les chiens de catégorie,
          veillez à prévoir votre autorisation de détention.
        </p>

        <p>
          Pour le bien-être de votre chien et celui des autres présents durant
          le salon, veillez à ne{" "}
          <strong className="text-body-emphasis">
            l’amener que s’il est sociable avec les autres animaux et à l’aise
            en présence de nombreuses personnes
          </strong>
          .
        </p>
      </div>
    </section>
  );
}

function PresentationSection() {
  return (
    <section className="flex flex-col gap-12">
      <div className={cn("flex flex-col gap-6 text-center", "md:px-30")}>
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large"
          )}
        >
          Présentation
        </h2>

        <p>
          Le Salon des Ani’Meaux a pour vocation de{" "}
          <strong className="text-body-emphasis">
            sensibiliser les petits et les grands
          </strong>{" "}
          au bien-être de nos amis les animaux.
        </p>

        <p>
          Ouvert à tous, il permet de rencontrer des{" "}
          <strong className="text-body-emphasis">
            professionnels et des associations
          </strong>
          , tout en profitant d’activités et animations riches et de moments de
          convivialité.
        </p>

        <p>
          Les visiteurs pourront retrouver des acteurs agissant en faveur du
          bien-être des animaux de compagnie mais également des animaux de la
          ferme, des animaux sauvages ainsi que des insectes.
        </p>
      </div>

      <ul className="flex items-start flex-wrap gap-12 justify-evenly">
        <PresentationItem
          text={
            <>
              <strong className="text-body-emphasis">60 exposants</strong>{" "}
              dévoués au bien-être des animaux.
            </>
          }
          image={exhibitorsImages}
        />

        <PresentationItem
          text={
            <>
              Des <strong className="text-body-emphasis">animations</strong>{" "}
              pour vous divertir et enrichir vos connaissances.
            </>
          }
          image={animationImages}
        />

        <PresentationItem
          text={
            <>
              Des{" "}
              <strong className="text-body-emphasis">
                chiens à l’adoption
              </strong>{" "}
              qui feront chavirer votre coeur.
            </>
          }
          image={adoptionImages}
        />
      </ul>
    </section>
  );
}

function PresentationItem({
  text,
  image,
}: {
  text: React.ReactNode;
  image: StaticImageProps["image"];
}) {
  return (
    <li className="w-[200px] flex flex-col gap-6 text-center">
      <StaticImage
        image={image}
        sizes={{ default: "200px" }}
        className="w-full aspect-square"
      />

      <p>{text}</p>
    </li>
  );
}

function OriginSection() {
  const { animeauxUrl } = useConfig();

  return (
    <section className={bubbleSectionClassNames.root()}>
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
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large"
          )}
        >
          L’origine
        </h2>

        <p>
          A l’initiative de l’association{" "}
          <BaseLink to={animeauxUrl} className={actionClassNames.proseInline()}>
            Ani’Meaux
          </BaseLink>{" "}
          et organisé en collaboration avec la municipalité de Meaux, le Salon
          des Ani’Meaux a vu naître sa première édition le 15 mai 2022.
        </p>

        <p>
          Mis en œuvre en seulement deux mois, grâce au travail de bénévoles
          dévoués, cette première édition a connu un franc succès puisqu’elle a
          rassemblé une{" "}
          <strong className="text-body-emphasis">
            cinquantaine d’exposants
          </strong>
          , professionnels et associations confondus, et a reçu plus de{" "}
          <strong className="text-body-emphasis">1 200 visiteurs</strong> sur
          une seule journée.
        </p>

        <p>
          En 2023, le Salon des Ani’Meaux voit plus grand en conviant 60
          exposants et ouvrira ses portes aux visiteurs durant deux journées :
          les 10 et 11 juin 2023.
        </p>
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="flex flex-col gap-12">
      <div className={cn("flex flex-col gap-6 text-center", "md:px-30")}>
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large"
          )}
        >
          Nos partenaires
        </h2>

        <p>
          Le Salon des Ani’Meaux est imaginé et mis en place par des bénévoles,
          mais il n’aurait pas pu voir le jour sans leur participation.
        </p>
      </div>

      <div
        className={cn(
          "grid grid-cols-[minmax(0px,320px)] gap-x-12 gap-y-6 justify-center",
          "xs:grid-cols-[repeat(2,minmax(0px,320px))]",
          "md:grid-cols-[repeat(3,minmax(0px,320px))]"
        )}
      >
        <PartnerItem
          image={meaux}
          alt="Ville de Meaux"
          to="https://www.ville-meaux.fr"
        />

        <PartnerItem
          image={citronad}
          alt="Citron’ad"
          to="https://www.citron-ad.fr"
        />

        <PartnerItem
          image={superlogo}
          alt="Super Logo"
          to="https://www.super-logo.com"
        />

        <PartnerItem
          image={arbreVert}
          alt="L’Arbre Vert"
          to="https://www.arbrevert.fr"
        />

        <PartnerItem image={anideo} alt="Anidéo" to="https://www.anideo.fr" />

        <PartnerItem
          image={neoVoice}
          alt="NeoVoice"
          to="https://www.neovoice.fr"
        />

        <PartnerItem
          image={leTraiteurImaginaire}
          alt="Le Traiteur Imaginaire"
          to="https://www.traiteur-imaginaire.com"
        />

        <PartnerItem
          image={evasion}
          alt="EVASION"
          to="https://www.evasionfm.com"
        />
      </div>
    </section>
  );
}

function PartnerItem({
  image,
  alt,
  to,
}: {
  image: string;
  alt: string;
  to: BaseLinkProps["to"];
}) {
  return (
    <BaseLink
      to={to}
      className="rounded-bubble-md flex transition-transform duration-100 ease-in-out hover:scale-105"
    >
      <img
        src={image}
        alt={alt}
        className="w-full aspect-[2/1] object-contain"
      />
    </BaseLink>
  );
}

function ExhibitorsSection() {
  return (
    <section className="flex flex-col gap-12">
      <div className={cn("flex flex-col gap-6 text-center", "md:px-30")}>
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large"
          )}
        >
          Exposants
        </h2>

        <p>
          Cette année,{" "}
          <strong className="text-body-emphasis">60 exposants</strong> vous
          attendent répartis dans 3 grandes catégories.
        </p>
      </div>

      <ul className="flex items-start flex-wrap gap-12 justify-evenly">
        <PresentationItem text="Associations" image={associationImages} />
        <PresentationItem text="Soins et activités" image={medicalImages} />
        <PresentationItem
          text="Alimentation et accessoires"
          image={foodImages}
        />
      </ul>

      <BaseLink
        to="/exposants"
        className={cn(actionClassNames.standalone(), "self-center")}
      >
        Voir tous les exposants
      </BaseLink>
    </section>
  );
}
