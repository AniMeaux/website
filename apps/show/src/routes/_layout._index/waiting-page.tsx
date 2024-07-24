import { Action } from "#core/actions/actions";
import { SocialLink } from "#core/actions/social-link";
import { useConfig } from "#core/config";
import { HighLightBackground } from "#core/layout/highlight-background";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { ExhibitorsImage } from "#exhibitors/image";
import { Pictogram } from "#generated/pictogram";
import logoLarge from "#images/logo-large.svg";
import { PreviousEditionImage } from "#previous-editions/image";
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
    <header className="grid grid-cols-1 justify-items-center pb-4 pt-safe-4 px-safe-page-narrow md:px-safe-page-normal">
      <img
        src={logoLarge}
        alt="Salon des Ani’Meaux"
        className="aspect-square w-2/3 md:w-1/2"
      />
    </header>
  );
}

function ComeBackSection() {
  return (
    <Section>
      <Section.ImageAside>
        <ExhibitorsImage
          fallbackSize="1024"
          sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
          loading="eager"
          shape={{ id: "variant-2", color: "alabaster", side: "left" }}
        />
      </Section.ImageAside>

      <Section.TextAside>
        <Section.Title>Revient en 2025</Section.Title>

        <p>
          Le Salon des Ani’Meaux revient en force pour une nouvelle édition en
          2025 ! Préparez-vous à vivre une expérience unique dédiée au bien-être
          des animaux domestiques et sauvages.
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

        <Section.ImageAside>
          <PreviousEditionImage
            fallbackSize="1024"
            sizes={{ default: "384px", md: "50vw", lg: "512px" }}
            shape={{ id: "variant-7", color: "mystic", side: "right" }}
            className="w-full"
          />
        </Section.ImageAside>

        <Section.TextAside className="md:col-start-1 md:row-start-1">
          <Section.Title>Éditions Précédentes</Section.Title>

          <p>
            Revivez les moments forts des éditions précédentes de notre salon en
            parcourant notre galerie de photos.
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
      </div>
    </Section>
  );
}

function FollowSection() {
  const { facebookUrl, instagramUrl } = useConfig();

  return (
    <Section width="full" columnCount={1}>
      <Section.TextAside className="px-safe-page-narrow">
        <Section.Title className="text-center">Restez informés</Section.Title>

        <p className="text-center">
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
    </Section>
  );
}
