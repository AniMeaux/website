import { formatDateRange } from "@animeaux/shared";
import { Prisma } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { SearchForm } from "~/controllers/searchForm";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { MapDateToString } from "~/core/dates";
import { prisma } from "~/core/db.server";
import {
  DynamicImage,
  PlaceholderImage,
  StaticImage,
  StaticImageProps,
} from "~/dataDisplay/image";
import { Icon, IconProps } from "~/generated/icon";
import { adoptionImages } from "~/images/adoption";
import { fosterFamilyLargeImages } from "~/images/fosterFamilyLarge";
import { fosterFamilySmallImages } from "~/images/fosterFamilySmall";
import { heroImages } from "~/images/hero";
import { pickUpImages } from "~/images/pickUp";
import { volunteerImages } from "~/images/volunteer";
import { BubbleShape } from "~/layout/bubbleShape";
import {
  HeroSection,
  HeroSectionAction,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";

const eventSelect = Prisma.validator<Prisma.EventArgs>()({
  select: {
    id: true,
    image: true,
    title: true,
    shortDescription: true,
    startDate: true,
    endDate: true,
    isFullDay: true,
    location: true,
  },
});

type Event = Prisma.EventGetPayload<typeof eventSelect>;

type LoaderDataServer = {
  pickUpCount: number;
  upcomingEvents: Event[];
};

export const loader: LoaderFunction = async () => {
  const [pickUpCount, upcomingEvents] = await Promise.all([
    prisma.animal.count(),
    prisma.event.findMany({
      where: { isVisible: true, endDate: { gte: new Date() } },
      orderBy: { endDate: "asc" },
      select: eventSelect.select,
    }),
  ]);

  return json<LoaderDataServer>({
    // Round to nearest lower 50 multiple.
    pickUpCount: Math.floor(pickUpCount / 50) * 50,
    upcomingEvents,
  });
};

type LoaderDataClient = MapDateToString<LoaderDataServer>;

export default function HomePage() {
  const { pickUpCount, upcomingEvents } = useLoaderData<LoaderDataClient>();

  return (
    <main className="px-page flex flex-col gap-24">
      <HeroSection isReversed>
        <HeroSectionAside>
          <HeroSectionImage image={heroImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle isLarge>Adoptez !</HeroSectionTitle>
          <HeroSectionParagraph>
            Trouvez le compagnon de vos rêves et donnez-lui une seconde chance
          </HeroSectionParagraph>

          <HeroSectionAction>
            <SearchForm className="w-full max-w-sm" />
          </HeroSectionAction>
        </HeroSectionAside>
      </HeroSection>

      <WhoWeAreSection />
      <NumbersSection pickUpCount={pickUpCount} />
      <UpcomingEventsSection upcomingEvents={upcomingEvents} />

      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={fosterFamilyLargeImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle>Devenez famille d'accueil</HeroSectionTitle>
          <HeroSectionParagraph>
            Aidez-nous à{" "}
            <strong className="text-body-emphasis">sauver les animaux</strong>{" "}
            en leur consacrant{" "}
            <strong className="text-body-emphasis">temps et attention</strong>,
            sans aucune contrainte financière
          </HeroSectionParagraph>

          <HeroSectionAction>
            <BaseLink
              to="/devenir-famille-d-accueil"
              className={actionClassNames.standalone()}
            >
              En savoir plus
            </BaseLink>
          </HeroSectionAction>
        </HeroSectionAside>
      </HeroSection>

      <DonateSection />

      <HeroSection isReversed>
        <HeroSectionAside>
          <HeroSectionImage image={volunteerImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle>Devenez bénévole</HeroSectionTitle>
          <HeroSectionParagraph>
            Contribuez aux{" "}
            <strong className="text-body-emphasis">
              sauvetages des animaux
            </strong>{" "}
            en difficultés que nous sommes amenés à prendre sous notre aile
          </HeroSectionParagraph>

          <HeroSectionAction>
            <BaseLink
              to="/devenir-benevole"
              className={actionClassNames.standalone()}
            >
              En savoir plus
            </BaseLink>
          </HeroSectionAction>
        </HeroSectionAside>
      </HeroSection>
    </main>
  );
}

function WhoWeAreSection() {
  return (
    <section className="flex flex-col gap-12">
      <div className="self-center max-w-2xl px-4 flex flex-col gap-6 text-center">
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large"
          )}
        >
          Qui sommes-nous ?
        </h2>

        <p>
          Ani'Meaux est une{" "}
          <strong className="text-body-emphasis">association</strong> loi 1901
          de protection animale, reconnue d'intérêt général, qui a pour but de{" "}
          <strong className="text-body-emphasis">sauver des animaux</strong>{" "}
          domestiques et sensibiliser à la cause animale en général
        </p>
      </div>

      <ul className="px-6 flex items-start flex-wrap gap-12 justify-evenly">
        <WhoWeAreItem
          text="Nous recueillons les animaux abandonnés, maltraités ou errants"
          image={pickUpImages}
        />

        <WhoWeAreItem
          text="Nous les plaçons dans une famille d'accueil adaptée à l'animal afin de lui prodiguer tous les soins nécessaires à son rétablissement"
          image={fosterFamilySmallImages}
        />

        <WhoWeAreItem
          text="Nous leur trouvons une nouvelle famille pour la vie"
          image={adoptionImages}
        />
      </ul>
    </section>
  );
}

function WhoWeAreItem({
  text,
  image,
}: {
  text: string;
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

function NumbersSection({
  pickUpCount,
}: {
  pickUpCount: LoaderDataClient["pickUpCount"];
}) {
  const years = DateTime.now()
    .diff(DateTime.fromISO("2018-04-10"), "years")
    .toHuman({ maximumFractionDigits: 0 });

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

      <ul
        className={cn(
          "w-full px-10 py-12 flex items-start flex-wrap justify-evenly gap-12",
          "md:px-24 md:py-10"
        )}
      >
        <NumberItem
          icon="cakeCandles"
          value={years}
          label="D'existence"
          color="green"
        />
        <NumberItem
          icon="handHoldingHeart"
          value={pickUpCount}
          label="Prises en charge"
          color="yellow"
        />
        <NumberItem
          icon="peopleGroup"
          value="50"
          label="Bénévoles"
          color="red"
        />
      </ul>
    </section>
  );
}

function NumberItem({
  icon,
  value,
  label,
  color,
}: {
  icon: IconProps["id"];
  value: React.ReactNode;
  label: React.ReactNode;
  color: "green" | "yellow" | "red";
}) {
  return (
    <li className="flex flex-col items-center gap-4 text-center">
      <Icon id={icon} className="text-[60px] text-gray-700" />

      <div className="w-full flex flex-col">
        <h3
          className={cn("font-serif text-[32px] font-bold leading-normal", {
            "text-green-base": color === "green",
            "text-yellow-darker": color === "yellow",
            "text-red-base": color === "red",
          })}
        >
          {value}
        </h3>

        <p>{label}</p>
      </div>
    </li>
  );
}

function UpcomingEventsSection({
  upcomingEvents,
}: {
  upcomingEvents: LoaderDataClient["upcomingEvents"];
}) {
  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col items-center gap-6">
      <h2
        className={cn(
          "text-title-section-small text-center",
          "md:text-title-section-large"
        )}
      >
        Événements à venir
      </h2>

      <ul
        className={cn(
          "max-w-3xl grid grid-cols-1 gap-6",
          "xs:grid-cols-2",
          "sm:grid-cols-1"
        )}
      >
        {upcomingEvents.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </ul>

      <BaseLink to="/evenements" className={actionClassNames.standalone()}>
        Voir plus
      </BaseLink>
    </section>
  );
}

function EventItem({
  event,
}: {
  event: LoaderDataClient["upcomingEvents"][number];
}) {
  return (
    <li className="flex">
      <BaseLink
        to={`/evenements/${event.id}`}
        className={cn(
          "group w-full px-4 py-3 shadow-none rounded-bubble-lg bg-transparent flex flex-col gap-4 transition-[background-color,box-shadow] duration-100 ease-in-out hover:bg-white hover:shadow-base",
          "sm:pl-6 sm:pr-12 sm:py-6 sm:flex-row sm:gap-6 sm:items-center"
        )}
      >
        {event.image == null ? (
          <PlaceholderImage
            icon="calendarDay"
            className={cn(
              "w-full aspect-4/3 flex-none rounded-bubble-ratio",
              "sm:w-[150px]"
            )}
          />
        ) : (
          <DynamicImage
            imageId={event.image}
            alt={event.title}
            sizes={{ sm: "150px", default: "100vw" }}
            fallbackSize="512"
            className={cn(
              "w-full aspect-4/3 flex-none rounded-bubble-ratio",
              "sm:w-[150px]"
            )}
          />
        )}

        <div className="flex-1 flex flex-col">
          <p className="text-title-item">{event.title}</p>
          <p>{event.shortDescription}</p>
          <ul className="flex flex-col">
            <EventItemDetailsItem icon="calendarDay">
              {formatDateRange(event.startDate, event.endDate, {
                showTime: !event.isFullDay,
              })}
            </EventItemDetailsItem>

            <EventItemDetailsItem icon="locationDot">
              {event.location}
            </EventItemDetailsItem>
          </ul>
        </div>

        <Icon
          id="arrowRight"
          className={cn(
            "hidden text-[32px] text-gray-500 transition-transform duration-100 ease-in-out group-hover:scale-110",
            "sm:block"
          )}
        />
      </BaseLink>
    </li>
  );
}

function EventItemDetailsItem({
  icon,
  children,
}: {
  icon: IconProps["id"];
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2 text-gray-500">
      <span className="flex-none flex h-6 items-center">
        <Icon id={icon} className="text-[14px]" />
      </span>

      <span className="flex-1">{children}</span>
    </li>
  );
}

function DonateSection() {
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
          "w-full px-10 py-12 flex flex-col items-center gap-6",
          "md:px-24 md:py-[60px]"
        )}
      >
        <div className="w-full max-w-3xl flex flex-col gap-6 text-center">
          <h2
            className={cn(
              "text-title-section-small",
              "md:text-title-section-large"
            )}
          >
            Faîtes un don !
          </h2>

          <p>
            Vous souhaitez nous aider mais vous ne pouvez accueillir ou
            adopter ? Vous pouvez nous faire un don ! Ce don servira à financer
            les soins vétérinaires, effectuer plus de sauvetages et acheter du
            matériel pour les animaux.
          </p>
        </div>

        <BaseLink
          to="/faire-un-don"
          className={actionClassNames.standalone({ color: "yellow" })}
        >
          Faire un don
        </BaseLink>
      </div>
    </section>
  );
}
