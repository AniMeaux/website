import { json, SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { SearchForm } from "~/controllers/searchForm";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { prisma } from "~/core/db.server";
import { StaticImage, StaticImageProps } from "~/dataDisplay/image";
import { EventItem } from "~/events/item";
import { Icon, IconProps } from "~/generated/icon";
import { adoptionImages } from "~/images/adoption";
import { fosterFamilyLargeImages } from "~/images/fosterFamilyLarge";
import { fosterFamilySmallImages } from "~/images/fosterFamilySmall";
import { heroImages } from "~/images/hero";
import { pickUpImages } from "~/images/pickUp";
import { volunteerImages } from "~/images/volunteer";
import { bubbleSectionClassNames, BubbleShape } from "~/layout/bubbleSection";
import {
  HeroSection,
  HeroSectionAction,
  HeroSectionAside,
  HeroSectionImage,
  HeroSectionParagraph,
  HeroSectionTitle,
} from "~/layout/heroSection";

export async function loader() {
  const [pickUpCount, upcomingEvents] = await Promise.all([
    prisma.animal.count(),
    prisma.event.findMany({
      where: { isVisible: true, endDate: { gte: new Date() } },
      orderBy: { endDate: "asc" },
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
  ]);

  return json({
    // Round to nearest lower 50 multiple.
    pickUpCount: Math.floor(pickUpCount / 50) * 50,
    upcomingEvents,
  });
}

export default function Route() {
  const { pickUpCount, upcomingEvents } = useLoaderData<typeof loader>();

  return (
    <main className="w-full px-page flex flex-col gap-24">
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
      <NumbersSection pickUpCount={pickUpCount} />
      <UpcomingEventsSection upcomingEvents={upcomingEvents} />

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
            "md:text-title-section-large"
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

      <ul className="flex items-start flex-wrap gap-12 justify-evenly">
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
  pickUpCount: SerializeFrom<typeof loader>["pickUpCount"];
}) {
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
          "px-10 py-12 flex items-start flex-wrap justify-evenly gap-12",
          "md:px-30 md:py-10"
        )}
      >
        <NumberItem
          icon="cakeCandles"
          value={years}
          label="D’existence"
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

function UpcomingEventsSection({
  upcomingEvents,
}: {
  upcomingEvents: SerializeFrom<typeof loader>["upcomingEvents"];
}) {
  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col items-center gap-12">
      <h2
        className={cn(
          "w-full text-title-section-small text-center",
          "md:px-30 md:text-title-section-large"
        )}
      >
        Événements à venir
      </h2>

      <ul
        className={cn(
          "grid grid-cols-1 gap-12",
          { "xs:grid-cols-2": upcomingEvents.length > 1 },
          "sm:grid-cols-1",
          "md:px-30"
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

function DonateSection() {
  return (
    <section className={bubbleSectionClassNames.root()}>
      <span className={bubbleSectionClassNames.bubbleContainer()}>
        <BubbleShape isDouble />
      </span>

      <div
        className={cn(
          bubbleSectionClassNames.content(),
          "px-10 py-12 flex flex-col items-center gap-6",
          "md:px-30 md:py-[60px]"
        )}
      >
        <div className="w-full flex flex-col gap-6 text-center">
          <h2
            className={cn(
              "text-title-section-small",
              "md:text-title-section-large"
            )}
          >
            Faîtes un don !
          </h2>

          <p>
            Vous souhaitez nous aider mais vous ne pouvez accueillir ou adopter
             ? Vous pouvez nous faire un don ! Ce don servira à financer les{" "}
            <strong className="text-body-emphasis">soins vétérinaires</strong>,
            effectuer plus de{" "}
            <strong className="text-body-emphasis">
              sauvetages et acheter du matériel
            </strong>{" "}
            pour les animaux.
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
