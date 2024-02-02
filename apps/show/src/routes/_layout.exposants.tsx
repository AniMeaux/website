import { Action } from "#core/actions";
import { useConfig } from "#core/config";
import { createConfig } from "#core/config.server";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { DynamicImage } from "#core/data-display/image";
import { ImageUrl } from "#core/data-display/image-url";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { BoardCard } from "#core/layout/board-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Section } from "#core/layout/section";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { NotFoundResponse } from "#core/response.server";
import { EXHIBITOR_CATEGORY_TRANSLATIONS } from "#exhibitors/translations";
import { Pictogram } from "#generated/pictogram";
import type { MetaFunction, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export async function loader() {
  const {
    featureFlagShowExhibitors,
    featureFlagSiteOnline,
    featureFlagShowProgram,
  } = createConfig();

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
      eventDescription: featureFlagShowProgram,
      id: true,
      image: true,
      name: true,
      url: true,
    },
  });

  return json({ exhibitors });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data?.exhibitors != null ? "Exposants" : getErrorTitle(404),
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
          <h2 className="text-mystic text-title-item">
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
      <ul className="grid grid-cols-1 items-start gap-4 xs:grid-cols-2 md:grid-cols-3">
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
    <li className="grid grid-cols-1 gap-2">
      <LightBoardCard
        isSmall
        className="grid aspect-4/3 grid-cols-1 content-center justify-items-center"
      >
        <Pictogram id="stand-mystic" className="text-[96px]" />
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
  exhibitor: SerializeFrom<typeof loader>["exhibitors"][number];
  loading: NonNullable<
    React.ComponentPropsWithoutRef<typeof DynamicImage>["loading"]
  >;
}) {
  return (
    <li className="grid grid-cols-1 gap-2">
      <Link
        to={exhibitor.url}
        className="group grid grid-cols-1 gap-2 rounded-b-0.5 rounded-t-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg"
      >
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-2 border border-alabaster">
          <DynamicImage
            image={ImageUrl.parse(exhibitor.image)}
            alt={exhibitor.name}
            loading={loading}
            aspectRatio="4:3"
            objectFit="cover"
            fallbackSize="512"
            sizes={{ default: "100vw", xs: "50vw", md: "30vw", lg: "310px" }}
            className="w-full transition-transform duration-150 ease-in-out group-hover:scale-105"
          />
        </div>

        <div className="grid grid-cols-1">
          <p className="text-body-uppercase-emphasis">{exhibitor.name}</p>
          <p>{EXHIBITOR_CATEGORY_TRANSLATIONS[exhibitor.category]}</p>
        </div>
      </Link>

      {exhibitor.eventDescription != null ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-1 rounded-1 bg-alabaster px-2 py-1 bg-var-alabaster">
          <p>
            <Markdown
              components={SENTENCE_COMPONENTS}
              content={exhibitor.eventDescription}
            />
          </p>

          <span className="flex h-2 items-center">
            <Pictogram id="stand-mystic" className="text-[16px]" />
          </span>
        </div>
      ) : null}
    </li>
  );
}
