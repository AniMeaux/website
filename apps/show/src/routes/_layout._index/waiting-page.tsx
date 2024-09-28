import { Action } from "#core/actions/actions";
import { SocialLink } from "#core/actions/social-link";
import { useConfig } from "#core/config";
import { DynamicImage } from "#core/data-display/image";
import { HighLightBackground } from "#core/layout/highlight-background";
import { LazyElement } from "#core/layout/lazy-element";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { Pictogram } from "#generated/pictogram";
import logoLarge from "#images/logo-large.svg";
import { Link } from "@remix-run/react";

export function WaitingPage() {
  return (
    <>
      <LogoSection />
      <ComeBackSection />
      <PreviousEditionsSection />
      <FollowSection />
    </>
  );
}

function LogoSection() {
  return (
    <header className="grid grid-cols-1 justify-items-center pb-8 pt-safe-8 px-safe-page-narrow md:px-safe-page-normal">
      <LazyElement asChild>
        <img
          src={logoLarge}
          alt="Salon des Ani’Meaux"
          className="aspect-square w-2/3 scale-90 opacity-0 transition-[opacity,transform] duration-1000 data-visible:scale-100 data-visible:opacity-100 md:w-1/2"
        />
      </LazyElement>
    </header>
  );
}

function ComeBackSection() {
  return (
    <Section>
      <LazyElement asChild>
        <Section.ImageAside className="aspect-4/3 translate-y-4 opacity-0 transition-[opacity,transform] duration-1000 data-visible:translate-y-0 data-visible:opacity-100">
          <DynamicImage
            image={{
              id: "/show/pages/pott-et-pollen-stand-nduainkltifzvy2idnvl",
            }}
            fallbackSize="1024"
            sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
            loading="eager"
            alt="Pott derrière un stand."
            aspectRatio="none"
            className="absolute inset-x-0 bottom-0 w-full md:bottom-auto md:top-1/2 md:-translate-y-[55%]"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-1000 data-visible:translate-y-0 data-visible:opacity-100 md:delay-150">
          <Section.Title>Revient en 2025</Section.Title>

          <p>
            Le Salon des Ani’Meaux revient en force pour une nouvelle édition en
            2025 ! Préparez-vous à vivre une expérience unique dédiée au
            bien-être des animaux domestiques et sauvages.
            <br />
            <br />
            Rencontrez des exposants passionnés, découvrez des produits et
            services de qualité, participez à des animations ludiques et
            éducatives, le tout dans une ambiance conviviale et bienveillante.
            <br />
            <br />
            Restez à l’affût des prochaines annonces pour ne pas manquer cet
            événement incontournable pour tous les amoureux des animaux.
          </p>
        </Section.TextAside>
      </LazyElement>
    </Section>
  );
}

function PreviousEditionsSection() {
  return (
    <Section width="full" columnCount={1}>
      <div className="relative grid grid-cols-1 gap-2 py-2 px-safe-page-narrow sm:gap-4 md:grid-cols-2 md:items-center md:py-4 md:px-safe-page-normal lg:gap-8">
        <HighLightBackground
          color="alabaster"
          className="absolute left-0 top-0 -z-10 h-full w-full"
        />

        <LazyElement asChild>
          <Section.ImageAside className="aspect-4/3 translate-x-4 opacity-0 transition-[opacity,transform] duration-1000 data-visible:translate-x-0 data-visible:opacity-100">
            <DynamicImage
              image={{
                id: "/show/pages/pott-et-pollen-photos-ajfy5llvexzgl0df2rsy",
              }}
              fallbackSize="1024"
              sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
              loading="eager"
              alt="Pott regarde un album photo."
              aspectRatio="none"
              className="absolute inset-x-0 bottom-0 w-full md:bottom-auto md:top-1/2 md:-translate-y-[55%]"
            />
          </Section.ImageAside>
        </LazyElement>

        <LazyElement asChild>
          <Section.TextAside className="-translate-x-4 opacity-0 transition-[opacity,transform] delay-150 duration-1000 data-visible:translate-x-0 data-visible:opacity-100 md:col-start-1 md:row-start-1">
            <Section.Title>Éditions Précédentes</Section.Title>

            <p>
              Revivez les moments forts des éditions précédentes de notre salon
              en parcourant notre galerie de photos.
              <br />
              <br />
              Découvrez les sourires, les émotions et les moments de partage qui
              ont marqué les visiteurs, les exposants et les bénévoles.
              <br />
              <br />
              Plongez dans l’univers passionnant de notre événement et
              laissez-vous emporter par l’ambiance chaleureuse et conviviale qui
              caractérise chaque édition.
            </p>

            <Section.Action asChild>
              <Action asChild color="mystic">
                <Link to={Routes.previousEditions()} prefetch="intent">
                  Voir les photos
                </Link>
              </Action>
            </Section.Action>
          </Section.TextAside>
        </LazyElement>
      </div>
    </Section>
  );
}

function FollowSection() {
  const { facebookUrl, instagramUrl } = useConfig();

  return (
    <Section width="full" columnCount={1}>
      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-1000 px-safe-page-narrow data-visible:translate-y-0 data-visible:opacity-100">
          <Section.Title className="md:text-center">
            Restez informés
          </Section.Title>

          <p className="md:text-center">
            Rejoignez notre communauté passionnée et ne manquez aucune annonce,
            programme ou nouveauté. Suivez-nous dès maintenant pour vivre
            l'aventure animale avec nous !
          </p>

          <div className="grid grid-cols-[auto_auto] justify-center gap-2">
            <SocialLink to={facebookUrl}>
              <Pictogram id="facebook" className="text-[48px]" />
            </SocialLink>

            <SocialLink to={instagramUrl}>
              <Pictogram id="instagram" className="text-[48px]" />
            </SocialLink>
          </div>
        </Section.TextAside>
      </LazyElement>
    </Section>
  );
}
