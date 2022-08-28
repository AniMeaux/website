import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";
import { mapImages } from "~/images/map";
import { BubbleShape } from "~/layout/bubbleShape";
import {
  HeroSection,
  HeroSectionAction,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";

export default function AccessPage() {
  return (
    <main className="w-full px-page flex flex-col gap-12">
      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage
            image={mapImages}
            className="transition-[filter] duration-100 ease-in-out group-hover:brightness-50"
          />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle isLarge>Accès au Salon</HeroSectionTitle>

          <HeroSectionParagraph>
            Voiture, bus, vélo ou à pied, tous les moyens sont bons pour visiter
            le Salon des Ani'Meaux !
          </HeroSectionParagraph>

          <HeroSectionAction>
            <BaseLink
              to="https://goo.gl/maps/bix61Gb2vAUdpgtq5"
              className={actionClassNames.standalone()}
            >
              Voir le plan
            </BaseLink>
          </HeroSectionAction>
        </HeroSectionAside>
      </HeroSection>

      <WarnSection />

      <section className="flex">
        <ul
          className={cn(
            "w-full grid grid-cols-1 grid-rows-[auto] gap-6",
            "sm:grid-cols-2",
            "md:grid-cols-3"
          )}
        >
          {INFOS.map((info) => (
            <li
              key={info.title}
              className="px-4 py-3 flex flex-col items-start gap-6"
            >
              <span
                className={cn(
                  "rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg p-3 bg-opacity-5 flex items-center justify-center text-[40px]",
                  ICON_COLOR_CLASS_NAME[info.color]
                )}
              >
                <Icon id={info.icon} />
              </span>

              <h2 className="text-title-item">{info.title}</h2>
              <p>{info.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function WarnSection() {
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
          Privilégiez les moyens de transports écologiques
        </h2>

        <p>
          Pensez à la planète et déplacez vous à pied, en vélo ou en transports
          en commun. La salle du Colisée de Meaux est très bien desservie par
          les bus, et proche du parc du pâtis pour une balade agréable avant ou
          après votre visite.
        </p>
      </div>
    </section>
  );
}

type Info = {
  icon: IconProps["id"];
  color: "blue" | "green" | "yellow" | "red" | "cyan";
  title: string;
  text: React.ReactNode;
};

const ICON_COLOR_CLASS_NAME: Record<Info["color"], string> = {
  blue: "bg-blue-base text-blue-base",
  cyan: "bg-cyan-base text-cyan-base",
  green: "bg-green-base text-green-base",
  red: "bg-red-base text-red-base",
  yellow: "bg-yellow-base text-yellow-darker",
};

const INFOS: Info[] = [
  {
    icon: "locationDot",
    color: "red",
    title: "Adresse",
    text: <>Colisée de Meaux, 73 Av. Henri Dunant, 77100 Meaux</>,
  },
  {
    icon: "clock",
    color: "blue",
    title: "Horaires d'ouverture",
    text: (
      <>
        Samedi 10 juin 2023 de 10h à 18h
        <br />
        Dimanche 11 juin 2023 de 10h à 18h
      </>
    ),
  },
  {
    icon: "bus",
    color: "green",
    title: "Venir en transports en commun",
    text: (
      <>
        Bus ligne{" "}
        <BaseLink
          to="https://www.transdev-idf.com/ligne-D/meaux-villenoy/511-511"
          className={actionClassNames.proseInline()}
        >
          D
        </BaseLink>{" "}
        ou{" "}
        <BaseLink
          to="https://www.transdev-idf.com/ligne-I/meaux-meaux/511-511"
          className={actionClassNames.proseInline()}
        >
          I
        </BaseLink>
        , arrêt Colisée de Meaux ou Roland Garros
      </>
    ),
  },
  {
    icon: "car",
    color: "yellow",
    title: "Venir en voiture",
    text: (
      <>
        Parking gratuit sur place.
        <br />
        Ne laissez pas vos animaux dans votre véhicule !
      </>
    ),
  },
];
