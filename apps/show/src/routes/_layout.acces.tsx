import { AccessImage } from "#access/image";
import { Action } from "#core/actions";
import { useConfig } from "#core/config";
import { createConfig } from "#core/config.server";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage";
import { DynamicImage } from "#core/dataDisplay/image";
import { BoardCard } from "#core/layout/boardCard";
import { HighLightBackground } from "#core/layout/highlightBackground";
import { Section } from "#core/layout/section";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/pageTitle";
import { NotFoundResponse } from "#core/response.server";
import { Pictogram } from "#generated/pictogram";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";

export async function loader() {
  const { featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline) {
    throw new NotFoundResponse();
  }

  return json("ok" as const);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(data === "ok" ? "Accès au salon" : getErrorTitle(404)),
  });
};

export function ErrorBoundary() {
  const { featureFlagSiteOnline } = useConfig();

  return <ErrorPage isStandAlone={!featureFlagSiteOnline} />;
}

export default function Route() {
  return (
    <>
      <TitleSection />
      <EcologySection />
      <CarpoolSection />
      <InformationSection />
    </>
  );
}

function TitleSection() {
  return (
    <Section>
      <Section.ImageAside>
        <AccessImage
          fallbackSize="1024"
          sizes={{ default: "384px", md: "50vw", lg: "512px" }}
          shape={{ id: "variant7", color: "prussianBlue", side: "right" }}
          className="w-full"
        />
      </Section.ImageAside>

      <Section.TextAside className="md:col-start-1 md:row-start-1">
        <Section.Title asChild className="text-center md:text-left">
          <h1>Accès au salon</h1>
        </Section.Title>

        <p className="text-center md:text-left">
          Voiture, bus, vélo ou à pied, tous les moyens sont bons pour visiter
          le Salon des Ani’Meaux !
        </p>

        <Section.Action asChild>
          <Action asChild color="mystic">
            <Link to="https://goo.gl/maps/bix61Gb2vAUdpgtq5">Voir le plan</Link>
          </Action>
        </Section.Action>
      </Section.TextAside>
    </Section>
  );
}

function EcologySection() {
  return (
    <Section columnCount={1}>
      <Section.TextAside asChild>
        <BoardCard>
          <Section.Title>
            Privilégiez les moyens de transports écologiques
          </Section.Title>

          <p>
            Pensez à la planète et déplacez vous à pied, en vélo ou en
            transports en commun. La salle du Colisée de Meaux est très bien
            desservie par les bus, et proche du parc du pâtis pour une balade
            agréable avant ou après votre visite.
          </p>
        </BoardCard>
      </Section.TextAside>
    </Section>
  );
}

function CarpoolSection() {
  const { carpoolFacebookGroupUrl } = useConfig();

  return (
    <Section>
      <Section.ImageAside>
        <DynamicImage
          image={{
            id: "/show/620fba68-a1e6-4ce4-a9a0-c31e5bf8fcba",
            blurhash: "UEIXHs}[Vr?v^Sv~H?NH?IMxROxZ-;tMX5WY",
          }}
          alt="Deux chiens assis côte à côte."
          aspectRatio="1:1"
          fallbackSize="1024"
          sizes={{ default: "384px", md: "50vw", lg: "512px" }}
          shape={{ id: "variant10", color: "paleBlue", side: "left" }}
          className="w-full"
        />
      </Section.ImageAside>

      <Section.TextAside>
        <Section.Title asChild className="text-center md:text-left">
          <h1>Covoiturage</h1>
        </Section.Title>

        <p className="text-center md:text-left">
          Proposez ou demandez un covoiturage, sur le groupe Facebook dédié,
          pour vous rendre au Salon des Ani’Meaux.
        </p>

        <Section.Action asChild>
          <Action asChild color="mystic">
            <Link to={carpoolFacebookGroupUrl}>Rejoindre le groupe</Link>
          </Action>
        </Section.Action>
      </Section.TextAside>
    </Section>
  );
}

function InformationSection() {
  return (
    <Section columnCount={1} width="full">
      <div className="relative py-2 px-safe-page-narrow md:py-4 md:px-safe-page-normal">
        <HighLightBackground
          color="paleBlue"
          className="absolute left-0 top-0 -z-10 h-full w-full"
        />

        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
          <HighLightItem icon="location" title="Adresse">
            Colisée de Meaux, 73 Av. Henri Dunant, 77100 Meaux.
          </HighLightItem>

          <HighLightItem icon="time" title="Horaires d’ouverture">
            Samedi 8 juin 2024 de 10h à 18h.
            <br />
            Dimanche 9 juin 2024 de 10h à 18h.
          </HighLightItem>

          <HighLightItem icon="bus" title="Venir en transports en commun">
            Bus ligne D ou I, arrêt Colisée de Meaux ou Roland Garros.
          </HighLightItem>

          <HighLightItem icon="car" title="Venir en voiture">
            Parking gratuit sur place.
            <br />
            <strong className="text-body-lowercase-emphasis">
              Ne laissez pas vos animaux dans votre véhicule !
            </strong>
          </HighLightItem>
        </ul>
      </div>
    </Section>
  );
}

function HighLightItem({
  icon,
  title,
  children,
}: React.PropsWithChildren<{
  icon: React.ComponentProps<typeof Pictogram>["id"];
  title: string;
}>) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2">
      <Pictogram id={icon} className="text-[48px]" />
      <div className="grid grid-cols-1">
        <p className="text-body-uppercase-emphasis">{title}</p>
        <p>{children}</p>
      </div>
    </li>
  );
}
