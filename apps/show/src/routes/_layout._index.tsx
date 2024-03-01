import { AccessImage } from "#access/image";
import { Action, ProseInlineAction } from "#core/actions";
import { useConfig } from "#core/config";
import { createConfig } from "#core/config.server";
import { ErrorPage } from "#core/data-display/error-page";
import { DynamicImage } from "#core/data-display/image";
import { OPENING_TIME, hasShowEnded } from "#core/dates";
import type { RouteHandle } from "#core/handles";
import { BoardCard } from "#core/layout/board-card";
import { FooterWave } from "#core/layout/footer-wave";
import { HighLightBackground } from "#core/layout/highlight-background";
import { LegalBackground } from "#core/layout/legal-background";
import { Section } from "#core/layout/section";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { ExhibitorsImage } from "#exhibitors/image";
import type { IconProps } from "#generated/icon";
import { Icon } from "#generated/icon";
import { Pictogram } from "#generated/pictogram";
import logoAniMeaux from "#images/logo-ani-meaux.svg";
import logoLarge from "#images/logo-large.svg";
import { usePartners } from "#partners/data";
import { PartnersImage } from "#partners/image";
import { PartnerItem } from "#partners/item";
import { PreviousEditionImage } from "#previous-editions/image";
import { cn } from "@animeaux/core";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const ONE_MINUTE_IN_MS = 60 * 1000;

export const handle: RouteHandle = {
  hasExpandedPageBackground: true,
};

export async function loader() {
  const { featureFlagShowExhibitors, featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline || !featureFlagShowExhibitors) {
    return json({ exhibitorCount: 60 });
  }

  return json({ exhibitorCount: await prisma.exhibitor.count() });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle() });
};

export function ErrorBoundary() {
  const { featureFlagSiteOnline } = useConfig();

  return <ErrorPage isStandAlone={!featureFlagSiteOnline} />;
}

export default function Route() {
  const { featureFlagSiteOnline } = useConfig();

  if (featureFlagSiteOnline) {
    return <HomePage />;
  }

  return <WaitingPage />;
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <ComeWithYourDogSection />
      <PresentationSection />
      <OriginSection />
      <PartnersSection />
      <ExhibitorsSection />
      <RaffleSection />
      <PreviousEditionsSection />
      <AccessSection />
    </>
  );
}

function HeroSection() {
  const { ticketingUrl } = useConfig();

  return (
    <Section columnCount={1}>
      <div className="relative grid grid-cols-1 gap-2 sm:gap-4 md:pt-[calc((1024px-100vw)*100/(1024-768))] lg:pt-0">
        <DynamicImage
          image={{ id: "/show/e0617fd9-ef5d-4faa-9921-e3e4105362cd" }}
          alt="Les animaux du salon."
          fallbackSize="1024"
          sizes={{ default: "100vw", lg: "1024px" }}
          aspectRatio="16:10"
          loading="eager"
          className="w-full"
        />

        <Section.TextAside className="md:absolute md:left-0 md:top-0">
          <Section.Title asChild className="text-center md:text-left">
            <h1>Salon des Ani’Meaux</h1>
          </Section.Title>

          <p className="text-center md:text-left">
            3ème édition du salon dédié au bien-être animal à Meaux.
            <br />
            <strong className="text-body-lowercase-emphasis">
              <time dateTime={OPENING_TIME.toISO()}>
                8 et 9 juin 2024 - 10h à 18h
              </time>{" "}
              - Colisée de Meaux.
            </strong>
          </p>

          <Countdown className="justify-self-center md:justify-self-start" />

          {hasShowEnded() ? null : (
            <Section.Action asChild>
              <Action asChild color="mystic">
                <Link to={ticketingUrl}>Achetez votre billet</Link>
              </Action>
            </Section.Action>
          )}
        </Section.TextAside>
      </div>
    </Section>
  );
}

function Countdown({ className }: { className?: string }) {
  const [, forceUpdate] = useState(true);

  const now = DateTime.now();
  const diff = OPENING_TIME.diff(now, ["days", "hours", "minutes"]);

  // Force a re-rendering every minutes to recompute the diff.
  useEffect(() => {
    const interval = setInterval(
      () => forceUpdate((b) => !b),
      ONE_MINUTE_IN_MS,
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (diff.toMillis() <= 0) {
    return null;
  }

  return (
    <div className={cn("grid grid-flow-col items-start gap-1", className)}>
      <CountDownItem
        label={diff.days > 1 ? "Jours" : "Jour"}
        value={diff.days}
      />

      <CountDownItem
        label={diff.hours > 1 ? "Heures" : "Heure"}
        value={diff.hours}
      />

      <CountDownItem
        // `minutes` can have decimals because it's the smallest unit
        // asked in the diff
        label={Math.floor(diff.minutes) > 1 ? "Minutes" : "Minute"}
        value={Math.floor(diff.minutes)}
      />
    </div>
  );
}

function CountDownItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-0.5">
      <span className="grid aspect-square w-5 items-center justify-items-center rounded-1 bg-alabaster font-serif text-[32px] leading-none tracking-wider text-mystic">
        {value.toLocaleString("fr-FR", { minimumIntegerDigits: 2 })}
      </span>

      <span className="text-caption-uppercase-default">{label}</span>
    </div>
  );
}

function ComeWithYourDogSection() {
  return (
    <Section>
      <Section.ImageAside>
        <DynamicImage
          image={{ id: "/show/e1f05606-0310-44c2-b9ac-273843ac44aa" }}
          alt="Chien qui tire la langue."
          fallbackSize="512"
          sizes={{ default: "384px", md: "50vw", lg: "464px" }}
          loading="eager"
          className="w-full"
        />
      </Section.ImageAside>

      <Section.TextAside>
        <Section.Title>Venir avec son chien</Section.Title>

        <p>
          Votre chien est le bienvenu durant le salon. Cependant, un contrôle
          vétérinaire sera effectué à l’entrée. Le carnet de santé et les
          papiers d’identification des animaux seront obligatoire lors de ce
          contrôle. Pour les chiens de catégorie, veillez à prévoir votre
          autorisation de détention.
        </p>

        <p className="rounded-1 bg-paleBlue px-2 py-1">
          Pour le bien-être de votre chien et celui des autres présents durant
          le salon, veillez à ne l’amener que s’il est sociable avec les autres
          animaux et à l’aise en présence de nombreuses personnes.
        </p>
      </Section.TextAside>
    </Section>
  );
}

function PresentationSection() {
  const { exhibitorCount } = useLoaderData<typeof loader>();

  return (
    <Section width="full" columnCount={1}>
      <div className="grid grid-cols-1">
        <section className="grid grid-cols-1 gap-2 px-safe-page-narrow sm:gap-4 md:grid-cols-2 md:items-end md:px-safe-page-normal lg:gap-8">
          <Section.TextAside className="md:pb-4">
            <Section.Title>Présentation</Section.Title>

            <p>
              Le Salon des Ani’Meaux a pour vocation de sensibiliser les petits
              et les grands au bien-être de nos amis les animaux.
              <br />
              <br />
              Ouvert à tous, il permet de rencontrer des professionnels et des
              associations, tout en profitant d’activités et animations riches
              et de moments de convivialité.
              <br />
              <br />
              Les visiteurs pourront retrouver des acteurs agissant en faveur du
              bien-être des animaux de compagnie mais également des animaux de
              la ferme, des animaux sauvages ainsi que des insectes.
            </p>
          </Section.TextAside>

          <Section.ImageAside className="-z-10">
            <DynamicImage
              image={{ id: "/show/539cb493-3e7d-406a-b6d9-d49ed90bf016" }}
              alt="Chat et chien."
              fallbackSize="512"
              sizes={{ default: "384px", md: "50vw", lg: "464px" }}
              loading="eager"
              aspectRatio="16:10"
              className="w-full"
            />
          </Section.ImageAside>
        </section>

        <section className="relative py-2 px-safe-page-narrow md:py-4 md:px-safe-page-normal">
          <HighLightBackground
            color="paleBlue"
            className="absolute left-0 top-0 -z-10 h-full w-full"
          />

          <aside className="grid grid-cols-1">
            <ul className="grid grid-cols-1 gap-2 md:auto-cols-fr md:grid-flow-col md:gap-4">
              <HighLightItem icon="stand-prussian-blue">
                {exhibitorCount} exposants dévoués au bien-être des animaux.
              </HighLightItem>

              <HighLightItem icon="dog">
                Des chiens à l’adoption qui feront chavirer votre coeur.
              </HighLightItem>

              <HighLightItem icon="video">
                Des animations pour vous divertir et enrichir vos connaissances.
              </HighLightItem>
            </ul>
          </aside>
        </section>
      </div>
    </Section>
  );
}

function HighLightItem({
  icon,
  children,
}: React.PropsWithChildren<{
  icon: React.ComponentProps<typeof Pictogram>["id"];
}>) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
      <Pictogram id={icon} className="text-[48px]" />
      <span>{children}</span>
    </li>
  );
}

function OriginSection() {
  return (
    <Section columnCount={1}>
      <Section.TextAside asChild>
        <BoardCard>
          <Section.Title>Origine du salon</Section.Title>

          <p>
            L’histoire du Salon des Ani’Meaux remonte à l’initiative de
            l’association Ani’Meaux, passionnée et engagée dans la cause
            animale. En partenariat étroit avec la municipalité de Meaux, cette
            initiative a donné naissance à un événement unique dédié au
            bien-être des animaux.
            <br />
            <br />
            La première édition a vu le jour en mai 2022, résultat d’un travail
            acharné de bénévoles déterminés à sensibiliser et à rassembler.
            Forte de ce succès initial, l’édition suivante en 2023 a amplifié
            les ambitions, réunissant exposants et visiteurs dans une atmosphère
            conviviale et engagée.
            <br />
            <br />
            Aujourd’hui, le Salon des Ani’Meaux est devenu un rendez-vous
            incontournable pour les amoureux des animaux, conjuguant passion,
            éducation et sensibilisation pour le bien-être de nos amis à quatre
            pattes.
          </p>
        </BoardCard>
      </Section.TextAside>
    </Section>
  );
}

function PartnersSection() {
  const { partnersFormUrl } = useConfig();
  const partners = usePartners();

  return (
    <Section width="full" columnCount={1}>
      <Section.TextAside className="px-safe-page-narrow">
        <Section.Title className="text-center">Nos partenaires</Section.Title>

        <p className="text-center">
          Le Salon des Ani’Meaux est imaginé et mis en place par des bénévoles,
          mais il n’aurait pas pu voir le jour sans leur participation.
        </p>

        <Section.Action asChild isCentered>
          <Action asChild color="prussianBlue">
            <Link to={partnersFormUrl}>Devenez partenaire</Link>
          </Action>
        </Section.Action>
      </Section.TextAside>

      <section className="grid grid-cols-1 px-safe-page-narrow md:px-safe-page-normal">
        {partners.length === 0 ? (
          <PartnersImage
            fallbackSize="1024"
            sizes={{ default: "100vw", lg: "1024px" }}
            className="w-full"
          />
        ) : (
          <ul className="flex flex-wrap justify-center gap-1 md:gap-2">
            {partners.map((partner) => (
              <PartnerItem
                key={partner.id}
                partner={partner}
                fallbackSize="512"
                sizes={{ default: "130px", lg: "180px" }}
                className="w-[130px] flex-none md:w-[180px]"
              />
            ))}
          </ul>
        )}
      </section>
    </Section>
  );
}

function ExhibitorsSection() {
  const { exhibitorCount } = useLoaderData<typeof loader>();

  return (
    <Section>
      <Section.ImageAside>
        <ExhibitorsImage
          fallbackSize="1024"
          sizes={{ default: "384px", md: "50vw", lg: "512px" }}
          shape={{ id: "variant-2", color: "paleBlue", side: "right" }}
          className="w-full"
        />
      </Section.ImageAside>

      <Section.TextAside className="md:col-start-1 md:row-start-1">
        <Section.Title className="text-center md:text-left">
          Nos exposants
        </Section.Title>

        <p className="text-center md:text-left">
          Cette année, {exhibitorCount} exposants vous attendent répartis dans 3
          grandes catégories.
        </p>

        <ul className="flex flex-wrap items-start justify-center gap-x-1 gap-y-2 md:gap-x-2">
          <ExhibitorItem icon="group">Associations</ExhibitorItem>
          <ExhibitorItem icon="help">Soins et activités</ExhibitorItem>
          <ExhibitorItem icon="food">Alimentation et accessoires</ExhibitorItem>
        </ul>

        <Section.Action asChild>
          <Action asChild color="mystic">
            <Link to={Routes.exhibitors()} prefetch="intent">
              Voir tous les exposants
            </Link>
          </Action>
        </Section.Action>
      </Section.TextAside>
    </Section>
  );
}

function ExhibitorItem({
  icon,
  children,
}: React.PropsWithChildren<{
  icon: React.ComponentProps<typeof Pictogram>["id"];
}>) {
  return (
    <li className="grid min-w-[130px] flex-1 grid-cols-1 justify-items-center gap-1">
      <Pictogram id={icon} className="text-[48px]" />
      <span className="w-full text-center">{children}</span>
    </li>
  );
}

function RaffleSection() {
  const { raffleUrl } = useConfig();

  return (
    <Section>
      <Section.ImageAside>
        <DynamicImage
          image={{
            id: "/show/b2b5b577-99be-49e0-b613-0990709388c9",
            blurhash: "UTL3}s4.?^xb_NRkWCbu%gtRIVWVxbM{M_aK",
          }}
          alt="Chien tenant un cadeau dans la gueule."
          aspectRatio="1:1"
          fallbackSize="1024"
          sizes={{ default: "384px", md: "50vw", lg: "512px" }}
          shape={{ id: "variant-10", color: "prussianBlue", side: "left" }}
          className="w-full"
        />
      </Section.ImageAside>

      <Section.TextAside>
        <Section.Title>Tombola</Section.Title>

        <p>
          L’équipe organisatrice vous propose une tombola grâce à la générosité
          de nombreux partenaires.
          <br />
          <br />
          Cette tombola permettra de financer partiellement la logistique
          relative à l’organisation du Salon. Les bénéfices éventuels seront
          reversés aux associations exposantes du Salon.
        </p>

        {hasShowEnded() ? null : (
          <Section.Action asChild>
            <Action asChild color="mystic">
              <Link to={raffleUrl}>Acheter un ticket</Link>
            </Action>
          </Section.Action>
        )}
      </Section.TextAside>
    </Section>
  );
}

function PreviousEditionsSection() {
  return (
    <Section width="full" columnCount={1}>
      <div className="relative grid grid-cols-1 gap-2 py-2 bg-var-alabaster px-safe-page-narrow sm:gap-4 md:grid-cols-2 md:items-center md:py-4 md:px-safe-page-normal lg:gap-8">
        <HighLightBackground
          color="alabaster"
          className="absolute left-0 top-0 -z-10 h-full w-full"
        />

        <Section.ImageAside>
          <PreviousEditionImage
            fallbackSize="1024"
            sizes={{ default: "384px", md: "50vw", lg: "512px" }}
            shape={{ id: "variant-3", color: "mystic", side: "right" }}
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

function AccessSection() {
  return (
    <Section>
      <Section.ImageAside>
        <AccessImage
          fallbackSize="1024"
          sizes={{ default: "384px", md: "50vw", lg: "512px" }}
          shape={{ id: "variant-7", color: "paleBlue", side: "left" }}
          className="w-full"
        />
      </Section.ImageAside>

      <Section.TextAside>
        <Section.Title className="text-center md:text-left">
          Accès au salon
        </Section.Title>

        <p className="text-center md:text-left">
          Voiture, bus, vélo ou à pied, tous les moyens sont bons pour visiter
          le Salon des Ani’Meaux !
        </p>

        <Section.Action asChild>
          <Action asChild color="mystic">
            <Link to={Routes.access()} prefetch="intent">
              S’y rendre
            </Link>
          </Action>
        </Section.Action>
      </Section.TextAside>
    </Section>
  );
}

function WaitingPage() {
  return (
    <main className="grid grid-cols-1">
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
    <section className="grid grid-cols-1 gap-2 py-4 px-safe-page-narrow md:grid-cols-2 md:items-center md:gap-4 md:px-safe-page-normal lg:gap-8">
      <aside className="relative grid grid-cols-1">
        <ExhibitorsImage
          fallbackSize="1024"
          sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
          loading="eager"
          shape={{ id: "variant-2", color: "alabaster", side: "left" }}
        />
      </aside>

      <aside className="grid grid-cols-1 gap-2">
        <h1 className="text-mystic text-title-small md:text-title-large">
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
    <section className="grid grid-cols-1 py-4">
      <div className="relative grid grid-cols-1 gap-4 py-4 bg-var-alabaster px-safe-page-narrow md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:px-safe-page-normal lg:gap-8">
        <HighLightBackground
          color="alabaster"
          className="absolute left-0 top-0 -z-10 h-full w-full"
        />

        <aside className="grid grid-cols-1 gap-2">
          <h1 className="text-mystic text-title-small md:text-title-large">
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
              <Link to={partnersFormUrl}>Devenez partenaire</Link>
            </Action>
          </div>
        </aside>

        <VerticalSeparator />
        <HorizontalSeparator />

        <aside className="grid grid-cols-1 gap-2">
          <h1 className="text-mystic text-title-small md:text-title-large">
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
              <Link to={exhibitorsFormUrl}>Devenez exposant</Link>
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
      className="hidden h-full w-[3px] overflow-visible text-mystic md:block"
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
      className="h-[3px] w-full overflow-visible text-mystic md:hidden"
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
    <section className="flex py-4 px-safe-page-narrow">
      <aside className="grid grid-cols-1 gap-2 text-center">
        <h1 className="text-mystic text-title-small md:text-title-large">
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
      <FooterWave className="h-[53px] w-full md:h-[90px]" />

      <section className="grid grid-cols-1 justify-items-center gap-4 bg-paleBlue px-page-narrow py-4 bg-var-paleBlue md:grid-cols-2 md:items-center md:px-page-normal lg:gap-8">
        <img
          src={logoAniMeaux}
          alt="Association Ani’Meaux"
          className="aspect-square w-[200px]"
        />

        <aside className="grid w-full grid-cols-1 gap-2">
          <div className="grid grid-cols-[auto_auto] justify-start gap-1">
            <SocialLink to={facebookUrl}>
              <Pictogram id="facebook" className="text-[24px]" />
            </SocialLink>

            <SocialLink to={instagramUrl}>
              <Pictogram id="instagram" className="text-[24px]" />
            </SocialLink>
          </div>

          <ul className="grid grid-cols-1">
            <ContactItem icon="phone-solid" to="tel:+33612194392">
              06 12 19 43 92
            </ContactItem>

            <ContactItem icon="envelope-solid" to="mailto:salon@animeaux.org">
              salon@animeaux.org
            </ContactItem>
          </ul>

          <p>
            Le Salon des Ani’Meaux est organisé par l'association{" "}
            <ProseInlineAction asChild>
              <Link to={animeauxUrl}>Ani’Meaux.</Link>
            </ProseInlineAction>
          </p>
        </aside>
      </section>

      <section className="relative z-10 grid grid-cols-1 px-page-narrow py-2 md:px-page-normal">
        <LegalBackground className="absolute left-0 top-0 -z-10 h-full w-full" />

        <p className="text-center text-white text-caption-lowercase-emphasis">
          Copyright © {new Date().getFullYear()} Ani’Meaux
        </p>
      </section>
    </footer>
  );
}

function SocialLink({
  children,
  ...rest
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">) {
  return (
    <Link
      {...rest}
      className="grid grid-cols-1 rounded-full transition-transform duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-prussianBlue focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg hover:scale-105 hover:active:scale-95"
    >
      {children}
    </Link>
  );
}

function ContactItem({
  icon,
  to,
  children,
}: {
  icon: IconProps["id"];
  to: React.ComponentProps<typeof Link>["to"];
  children: string;
}) {
  return (
    <li className="grid grid-cols-1 justify-items-start">
      <Link
        to={to}
        className="grid grid-cols-[auto_auto] items-start gap-1 rounded-0.5 transition-transform duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-paleBlue hover:scale-105 hover:active:scale-95"
      >
        <span className="flex h-2 items-center">
          <Icon id={icon} className="text-[16px] text-mystic" />
        </span>

        <span>{children}</span>
      </Link>
    </li>
  );
}
