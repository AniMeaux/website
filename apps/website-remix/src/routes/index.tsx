import { SearchForm } from "~/controllers/searchForm";
import { cn } from "~/core/classNames";
import { StaticImage, StaticImageProps } from "~/dataDisplay/image";
import { Icon, IconProps } from "~/generated/icon";
import { adoptionImages } from "~/images/adoption";
import { fosterFamilySmallImages } from "~/images/fosterFamilySmall";
import { heroImages } from "~/images/hero";
import { pickUpImages } from "~/images/pickUp";
import { BubbleShape } from "~/layout/bubbleShape";
import { HeroSection } from "~/layout/heroSection";

export default function HomePage() {
  return (
    <main className="px-page flex flex-col gap-24">
      <HeroSection
        title="Adoptez !"
        message="Trouvez le compagnon de vos rêves et donnez-lui une seconde chance"
        action={<SearchForm className="w-full max-w-sm" />}
        image={heroImages}
        hasLargeTitle
        isReversed
      />

      <WhoWeAreSection />
      <NumbersSection />
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

function NumbersSection() {
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
          value="4 ans"
          label="D'existence"
          color="green"
        />
        <NumberItem
          icon="handHoldingHeart"
          value="500"
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
