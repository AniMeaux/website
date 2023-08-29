import { cn } from "#core/classNames.ts";
import { cloudinary } from "#core/cloudinary/cloudinary.server.ts";
import { createConfig } from "#core/config.server.ts";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import { useElementSize } from "#core/elements.ts";
import type { RouteHandle } from "#core/handles.ts";
import { createSocialMeta } from "#core/meta.ts";
import { Routes } from "#core/navigation.tsx";
import { getPageTitle } from "#core/pageTitle.ts";
import { Primitive } from "#core/primitives.tsx";
import { NotFoundResponse } from "#core/response.server.ts";
import { ScrollRestorationLocationState } from "#core/scrollRestoration.ts";
import { Icon } from "#generated/icon.tsx";
import { PhotoLocationState } from "#previousEditions/photoLocationState.ts";
import { PreviousEdition } from "#previousEditions/previousEdition.tsx";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { Link, useLoaderData, useLocation, useParams } from "@remix-run/react";
import { forwardRef } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const handle: RouteHandle = {
  htmlBackgroundColor: cn("bg-black bg-var-black"),
  isFullHeight: true,
};

const ParamsSchema = z.object({
  edition: z.nativeEnum(PreviousEdition),
  photoIndex: zfd.numeric(z.number().int().min(0)),
});

export async function loader({ params }: LoaderArgs) {
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

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null
        ? `Photo du salon ${data.edition} par Julia Pommé Photographe.`
        : getErrorTitle(404),
    ),
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

  return (
    <main className="overflow-hidden w-full h-full max-h-full px-safe-0 py-safe-0 grid grid-cols-[72px_minmax(0px,1fr)_72px] grid-rows-[72px_minmax(0px,1fr)_72px]">
      <div
        ref={ref}
        className="row-start-2 col-start-1 md:col-start-2 col-span-3 md:col-span-1 grid justify-items-center items-center"
      >
        <DynamicImage
          // We don't want the previous image to stay visible during the loading
          // of the next one.
          // With this key, the placeholder of the next image will be visible.
          key={image.id}
          alt={`Photo du salon ${edition} par Julia Pommé Photographe.`}
          fallbackSize="2048"
          image={image}
          sizes={{ default: "100vw" }}
          aspectRatio="none"
          loading="eager"
          style={{ width, aspectRatio: `${image.width} / ${image.height}` }}
          className="min-w-0 max-w-full min-h-0 max-h-full"
        />
      </div>

      <PhotoAction asChild className="row-start-1 col-start-1">
        <Link
          to={Routes.previousEditions(edition)}
          state={ScrollRestorationLocationState.create({
            scrollRestorationLocationKey: galleryLocationKey,
          })}
        >
          <Icon id="close" />
        </Link>
      </PhotoAction>

      {photoIndex > 0 ? (
        <PhotoAction asChild className="row-start-3 md:row-start-2 col-start-1">
          <Link
            to={Routes.photo(edition, photoIndex - 1)}
            state={PhotoLocationState.create({ galleryLocationKey })}
          >
            <Icon id="linearArrowLeft" />
          </Link>
        </PhotoAction>
      ) : null}

      {photoIndex < imageCount - 1 ? (
        <PhotoAction asChild className="row-start-3 md:row-start-2 col-start-3">
          <Link
            to={Routes.photo(edition, photoIndex + 1)}
            state={PhotoLocationState.create({ galleryLocationKey })}
          >
            <Icon id="linearArrowRight" />
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
        "justify-self-center self-center opacity-70 hover:opacity-100 focus-visible:opacity-100 grid grid-cols-1 text-[48px] text-white focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic",
        className,
      )}
    />
  );
});
