import { getErrorTitle } from "#core/data-display/error-page";
import { DynamicImage } from "#core/data-display/image";
import { useElementSize } from "#core/elements";
import type { RouteHandle } from "#core/handles";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { ScrollRestorationLocationState } from "#core/scroll-restoration";
import { services } from "#core/services.server.js";
import { Icon } from "#generated/icon";
import { PicturesLocationState } from "#previous-editions/pictures-location-state";
import {
  PREVIOUS_EDITION_PHOTOGRAPH,
  PreviousEdition,
} from "#previous-editions/previous-edition";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useLocation, useParams } from "@remix-run/react";
import { forwardRef } from "react";

export const handle: RouteHandle = {
  htmlBackgroundColor: cn("bg-black"),
  isFullHeight: true,
};

const ParamsSchema = zu.object({
  edition: zu.nativeEnum(PreviousEdition),
  pictureIndex: zu.searchParams.number().pipe(zu.number().int().min(0)),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(ParamsSchema, params);

  const pictures = await services.image.getAllImages(routeParams.edition);

  const picture = pictures[routeParams.pictureIndex];
  if (picture == null) {
    throw notFound();
  }

  return json({
    edition: routeParams.edition,
    picture,
    pictureCount: pictures.length,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  let title = getErrorTitle(404);

  if (data != null) {
    const photograph = PREVIOUS_EDITION_PHOTOGRAPH[data.edition];

    title =
      photograph == null
        ? `Photo du salon ${data.edition}.`
        : `Photo du salon ${data.edition} par ${photograph.name}.`;
  }

  return createSocialMeta({ title: getPageTitle(title) });
};

export default function Route() {
  const { pictureIndex } = ParamsSchema.parse(useParams());
  const { edition, picture, pictureCount } = useLoaderData<typeof loader>();
  const { galleryLocationKey } = PicturesLocationState.parse(
    useLocation().state,
  );
  const { ref, size } = useElementSize<React.ComponentRef<"div">>();

  const width =
    size == null
      ? undefined
      : Math.min(size.width, (size.height * picture.width) / picture.height);

  const photograph = PREVIOUS_EDITION_PHOTOGRAPH[edition];

  return (
    <main className="grid h-full max-h-full w-full grid-cols-[72px_minmax(0px,1fr)_72px] grid-rows-[72px_minmax(0px,1fr)_72px] overflow-hidden px-safe-0 py-safe-0">
      <div
        ref={ref}
        className="col-span-3 col-start-1 row-start-2 grid items-center justify-items-center md:col-span-1 md:col-start-2"
      >
        <DynamicImage
          // We don't want the previous image to stay visible during the loading
          // of the next one.
          // With this key, the placeholder of the next image will be visible.
          key={picture.id}
          alt={
            photograph == null
              ? `Photo du salon ${edition}.`
              : `Photo du salon ${edition} par ${photograph.name}.`
          }
          fallbackSize="2048"
          image={picture}
          sizes={{ default: "100vw" }}
          aspectRatio="none"
          loading="eager"
          style={{ width, aspectRatio: `${picture.width} / ${picture.height}` }}
          className="max-h-full min-h-0 min-w-0 max-w-full"
        />
      </div>

      <PictureAction asChild className="col-start-1 row-start-1">
        <Link
          to={Routes.previousEditions.edition(edition).toString()}
          state={ScrollRestorationLocationState.create({
            scrollRestorationLocationKey: galleryLocationKey,
          })}
        >
          <Icon id="x-mark-light" />
        </Link>
      </PictureAction>

      {pictureIndex > 0 ? (
        <PictureAction
          asChild
          className="col-start-1 row-start-3 md:row-start-2"
        >
          <Link
            to={Routes.previousEditions
              .edition(edition)
              .pictureIndex(pictureIndex - 1)
              .toString()}
            state={PicturesLocationState.create({ galleryLocationKey })}
          >
            <Icon id="chevron-left-light" />
          </Link>
        </PictureAction>
      ) : null}

      {pictureIndex < pictureCount - 1 ? (
        <PictureAction
          asChild
          className="col-start-3 row-start-3 md:row-start-2"
        >
          <Link
            to={Routes.previousEditions
              .edition(edition)
              .pictureIndex(pictureIndex + 1)
              .toString()}
            state={PicturesLocationState.create({ galleryLocationKey })}
          >
            <Icon id="chevron-right-light" />
          </Link>
        </PictureAction>
      ) : null}
    </main>
  );
}

const PictureAction = forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  React.ComponentPropsWithoutRef<typeof Primitive.button>
>(function PictureAction({ className, ...props }, ref) {
  return (
    <Primitive.button
      {...props}
      ref={ref}
      className={cn(
        "grid grid-cols-1 self-center justify-self-center text-white opacity-70 icon-48 can-hover:hover:opacity-100 can-hover:focus-visible:opacity-100 can-hover:focus-visible:focus-compact",
        className,
      )}
    />
  );
});
