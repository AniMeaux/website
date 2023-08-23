import { getAllAnimalPictures } from "#animals/pictures/allPictures.ts";
import { getAnimalDisplayName } from "#animals/profile/name.tsx";
import { Action } from "#core/actions.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { cn } from "#core/classNames.ts";
import { getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import { db } from "#core/db.server.ts";
import { RouteHandle } from "#core/handles.ts";
import { assertIsDefined } from "#core/isDefined.server.ts";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { prisma } from "#core/prisma.server.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { Icon } from "#generated/icon.tsx";
import { DownloadPictureLink } from "#routes/downloads.picture.$id.tsx";
import { UserGroup } from "@prisma/client";
import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData, V2_MetaFunction } from "@remix-run/react";
import { z } from "zod";

export const handle: RouteHandle = {
  htmlBackgroundColor: "bg-white",
  isFullHeight: true,
};

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ]);

  const idResult = z.string().uuid().safeParse(params["id"]);
  if (!idResult.success) {
    throw new NotFoundResponse();
  }

  const animal = await prisma.animal.findUnique({
    where: { id: idResult.data },
    select: {
      alias: true,
      avatar: true,
      id: true,
      name: true,
      pictures: true,
    },
  });

  assertIsDefined(animal);
  const allPictures = getAllAnimalPictures(animal);

  const pictureIdResult = z.string().uuid().safeParse(params["pictureId"]);
  if (!pictureIdResult.success || !allPictures.includes(pictureIdResult.data)) {
    throw new NotFoundResponse();
  }

  return json({ animal, visiblePictureId: pictureIdResult.data });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const animal = data?.animal;
  if (animal == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(`Photos de ${getAnimalDisplayName(animal)}`) }];
};

export default function Route() {
  const { animal, visiblePictureId } = useLoaderData<typeof loader>();
  const allPictures = getAllAnimalPictures(animal);
  const visiblePictureIndex = allPictures.indexOf(visiblePictureId);

  return (
    <main className="w-full h-full grid grid-cols-1 grid-rows-[auto_minmax(0px,1fr)_auto]">
      <header className="min-h-[50px] px-safe-1 pt-safe-0.5 pb-0.5 flex justify-end items-center md:min-h-[60px] md:px-safe-2 md:pt-safe-1 md:pb-1">
        <Action asChild variant="text">
          <DownloadPictureLink
            pictureId={visiblePictureId}
            fileName={`${getAnimalDisplayName(animal)} (${
              visiblePictureIndex + 1
            })`}
          >
            <Icon id="download" />
            Télécharger
          </DownloadPictureLink>
        </Action>
      </header>

      <div className="flex flex-col items-center justify-center">
        <DynamicImage
          imageId={visiblePictureId}
          alt={`Photo ${visiblePictureIndex + 1} de ${getAnimalDisplayName(
            animal
          )}`}
          sizes={{ default: "100vw" }}
          fallbackSize="2048"
          aspectRatio="none"
          background="none"
          className="min-w-0 max-w-full min-h-0 max-h-full"
        />
      </div>

      <footer className="pt-0.5 pb-safe-0.5 flex justify-center md:pt-1 md:pb-safe-1">
        <div className="overflow-x-auto scrollbars-none max-w-full px-safe-1 grid grid-flow-col auto-cols-[60px] justify-start gap-1 md:auto-cols-[80px] md:gap-2">
          {allPictures.map((pictureId, index) => (
            <BaseLink
              key={pictureId}
              to={Routes.animals
                .id(animal.id)
                .pictures.pictureId(pictureId)
                .toString()}
              replace
              className="aspect-4/3 rounded-0.5 flex transition-transform duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <DynamicImage
                imageId={pictureId}
                alt={`Photo ${index + 1} de ${getAnimalDisplayName(animal)}`}
                sizes={{ md: "80px", default: "60px" }}
                fallbackSize="512"
                className={cn(
                  "w-full rounded-0.5 transition-opacity duration-100 ease-in-out",
                  pictureId === visiblePictureId ? "opacity-100" : "opacity-50"
                )}
              />
            </BaseLink>
          ))}
        </div>
      </footer>
    </main>
  );
}
