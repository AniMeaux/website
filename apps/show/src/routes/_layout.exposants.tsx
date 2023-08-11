import { Exhibitor } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, V2_MetaFunction, useLoaderData } from "@remix-run/react";
import { Action } from "~/core/actions";
import { useConfig } from "~/core/config";
import { createConfig } from "~/core/config.server";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { DynamicImage, ImageUrl } from "~/core/dataDisplay/image";
import { BoardCard } from "~/core/layout/boardCard";
import { LightBoardCard } from "~/core/layout/lightBoardCard";
import { Section } from "~/core/layout/section";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { prisma } from "~/core/prisma.server";
import { NotFoundResponse } from "~/core/response.server";
import { EXHIBITOR_CATEGORY_TRANSLATIONS } from "~/exhibitors/translations";
import { Pictogram } from "~/generated/pictogram";

export async function loader() {
  const { featureFlagShowExhibitors, featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline) {
    throw new NotFoundResponse();
  }

  if (!featureFlagShowExhibitors) {
    return json({ exhibitors: [] });
  }

  const exhibitors = await prisma.exhibitor.findMany({
    orderBy: { name: "asc" },
    select: {
      category: true,
      id: true,
      image: true,
      name: true,
      url: true,
    },
  });

  return json({ exhibitors });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data?.exhibitors != null ? "Exposants" : getErrorTitle(404)
    ),
  });
};

export function ErrorBoundary() {
  const { featureFlagSiteOnline } = useConfig();

  return <ErrorPage isStandAlone={!featureFlagSiteOnline} />;
}

export default function Route() {
  const { featureFlagShowExhibitors } = useConfig();

  return (
    <>
      <TitleSection />
      {featureFlagShowExhibitors ? <ListSection /> : <WaitingSection />}
    </>
  );
}

function TitleSection() {
  return (
    <Section columnCount={1}>
      <Section.Title asChild>
        <h1>Exposants</h1>
      </Section.Title>
    </Section>
  );
}

function WaitingSection() {
  const { exhibitorsFormUrl } = useConfig();

  return (
    <Section columnCount={1}>
      <Section.TextAside asChild>
        <BoardCard>
          <h2 className="text-title-item text-mystic">
            Il est encore un peu tôt
          </h2>

          <p>
            Nous sommes actuellement en pleine phase de sélection des exposants
            qui participeront à l’édition prochaine du salon. Nous mettons tout
            en œuvre pour choisir les meilleurs candidats afin de proposer une
            expérience exceptionnelle aux visiteurs.
            <br />
            <br />
            La liste des exposants retenus sera{" "}
            <strong className="text-body-lowercase-emphasis">
              communiquée ultérieurement
            </strong>
            , restez donc à l’affût pour découvrir les acteurs passionnants qui
            feront partie de cet événement inoubliable !
          </p>

          <Section.Action asChild>
            <Action asChild>
              <Link to={exhibitorsFormUrl}>Devenez exposant</Link>
            </Action>
          </Section.Action>
        </BoardCard>
      </Section.TextAside>
    </Section>
  );
}

function ListSection() {
  const { exhibitors } = useLoaderData<typeof loader>();

  return (
    <Section columnCount={1}>
      <ul className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 items-start">
        <BecomeExhibitorItem />

        {exhibitors.map((exhibitor, index) => (
          <ExhibitorItem
            key={exhibitor.id}
            exhibitor={exhibitor}
            loading={index < 5 ? "eager" : "lazy"}
          />
        ))}
      </ul>
    </Section>
  );
}

function BecomeExhibitorItem() {
  const { exhibitorsFormUrl } = useConfig();

  return (
    <li className="group grid grid-cols-1 gap-2">
      <LightBoardCard
        isSmall
        className="aspect-4/3 grid grid-cols-1 justify-items-center items-center"
      >
        <Pictogram
          id="standMystic"
          className="text-[96px] group-hover:scale-105 transition-transform duration-150 ease-in-out"
        />
      </LightBoardCard>

      <Action asChild className="justify-self-center">
        <Link to={exhibitorsFormUrl}>Devenez exposant</Link>
      </Action>
    </li>
  );
}

function ExhibitorItem({
  exhibitor,
  loading,
}: {
  exhibitor: Pick<Exhibitor, "category" | "id" | "image" | "name" | "url">;
  loading: NonNullable<
    React.ComponentPropsWithoutRef<typeof DynamicImage>["loading"]
  >;
}) {
  return (
    <li className="grid grid-cols-1">
      <Link
        to={exhibitor.url}
        className="group rounded-t-2 rounded-b-0.5 grid grid-cols-1 gap-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg"
      >
        <div className="overflow-hidden w-full rounded-2 border border-alabaster grid grid-cols-1">
          <DynamicImage
            image={ImageUrl.parse(exhibitor.image)}
            alt={exhibitor.name}
            loading={loading}
            aspectRatio="4:3"
            objectFit="cover"
            fallbackSize="512"
            sizes={{ default: "100vw", xs: "50vw", md: "30vw", lg: "310px" }}
            className="w-full group-hover:scale-105 transition-transform duration-150 ease-in-out"
          />
        </div>

        <div className="grid grid-cols-1">
          <p className="text-body-uppercase-emphasis">{exhibitor.name}</p>
          <p>{EXHIBITOR_CATEGORY_TRANSLATIONS[exhibitor.category]}</p>
        </div>
      </Link>
    </li>
  );
}
