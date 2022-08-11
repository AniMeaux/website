import { SearchForm } from "~/controllers/searchForm";
import { cn } from "~/core/classNames";
import { StaticImage, StaticImageProps } from "~/dataDisplay/image";
import { adoptionImages } from "~/images/adoption";
import { fosterFamilySmallImages } from "~/images/fosterFamilySmall";
import { heroImages } from "~/images/hero";
import { pickUpImages } from "~/images/pickUp";
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

      <ul className="flex items-start flex-wrap gap-12 justify-evenly">
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
