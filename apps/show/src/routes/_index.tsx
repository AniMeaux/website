import { V2_MetaFunction } from "@remix-run/react";
import { Action, ProseInlineAction } from "~/core/actions";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { useConfig } from "~/core/config";
import { DynamicImage } from "~/core/dataDisplay/image";
import { FooterWave } from "~/core/layout/footerWave";
import { HighLightBackground } from "~/core/layout/highlightBackground";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { Icon, IconProps } from "~/generated/icon";
import { Pictogram } from "~/generated/pictogram";
import logoAniMeaux from "~/images/logoAniMeaux.svg";
import logoLarge from "~/images/logoLarge.svg";

export const meta: V2_MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle() });
};

export default function Route() {
  return (
    <main className="grid grid-cols-1 gap-24">
      <LogoSection />
      <ComeBackSection />
      <ActionsSection />
      <FollowSection />
      <FooterSection />
    </main>
  );
}

function LogoSection() {
  return (
    <header className="px-safe-page-narrow md:px-safe-page-normal pt-safe-4 pb-4 grid grid-cols-1 justify-items-center">
      <img
        src={logoLarge}
        alt="Salon des Ani’Meaux"
        className="w-2/3 md:w-1/2 aspect-square"
      />
    </header>
  );
}

function ComeBackSection() {
  return (
    <section className="px-safe-page-narrow md:px-safe-page-normal py-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 lg:gap-8 md:items-center">
      <aside className="relative grid grid-cols-1">
        <DynamicImage
          image={{
            id: "/show/9ec51afc-44b3-4bf8-963a-d3d06d6227a6",
            blurhash: "U5FO+L0000?[00EJ?t$m00^,RQk95QyD4;IA",
          }}
          alt="Stands des exposants du salon."
          fallbackSize="1024"
          sizes={{ md: "50vw", default: "100vw" }}
          loading="eager"
          shape={{ id: "variant2", color: "alabaster", side: "left" }}
        />
      </aside>

      <aside className="grid grid-cols-1 gap-2">
        <h1 className="text-title-small md:text-title-large text-mystic">
          Revient en 2024
        </h1>

        <p>
          Le Salon des Ani’Meaux revient en force pour une nouvelle édition en
          2024 ! Préparez-vous à vivre une expérience unique dédiée au bien-être
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
      </aside>
    </section>
  );
}

function ActionsSection() {
  const { exhibitorsFormUrl, partnersFormUrl } = useConfig();

  return (
    <section className="py-4 grid grid-cols-1">
      <div className="relative bg-alabaster bg-var-alabaster px-safe-page-narrow md:px-safe-page-normal py-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 lg:gap-8 md:items-start">
        <HighLightBackground
          color="alabaster"
          className="absolute -z-10 top-0 left-0 w-full h-full"
        />

        <aside className="grid grid-cols-1 gap-2">
          <h1 className="text-title-small md:text-title-large text-mystic">
            Devenir partenaire
          </h1>

          <p>
            Vous souhaitez soutenir le Salon des Ani’Meaux et contribuer à sa
            réussite ?
            <br />
            <br />
            Devenez partenaire en apportant votre soutien financier à notre
            association organisatrice. Votre contribution nous permettra de
            proposer un événement encore plus exceptionnel, avec des animations
            variées, des exposants de qualité et des moments de partage
            inoubliables. En devenant partenaire, vous marquerez votre
            engagement en faveur du bien-être animal et bénéficierez d'une
            visibilité auprès d’un large public passionné.
            <br />
            <br />
            Rejoignez-nous dans cette aventure et ensemble, créons un salon
            encore plus grand et impactant pour notre communauté d'amoureux des
            animaux.
          </p>

          <div className="grid grid-cols-1 justify-items-center md:justify-items-start">
            <Action asChild>
              <BaseLink to={partnersFormUrl}>Devenez partenaire</BaseLink>
            </Action>
          </div>
        </aside>

        <VerticalSeparator />
        <HorizontalSeparator />

        <aside className="grid grid-cols-1 gap-2">
          <h1 className="text-title-small md:text-title-large text-mystic">
            Devenir Exposant
          </h1>

          <p>
            Vous êtes un professionnel passionné par le monde animal et
            souhaitez faire partie de l’aventure du Salon des Ani’Meaux en tant
            qu’exposant ?
            <br />
            <br />
            Remplissez dès maintenant notre formulaire de présentation et
            proposez votre participation à l’édition 2024. En rejoignant notre
            salon, vous bénéficierez d'une visibilité exceptionnelle auprès d’un
            public enthousiaste et engagé. Faites connaître votre activité,
            partagez votre expertise et rencontrez de nouveaux partenaires.
            <br />
            <br />
            Nous sommes impatients de découvrir votre univers et de vous
            accueillir parmi les exposants de notre prochain événement. Ne
            manquez pas cette opportunité unique de participer à une expérience
            enrichissante et mémorable.
          </p>

          <div className="grid grid-cols-1 justify-items-center md:justify-items-start">
            <Action asChild>
              <BaseLink to={exhibitorsFormUrl}>Devenez exposant</BaseLink>
            </Action>
          </div>
        </aside>
      </div>
    </section>
  );
}

function VerticalSeparator() {
  return (
    <svg
      viewBox="0 0 3 100"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden md:block h-full w-[3px] overflow-visible text-mystic"
    >
      <path
        d="M1.5 0L1.5 100"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="14 13"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function HorizontalSeparator() {
  return (
    <svg
      viewBox="0 0 100 3"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="md:hidden h-[3px] w-full overflow-visible text-mystic"
    >
      <path
        d="M0 1.5L100 1.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="14 13"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function FollowSection() {
  const { facebookUrl, instagramUrl } = useConfig();

  return (
    <section className="px-safe-page-narrow py-4 flex">
      <aside className="grid grid-cols-1 gap-2 text-center">
        <h1 className="text-title-small md:text-title-large text-mystic">
          Restez informés
        </h1>

        <p>
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
      </aside>
    </section>
  );
}

function FooterSection() {
  const { facebookUrl, instagramUrl, animeauxUrl } = useConfig();

  return (
    <footer className="grid grid-cols-1">
      <FooterWave className="w-full h-[53px] md:h-[90px]" />

      <section className="bg-paleBlue bg-var-paleBlue px-page-narrow md:px-page-normal py-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 justify-items-center md:items-center">
        <img
          src={logoAniMeaux}
          alt="Association Ani’Meaux"
          className="w-[200px]"
        />

        <aside className="w-full grid grid-cols-1 gap-2">
          <div className="grid grid-cols-[auto_auto] justify-start gap-1">
            <SocialLink to={facebookUrl}>
              <Pictogram id="facebook" className="text-[24px]" />
            </SocialLink>

            <SocialLink to={instagramUrl}>
              <Pictogram id="instagram" className="text-[24px]" />
            </SocialLink>
          </div>

          <ul className="grid grid-cols-1">
            <ContactItem icon="boldCall" to="tel:+33612194392">
              06 12 19 43 92
            </ContactItem>

            <ContactItem icon="boldSms" to="mailto:salon@animeaux.org">
              salon@animeaux.org
            </ContactItem>
          </ul>

          <p>
            Le Salon des Ani’Meaux est organisé par l'association{" "}
            <ProseInlineAction asChild>
              <BaseLink to={animeauxUrl}>Ani’Meaux.</BaseLink>
            </ProseInlineAction>
          </p>
        </aside>
      </section>

      <section className="bg-prussianBlue px-page-narrow md:px-page-normal py-2 grid grid-cols-1">
        <p className="text-caption-lowercase-emphasis text-white text-center">
          Copyright © {new Date().getFullYear()} Ani’Meaux
        </p>
      </section>
    </footer>
  );
}

function SocialLink(props: Omit<BaseLinkProps, "className">) {
  return (
    <BaseLink
      {...props}
      className="rounded-full grid grid-cols-1 transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95 hover:active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-prussianBlue focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg"
    />
  );
}

function ContactItem({
  icon,
  to,
  children,
}: {
  icon: IconProps["id"];
  to: NonNullable<BaseLinkProps["to"]>;
  children: string;
}) {
  return (
    <li className="grid grid-cols-1 justify-items-start">
      <BaseLink
        to={to}
        className="rounded-md grid grid-cols-[auto_auto] items-start gap-1 transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95 hover:active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-paleBlue"
      >
        <span className="h-2 flex items-center">
          <Icon id={icon} className="text-[16px] text-mystic" />
        </span>

        <span>{children}</span>
      </BaseLink>
    </li>
  );
}
