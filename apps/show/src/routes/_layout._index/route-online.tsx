import { Action } from "#core/actions/action";
import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { DynamicImage } from "#core/data-display/image";
import { BoardCard } from "#core/layout/board-card";
import { HighLightBackground } from "#core/layout/highlight-background";
import { LazyElement } from "#core/layout/lazy-element";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { ShowDay } from "#core/show-day";
import { Pictogram } from "#generated/pictogram";
import { ProviderItem } from "#providers/item";
import { ProvidersPlaceholderImage } from "#providers/placeholder-image";
import { SponsorItem } from "#sponsors/item.js";
import { SponsorsPlaceholderImage } from "#sponsors/placeholder-image.js";
import { cn } from "@animeaux/core";
import { Link, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import type { loader } from "./route";

export function RouteOnline() {
  return (
    <>
      <SectionHero />
      <SectionComeWithYourDog />
      <SectionPresentation />
      <SectionOrigin />
      <SectionSponsors />
      <SectionExhibitors />
      <SectionPreviousEditions />
      <SectionAccess />
      <SectionProviders />
    </>
  );
}

function SectionHero() {
  return (
    <Section.Root columnCount={1}>
      <div className="grid grid-cols-1 gap-2 sm:gap-0 md:grid-cols-auto-fr md:items-start">
        <LazyElement asChild>
          <div className="relative aspect-4/3 translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100 md:grid md:grid-cols-1">
            <DynamicImage
              image={{ id: "/show/pages/pott-and-co_ugp2id" }}
              alt="Pott et ses amis."
              fallbackSize="1024"
              sizes={{ default: "100vw", md: "66vw", lg: "1024px" }}
              aspectRatio="none"
              objectFit="contain"
              loading="eager"
              className="absolute inset-x-0 bottom-0 w-full md:static md:aspect-4/3"
            />
          </div>
        </LazyElement>

        <LazyElement asChild>
          <Section.TextAside className="-translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100 md:col-start-1 md:row-start-1">
            <h1 className="text-center text-hero-small md:text-left md:text-hero-large">
              <span className="text-prussianBlue">Salon des</span>
              <br />
              <span className="text-mystic">Ani’Meaux</span>
              <br />
            </h1>

            <p className="text-center md:text-left">
              4ème édition du salon dédié au bien-être animal.
              <br />
              <strong className="text-body-lowercase-emphasis">
                <time dateTime={ShowDay.openingTime.toISO()}>
                  7 et 8 juin 2025 - 10h à 18h
                </time>{" "}
                - Colisée de Meaux.
              </strong>
            </p>

            <Countdown className="justify-self-center md:justify-self-start" />

            {!ShowDay.hasShowEnded() ? (
              <Section.Action asChild>
                <Action color="mystic" asChild>
                  <Link to={CLIENT_ENV.TICKETING_URL}>
                    Achetez votre billet
                  </Link>
                </Action>
              </Section.Action>
            ) : null}
          </Section.TextAside>
        </LazyElement>
      </div>
    </Section.Root>
  );
}

function Countdown({ className }: { className?: string }) {
  const [, forceUpdate] = useState(true);

  const now = DateTime.now();
  const diff = ShowDay.openingTime.diff(now, ["days", "hours", "minutes"]);

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

const ONE_MINUTE_IN_MS = 60 * 1000;

function CountDownItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-0.5">
      <span className="grid aspect-square w-[80px] items-center justify-items-center rounded-1 bg-alabaster font-serif text-[48px] leading-none tracking-wider text-mystic">
        {value.toLocaleString("fr-FR", { minimumIntegerDigits: 2 })}
      </span>

      <span className="text-caption-lowercase-default">{label}</span>
    </div>
  );
}

function SectionComeWithYourDog() {
  return (
    <Section.Root>
      <LazyElement asChild>
        <Section.ImageAside className="aspect-square translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
          <DynamicImage
            image={{
              id: "/show/pages/pott-et-pollen-veterinaire-ywxiy9ev9namh5vnfdes",
            }}
            alt="Pott et Pollen font un contrôle vétérinaire."
            fallbackSize="512"
            sizes={{ default: "100vw", md: "50vw", lg: "464px" }}
            aspectRatio="none"
            className="absolute inset-y-0 left-1/2 h-full max-w-none -translate-x-1/2"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
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
            le salon, veillez à ne l’amener que s’il est sociable avec les
            autres animaux et à l’aise en présence de nombreuses personnes.
          </p>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}

function SectionPresentation() {
  const { exhibitorCount } = useLoaderData<typeof loader>();

  return (
    <Section.Root width="full" columnCount={1}>
      <div className="grid grid-cols-1 gap-4">
        <section className="grid grid-cols-1 gap-2 px-safe-page-narrow sm:gap-4 md:grid-cols-2 md:items-center md:px-safe-page-normal lg:gap-8">
          <LazyElement asChild>
            <Section.TextAside className="-translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
              <Section.Title>Présentation</Section.Title>

              <p>
                Le Salon des Ani’Meaux a pour vocation de sensibiliser les
                petits et les grands au bien-être de nos amis les animaux.
              </p>

              <p>
                Ouvert à tous, il permet de rencontrer des professionnels et des
                associations, tout en profitant d’activités et animations riches
                et de moments de convivialité.
              </p>

              <p>
                Les visiteurs pourront retrouver des acteurs agissant en faveur
                du bien-être des animaux de compagnie mais également des animaux
                de la ferme, des animaux sauvages ainsi que des insectes.
              </p>
            </Section.TextAside>
          </LazyElement>

          <LazyElement asChild>
            <Section.ImageAside className="-z-just-above aspect-4/3 translate-x-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-x-0 data-visible:opacity-100">
              <DynamicImage
                image={{ id: "/show/pages/pott-et-pollen-bonjour_xiufg6" }}
                alt="Pott et Pollen disent bonjour."
                fallbackSize="512"
                sizes={{ default: "100vw", md: "50vw", lg: "464px" }}
                aspectRatio="none"
                className="absolute inset-x-0 top-0 w-full"
              />
            </Section.ImageAside>
          </LazyElement>
        </section>

        <section className="relative py-2 px-safe-page-narrow md:py-4 md:px-safe-page-normal">
          <HighLightBackground
            color="paleBlue"
            className="absolute inset-0 -z-just-above h-full w-full"
          />

          <aside className="grid grid-cols-1">
            <ul className="flex flex-wrap justify-center gap-2 md:gap-4">
              <PresentationItem icon="stand-prussian-blue">
                {exhibitorCount == null
                  ? "De nombreux exposants dévoués au bien-être des animaux."
                  : `${exhibitorCount} exposants dévoués au bien-être des animaux.`}
              </PresentationItem>

              <PresentationItem icon="dog">
                Des chiens à l’adoption qui feront chavirer votre coeur.
              </PresentationItem>

              <PresentationItem icon="video">
                Des animations pour vous divertir et enrichir vos connaissances.
              </PresentationItem>
            </ul>
          </aside>
        </section>
      </div>
    </Section.Root>
  );
}

function PresentationItem({
  icon,
  children,
}: React.PropsWithChildren<{
  icon: React.ComponentProps<typeof Pictogram>["id"];
}>) {
  return (
    <li className="grid min-w-[300px] max-w-sm flex-1 grid-cols-auto-fr items-center gap-2">
      <Pictogram id={icon} className="icon-48" />
      <span>{children}</span>
    </li>
  );
}

function SectionOrigin() {
  return (
    <Section.Root columnCount={1}>
      <LazyElement asChild>
        <Section.TextAside asChild>
          <BoardCard className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
            <Section.Title>Origine du salon</Section.Title>

            <p>
              L’histoire du Salon des Ani’Meaux trouve ses racines dans
              l’engagement passionné de l’
              <ProseInlineAction asChild>
                <Link to={CLIENT_ENV.ANIMEAUX_URL}>association Ani’Meaux</Link>
              </ProseInlineAction>{" "}
              pour la cause animale. Créé en étroite collaboration avec la
              municipalité de Meaux, cet événement unique célèbre le bien-être
              animal à travers des rencontres enrichissantes.
            </p>

            <p>
              Lancée en mai 2022, la première édition a vu le jour grâce à la
              mobilisation de nos bénévoles déterminés à sensibiliser et à
              fédérer autour d’une cause commune. Porté par ce succès, le salon
              connaît une croissance constante, attirant chaque année davantage
              d’exposants et de visiteurs dans une ambiance chaleureuse.
            </p>

            <p>
              Aujourd’hui, le Salon des Ani’Meaux s’impose comme un rendez-vous
              incontournable, mêlant passion, éducation et sensibilisation pour
              offrir une expérience unique dédiée au bien-être et au respect de
              nos compagnons à quatre pattes.
            </p>
          </BoardCard>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}

function SectionSponsors() {
  const { sponsors } = useLoaderData<typeof loader>();

  return (
    <Section.Root width="full" columnCount={1}>
      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow px-safe-page-narrow data-visible:translate-y-0 data-visible:opacity-100">
          <Section.Title className="md:text-center">Nos sponsors</Section.Title>

          <p className="md:text-center">
            Le Salon des Ani’Meaux est imaginé et mis en place par des
            bénévoles, mais il n’aurait pas pu voir le jour sans leur
            participation.
          </p>
        </Section.TextAside>
      </LazyElement>

      <section className="grid grid-cols-1 px-safe-page-narrow md:px-safe-page-normal">
        {sponsors.length === 0 ? (
          <LazyElement asChild>
            <SponsorsPlaceholderImage
              fallbackSize="1024"
              sizes={{ default: "100vw", md: "640px" }}
              className="w-full max-w-screen-sm translate-y-4 justify-self-center opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100"
            />
          </LazyElement>
        ) : (
          <ul className="flex flex-wrap justify-center gap-1 md:gap-2">
            {sponsors.map((sponsor) => (
              <LazyElement key={sponsor.id} asChild>
                <SponsorItem
                  sponsor={sponsor}
                  imageFallbackSize="256"
                  imageSizes={{ default: "130px", md: "180px" }}
                  className="w-[130px] flex-none translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100 md:w-[180px]"
                />
              </LazyElement>
            ))}
          </ul>
        )}
      </section>
    </Section.Root>
  );
}

function SectionExhibitors() {
  const { exhibitorCount } = useLoaderData<typeof loader>();

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
            alt="Pott derrière un stand."
            aspectRatio="none"
            className="absolute inset-x-0 bottom-0 w-full"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
          <Section.Title>Nos exposants</Section.Title>

          {exhibitorCount == null ? (
            <p>
              Cette année, de nombreux exposants vous attendent répartis dans 3
              grandes catégories.
            </p>
          ) : (
            <p>
              Cette année, {exhibitorCount} exposants vous attendent répartis
              dans 3 grandes catégories.
            </p>
          )}

          <ul className="flex flex-wrap items-start justify-center gap-x-1 gap-y-2 md:gap-x-2">
            <ExhibitorItem icon="group">Associations</ExhibitorItem>
            <ExhibitorItem icon="help">Soins et activités</ExhibitorItem>
            <ExhibitorItem icon="food">
              Alimentation et accessoires
            </ExhibitorItem>
          </ul>

          <Section.Action asChild>
            <Action color="mystic" asChild>
              <Link to={Routes.exhibitors.toString()} prefetch="intent">
                Voir tous les exposants
              </Link>
            </Action>
          </Section.Action>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
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
      <Pictogram id={icon} className="icon-48" />
      <span className="w-full text-center">{children}</span>
    </li>
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

function SectionAccess() {
  return (
    <Section.Root>
      <LazyElement asChild>
        <Section.ImageAside className="aspect-square translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
          <DynamicImage
            image={{
              id: "/show/pages/pott-plan-jceivcyzibkcg2qtp8jj",
            }}
            fallbackSize="1024"
            sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
            alt="Pott regarde un plan."
            aspectRatio="none"
            className="absolute inset-x-0 top-1/2 w-full -translate-y-[56%] md:-translate-y-[53%]"
          />
        </Section.ImageAside>
      </LazyElement>

      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100">
          <Section.Title>Accès au salon</Section.Title>

          <p>
            Voiture, bus, vélo ou à pied, tous les moyens sont bons pour visiter
            le Salon des Ani’Meaux !
          </p>

          <Section.Action asChild>
            <Action color="mystic" asChild>
              <Link to={Routes.access.toString()} prefetch="intent">
                S’y rendre
              </Link>
            </Action>
          </Section.Action>
        </Section.TextAside>
      </LazyElement>
    </Section.Root>
  );
}

function SectionProviders() {
  const { providers } = useLoaderData<typeof loader>();

  return (
    <Section.Root width="full" columnCount={1}>
      <LazyElement asChild>
        <Section.TextAside className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow px-safe-page-narrow data-visible:translate-y-0 data-visible:opacity-100">
          <Section.Title className="md:text-center">
            Nos prestataires
          </Section.Title>

          <p className="md:text-center">
            Nous aurons la joie de collaborer avec ces prestataires.
          </p>
        </Section.TextAside>
      </LazyElement>

      <section className="grid grid-cols-1 px-safe-page-narrow md:px-safe-page-normal">
        {providers.length === 0 ? (
          <LazyElement asChild>
            <ProvidersPlaceholderImage
              fallbackSize="1024"
              sizes={{ default: "100vw", md: "640px" }}
              className="w-full max-w-screen-sm translate-y-4 justify-self-center opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100"
            />
          </LazyElement>
        ) : (
          <ul className="flex flex-wrap justify-center gap-1 md:gap-2">
            {providers.map((provider) => (
              <LazyElement key={provider.id} asChild>
                <ProviderItem
                  provider={provider}
                  imageFallbackSize="256"
                  imageSizes={{ default: "130px", md: "180px" }}
                  className="w-[130px] flex-none translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100 md:w-[180px]"
                />
              </LazyElement>
            ))}
          </ul>
        )}
      </section>
    </Section.Root>
  );
}
