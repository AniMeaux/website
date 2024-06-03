import { cloudinary } from "#core/cloudinary/cloudinary.server";
import { createConfig } from "#core/config.server";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { DynamicImage } from "#core/data-display/image";
import { useElementSize } from "#core/elements";
import type { RouteHandle } from "#core/handles";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { NotFoundResponse } from "#core/response.server";
import { ScrollRestorationLocationState } from "#core/scroll-restoration";
import { Icon } from "#generated/icon";
import { PhotoLocationState } from "#previous-editions/photo-location-state";
import {
  PREVIOUS_EDITION_PHOTOGRAPH,
  PreviousEdition,
} from "#previous-editions/previous-edition";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { zu } from "@animeaux/zod-utils";
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
  photoIndex: zu.searchParams.number().pipe(zu.number().int().min(0)),
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

  const images = await cloudinary.previousEdition.findAllImages(
    result.data.edition,
  );

  const image = images[result.data.photoIndex];
  if (image == null) {
    throw new NotFoundResponse();
  }

  return json({
    edition: result.data.edition,
    image,
    imageCount: images.length,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  let title = getErrorTitle(404);

  if (data != null) {
    const photograph = PREVIOUS_EDITION_PHOTOGRAPH[data.edition];

    title =
      photograph == null
        ? `Photo du salon ${data.edition}.`
        : `Photo du salon ${data.edition} par ${photograph}.`;
  }

  return createSocialMeta({
    title: getPageTitle(title),
  });
};

export function ErrorBoundary() {
  return <ErrorPage isStandAlone />;
}

export default function Route() {
  const { photoIndex } = ParamsSchema.parse(useParams());
  const { edition, image, imageCount } = useLoaderData<typeof loader>();
  const { galleryLocationKey } = PhotoLocationState.parse(useLocation().state);
  const { ref, size } = useElementSize<React.ComponentRef<"div">>();

  const width =
    size == null
      ? undefined
      : Math.min(size.width, (size.height * image.width) / image.height);

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
          key={image.id}
          alt={
            photograph == null
              ? `Photo du salon ${edition}.`
              : `Photo du salon ${edition} par ${photograph}.`
          }
          fallbackSize="2048"
          image={image}
          sizes={{ default: "100vw" }}
          aspectRatio="none"
          loading="eager"
          style={{ width, aspectRatio: `${image.width} / ${image.height}` }}
          className="max-h-full min-h-0 min-w-0 max-w-full"
        />
      </div>

      <PhotoAction asChild className="col-start-1 row-start-1">
        <Link
          to={Routes.previousEditions(edition)}
          state={ScrollRestorationLocationState.create({
            scrollRestorationLocationKey: galleryLocationKey,
          })}
        >
          <Icon id="x-mark-light" />
        </Link>
      </PhotoAction>

      {photoIndex > 0 ? (
        <PhotoAction asChild className="col-start-1 row-start-3 md:row-start-2">
          <Link
            to={Routes.photo(edition, photoIndex - 1)}
            state={PhotoLocationState.create({ galleryLocationKey })}
          >
            <Icon id="chevron-left-light" />
          </Link>
        </PhotoAction>
      ) : null}

      {photoIndex < imageCount - 1 ? (
        <PhotoAction asChild className="col-start-3 row-start-3 md:row-start-2">
          <Link
            to={Routes.photo(edition, photoIndex + 1)}
            state={PhotoLocationState.create({ galleryLocationKey })}
          >
            <Icon id="chevron-right-light" />
          </Link>
        </PhotoAction>
      ) : null}
    </main>
  );
}

const PhotoAction = forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  React.ComponentPropsWithoutRef<typeof Primitive.button>
>(function PhotoAction({ className, ...props }, ref) {
  return (
    <Primitive.button
      {...props}
      ref={ref}
      className={cn(
        "grid grid-cols-1 self-center justify-self-center text-[48px] text-white opacity-70 focus-visible:opacity-100 focus-visible:focus-compact-mystic hover:opacity-100",
        className,
      )}
    />
  );
});
