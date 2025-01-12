import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { Tab, Tabs } from "#core/controllers/tabs";
import { DynamicImage } from "#core/data-display/image";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { ScrollRestorationLocationState } from "#core/scroll-restoration";
import type { PrevousEditionCloudinaryDelegate } from "#previous-editions/cloudinary.server";
import { PicturesLocationState } from "#previous-editions/pictures-location-state";
import {
  PREVIOUS_EDITION_PHOTOGRAPH,
  SORTED_PREVIOUS_EDITIONS,
} from "#previous-editions/previous-edition";
import { cn } from "@animeaux/core";
import type { SerializeFrom } from "@remix-run/node";
import { Await, Link, useLoaderData, useLocation } from "@remix-run/react";
import { Suspense } from "react";
import type { loader } from "./route";

export function SectionPictures() {
  const { pictures, edition } = useLoaderData<typeof loader>();

  const photograph = PREVIOUS_EDITION_PHOTOGRAPH[edition];

  return (
    <Section.Root columnCount={1}>
      <Tabs>
        {SORTED_PREVIOUS_EDITIONS.map((edition) => (
          <Tab
            key={edition}
            to={Routes.previousEditions.edition(edition).toString()}
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

      <ul className="grid gap-0.5 grid-auto-fill-cols-[150px] md:gap-1">
        <Suspense
          // Force skelton to show when changing edition.
          key={edition}
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
          <Await resolve={pictures}>
            {(pictures) =>
              pictures.map((picture, index) => (
                <PictureItem key={picture.id} picture={picture} index={index} />
              ))
            }
          </Await>
        </Suspense>
      </ul>
    </Section.Root>
  );
}

function PictureItem({
  picture,
  index,
}: {
  picture: SerializeFrom<PrevousEditionCloudinaryDelegate.Picture>;
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
        to={Routes.previousEditions
          .edition(edition)
          .pictureIndex(index)
          .toString()}
        prefetch="intent"
        state={PicturesLocationState.create({
          galleryLocationKey: scrollRestorationLocationKey,
        })}
        className="group grid aspect-square grid-cols-1 overflow-hidden rounded-1 can-hover:focus-visible:focus-spaced md:rounded-2"
      >
        <DynamicImage
          alt={
            photograph == null
              ? `Photo du salon ${edition}.`
              : `Photo du salon ${edition} par ${photograph.name}.`
          }
          title={photograph?.name}
          fallbackSize={isCover ? "512" : "256"}
          image={picture}
          aspectRatio="1:1"
          objectFit="cover"
          sizes={
            isCover ? { default: "256px", sm: "400px" } : { default: "256px" }
          }
          loading={index < 5 ? "eager" : "lazy"}
          className="w-full transition-transform duration-slow can-hover:group-hover:scale-105"
        />
      </Link>
    </li>
  );
}
