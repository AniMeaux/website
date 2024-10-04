import { ProseInlineAction } from "#core/actions/actions";
import { cloudinary } from "#core/cloudinary/cloudinary.server";
import { Tab, Tabs } from "#core/controllers/tabs";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { DynamicImage } from "#core/data-display/image";
import { LazyElement } from "#core/layout/lazy-element";
import { Section } from "#core/layout/section";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { NotFoundResponse } from "#core/response.server";
import { ScrollRestorationLocationState } from "#core/scroll-restoration";
import { PhotoLocationState } from "#previous-editions/photo-location-state";
import {
  PREVIOUS_EDITION_PHOTOGRAPH,
  PreviousEdition,
  SORTED_PREVIOUS_EDITIONS,
} from "#previous-editions/previous-edition";
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
  return <ErrorPage />;
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
      <LazyElement asChild>
        <Section.ImageAside className="aspect-square translate-x-4 opacity-0 transition-[opacity,transform] duration-1000 data-visible:translate-x-0 data-visible:opacity-100">
          <DynamicImage
            image={{
              id: "/show/pages/pott-et-pollen-photos-ajfy5llvexzgl0df2rsy",
            }}
            fallbackSize="1024"
            sizes={{ default: "100vw", md: "50vw", lg: "512px" }}
            loading="eager"
            alt="Pott regarde un album photo."
            aspectRatio="1:1"
            className="w-full"
          />
        </Section.ImageAside>
      </LazyElement>

      <Section.TextAside className="md:col-start-1 md:row-start-1">
        <Section.Title asChild>
          <h1>Éditions précédentes</h1>
        </Section.Title>

        <p>
          Revivez les moments forts des éditions précédentes de notre salon en
          parcourant notre galerie de photos.
        </p>
      </Section.TextAside>
    </Section>
  );
}

function PhotoGrid() {
  const { images, edition } = useLoaderData<typeof loader>();

  const photograph = PREVIOUS_EDITION_PHOTOGRAPH[edition];

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

      {photograph != null ? (
        <p>
          Les photos ont été prises par{" "}
          <ProseInlineAction asChild>
            <a href={photograph.url}>{photograph.name}</a>
          </ProseInlineAction>
          .
        </p>
      ) : null}

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
        className="group grid aspect-square grid-cols-1 overflow-hidden rounded-1 focus-visible:focus-spaced-mystic md:rounded-2"
      >
        <DynamicImage
          alt={
            photograph == null
              ? `Photo du salon ${edition}.`
              : `Photo du salon ${edition} par ${photograph.name}.`
          }
          title={photograph?.name}
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
