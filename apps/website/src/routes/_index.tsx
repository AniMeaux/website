import { actionClassNames } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { SearchForm } from "#core/controllers/searchForm";
import type { StaticImageProps } from "#core/data-display/image";
import { StaticImage } from "#core/data-display/image";
import { prisma } from "#core/db.server";
import {
  BubbleShape,
  bubbleSectionClassNames,
} from "#core/layout/bubble-section";
import {
  HeroSection,
  HeroSectionAction,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "#core/layout/hero-section";
import { DonationSection } from "#donation/section";
import { EventItem } from "#events/item";
import type { IconProps } from "#generated/icon";
import { Icon } from "#generated/icon";
import { adoptionImages } from "#images/adoption";
import { fosterFamilyLargeImages } from "#images/foster-family-large";
import { fosterFamilySmallImages } from "#images/foster-family-small";
import { heroImages } from "#images/hero";
import { pickUpImages } from "#images/pick-up";
import { volunteerImages } from "#images/volunteer";
import { cn } from "@animeaux/core";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils/promise";

export async function loader() {
  const { pickUpCount, upcomingEvents } = await promiseHash({
    pickUpCount: prisma.animal.count(),
    upcomingEvents: prisma.event.findMany({
      where: { isVisible: true, endDate: { gte: new Date() } },
      orderBy: [
        { startDate: "asc" },
        // If two events start at the same time, display the one that ends the
        // earliest first.
        { endDate: "asc" },
      ],
      select: {
        id: true,
        image: true,
        title: true,
        url: true,
        description: true,
        startDate: true,
        endDate: true,
        isFullDay: true,
        location: true,
      },
    }),
  });

  return json({
    // Round to nearest lower 50 multiple.
    pickUpCount: Math.floor(pickUpCount / 50) * 50,
    upcomingEvents,
  });
}

export default function Route() {
  return (
    <main className="flex w-full flex-col gap-24 px-page">
      <HeroSection isReversed>
        <HeroSectionAside>
          <HeroSectionImage image={heroImages} loading="eager" />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle isLarge>Adoptez !</HeroSectionTitle>
          <HeroSectionParagraph>
            Trouvez le compagnon de vos rêves et donnez-lui une seconde chance.
          </HeroSectionParagraph>

          <HeroSectionAction>
            <SearchForm className="w-full max-w-sm" />
          </HeroSectionAction>
        </HeroSectionAside>
      </HeroSection>

      <WhoWeAreSection />
      <NumbersSection />
      <UpcomingEventsSection />

      <HeroSection>
        <HeroSectionAside>
          <HeroSectionImage image={fosterFamilyLargeImages} />
        </HeroSectionAside>

        <HeroSectionAside>
          <HeroSectionTitle>Devenez famille d’accueil</HeroSectionTitle>
          <HeroSectionParagraph>
            Aidez-nous à{" "}
            <strong className="text-body-emphasis">sauver les animaux</strong>{" "}
            en leur consacrant{" "}
            <strong className="text-body-emphasis">temps et attention</strong>,
            sans aucune contrainte financière.
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

      <DonationSection />

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
            en difficultés que nous sommes amenés à prendre sous notre aile.
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
      <div className={cn("flex flex-col gap-6 text-center", "md:px-30")}>
        <h2
          className={cn(
            "text-title-section-small",
            "md:text-title-section-large",
          )}
        >
          Qui sommes-nous ?
        </h2>

        <p>
          Ani’Meaux est une{" "}
          <strong className="text-body-emphasis">association</strong> loi 1901
          de protection animale, reconnue d’intérêt général, qui a pour but de{" "}
          <strong className="text-body-emphasis">sauver des animaux</strong>{" "}
          domestiques et sensibiliser à la cause animale en général.
        </p>
      </div>

      <ul className="flex flex-wrap items-start justify-evenly gap-12">
        <WhoWeAreItem
          text="Nous recueillons les animaux abandonnés, maltraités ou errants."
          image={pickUpImages}
        />

        <WhoWeAreItem
          text="Nous les plaçons dans une famille d’accueil adaptée à l’animal afin de lui prodiguer tous les soins nécessaires à son rétablissement."
          image={fosterFamilySmallImages}
        />

        <WhoWeAreItem
          text="Nous leur trouvons une nouvelle famille pour la vie."
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
    <li className="flex w-[200px] flex-col gap-6 text-center">
      <StaticImage
        image={image}
        sizes={{ default: "200px" }}
        className="aspect-square w-full"
      />

      <p>{text}</p>
    </li>
  );
}

function NumbersSection() {
  const { pickUpCount } = useLoaderData<typeof loader>();

  const years = DateTime.now()
    .diff(DateTime.fromISO("2018-04-10"), "years")
    .toHuman({ maximumFractionDigits: 0 });

  return (
    <section className={bubbleSectionClassNames.root()}>
      <span className={bubbleSectionClassNames.bubbleContainer()}>
        <BubbleShape />
      </span>

      <ul
        className={cn(
          bubbleSectionClassNames.content(),
          "flex flex-wrap items-start justify-evenly gap-12 px-10 py-12",
          "md:px-30 md:py-10",
        )}
      >
        <NumberItem
          icon="cake-candles"
          value={years}
          label="D’existence"
          color="green"
        />
        <NumberItem
          icon="hand-holding-heart"
          value={pickUpCount}
          label="Prises en charge"
          color="yellow"
        />
        <NumberItem
          icon="people-group"
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

      <div className="flex w-full flex-col">
        <h3
          className={cn("font-serif text-[32px] font-bold leading-normal", {
            "text-brandGreen": color === "green",
            "text-brandYellow-darker": color === "yellow",
            "text-brandRed": color === "red",
          })}
        >
          {value}
        </h3>

        <p>{label}</p>
      </div>
    </li>
  );
}

function UpcomingEventsSection() {
  const { upcomingEvents } = useLoaderData<typeof loader>();
  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col items-center gap-12">
      <h2
        className={cn(
          "w-full text-center text-title-section-small",
          "md:px-30 md:text-title-section-large",
        )}
      >
        Événements à venir
      </h2>

      <ul
        className={cn(
          "grid grid-cols-1 gap-12",
          { "xs:grid-cols-2": upcomingEvents.length > 1 },
          "sm:grid-cols-1",
          "md:px-30",
        )}
      >
        {upcomingEvents.map((event) => (
          <EventItem key={event.id} isInlined event={event} />
        ))}
      </ul>

      <BaseLink to="/evenements" className={actionClassNames.standalone()}>
        Voir plus
      </BaseLink>
    </section>
  );
}
