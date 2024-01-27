import { cloudinary } from "#core/cloudinary/cloudinary.server.ts";
import { createConfig } from "#core/config.server.ts";
import { useConfig } from "#core/config.ts";
import { Tab, Tabs } from "#core/controllers/tabs.tsx";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import { Section } from "#core/layout/section.tsx";
import { createSocialMeta } from "#core/meta.ts";
import { Routes } from "#core/navigation.tsx";
import { getPageTitle } from "#core/pageTitle.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { ScrollRestorationLocationState } from "#core/scrollRestoration.ts";
import { PreviousEditionImage } from "#previousEditions/image.tsx";
import { PhotoLocationState } from "#previousEditions/photoLocationState.ts";
import {
  PREVIOUS_EDITION_PHOTOGRAPH,
  PreviousEdition,
  SORTED_PREVIOUS_EDITIONS,
} from "#previousEditions/previousEdition.tsx";
import { cn } from "@animeaux/core";
import { zu } from "@animeaux/zod-utils";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, Link, useLoaderData, useLocation } from "@remix-run/react";
import { Suspense } from "react";

const ParamsSchema = zu.object({
  edition: zu.nativeEnum(PreviousEdition),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const { featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline) {
    throw new NotFoundResponse();
  }

  const result = ParamsSchema.safeParse(params);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  return defer({
    edition: result.data.edition,
    images: cloudinary.previousEdition.findAllImages(result.data.edition),
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? `Édition de ${data.edition}` : getErrorTitle(404),
    ),
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
      <PhotoGrid />
    </>
  );
}

function TitleSection() {
  return (
    <Section>
      <Section.ImageAside>
        <PreviousEditionImage
          fallbackSize="1024"
          sizes={{ default: "384px", md: "50vw", lg: "512px" }}
          shape={{ id: "variant3", color: "prussianBlue", side: "right" }}
          className="w-full"
        />
      </Section.ImageAside>

      <Section.TextAside className="md:col-start-1 md:row-start-1">
        <Section.Title asChild className="text-center md:text-left">
          <h1>Éditions précédentes</h1>
        </Section.Title>

        <p className="text-center md:text-left">
          Revivez les moments forts des éditions précédentes de notre salon en
          parcourant notre galerie de photos.
        </p>
      </Section.TextAside>
    </Section>
  );
}

function PhotoGrid() {
  const { images } = useLoaderData<typeof loader>();

  return (
    <Section columnCount={1}>
      <Tabs>
        {SORTED_PREVIOUS_EDITIONS.map((edition) => (
          <Tab
            key={edition}
            to={Routes.previousEditions(edition)}
            preventScrollReset
            prefetch="intent"
          >
            {edition}
          </Tab>
        ))}
      </Tabs>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-0.5 md:gap-1">
        <Suspense
          fallback={Array.from(
            {
              // To be sure they get displayed nicely on 2 to 6 columns.
              length: 6 * 5 * 4,
            },
            (_, index) => (
              <li
                key={index}
                className={cn(
                  "aspect-square animate-pulse rounded-1 bg-alabaster md:rounded-2",
                  index === 0 ? "sm:col-span-2 sm:row-span-2" : undefined,
                )}
              />
            ),
          )}
        >
          <Await resolve={images}>
            {(images) =>
              images.map((image, index) => (
                <ImageItem key={image.id} image={image} index={index} />
              ))
            }
          </Await>
        </Suspense>
      </ul>
    </Section>
  );
}

function ImageItem({
  image,
  index,
}: {
  image: Awaited<SerializeFrom<typeof loader>["images"]>[number];
  index: number;
}) {
  const { edition } = useLoaderData<typeof loader>();
  const isCover = index === 0;

  const location = useLocation();
  const { scrollRestorationLocationKey = location.key } =
    ScrollRestorationLocationState.parse(location.state);

  const photograph = PREVIOUS_EDITION_PHOTOGRAPH[edition];

  return (
    <li
      className={cn(
        "grid grid-cols-1",
        isCover ? "sm:col-span-2 sm:row-span-2" : undefined,
      )}
    >
      <Link
        to={Routes.photo(edition, index)}
        prefetch="intent"
        state={PhotoLocationState.create({
          galleryLocationKey: scrollRestorationLocationKey,
        })}
        className="group grid aspect-square grid-cols-1 overflow-hidden rounded-1 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg md:rounded-2"
      >
        <DynamicImage
          alt={
            photograph == null
              ? `Photo du salon ${edition}.`
              : `Photo du salon ${edition} par ${photograph}.`
          }
          title={photograph}
          fallbackSize={isCover ? "512" : "256"}
          image={image}
          aspectRatio="1:1"
          objectFit="cover"
          sizes={
            isCover ? { default: "256px", sm: "400px" } : { default: "256px" }
          }
          loading={index < 5 ? "eager" : "lazy"}
          className="w-full transition-transform duration-150 ease-in-out group-hover:scale-105"
        />
      </Link>
    </li>
  );
}
