import { Action } from "#i/core/actions/action";
import { SocialLink } from "#i/core/actions/social-link";
import { DynamicImage } from "#i/core/data-display/image";
import { HighLightBackground } from "#i/core/layout/highlight-background";
import { LazyElement } from "#i/core/layout/lazy-element";
import { Section } from "#i/core/layout/section";
import { Routes } from "#i/core/navigation";
import { Pictogram } from "#i/generated/pictogram";
import logoLarge from "#i/images/logo-large.svg";
import { Link } from "@remix-run/react";

export function RouteWaiting() {
  return (
    <>
      <SectionLogo />
      <SectionComeBack />
      <SectionPreviousEditions />
      <SectionFollow />
    </>
  );
}

function SectionLogo() {
  return (
    <header className="grid grid-cols-1 justify-items-center pb-4 pt-safe-4 px-safe-page-narrow md:px-safe-page-normal">
      <img
        src={logoLarge}
        alt="Salon des Ani’Meaux"
        className="aspect-square w-2/3 md:w-1/2"
      />
    </header>
  );
}

function SectionComeBack() {
  return (
    <Section.Root>
      <LazyElement asChild>
        <Section.ImageAside className="aspect-square translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
          <DynamicImage
            image={{
              id: "/show/pages/pott-et-pollen-stand-nduainkltifzvy2idnvl",
            }}
            fallbackSize="1024"
            sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
            loading="eager"
            alt="Pott derrière un stand."
            aspectRatio="none"
            className="absolute inset-x-0 bottom-0 w-full"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
          <Section.Title>Revient en 2026</Section.Title>

          <p>
            Le Salon des Ani’Meaux revient en force pour une nouvelle édition en
            2026 ! Préparez-vous à vivre une expérience unique dédiée au
            bien-être des animaux domestiques et sauvages.
          </p>

          <p>
            Rencontrez des exposants passionnés, découvrez des produits et
            services de qualité, participez à des animations ludiques et
            éducatives, le tout dans une ambiance conviviale et bienveillante.
          </p>

          <p>
            Restez à l’affût des prochaines annonces pour ne pas manquer cet
            événement incontournable pour tous les amoureux des animaux.
          </p>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}

function SectionPreviousEditions() {
  return (
    <Section.Root
      width="full"
      height="large"
      columnCount={1}
      className="pt-12 md:pt-8"
    >
      <div className="relative grid grid-cols-1 gap-2 py-2 px-safe-page-narrow sm:gap-4 md:grid-cols-2 md:items-center md:py-4 md:px-safe-page-normal lg:gap-8">
        <HighLightBackground
          color="alabaster"
          className="absolute left-0 top-0 -z-just-above h-full w-full"
        />

        <LazyElement asChild>
          <Section.ImageAside className="aspect-4/3 translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
            <DynamicImage
              image={{
                id: "/show/pages/pott-et-pollen-photos-ajfy5llvexzgl0df2rsy",
              }}
              fallbackSize="1024"
              sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
              alt="Pott regarde un album photo."
              aspectRatio="none"
              className="absolute inset-x-0 top-1/2 w-full -translate-y-[63%] md:-translate-y-[55%]"
            />
          </Section.ImageAside>
        </LazyElement>

        <LazyElement asChild>
          <Section.TextAside className="-translate-x-4 opacity-0 transition-[opacity,transform] delay-150 duration-very-slow data-visible:translate-x-0 data-visible:opacity-100 md:col-start-1 md:row-start-1">
            <Section.Title>Éditions Précédentes</Section.Title>

            <p>
              Revivez les moments forts des éditions précédentes de notre salon
              en parcourant notre galerie de photos.
            </p>

            <p>
              Découvrez les sourires, les émotions et les moments de partage qui
              ont marqué les visiteurs, les exposants et les bénévoles.
            </p>

            <p>
              Plongez dans l’univers passionnant de notre événement et
              laissez-vous emporter par l’ambiance chaleureuse et conviviale qui
              caractérise chaque édition.
            </p>

            <Section.Action asChild>
              <Action color="mystic" asChild>
                <Link to={Routes.previousEditions.toString()} prefetch="intent">
                  Voir les photos
                </Link>
              </Action>
            </Section.Action>
          </Section.TextAside>
        </LazyElement>
      </div>
    </Section.Root>
  );
}

function SectionFollow() {
  return (
    <Section.Root width="full" columnCount={1}>
      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow px-safe-page-narrow data-visible:translate-y-0 data-visible:opacity-100">
          <Section.Title className="md:text-center">
            Restez informés
          </Section.Title>

          <p className="md:text-center">
            Rejoignez notre communauté passionnée et ne manquez aucune annonce,
            programme ou nouveauté. Suivez-nous dès maintenant pour vivre
            l'aventure animale avec nous !
          </p>

          <div className="grid grid-cols-2-auto justify-center gap-2">
            <SocialLink to={CLIENT_ENV.FACEBOOK_URL}>
              <Pictogram id="facebook" className="icon-48" />
            </SocialLink>

            <SocialLink to={CLIENT_ENV.INSTAGRAM_URL}>
              <Pictogram id="instagram" className="icon-48" />
            </SocialLink>
          </div>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}
