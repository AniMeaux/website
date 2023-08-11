import { Link, V2_MetaFunction } from "@remix-run/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Action, ProseInlineAction } from "~/core/actions";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { ErrorPage } from "~/core/dataDisplay/errorPage";
import { DynamicImage } from "~/core/dataDisplay/image";
import { OPENING_TIME, hasShowEnded } from "~/core/dates";
import { RouteHandle } from "~/core/handles";
import { BoardCard } from "~/core/layout/boardCard";
import { FooterWave } from "~/core/layout/footerWave";
import { HighLightBackground } from "~/core/layout/highlightBackground";
import { LegalBackground } from "~/core/layout/legalBackground";
import { Section } from "~/core/layout/section";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { Routes } from "~/core/routes";
import { ExhibitorsImage } from "~/exhibitors/image";
import { Icon, IconProps } from "~/generated/icon";
import { Pictogram } from "~/generated/pictogram";
import logoAniMeaux from "~/images/logoAniMeaux.svg";
import logoLarge from "~/images/logoLarge.svg";
import { PartnersImage } from "~/partners/image";

const ONE_MINUTE_IN_MS = 60 * 1000;

export const handle: RouteHandle = {
  hasExpandedPageBackground: true,
};

export const meta: V2_MetaFunction = () => {
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
      <div className="relative grid grid-cols-1 gap-2 md:pt-[calc((1024px-100vw)*100/(1024-768))] lg:pt-0">
        <DynamicImage
          image={{ id: "/show/e0617fd9-ef5d-4faa-9921-e3e4105362cd" }}
          alt="Les animaux du salon."
          fallbackSize="1024"
          sizes={{ default: "100vw", lg: "1024px" }}
          aspectRatio="16:10"
          loading="eager"
          className="w-full"
        />

        <Section.TextAside className="md:absolute md:top-0 md:left-0">
          <Section.Title asChild className="text-center md:text-left">
            <h1>Salon des Ani’Meaux</h1>
          </Section.Title>

          <p className="text-center md:text-left">
            Premier salon dédié au bien-être animal à Meaux.
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
      ONE_MINUTE_IN_MS
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
      <span className="w-5 aspect-square rounded-1 bg-alabaster font-serif text-[32px] leading-none tracking-wider text-mystic grid justify-items-center items-center">
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

        <p className="rounded-1 px-2 py-1 bg-paleBlue">
          Pour le bien-être de votre chien et celui des autres présents durant
          le salon, veillez à ne l’amener que s’il est sociable avec les autres
          animaux et à l’aise en présence de nombreuses personnes.
        </p>
      </Section.TextAside>
    </Section>
  );
}

function PresentationSection() {
  return (
    <Section width="full" columnCount={1}>
      <div className="grid grid-cols-1">
        <section className="px-safe-page-narrow md:px-safe-page-normal grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 lg:gap-8 md:items-end">
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
            />
          </Section.ImageAside>
        </section>

        <section className="relative px-safe-page-narrow md:px-safe-page-normal py-2 md:py-4">
          <HighLightBackground
            color="paleBlue"
            className="absolute -z-10 top-0 left-0 w-full h-full"
          />

          <aside className="grid grid-cols-1">
            <ul className="grid grid-cols-1 md:grid-flow-col md:auto-cols-fr gap-2 md:gap-4">
              <HighLightItem icon="standPrussianBlue">
                60 exposants dévoués au bien-être des animaux.
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
    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 items-center">
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

      <section className="px-safe-page-narrow md:px-safe-page-normal grid grid-cols-1">
        <PartnersImage
          fallbackSize="1024"
          sizes={{ default: "100vw", lg: "1024px" }}
        />
      </section>
    </Section>
  );
}

function ExhibitorsSection() {
  return (
    <Section>
      <Section.ImageAside>
        <ExhibitorsImage
          fallbackSize="1024"
          sizes={{ default: "384px", md: "50vw", lg: "512px" }}
          shape={{ id: "variant2", color: "paleBlue", side: "right" }}
        />
      </Section.ImageAside>

      <Section.TextAside className="md:col-start-1 md:row-start-1">
        <Section.Title className="text-center md:text-left">
          Nos exposants
        </Section.Title>

        <p className="text-center md:text-left">
          Cette année, XX exposants vous attendent répartis dans 3 grandes
          catégories.
        </p>

        <ul className="flex flex-wrap justify-center items-start gap-x-1 gap-y-2 md:gap-x-2">
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
    <li className="flex-1 min-w-[130px] grid grid-cols-1 gap-1 justify-items-center">
      <Pictogram id={icon} className="text-[48px]" />
      <span className="w-full text-center">{children}</span>
    </li>
  );
}

function RaffleSection() {
  const { raffleUrl } = useConfig();

  return (
    <Section>
      <Section.ImageAside className="aspect-square justify-items-center items-center">
        <p>Touver une image</p>
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
      <div className="relative px-safe-page-narrow md:px-safe-page-normal py-2 md:py-4 bg-var-alabaster grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 lg:gap-8 md:items-center">
        <HighLightBackground
          color="alabaster"
          className="absolute -z-10 top-0 left-0 w-full h-full"
        />

        <Section.ImageAside>
          <DynamicImage
            image={{
              id: "/show/d5e8898b-d756-4942-a957-17ba782d2aa1",
              blurhash: "UDGuH~.T000000IAEMs;4n%2o~tRs9xD-;t7",
            }}
            alt="Des visiteurs regardant le panneau des adoptions."
            title="Julia Pommé Photographe"
            aspectRatio="1:1"
            fallbackSize="1024"
            sizes={{ default: "384px", md: "50vw", lg: "512px" }}
            shape={{ id: "variant3", color: "mystic", side: "right" }}
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
              <Link to={Routes.previousEditions()}>Voir les photos</Link>
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
        <DynamicImage
          image={{
            id: "/show/d9abb32b-c6f4-4ab4-af8b-a4cc2e2f228e",
            blurhash: "UPO||Q~CNGxc~CnpR$xY$-NXj=Rmj^R~oOoc",
          }}
          alt="Carte de Meaux."
          aspectRatio="1:1"
          fallbackSize="1024"
          sizes={{ default: "384px", md: "50vw", lg: "512px" }}
          shape={{ id: "variant7", color: "paleBlue", side: "left" }}
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
            <Link to={Routes.access()}>S’y rendre</Link>
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
        <ExhibitorsImage
          fallbackSize="1024"
          sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
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
      <div className="relative bg-var-alabaster px-safe-page-narrow md:px-safe-page-normal py-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 lg:gap-8 md:items-start">
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
          className="w-[200px] aspect-square"
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

      <section className="relative z-10 px-page-narrow md:px-page-normal py-2 grid grid-cols-1">
        <LegalBackground className="absolute -z-10 top-0 left-0 w-full h-full" />

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
        className="rounded-0.5 grid grid-cols-[auto_auto] items-start gap-1 transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95 hover:active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-paleBlue"
      >
        <span className="h-2 flex items-center">
          <Icon id={icon} className="text-[16px] text-mystic" />
        </span>

        <span>{children}</span>
      </BaseLink>
    </li>
  );
}
