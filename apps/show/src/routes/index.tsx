import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { actionClassNames } from "~/core/actions";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { StaticImage, StaticImageProps } from "~/dataDisplay/image";
import { Icon } from "~/generated/icon";
import { adoptionImages } from "~/images/adoption";
import { animationImages } from "~/images/animation";
import { associationImages } from "~/images/association";
import { exhibitorsImages } from "~/images/exhibitors";
import { foodImages } from "~/images/food";
import { mapImages } from "~/images/map";
import meaux from "~/images/meaux.png";
import { medicalImages } from "~/images/medical";
import nameAndLogo from "~/images/nameAndLogo.svg";
import poullain from "~/images/poullain.png";
import { showImages } from "~/images/show";
import { BubbleShape } from "~/layout/bubbleShape";
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
    <main className="px-page flex flex-col gap-24">
      <HeroSection isReversed>
        <HeroSectionAside>
          <HeroSectionImage image={showImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <div className={cn("px-4 flex", "md:px-6")}>
            <img
              src={nameAndLogo}
              alt="Salon des Ani'Meaux"
              className="w-full aspect-[440_/_126]"
            />
          </div>

          <HeroSectionParagraph>
            Premier salon dédié au bien-être animal à Meaux.
            <br />
            <strong className="text-body-emphasis">
              <time dateTime={OPENING_TIME.toISO()}>
                10 et 11 juin 2023 - 10h à 18h
              </time>{" "}
              - Colisée de Meaux
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
          <BaseLink
            to="https://goo.gl/maps/bix61Gb2vAUdpgtq5"
            className="group relative w-full flex"
          >
            <HeroSectionImage
              image={mapImages}
              className="transition-[filter] duration-100 ease-in-out group-hover:brightness-50"
            />

            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 min-w-max flex items-center gap-2 text-white text-body-emphasis transition-opacity duration-100 ease-in-out group-hover:opacity-100">
              <Icon id="arrowUpRightFromSquare" />
              Voir le plan
            </p>
          </BaseLink>
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle>Accès au Salon</HeroSectionTitle>
          <HeroSectionParagraph>
            Voiture, bus, vélo ou à pied, tous les moyens sont bon pour venir au
            Salon des Ani'Meaux !
          </HeroSectionParagraph>

          <HeroSectionAction>
            <BaseLink to="/acces" className={actionClassNames.standalone()}>
              S'y rendre
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
    <div className="rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg bg-gray-100 px-3 py-2 flex flex-col items-center">
      <span className="font-serif text-[32px] font-bold leading-normal text-blue-base">
        {value.toLocaleString("fr-FR", { minimumIntegerDigits: 2 })}
      </span>

      <span>{label}</span>
    </div>
  );
}

function ComeWithYourDogSection() {
  return (
    <section className="relative flex">
      {/* Wrap the shape because it looks like SVG can only be sized with width
      and height. But we don't want the width class to be a complexe arbitrary
      value with hard coded size in px: `w-[calc(100%_-_16px)]` */}
      <span
        className={cn(
          "absolute -z-10 top-0 left-2 bottom-0 right-2",
          "md:left-4 md:right-4"
        )}
      >
        <BubbleShape isDouble className="w-full h-full" />
      </span>

      <div
        className={cn(
          "w-full px-10 py-18 flex flex-col items-center gap-6 text-center",
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
            un contrôle vétérinaire sera effectué à l'entrée
          </strong>
          . Le carnet de santé et les papiers d'identification des animaux
          seront obligatoire lors de ce contrôle. Pour les chiens de catégorie,
          veillez à prévoir votre autorisation de détention.
        </p>

        <p>
          Pour le bien-être de votre chien et celui des autres présents durant
          le salon, veillez à ne{" "}
          <strong className="text-body-emphasis">
            l'amener que s'il est sociable avec les autres animaux et à l'aise
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
      <div className={cn("px-4 flex flex-col gap-6 text-center", "md:px-30")}>
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large"
          )}
        >
          Présentation
        </h2>

        <p>
          Le Salon des Ani'Meaux a pour vocation de{" "}
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
          , tout en profitant d'activités et animations riches et de moments de
          convivialité.
        </p>

        <p>
          Les visiteurs pourront retrouver des acteurs agissant en faveur du
          bien-être des animaux de compagnie mais également des animaux de la
          ferme, des animaux sauvages ainsi que des insectes.
        </p>
      </div>

      <ul className="px-4 flex items-start flex-wrap gap-12 justify-evenly">
        <PresentationItem
          text={
            <>
              <strong className="text-body-emphasis">60 exposants</strong>{" "}
              dévoués au bien-être des animaux
            </>
          }
          image={exhibitorsImages}
        />

        <PresentationItem
          text={
            <>
              Des <strong className="text-body-emphasis">animations</strong>{" "}
              pour vous divertir et enrichir vos connaissances
            </>
          }
          image={animationImages}
        />

        <PresentationItem
          text={
            <>
              Des{" "}
              <strong className="text-body-emphasis">
                chiens à l'adoption
              </strong>{" "}
              qui feront chavirer votre coeur
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
    <section className="relative flex">
      {/* Wrap the shape because it looks like SVG can only be sized with width
      and height. But we don't want the width class to be a complexe arbitrary
      value with hard coded size in px: `w-[calc(100%_-_16px)]` */}
      <span
        className={cn(
          "absolute -z-10 top-0 left-2 bottom-0 right-2",
          "md:left-4 md:right-4"
        )}
      >
        <BubbleShape className="w-full h-full" />
      </span>

      <div
        className={cn(
          "w-full px-10 py-18 flex flex-col items-center gap-6 text-center",
          "md:px-30 md:py-[60px]"
        )}
      >
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large"
          )}
        >
          L'origine
        </h2>

        <p>
          A l'initiative de l'association{" "}
          <BaseLink to={animeauxUrl} className={actionClassNames.proseInline()}>
            Ani'Meaux
          </BaseLink>{" "}
          et organisé en collaboration avec la municipalité de Meaux, le Salon
          des Ani'Meaux a vu naître sa première édition le 15 mai 2022.
        </p>

        <p>
          Mis en œuvre en seulement deux mois, grâce au travail de bénévoles
          dévoués, cette première édition a connu un franc succès puisqu'elle a
          rassemblé une{" "}
          <strong className="text-body-emphasis">
            cinquantaine d'exposants
          </strong>
          , professionnels et associations confondus, et a reçu plus de{" "}
          <strong className="text-body-emphasis">1 200 visiteurs</strong> sur
          une seule journée.
        </p>

        <p>
          En 2023, le Salon des Ani'Meaux voit plus grand et attend 60 exposants
          et ouvrira ses portes aux visiteurs durant deux journées : les 10 et
          11 juin 2023.
        </p>
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="flex flex-col gap-12">
      <div className={cn("px-4 flex flex-col gap-6 text-center", "md:px-30")}>
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large"
          )}
        >
          Nos partenaires
        </h2>

        <p>
          Le Salon des Ani'Meaux est imaginé et mis en place par des bénévoles,
          mais il n'aurait pas pu voir le jour sans leur participation.
        </p>
      </div>

      <div
        className={cn(
          "px-4 flex flex-col gap-12",
          "md:flex-row md:items-center md:justify-center"
        )}
      >
        <PartnerItem
          image={meaux}
          alt="Ville de Meaux"
          to="https://www.ville-meaux.fr"
        />

        <PartnerItem
          image={poullain}
          alt="Jardinerie Poullain"
          to="https://jardineriepoullain.fr"
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
      className={cn(
        "rounded-tl-[48px] rounded-tr-3xl rounded-br-[48px] rounded-bl-3xl bg-transparent px-4 py-3 flex transition-[background-color,box-shadow] duration-100 ease-in-out hover:bg-white hover:shadow-base",
        "md:p-6"
      )}
    >
      <img
        src={image}
        alt={alt}
        className={cn("w-full aspect-video object-contain", "md:w-[320px]")}
      />
    </BaseLink>
  );
}

function ExhibitorsSection() {
  return (
    <section className="flex flex-col gap-12">
      <div className={cn("px-4 flex flex-col gap-6 text-center", "md:px-30")}>
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

      <ul className="px-4 flex items-start flex-wrap gap-12 justify-evenly">
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
