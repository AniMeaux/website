import { AccessImage } from "#access/image";
import { Action } from "#core/actions/actions";
import { useConfig } from "#core/config";
import type { DynamicImageProps } from "#core/data-display/image";
import { DynamicImage } from "#core/data-display/image";
import { ImageUrl } from "#core/data-display/image-url";
import { OPENING_TIME, hasShowEnded } from "#core/dates";
import { BoardCard } from "#core/layout/board-card";
import { HighLightBackground } from "#core/layout/highlight-background";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { ExhibitorsImage } from "#exhibitors/image";
import { Pictogram } from "#generated/pictogram";
import { usePartners } from "#partners/data";
import { PartnerItem } from "#partners/item";
import { PartnersPlaceholderImage } from "#partners/placeholder-image";
import { PreviousEditionImage } from "#previous-editions/image";
import { cn } from "@animeaux/core";
import type { ShowProvider } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import type { loader } from "./route";

const ONE_MINUTE_IN_MS = 60 * 1000;

export function HomePage() {
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
      <ProvidersSection />
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
          papiers d’identification des animaux seront obligatoires lors de ce
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
          <PartnersPlaceholderImage
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
      <div className="relative grid grid-cols-1 gap-2 py-2 px-safe-page-narrow sm:gap-4 md:grid-cols-2 md:items-center md:py-4 md:px-safe-page-normal lg:gap-8">
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

function ProvidersSection() {
  const { providers } = useLoaderData<typeof loader>();

  return (
    <Section width="full" columnCount={1}>
      <Section.TextAside className="px-safe-page-narrow">
        <Section.Title className="text-center">Nos prestataires</Section.Title>

        <p className="text-center">
          Nous aurons la joie de collaborer avec ces prestataires.
        </p>
      </Section.TextAside>

      <section className="grid grid-cols-1 px-safe-page-narrow md:px-safe-page-normal">
        {providers.length === 0 ? (
          <ProviderPlaceholderImage
            fallbackSize="1024"
            sizes={{ default: "100vw", lg: "1024px" }}
            className="w-full"
          />
        ) : (
          <ul className="flex flex-wrap justify-center gap-1 md:gap-2">
            {providers.map((provider) => (
              <ProviderItem
                key={provider.id}
                provider={provider}
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

function ProviderPlaceholderImage(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof DynamicImage>,
    "alt" | "aspectRatio" | "image" | "title"
  >,
) {
  return (
    <DynamicImage
      {...props}
      image={{ id: "/show/2bb4f949-4874-4d66-8822-30bf26ebde2c" }}
      alt="Prestataires du Salon des Ani’Meaux."
      title="Prestataires du Salon des Ani’Meaux."
      aspectRatio="16:9"
    />
  );
}

function ProviderItem({
  provider,
  fallbackSize,
  sizes,
  className,
}: Pick<DynamicImageProps, "fallbackSize" | "sizes"> & {
  provider: Pick<ShowProvider, "id" | "image" | "name" | "url">;
  isSmall?: boolean;
  className?: string;
}) {
  return (
    <li className={cn("grid grid-cols-1", className)}>
      <Link
        to={provider.url}
        className={cn(
          "group grid grid-cols-1 overflow-hidden rounded-2 border border-alabaster focus-visible:focus-spaced-mystic",
        )}
      >
        <DynamicImage
          image={ImageUrl.parse(provider.image)}
          alt={provider.name}
          aspectRatio="4:3"
          objectFit="cover"
          fallbackSize={fallbackSize}
          sizes={sizes}
          className="w-full transition-transform duration-150 ease-in-out group-hover:scale-105"
        />
      </Link>
    </li>
  );
}
